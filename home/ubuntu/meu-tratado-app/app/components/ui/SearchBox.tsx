'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  disabled?: boolean;
}

export default function SearchBox({ value, onChange, onSearch, disabled }: SearchBoxProps) {
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <motion.div
          animate={isTyping ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
            placeholder="Digite sua pergunta médica..."
            className="input"
            disabled={disabled}
          />
        </motion.div>
        <motion.button
          type="submit"
          disabled={disabled || !value.trim()}
          className={`
            absolute right-2 top-1/2 transform -translate-y-1/2
            px-4 py-2 bg-blue-600 text-white rounded-md
            ${disabled || !value.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
            transition-all duration-200
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Pesquisar
        </motion.button>
      </div>
    </form>
  );
}