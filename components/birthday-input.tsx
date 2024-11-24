'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, ChevronDown } from 'lucide-react'

interface BirthdayInputProps {
  onBirthdayChange: (birthday: { day: number; month: number; year: number } | null) => void
}

export function BirthdayInput({ onBirthdayChange }: BirthdayInputProps) {
  const [day, setDay] = useState<string>('')
  const [month, setMonth] = useState<string>('')
  const [year, setYear] = useState<string>('')

  useEffect(() => {
    if (day && month && year) {
      const dayNum = parseInt(day, 10)
      const monthNum = parseInt(month, 10)
      const yearNum = parseInt(year, 10)
      if (dayNum > 0 && monthNum > 0 && yearNum > 0) {
        onBirthdayChange({ day: dayNum, month: monthNum, year: yearNum })
      }
    } else {
      onBirthdayChange(null)
    }
  }, [day, month, year, onBirthdayChange])

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <motion.div className="space-y-2" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Label htmlFor="day" className="text-gray-700 dark:text-gray-300">Day</Label>
          <div className="relative">
            <Input
              id="day"
              type="number"
              min="1"
              max="31"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="DD"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 pl-8"
            />
            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </motion.div>
        <motion.div className="space-y-2" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Label htmlFor="month" className="text-gray-700 dark:text-gray-300">Month</Label>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger id="month" className="bg-white text-gray-700 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((monthName, index) => (
                <SelectItem key={index + 1} value={(index + 1).toString()}>
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        <motion.div className="space-y-2" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Label htmlFor="year" className="text-gray-700 dark:text-gray-300">Year</Label>
          <div className="relative">
            <Input
              id="year"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="YYYY"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 pl-8"
            />
            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

