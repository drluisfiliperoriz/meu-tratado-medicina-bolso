import { NextResponse } from 'next/server';
import livroData from '../../../data/livro_processado.json';

export const dynamic = "force-dynamic";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MAX_TOKENS = 500;

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Prepare context from book data
    const context = prepareContext(query);

    try {
      const completion = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-preview',
          messages: [
          {
            role: 'system',
            content: 'You are a medical assistant helping with queries based on the book "Meu Tratado de Medicina de Bolso". Provide answers with references to specific pages and chapters.',
          },
          {
            role: 'user',
            content: `Context from the book:\n${context}\n\nQuery: ${query}`,
          },
        ],
        max_tokens: MAX_TOKENS,
      }),
    });

      if (!completion.ok) {
        const errorData = await completion.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
      }

      const result = await completion.json();
      const answer = result.choices[0].message.content;
      const references = extractReferences(answer, context);

      return NextResponse.json({
        answer,
        references,
      });
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      return NextResponse.json(
        { error: 'Falha na comunicação com o servidor OpenAI. Por favor, tente novamente.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error processing query:', error);
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    );
  }
}

function prepareContext(query: string): string {
  // Search through book content for relevant sections
  const relevantChapters = livroData.chapters.filter(chapter => 
    chapter.content?.toLowerCase().includes(query.toLowerCase())
  );

  return relevantChapters
    .map(chapter => `Chapter: ${chapter.title}\nPages: ${chapter.start_page}-${chapter.end_page}\nContent: ${chapter.content}\n`)
    .join('\n');
}

function extractReferences(answer: string, context: string) {
  const references: Array<{
    chapter: string;
    pages: string;
    excerpt: string;
  }> = [];

  // Extract chapter and page references from the context
  const chapters = context.split('\n\n');
  chapters.forEach(chapter => {
    const chapterMatch = chapter.match(/Chapter: (.*)\nPages: (\d+-\d+)/);
    if (chapterMatch) {
      references.push({
        chapter: chapterMatch[1],
        pages: chapterMatch[2],
        excerpt: chapter.split('Content: ')[1] || '',
      });
    }
  });

  return references;
}