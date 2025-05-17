"use client";

import React, { useState } from 'react';

export function SimpleChatInterface() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Falha na comunicação com o servidor');
      }
      
      setResponse(data.choices[0].message.content);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao processar sua solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Consulta Médica</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium mb-1">
            Sua pergunta:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Digite sua pergunta médica aqui..."
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Processando...' : 'Enviar'}
        </button>
      </form>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      {response && (
        <div className="p-4 bg-gray-100 rounded-md">
          <h3 className="font-bold mb-2">Resposta:</h3>
          <div className="whitespace-pre-wrap">{response}</div>
        </div>
      )}
    </div>
  );
}
