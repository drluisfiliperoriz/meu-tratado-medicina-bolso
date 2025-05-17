'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Chapter {
  title: string;
  start_page: number;
  end_page: number;
  sections: any[];
}

interface BookIndexProps {
  chapters: Chapter[];
}

export default function BookIndex({ chapters }: BookIndexProps) {
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-6">Índice do Livro</h2>
      <div className="space-y-2">
        {chapters?.map((chapter, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => setExpandedChapter(expandedChapter === index ? null : index)}
              className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{chapter.title}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {chapter.start_page}-{chapter.end_page}
                </span>
              </div>
              <AnimatePresence>
                {expandedChapter === index && chapter.sections?.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600"
                  >
                    {chapter.sections.map((section, sIndex) => (
                      <div key={sIndex} className="py-1 text-sm text-gray-600 dark:text-gray-300">
                        {section}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}