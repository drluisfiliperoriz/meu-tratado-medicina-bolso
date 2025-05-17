import OpenAI from 'openai';
import { logger } from './logger';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Wrapper function to handle OpenAI API calls with error handling
export async function makeOpenAIRequest(prompt: string) {
  try {
    logger.info('Making OpenAI API request', { prompt });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-preview",
      messages: [{ role: "user", content: prompt }],
    });

    logger.info('OpenAI API request successful');
    return response;
  } catch (error: any) {
    logger.error('OpenAI API request failed', {
      error: error.message,
      code: error.code,
      type: error.type
    });

    if (error.code === 'invalid_api_key') {
      throw new Error('Chave de API inválida. Por favor, verifique suas configurações.');
    }

    if (error.code === 'rate_limit_exceeded') {
      throw new Error('Limite de requisições excedido. Tente novamente mais tarde.');
    }

    throw new Error('Falha na comunicação com o servidor OpenAI. Por favor, tente novamente.');
  }
}

// Utility function to validate API key format
export function validateAPIKey(apiKey: string): boolean {
  // Aceita tanto o formato padrão quanto o formato sk-proj-
  const isValidFormat = /^sk-[A-Za-z0-9]{48}$/.test(apiKey) || /^sk-proj-[A-Za-z0-9-_]{120,}$/.test(apiKey);
  logger.info('API key validation result', { isValid: isValidFormat });
  return isValidFormat;
}