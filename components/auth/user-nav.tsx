"use client";

import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";

interface UserNavProps {
  user: User;
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 rounded-full bg-white p-1 shadow-sm ring-1 ring-stone-200 hover:ring-stone-300 transition-all">
        {user.user_metadata.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.full_name || "User"}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <UserIcon className="h-4 w-4" />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-56 origin-top-right scale-0 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-transform group-hover:scale-100 focus:outline-none">
        <div className="p-4">
          <p className="text-sm font-medium text-stone-900">
            {user.user_metadata.full_name || "User"}
          </p>
          <p className="text-xs text-stone-500 truncate">{user.email}</p>
        </div>
        <div className="border-t border-stone-100">
          <a
            href="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
          >
            <UserIcon className="h-4 w-4" />
            Profile
          </a>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
