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
    <div className="bg-surface text-on-surface font-body min-h-screen">
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
          <Link href="#" className="flex items-center gap-3 text-on-surface px-4 py-2 hover:bg-surface-container-highest transition-all duration-200 ease-in-out rounded-lg">
            <span className="material-symbols-outlined">folder_open</span>
            <span className="font-medium">Projects</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 text-on-surface px-4 py-2 hover:bg-surface-container-highest transition-all duration-200 ease-in-out rounded-lg">
            <span className="material-symbols-outlined">auto_awesome</span>
            <span className="font-medium">Brand Hub</span>
          </Link>
        </nav>
        <div className="pt-4 border-t border-outline-variant/10 flex flex-col gap-1">
          <button className="mb-4 bg-secondary-container text-on-secondary-container font-semibold py-2 px-4 rounded-full text-sm hover:opacity-90 transition-opacity">
            Invite Members
          </button>
          <Link href="#" className="flex items-center gap-3 text-on-surface px-4 py-2 hover:bg-surface-container-highest transition-all duration-200 ease-in-out rounded-lg">
            <span className="material-symbols-outlined">delete</span>
            <span className="font-medium">Trash</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 text-on-surface px-4 py-2 hover:bg-surface-container-highest transition-all duration-200 ease-in-out rounded-lg">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </aside>

      <main className="ml-64 min-h-screen bg-surface">
        <header className="sticky top-0 w-full z-40 px-8 py-4 flex justify-between items-center bg-surface-container-low/80 backdrop-blur-md">
          <div className="flex-1 max-w-2xl relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input className="w-full bg-surface-container-highest/40 border-none rounded-full py-3 pl-12 pr-6 focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant/60 transition-all font-body text-sm" placeholder="Search your content or templates" type="text" />
          </div>
          <div className="flex items-center gap-4 ml-6 relative" ref={dropdownRef}>
            <button className="p-2 text-on-surface hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            
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
                    <img src={user.photoURL || ""} className="w-full h-full object-cover" alt="Avatar"/>
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

          <section className="mb-12">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold font-headline">Recent designs</h2>
                <p className="text-on-surface-variant text-sm">Pick up right where you left off</p>
              </div>
              <button className="text-primary font-bold text-sm hover:underline">View all</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="md:col-span-2 md:row-span-2 group">
                <div className="h-full bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col border border-outline-variant/10">
                  <div className="relative h-2/3 overflow-hidden">
                    <img alt="Design thumbnail" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC0pGU0TjYDg4NiwHEg8JGnm2r4iWcvQkIIV3OS5Sd642RRkn0KCo2x916ExJwKyyaS9Vh5KzZJZ7tcDe3OZRrgPtwN00Z9bbDvOz0eZLzcLALqOVtpPtUeRWbScXtm9d-IFHkrPUAfRTxBItmd83f_zRYAGGbn6HftTufwZT1moyOfFsAIXXmdoLzxrVzybiG3I5VFNJVsqQows1z93kAcNTC6Ezk8P71Y-j0jPdIoFyOu5m_oOS7182LYUbG05pKTH5gffLL-90" />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary">In Progress</div>
                  </div>
                  <div className="p-8 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-xl font-bold font-headline mb-2">Summer Brand Campaign 2024</h3>
                      <p className="text-on-surface-variant text-sm mb-4">Modified 2 hours ago • Marketing</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-dim"></div>
                        <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-primary-container"></div>
                      </div>
                      <span className="text-xs text-on-surface-variant font-medium">+2 collaborators</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {[
                { title: "Q3 Review Deck", type: "Presentation", time: "1 day ago", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7M_koVV2sAaMU8Vq9n-ybx6GoMnDhiciqBYCwhml2ArM13iJ7ZHNOQGelV5dcVaQlz6dC53dhHQ46judnChIOPzTm07G6gaMwl57ES6r4hyL7WN2zNlVZBl1E2d-YfXS5YNtY5JYdJJ0VtCrJNrjqhXy5EKo8H731_66JAbtNpQqe27arIK6TT3-F8dnBgvAW7DLkU-lVqadSe_reehTMOlYt_tr0yuwtzDUdFY55qpZ21lQ0BUhx4rcce3OaCBL5r8gBZrIl4uc" },
                { title: "Instagram Stories Pack", type: "Social Media", time: "3 days ago", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAN4LE2lNZA2r1XbYOf6DkfAgjDetpAD5bKi_aTC9G2F1d5a7vm1FlpQ4ZxwCpyLXqfv5wUQLvIgcaxpM-sJF1yZCYhismMhq95ZoH0rAr1xnQ2eFau3GSsXvDvJ-gh-iIn8zDH-J97XTWCzj1DbJl_986ytcJ3ibcjQyACMgjYYPCrpMsOyetRzGyJrEfDLt6Db015aALxqpfDoHp5EW8eJV6DSKr6lXHfBh9MkgnbiztUTfHoODzE2wCoqOMOdr-unxR72B4YTpY" },
                { title: "New Brand Identity", type: "Brand Hub", time: "Last week", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrsRBUh4vGol710cqAxS5fgvY06aqsaUs1uJKddxA2UBks_IzGZtvkuMN4IphO9Ia7FY0dsE7gSn2Gh9xGpd9tXR6ZubmhHMvrislY7M_s3m-Jrfxs4suhvrXOh9M5PM6xp8hTZI37ZuFxRJC1_G27r2dfkoHiH38BB2yn014AZNjzm6gBC3h4ZBj8qfvkKSbMMSWYFGap5wK8b09ZHnwT9gStqjHqS8Kzxw9rUEsmv62p3v76vK52iYWgMzarsVqrrThqNYUJ5lk" },
                { title: "Portfolio Website V2", type: "Apps", time: "2 weeks ago", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvsAlaQ2geaXBJdHTIm2lIBgOBeolGaD9QeMrDZBdQ4iu9cYUV52nCkg99XXyFvGSdRtKiJDU6nlr8k9yOiDFTeYCLyvG7vMCE46dGgHsz_lBN6OqkNbZYDPZacicLC4oxtkfGMpzrgyH9GxD6bADUVmBHoaYiF-h3_N8pOUaftpD_fARhrDeXPPbTesO3eGXWNdy3k55XQ8I04ZzlRZZQ1VvzTl6MV-s_fJ9zumoW4PND2r3HW5cZOCcPKLTaL2VFONPpn0zoWcY" }
              ].map((card, idx) => (
                <div key={idx} className="group">
                  <div className="h-full bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col border border-outline-variant/10">
                    <div className="relative h-48 overflow-hidden">
                      <img alt={card.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={card.img} />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold font-headline mb-1 truncate">{card.title}</h3>
                      <p className="text-on-surface-variant text-xs mb-4">{card.time} • {card.type}</p>
                      <Link href="/editor">
                        <button className="w-full py-2 bg-surface-container-high text-on-surface text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-colors">
                          Edit Design
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
