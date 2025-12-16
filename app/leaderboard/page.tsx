import Link from "next/link";
import {
  Trophy,
  Medal,
  Award,
  User,
  Tag,
  CheckCircle2,
  ThumbsUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getLeaderboardUsers, getUserStats } from "@/lib/queries/leaderboard";

interface LeaderboardUser {
  id: string;
  username: string | null;
  avatar_url: string | null;
  reputation_score: number | null;
  role: string | null;
  created_at: string | null;
  stats: {
    totalTags: number;
    verifiedTags: number;
    votesCast: number;
  };
}

export default async function LeaderboardPage() {
  const users = await getLeaderboardUsers(50);

  // If no users, return empty state early
  if (!users || users.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-stone-900 mb-2">
            Community Leaderboard
          </h1>
          <p className="text-stone-600">
            Top contributors helping preserve fashion history
          </p>
        </div>
        <div className="text-center py-12 text-stone-600">
          No users on the leaderboard yet. Be the first to contribute!
        </div>
      </div>
    );
  }

  // Fetch stats for all users
  const usersWithStats: LeaderboardUser[] = await Promise.all(
    users.map(async (user) => ({
      ...user,
      stats: await getUserStats(user.id),
    }))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-stone-900 mb-2">
          Community Leaderboard
        </h1>
        <p className="text-stone-600">
          Top contributors helping preserve fashion history
        </p>
      </div>

      {/* Top 3 Podium */}
      {usersWithStats.length >= 3 && (
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {/* 2nd Place */}
          <div className="flex flex-col items-center sm:pt-8">
            <Medal className="h-8 w-8 text-stone-400 mb-2" />
            <UserCard user={usersWithStats[1]} rank={2} />
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <Trophy className="h-10 w-10 text-yellow-500 mb-2" />
            <UserCard user={usersWithStats[0]} rank={1} />
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center sm:pt-8">
            <Award className="h-8 w-8 text-amber-600 mb-2" />
            <UserCard user={usersWithStats[2]} rank={3} />
          </div>
        </div>
      )}

      {/* Rest of leaderboard */}
      <div className="max-w-4xl mx-auto space-y-2">
        {usersWithStats.slice(3).map((user, index) => (
          <UserRow key={user.id} user={user} rank={index + 4} />
        ))}
      </div>

      {usersWithStats.length === 0 && (
        <div className="text-center py-12 text-stone-600">
          No users on the leaderboard yet. Be the first to contribute!
        </div>
      )}
    </div>
  );
}

// User card component for top 3
function UserCard({ user, rank }: { user: LeaderboardUser; rank: number }) {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardContent className="p-4 text-center">
        <Link href={`/profile?user=${user.id}`}>
          <div className="flex flex-col items-center">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username || "User"}
                className="w-16 h-16 rounded-full mb-2"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <User className="h-8 w-8 text-orange-600" />
              </div>
            )}
            <p className="font-semibold text-stone-900">{user.username}</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {user.reputation_score || 0}
            </p>
            <p className="text-xs text-stone-500">reputation</p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

// User row component for rank 4+
function UserRow({ user, rank }: { user: LeaderboardUser; rank: number }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <Link href={`/profile?user=${user.id}`}>
          <div className="flex items-center gap-4">
            {/* Rank */}
            <div className="text-2xl font-bold text-stone-400 w-12 text-center flex-shrink-0">
              #{rank}
            </div>

            {/* Avatar */}
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username || "User"}
                className="w-12 h-12 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-orange-600" />
              </div>
            )}

            {/* Username & Stats */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-900 truncate">
                {user.username}
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-stone-600 mt-1">
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {user.stats.totalTags} submitted
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                  <span className="truncate">
                    {user.stats.verifiedTags} verified
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{user.stats.votesCast} votes</span>
                </span>
              </div>
            </div>

            {/* Reputation Score */}
            <div className="text-right flex-shrink-0">
              <p className="text-xl sm:text-2xl font-bold text-orange-600">
                {user.reputation_score || 0}
              </p>
              <p className="text-xs text-stone-500">reputation</p>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
