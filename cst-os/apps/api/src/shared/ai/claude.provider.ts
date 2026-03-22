import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiService, AiChatOptions, AiChatResponse } from './ai.service';

@Injectable()
export class ClaudeProvider extends AiService {
  private client: Anthropic;
  private defaultModel = 'claude-sonnet-4-6';

  constructor(private config: ConfigService) {
    super();
    this.client = new Anthropic({
      apiKey: this.config.get<string>('ANTHROPIC_API_KEY'),
    });
  }

  async chat(options: AiChatOptions): Promise<AiChatResponse> {
    const response = await this.client.messages.create({
      model: this.defaultModel,
      max_tokens: options.maxTokens ?? 8096,
      system: options.systemPrompt,
      messages: options.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    return {
      content: textBlock?.type === 'text' ? textBlock.text : '',
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  }

  async streamChat(
    options: AiChatOptions,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    const stream = this.client.messages.stream({
      model: this.defaultModel,
      max_tokens: options.maxTokens ?? 8096,
      system: options.systemPrompt,
      messages: options.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        onChunk(event.delta.text);
      }
    }
  }
}
