"use client";

import { auth } from "@/lib/firebaseConfig";
import { signOut, User } from "firebase/auth";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Dashboard({ user }: { user: User }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen relative z-0">
      {/* Doodle Background Overlay */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none opacity-60 dark:opacity-80 invert dark:invert-0"
        style={{
          backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
          backgroundRepeat: 'repeat',
          backgroundPosition: 'top center',
          backgroundSize: '400px'
        }}
      />
      <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low flex flex-col p-4 gap-2 z-50">
        <div className="mb-8 px-4 flex flex-col gap-1">
          <span className="text-xl font-black text-on-surface tracking-tight font-headline">Designora</span>
          <div className="flex items-center gap-3 mt-4 p-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold font-headline">Personal Workspace</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Free Plan</span>
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          <Link href="/" className="flex items-center gap-3 bg-primary text-white rounded-lg px-4 py-2 transition-all duration-200 ease-in-out">
            <span className="material-symbols-outlined">home</span>
            <span className="font-medium">Home</span>
          </Link>

        </nav>
        <div className="pt-4 border-t border-outline-variant/10 flex flex-col gap-1">

          <Link href="#" className="flex items-center gap-3 text-on-surface px-4 py-2 hover:bg-surface-container-highest transition-all duration-200 ease-in-out rounded-lg">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </aside>

      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 w-full z-40 px-8 py-4 flex justify-between items-center bg-transparent">
          <div></div>
          <div className="flex items-center gap-4 ml-6 relative" ref={dropdownRef}>


            <div
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src={user.photoURL || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
              />
            </div>

            {profileOpen && (
              <div className="absolute right-0 top-14 w-64 bg-surface-container-lowest border border-outline-variant shadow-2xl rounded-2xl p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src={user.photoURL || ""} className="w-full h-full object-cover" alt="Avatar" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold truncate max-w-[150px]">{user.displayName || "User"}</span>
                    <span className="text-[10px] text-on-surface-variant truncate max-w-[150px]">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-error hover:bg-error/10 rounded-lg transition-colors font-medium text-sm"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="px-8 pb-12">
          <section className="mt-4 mb-10 rounded-[2rem] overflow-hidden relative min-h-[320px] flex items-center p-12 bg-gradient-to-br from-primary to-primary-container">
            <div className="relative z-10 max-w-xl">
              <h1 className="text-5xl font-extrabold text-on-primary font-headline leading-tight tracking-tight mb-4 text-white">What will you design today?</h1>
              <p className="text-on-primary/80 text-lg font-medium mb-8 text-white/90">Unlock your creative potential with our intuitive tools and curated templates.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/editor">
                  <button className="bg-surface-container-lowest text-primary font-bold px-8 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg">
                    Blank Project
                  </button>
                </Link>
              </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
          </section>

          <div className="fixed bottom-8 right-8 z-50">
            <Link href="/editor">
              <button className="bg-primary text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl">add</span>
                <span className="font-bold pr-2">Create New</span>
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
