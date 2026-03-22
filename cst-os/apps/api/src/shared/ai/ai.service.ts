export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChatOptions {
  systemPrompt?: string;
  messages: AiMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface AiChatResponse {
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export abstract class AiService {
  abstract chat(options: AiChatOptions): Promise<AiChatResponse>;

  abstract streamChat(
    options: AiChatOptions,
    onChunk: (chunk: string) => void,
  ): Promise<void>;
}
