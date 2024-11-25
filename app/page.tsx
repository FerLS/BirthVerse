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
      const { text, reference } = await getBibleVerseFromDate(dateString);
      setVerse(text);
      setReference(reference);
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
        <div className="text-center space-y-10">
          <motion.h1
            className="text-3xl font-bold flex items-center justify-center text-foreground "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Book className="mr-2 md:inline hidden " />
            <p> Discover Your BirthVerse</p>
          </motion.h1>
          <p className="text-xl text-muted-foreground">
            Have you ever wondered which Bible verse corresponds to your date of
            birth? No? I don’t care, here you go.
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
  { name: "1chronicles", chapters: 29 },
  { name: "1corinthians", chapters: 16 },
  { name: "1john", chapters: 5 },
  { name: "1kings", chapters: 22 },
  { name: "1peter", chapters: 5 },
  { name: "1samuel", chapters: 31 },
  { name: "1thessalonians", chapters: 5 },
  { name: "1timothy", chapters: 6 },
  { name: "2chronicles", chapters: 36 },
  { name: "2corinthians", chapters: 13 },
  { name: "2john", chapters: 1 },
  { name: "2kings", chapters: 25 },
  { name: "2peter", chapters: 3 },
  { name: "2samuel", chapters: 24 },
  { name: "2thessalonians", chapters: 3 },
  { name: "2timothy", chapters: 4 },
  { name: "3john", chapters: 1 },
  { name: "acts", chapters: 28 },
  { name: "amos", chapters: 9 },
  { name: "colossians", chapters: 4 },
  { name: "daniel", chapters: 12 },
  { name: "deuteronomy", chapters: 34 },
  { name: "ecclesiastes", chapters: 12 },
  { name: "ephesians", chapters: 6 },
  { name: "esther", chapters: 10 },
  { name: "exodus", chapters: 40 },
  { name: "ezekiel", chapters: 48 },
  { name: "ezra", chapters: 10 },
  { name: "galatians", chapters: 6 },
  { name: "genesis", chapters: 50 },
  { name: "habakkuk", chapters: 3 },
  { name: "haggai", chapters: 2 },
  { name: "hebrews", chapters: 13 },
  { name: "hosea", chapters: 14 },
  { name: "isaiah", chapters: 66 },
  { name: "james", chapters: 5 },
  { name: "jeremiah", chapters: 52 },
  { name: "job", chapters: 42 },
  { name: "joel", chapters: 3 },
  { name: "john", chapters: 21 },
  { name: "jonah", chapters: 4 },
  { name: "joshua", chapters: 24 },
  { name: "jude", chapters: 1 },
  { name: "judges", chapters: 21 },
  { name: "lamentations", chapters: 5 },
  { name: "leviticus", chapters: 27 },
  { name: "luke", chapters: 24 },
  { name: "malachi", chapters: 4 },
  { name: "mark", chapters: 16 },
  { name: "matthew", chapters: 28 },
  { name: "micah", chapters: 7 },
  { name: "nahum", chapters: 3 },
  { name: "nehemiah", chapters: 13 },
  { name: "numbers", chapters: 36 },
  { name: "obadiah", chapters: 1 },
  { name: "philemon", chapters: 1 },
  { name: "philippians", chapters: 4 },
  { name: "proverbs", chapters: 31 },
  { name: "psalms", chapters: 150 },
  { name: "revelation", chapters: 22 },
  { name: "romans", chapters: 16 },
  { name: "ruth", chapters: 4 },
  { name: "songofsolomon", chapters: 8 },
  { name: "titus", chapters: 3 },
  { name: "zechariah", chapters: 14 },
  { name: "zephaniah", chapters: 3 },
];

const queryBibleApi = async (book: string, chapter: number) => {
  const url = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/en-asv/books/${book}/chapters/${chapter}.json`;
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();

    return data;
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
    let book = books[bookIndex].name;

    let chapter = ((day + month + year) % books[bookIndex].chapters) + 1;

    let result = await queryBibleApi(book, chapter);

    let index = (day + month + year) % result.data.length;

    return {
      text: result.data[index].text,
      reference: `${book} ${chapter}:${result.data[index].verse}`,
    };
  } catch (error) {
    console.error(error);
    return { text: "Error", reference: "Error" };
  }
};
