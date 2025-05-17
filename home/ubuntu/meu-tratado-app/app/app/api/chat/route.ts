export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { message, apiKey } = await request.json()

    if (!message || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Mensagem e chave API são obrigatórios' }),
        { status: 400 }
      )
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-preview',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente médico especializado em fornecer informações precisas e atualizadas sobre medicina. Responda de forma clara e profissional.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return new Response(
        JSON.stringify({ error: error.error?.message || 'Erro na API do OpenAI' }),
        { status: response.status }
      )
    }

    const data = await response.json()
    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500 }
    )
  }
}