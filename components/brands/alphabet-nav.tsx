"use client";

import { useState, useEffect } from "react";
import { trackBrandListInteraction } from "@/lib/analytics";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface AlphabetNavProps {
  availableLetters: string[];
}

export function AlphabetNav({ availableLetters }: AlphabetNavProps) {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Find which letter section is currently in view
      for (const letter of availableLetters) {
        const element = document.getElementById(`letter-${letter}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            setActiveLetter(letter);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [availableLetters]);

  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      trackBrandListInteraction({
        action: "letter_nav",
        value: letter,
      });
    }
  };

  return (
    <>
      {/* Desktop: Vertical sidebar on right */}
      <div className="hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-20">
        <nav className="bg-white rounded-lg shadow-lg border border-stone-200 p-2 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-1">
            {ALPHABET.map((letter) => {
              const isAvailable = availableLetters.includes(letter);
              const isActive = activeLetter === letter;

              return (
                <button
                  key={letter}
                  onClick={() => isAvailable && scrollToLetter(letter)}
                  disabled={!isAvailable}
                  className={`
                    w-8 h-8 rounded text-xs font-medium transition-all
                    ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : isAvailable
                        ? "text-stone-700 hover:bg-stone-100"
                        : "text-stone-300 cursor-not-allowed"
                    }
                  `}
                  title={
                    isAvailable
                      ? `Jump to ${letter}`
                      : `No brands starting with ${letter}`
                  }
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile: Horizontal scrollable bar at top */}
      <div className="lg:hidden sticky top-32 z-10 bg-white border-b border-stone-200 py-2">
        <div className="overflow-x-auto px-4 scrollbar-hide">
          <div className="flex gap-1 min-w-max">
            {ALPHABET.map((letter) => {
              const isAvailable = availableLetters.includes(letter);
              const isActive = activeLetter === letter;

              return (
                <button
                  key={letter}
                  onClick={() => isAvailable && scrollToLetter(letter)}
                  disabled={!isAvailable}
                  className={`
                    flex-shrink-0 w-10 h-10 rounded-lg text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : isAvailable
                        ? "bg-stone-100 text-stone-700 active:bg-stone-200"
                        : "bg-stone-50 text-stone-300 cursor-not-allowed"
                    }
                  `}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
