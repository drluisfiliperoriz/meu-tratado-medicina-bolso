'use client';

import { useState } from 'react';
import { ErrorMessage } from './ui/error-message';

export function ChatInterface() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falha na comunicação com o servidor');
      }

      const data = await res.json();
      setResponse(data.choices[0].message.content);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite sua pergunta aqui..."
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Processando...' : 'Enviar'}
        </button>
      </form>

      {error && <ErrorMessage message={error} />}

      {response && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold mb-2">Resposta:</h3>
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
}