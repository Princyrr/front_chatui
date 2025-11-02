import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly apiKey = process.env.OPENAI_API_KEY;

  async generateReply(messages: { role: string; content: string }[]) {
    if (!this.apiKey) throw new Error('OPENAI_API_KEY not set');

    // Exemplo usando Chat Completions (ajuste conforme API real)
    const body = {
      model: 'gpt-4o-mini', // ajuste para o modelo que você usar
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      max_tokens: 800,
      temperature: 0.2,
    };

    const res = await axios.post('https://api.openai.com/v1/chat/completions', body, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });

    // Extrai texto (ajuste conforme resposta real)
    const content = res.data.choices?.[0]?.message?.content ?? '';
    this.logger.debug('LLM reply length: ' + content.length);
    return content;
  }
}
