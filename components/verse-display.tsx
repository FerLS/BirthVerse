'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Quote } from 'lucide-react'

interface VerseDisplayProps {
  verse: string | null
  reference: string | null
  loading: boolean
  error: string | null
}

export function VerseDisplay({ verse, reference, loading, error }: VerseDisplayProps) {
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center text-gray-600 dark:text-gray-400 text-lg"
        >
          <div className="flex justify-center items-center space-x-1">
            <motion.div
              className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop" }}
            />
            <motion.div
              className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
            />
          </div>
        </motion.div>
      )}

      {error && (
        <motion.p
          key="error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 rounded-lg p-4"
        >
          {error}
        </motion.p>
      )}

      {verse && reference && (
        <motion.div
          key="verse"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center space-y-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm"
        >
          <Quote className="mx-auto text-gray-400 dark:text-gray-600" size={24} />
          <motion.p 
            className="text-xl text-gray-800 dark:text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {verse}
          </motion.p>
          <motion.p 
            className="text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {reference}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

