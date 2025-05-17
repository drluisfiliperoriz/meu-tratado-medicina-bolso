'use client';

import { motion } from 'framer-motion';

interface Reference {
  chapter: string;
  pages: string;
  excerpt: string;
}

interface ResponseDisplayProps {
  response: {
    answer: string;
    references: Reference[];
  };
}

export default function ResponseDisplay({ response }: ResponseDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 space-y-6"
    >
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Resposta</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {response.answer}
        </p>
      </div>

      {response.references.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Referências</h3>
          <div className="space-y-4">
            {response.references.map((ref, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-blue-600 dark:text-blue-400">
                    {ref.chapter}
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Páginas: {ref.pages}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {ref.excerpt}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}