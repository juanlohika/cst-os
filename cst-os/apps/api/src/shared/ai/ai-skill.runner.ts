import { Injectable } from '@nestjs/common';
import { AiService, AiMessage } from './ai.service';

export interface SkillRunOptions {
  /** The CLAUDE.md instruction for this skill/app */
  systemPrompt: string;
  /** Conversation messages (step inputs from the user) */
  messages: AiMessage[];
  /** Knowledge sources to inject into context */
  knowledgeSources?: string[];
  /** Structured context pulled from current page (project, client, etc.) */
  context?: Record<string, unknown>;
  maxTokens?: number;
}

export interface SkillRunResult {
  content: string;
  usage: { inputTokens: number; outputTokens: number };
}

@Injectable()
export class AiSkillRunner {
  constructor(private aiService: AiService) {}

  async run(options: SkillRunOptions): Promise<SkillRunResult> {
    const systemPrompt = this.buildSystemPrompt(
      options.systemPrompt,
      options.context,
      options.knowledgeSources,
    );

    return this.aiService.chat({
      systemPrompt,
      messages: options.messages,
      maxTokens: options.maxTokens,
    });
  }

  async stream(
    options: SkillRunOptions,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    const systemPrompt = this.buildSystemPrompt(
      options.systemPrompt,
      options.context,
      options.knowledgeSources,
    );

    return this.aiService.streamChat(
      { systemPrompt, messages: options.messages, maxTokens: options.maxTokens },
      onChunk,
    );
  }

  private buildSystemPrompt(
    baseInstruction: string,
    context?: Record<string, unknown>,
    knowledgeSources?: string[],
  ): string {
    let prompt = baseInstruction;

    if (context && Object.keys(context).length > 0) {
      prompt += '\n\n---\n## AUTO-FILLED CONTEXT\n';
      for (const [key, value] of Object.entries(context)) {
        if (value !== null && value !== undefined) {
          prompt += `\n**${key}:** ${JSON.stringify(value)}`;
        }
      }
    }

    if (knowledgeSources && knowledgeSources.length > 0) {
      prompt += '\n\n---\n## KNOWLEDGE SOURCES\n';
      knowledgeSources.forEach((source, i) => {
        prompt += `\n### Source ${i + 1}\n${source}`;
      });
    }

    return prompt;
  }
}
