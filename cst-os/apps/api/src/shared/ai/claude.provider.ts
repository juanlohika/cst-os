import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiService, AiChatOptions, AiChatResponse } from './ai.service';
import { SystemSettingsService } from '../../modules/system-settings/system-settings.service';

@Injectable()
export class ClaudeProvider extends AiService {
  private defaultModel = 'claude-sonnet-4-6';

  constructor(
    private config: ConfigService,
    private settings: SystemSettingsService
  ) {
    super();
  }

  private async getClient(): Promise<Anthropic> {
    const setting = await this.settings.findByKey('ANTHROPIC_API_KEY');
    const apiKey = setting?.value || this.config.get<string>('ANTHROPIC_API_KEY');
    
    if (!apiKey) {
      throw new Error('Anthropic API key is not configured in settings or environment.');
    }
    
    return new Anthropic({ apiKey });
  }

  async chat(options: AiChatOptions): Promise<AiChatResponse> {
    const client = await this.getClient();
    const response = await client.messages.create({
      model: this.defaultModel,
      max_tokens: options.maxTokens ?? 8096,
      system: options.systemPrompt,
      messages: options.messages.map((m) => ({
        role: m.role,
        content: m.content as string,
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
    const client = await this.getClient();
    const stream = client.messages.stream({
      model: this.defaultModel,
      max_tokens: options.maxTokens ?? 8096,
      system: options.systemPrompt,
      messages: options.messages.map((m) => ({
        role: m.role,
        content: m.content as string,
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
