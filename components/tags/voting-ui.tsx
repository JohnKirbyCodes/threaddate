"use client";

import { useState, useTransition } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { castVote, removeVote } from "@/lib/actions/cast-vote";
import { useRouter } from "next/navigation";
import { trackVote, trackVoteUnauthenticated } from "@/lib/analytics";

interface VotingUIProps {
  tagId: number;
  currentScore: number;
  userVote: number | null;
  isAuthenticated: boolean;
}

export function VotingUI({
  tagId,
  currentScore,
  userVote: initialUserVote,
  isAuthenticated,
}: VotingUIProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [userVote, setUserVote] = useState<number | null>(initialUserVote);
  const [score, setScore] = useState(currentScore);

  const handleVote = async (value: 1 | -1) => {
    if (!isAuthenticated) {
      trackVoteUnauthenticated({ tagId, redirectTriggered: true });
      router.push("/login?redirect=" + encodeURIComponent(`/tags/${tagId}`));
      return;
    }

    // Optimistic update
    const oldVote = userVote;
    const oldScore = score;

    if (userVote === value) {
      // Remove vote
      setUserVote(null);
      setScore(score - value);
      startTransition(async () => {
        const result = await removeVote(tagId);
        if (result.error) {
          // Revert on error
          setUserVote(oldVote);
          setScore(oldScore);
        } else {
          trackVote({
            tagId,
            action: 'removed',
            previousValue: value,
          });
        }
      });
    } else {
      // Cast or change vote
      const scoreDelta = oldVote ? value - oldVote : value;
      setUserVote(value);
      setScore(score + scoreDelta);
      startTransition(async () => {
        const result = await castVote(tagId, value);
        if (result.error) {
          // Revert on error
          setUserVote(oldVote);
          setScore(oldScore);
        } else {
          trackVote({
            tagId,
            action: oldVote ? 'changed' : 'cast',
            voteValue: value,
            previousValue: oldVote ?? undefined,
          });
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => handleVote(1)}
        disabled={isPending}
        className={`rounded-md p-2 transition-colors ${
          userVote === 1
            ? "bg-green-100 text-green-600"
            : "text-stone-400 hover:bg-stone-100 hover:text-green-600"
        } disabled:opacity-50`}
        aria-label="Upvote"
      >
        <ArrowUp className="h-6 w-6" />
      </button>

      <div
        className={`min-w-[3rem] text-center text-lg font-bold ${
          score > 0
            ? "text-green-600"
            : score < 0
            ? "text-red-600"
            : "text-stone-600"
        }`}
      >
        {score}
      </div>

      <button
        onClick={() => handleVote(-1)}
        disabled={isPending}
        className={`rounded-md p-2 transition-colors ${
          userVote === -1
            ? "bg-red-100 text-red-600"
            : "text-stone-400 hover:bg-stone-100 hover:text-red-600"
        } disabled:opacity-50`}
        aria-label="Downvote"
      >
        <ArrowDown className="h-6 w-6" />
      </button>
    </div>
  );
}
