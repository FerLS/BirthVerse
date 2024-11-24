"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BirthdayInput } from "@/components/birthday-input";
import { VerseDisplay } from "@/components/verse-display";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

export default function Home() {
  const [birthday, setBirthday] = useState<{
    day: number;
    month: number;
    year: number;
  } | null>(null);
  const [verse, setVerse] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVerse = async () => {
    if (!birthday) {
      setError("Please enter your complete birthday.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const dateString = `${birthday.year}-${String(birthday.month).padStart(
        2,
        "0"
      )}-${String(birthday.day).padStart(2, "0")}`;
      const verseText = await getBibleVerseFromDate(dateString);
      if (typeof verseText === "string") {
        setVerse(verseText);
        setReference(null);
      } else {
        setVerse(verseText.text);
        setReference(verseText.reference);
      }
    } catch (err) {
      setError("Failed to fetch verse. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 "
      >
        <div className="text-center space-y-2">
          <motion.h1
            className="text-3xl font-bold flex items-center justify-center text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Book className="mr-2" /> Birthday Bible Verse
          </motion.h1>
          <p className="text-lg text-muted-foreground">
            Discover your personalized scripture
          </p>
        </div>
        <motion.div
          className="bg-card text-card-foreground rounded-lg p-6 shadow-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <BirthdayInput onBirthdayChange={setBirthday} />
          <Button
            onClick={fetchVerse}
            className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-custom"
            disabled={!birthday || loading}
          >
            {loading ? "Fetching..." : "Get Your Verse"}
          </Button>
        </motion.div>

        <VerseDisplay
          verse={verse}
          reference={reference}
          loading={loading}
          error={error}
        />
      </motion.div>
    </main>
  );
}

const getBibleBooks = () => [
  "1chronicles",
  "1corinthians",
  "1john",
  "1kings",
  "1peter",
  "1samuel",
  "1thessalonians",
  "1timothy",
  "2chronicles",
  "2corinthians",
  "2john",
  "2kings",
  "2peter",
  "2samuel",
  "2thessalonians",
  "2timothy",
  "3john",
  "acts",
  "amos",
  "colossians",
  "daniel",
  "deuteronomy",
  "ecclesiastes",
  "ephesians",
  "esther",
  "exodus",
  "ezekiel",
  "ezra",
  "galatians",
  "genesis",
  "habakkuk",
  "haggai",
  "hebrews",
  "hosea",
  "isaiah",
  "james",
  "jeremiah",
  "job",
  "joel",
  "john",
  "jonah",
  "joshua",
  "jude",
  "judges",
  "lamentations",
  "leviticus",
  "luke",
  "malachi",
  "mark",
  "matthew",
  "micah",
  "nahum",
  "nehemiah",
  "numbers",
  "obadiah",
  "philemon",
  "philippians",
  "proverbs",
  "psalms",
  "revelation",
  "romans",
  "ruth",
  "songofsolomon",
  "titus",
  "zechariah",
  "zephaniah",
];

const queryBibleApi = async (book: string, chapter: number, verse: number) => {
  const url = `https://bible-api.com/${book}%20${chapter}:${verse}`;
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    return {
      text: data.text,
      reference: `${book} ${chapter}:${verse}`,
    };
  }
  return null;
};

const getBibleVerseFromDate = async (dateString: string) => {
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const books = getBibleBooks();
    let bookIndex = (day * month + year) % books.length;
    let book = books[bookIndex];

    let chapter = (day + month + year) % 20;
    let verse = (day * month * year) % 30;

    console.log(`Fetching verse from ${book} ${chapter}:${verse}`);
    let result = await queryBibleApi(book, chapter, verse);
    if (result) return result;

    while (!result) {
      verse--;
      result = await queryBibleApi(book, chapter, verse);
      if (result) return result;
      chapter--;
      result = await queryBibleApi(book, chapter, verse);
      if (result) return result;
      const books = getBibleBooks();
      bookIndex--;
      book = books[bookIndex];
      result = await queryBibleApi(book, chapter, verse);
      if (result) return result;
    }

    return getAlternativeVerse();
  } catch (error) {
    return "Invalid date format. Use 'YYYY-MM-DD'.";
  }
};

const getAlternativeVerse = () => {
  const fallbackVerse = {
    book: "psalms",
    chapter: 23,
    verse: 1,
    text: "HOHO, easter egg",
  };
  return `${fallbackVerse.text} (Psalms ${fallbackVerse.chapter}:${fallbackVerse.verse})`;
};
