"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var LlmService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let LlmService = LlmService_1 = class LlmService {
    logger = new common_1.Logger(LlmService_1.name);
    apiKey = process.env.OPENAI_API_KEY;
    async generateReply(messages) {
        if (!this.apiKey)
            throw new Error('OPENAI_API_KEY not set');
        // Exemplo usando Chat Completions (ajuste conforme API real)
        const body = {
            model: 'gpt-4o-mini', // ajuste para o modelo que você usar
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            max_tokens: 800,
            temperature: 0.2,
        };
        const res = await axios_1.default.post('https://api.openai.com/v1/chat/completions', body, {
            headers: { Authorization: `Bearer ${this.apiKey}` },
        });
        // Extrai texto (ajuste conforme resposta real)
        const content = res.data.choices?.[0]?.message?.content ?? '';
        this.logger.debug('LLM reply length: ' + content.length);
        return content;
    }
};
exports.LlmService = LlmService;
exports.LlmService = LlmService = LlmService_1 = __decorate([
    (0, common_1.Injectable)()
], LlmService);
