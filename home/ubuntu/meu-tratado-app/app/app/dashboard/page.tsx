'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const apiKey = localStorage.getItem('openai-api-key')
    if (!apiKey) {
      router.push('/')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const apiKey = localStorage.getItem('openai-api-key')
    if (!apiKey) {
      router.push('/')
      return
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          apiKey,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar a requisição')
      }

      setResponse(data.response)
      setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar a requisição')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Meu Tratado de Medicina de Bolso</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="query" className="block text-sm font-medium mb-2">
                Sua pergunta médica
              </label>
              <textarea
                id="query"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua pergunta sobre medicina..."
                className="w-full p-3 border rounded-md min-h-[100px]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Enviar Pergunta'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {response && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Resposta</h2>
            <div className="prose max-w-none">
              {response.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}