import { logger } from './logger';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

/**
 * Função para fazer requisições diretamente à API do OpenAI sem depender do pacote openai
 */
export async function makeOpenAIRequest(prompt: string): Promise<ChatResponse> {
  try {
    logger.info('Making OpenAI API request', { prompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-preview",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      logger.error('OpenAI API error', { 
        status: response.status, 
        statusText: response.statusText,
        error: errorData 
      });
      throw new Error(errorData.error?.message || 'Failed to communicate with OpenAI');
    }

    const data = await response.json();
    logger.info('OpenAI API request successful');
    return data;
  } catch (error: any) {
    logger.error('OpenAI API request failed', {
      error: error.message,
      status: error.status,
    });

    if (error.message.includes('invalid_api_key')) {
      throw new Error('Chave de API inválida. Por favor, verifique suas configurações.');
    }

    if (error.message.includes('rate_limit')) {
      throw new Error('Limite de requisições excedido. Tente novamente mais tarde.');
    }

    throw new Error('Falha na comunicação com o servidor OpenAI. Por favor, tente novamente.');
  }
}

/**
 * Função para validar o formato da chave da API
 */
export function validateAPIKey(apiKey: string): boolean {
  // Aceita tanto o formato padrão quanto o formato sk-proj-
  const isValidFormat = /^sk-[A-Za-z0-9]{48}$/.test(apiKey) || /^sk-proj-[A-Za-z0-9-_]{120,}$/.test(apiKey);
  logger.info('API key validation result', { isValid: isValidFormat });
  return isValidFormat;
}
