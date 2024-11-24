'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BirthdayInput } from '@/components/birthday-input'
import { VerseDisplay } from '@/components/verse-display'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Book } from 'lucide-react'

export default function Home() {
  const [birthday, setBirthday] = useState<{ day: number; month: number; year: number } | null>(null)
  const [verse, setVerse] = useState<string | null>(null)
  const [reference, setReference] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const fetchVerse = async () => {
    if (!birthday) {
      setError('Please enter your complete birthday.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://magicloops.dev/api/loop/dfc5a7c3-fa17-49b3-b5f0-06b16b99c773/run?day=${birthday.day}&month=${birthday.month}&year=${birthday.year}`)
      const data = await response.json()
      setVerse(data.verse)
      setReference(data.index)
    } catch (err) {
      setError('Failed to fetch verse. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 transition-colors duration-200">

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <motion.h1 
            className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Book className="mr-2" /> Birthday Bible Verse
          </motion.h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Discover your personalized scripture</p>
        </div>
        <motion.div 
          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <BirthdayInput onBirthdayChange={setBirthday} />
          <Button 
            onClick={fetchVerse} 
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
            disabled={!birthday || loading}
          >
            {loading ? 'Fetching...' : 'Get Your Verse'}
          </Button>
        </motion.div>
        <VerseDisplay verse={verse} reference={reference} loading={loading} error={error} />
      </motion.div>
    </main>
  )
}

