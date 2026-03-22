import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { AgentToolRegistry, ToolName } from './agent-tool.registry';
import { AgentDataService } from './agent-data.service';
import { AgentToolCallLogger } from './agent-tool-call-log';
import { ContextBundle } from './agent-context.builder';

export interface RunAgentParams {
  sessionId: string; appId: string; userId: string; userMessage: string;
  contextBundle: ContextBundle; allowedTools: string[];
  claudeMd: string; maxTokens?: number;
}

export interface AgentRunResult {
  response: string; toolCallsMade: number;
  inputTokens: number; outputTokens: number; totalCost: number;
}

const INPUT_COST_PER_TOKEN  = 3 / 1_000_000;   // claude-opus-4-6
const OUTPUT_COST_PER_TOKEN = 15 / 1_000_000;

@Injectable()
export class AgentRunner {
  private readonly anthropic: Anthropic;

  constructor(
    private readonly toolRegistry: AgentToolRegistry,
    private readonly agentDataService: AgentDataService,
    private readonly toolCallLogger: AgentToolCallLogger,
  ) {
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async run(params: RunAgentParams): Promise<AgentRunResult> {
    const { sessionId, appId, userId, userMessage, contextBundle, allowedTools, claudeMd, maxTokens = 4096 } = params;

    const systemPrompt = `${claudeMd}\n\n## Current Context\n\`\`\`json\n${JSON.stringify(contextBundle, null, 2)}\n\`\`\``;
    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: userMessage }];
    const tools = this.toolRegistry.getToolDefinitions(allowedTools);

    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let toolCallsMade = 0;
    let finalResponse = '';
    const MAX_ITERATIONS = 5;

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const response = await this.anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: maxTokens,
        system: systemPrompt,
        tools: tools.length > 0 ? tools : undefined,
        messages,
      });

      totalInputTokens  += response.usage.input_tokens;
      totalOutputTokens += response.usage.output_tokens;

      if (response.stop_reason === 'end_turn' || !response.content.some(b => b.type === 'tool_use')) {
        finalResponse = response.content.filter(b => b.type === 'text').map(b => (b as Anthropic.TextBlock).text).join('');
        break;
      }

      // Process tool calls
      messages.push({ role: 'assistant', content: response.content });
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== 'tool_use') continue;
        const toolName = block.name as ToolName;
        const toolInput = block.input as Record<string, unknown>;

        if (!this.toolRegistry.isAllowed(toolName, allowedTools)) {
          toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify({ error: 'Tool not allowed' }) });
          continue;
        }

        const start = Date.now();
        let toolOutput: unknown;
        try {
          toolOutput = await this.toolRegistry.executeToolCall(toolName, toolInput, this.agentDataService);
        } catch (err) {
          toolOutput = { error: (err as Error).message };
        }
        const durationMs = Date.now() - start;
        toolCallsMade++;

        await this.toolCallLogger.log({
          sessionId, appId, userId, toolName, toolInput, toolOutput,
          durationMs, inputTokens: 0, outputTokens: 0, costUsd: 0,
        });

        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(toolOutput) });
      }

      messages.push({ role: 'user', content: toolResults });
    }

    const totalCost = totalInputTokens * INPUT_COST_PER_TOKEN + totalOutputTokens * OUTPUT_COST_PER_TOKEN;

    return { response: finalResponse, toolCallsMade, inputTokens: totalInputTokens, outputTokens: totalOutputTokens, totalCost };
  }
}
