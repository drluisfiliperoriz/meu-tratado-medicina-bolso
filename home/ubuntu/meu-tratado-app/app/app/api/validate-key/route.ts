export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey || !apiKey.startsWith('sk-proj-')) {
      return new Response(
        JSON.stringify({ error: 'Formato de chave API inválido' }),
        { status: 400 }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500 }
    )
  }
}