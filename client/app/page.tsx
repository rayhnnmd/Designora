"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import Dashboard from "@/components/dashboard/Dashboard";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (user) {
    return <Dashboard user={user} />;
  }
  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container font-body min-h-screen">

      <nav className="w-full top-0 sticky z-50 bg-[#fff3fd] dark:bg-[#1a161b] flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold text-[#7D26CD] dark:text-[#c185ff] tracking-tight font-headline">Designora</span>
          <div className="hidden md:flex gap-6 items-center">

            <Link className="font-headline font-semibold text-[#3e2548] dark:text-[#e9def1] hover:text-[#7D26CD] transition-colors duration-200" href="#features">Features</Link>
            <Link className="font-headline font-semibold text-[#3e2548] dark:text-[#e9def1] hover:text-[#7D26CD] transition-colors duration-200" href="#business">Business</Link>
            <Link className="font-headline font-semibold text-[#3e2548] dark:text-[#e9def1] hover:text-[#7D26CD] transition-colors duration-200" href="#education">Education</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="hidden lg:block font-headline font-semibold text-primary transition-transform scale-95 active:scale-90 px-4 py-2">Log In</button>
          </Link>
          <Link href="/login">
            <button className="bg-gradient-to-br from-[#7f29cf] to-[#c185ff] text-white font-headline font-bold rounded-full px-6 py-2.5 transition-transform scale-95 active:scale-90">Sign Up</button>
          </Link>
        </div>
      </nav>

      <main>

        <section className="relative px-6 pt-16 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider uppercase bg-surface-container-high text-primary rounded-full font-label">
                The Future of Content Creation
              </span>
              <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-on-surface leading-tight mb-8">
                Design <span className="text-primary italic">Anything</span> in Seconds.
              </h1>
              <p className="text-xl text-on-surface-variant leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 font-body">
                Elevate your creative workflow with our intuitive Digital Atelier. From masterpieces to social content, Designora makes professional design accessible to everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login">
                  <button className="bg-gradient-to-br from-[#7f29cf] to-[#c185ff] text-white text-lg font-headline font-bold rounded-full px-10 py-4 hover:opacity-90 transition-all shadow-xl shadow-primary/20">
                    Get Started Free
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative group flex justify-center lg:justify-end">
              <img className="w-full max-w-lg rounded-2xl shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ0wvOTitxkMRNQYc_5HmU_DBy814hU_gzYPybT6GDi3KivCtfE9Og6mNVJM6xlhPLy_LJjfFN1Zt2RukESlyBRmimAz0ZnDzXz-1sDgNPhmHnPF6-s03h9HTHkuvvLIhm-wXwMTwlhj6AS6i3vm0pzqlC5qwS8VxK6IexfQikxNpA3vfbnWSQBCi-odT2OebmcoR0antFKo-Obeh87X2mesH2dRm-IRBklXfAbz4q5grjBi96HCgiKvxXIxaiJq7tXNAqCyWst-Q" alt="Dashboard Preview" />
            </div>
          </div>
        </section>
      </main>
      <footer className="py-12 border-t border-outline-variant/30 text-center text-on-surface-variant text-sm">
        <p>© 2026 Designora Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}