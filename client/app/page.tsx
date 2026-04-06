"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container font-body">

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
            <div className="z-10">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider uppercase bg-surface-container-high text-primary rounded-full font-label">
                The Future of Content Creation
              </span>
              <h1 className="text-6xl md:text-8xl font-headline font-extrabold text-on-surface leading-[1.05] tracking-tight mb-8">
                Design <span className="text-primary italic">Anything</span> in Seconds.
              </h1>
              <p className="text-xl text-on-surface-variant leading-relaxed mb-10 max-w-xl font-body">
                Elevate your creative workflow with our intuitive Digital Atelier. From social media masterpieces to cinematic video presentations, Designora makes professional design accessible to everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <button className="bg-gradient-to-br from-[#7f29cf] to-[#c185ff] text-white text-lg font-headline font-bold rounded-full px-10 py-4 hover:opacity-90 transition-all shadow-xl shadow-primary/20">
                    Start Designing for Free
                  </button>
                </Link>

              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary-container/20 blur-3xl rounded-full"></div>
              <div className="relative grid grid-cols-12 gap-4">
                <div className="col-span-8 rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500">
                  <img className="w-full aspect-[4/3] object-cover" alt="modern creative workspace" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ0wvOTitxkMRNQYc_5HmU_DBy814hU_gzYPybT6GDi3KivCtfE9Og6mNVJM6xlhPLy_LJjfFN1Zt2RukESlyBRmimAz0ZnDzXz-1sDgNPhmHnPF6-s03h9HTHkuvvLIhm-wXwMTwlhj6AS6i3vm0pzqlC5qwS8VxK6IexfQikxNpA3vfbnWSQBCi-odT2OebmcoR0antFKo-Obeh87X2mesH2dRm-IRBklXfAbz4q5grjBi96HCgiKvxXIxaiJq7tXNAqCyWst-Q"/>
                </div>
                <div className="col-span-4 rounded-xl overflow-hidden shadow-2xl mt-12 transition-transform hover:scale-[1.02] duration-500">
                  <img className="w-full aspect-square object-cover" alt="vibrant abstract digital art" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDubK2lNusuqHMpwmTfgbJs93I__376SUieMf_jZe3Y5sHIGwYT4Aj8yve9r3NuKvrC-xs42OQUoCVeOQd_13CILydLUbpzrl4lBcC8g5sv3PsH7LG-mCeyw8Feyedq-h3OhqmZt-VovKjnT_bRafIXBDPBNgzQq45V69Suazy6lRE5bz0vPViQeHLzd1IOGPldaiuOFiGA2SrZz4ehHqdAxBJbVeo0wZHDyw16ye8xGygJ8zhzWGsK_v-C1MJL2oOZzHDFcV-6Ho"/>
                </div>
                <div className="col-span-12 bg-white/70 backdrop-blur-3xl p-6 rounded-xl shadow-lg mt-4 flex items-center gap-6 border border-white/20">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-surface-container-lowest bg-surface-dim"></div>
                    <div className="w-10 h-10 rounded-full border-2 border-surface-container-lowest bg-primary"></div>
                    <div className="w-10 h-10 rounded-full border-2 border-surface-container-lowest bg-secondary"></div>
                  </div>
                  <p className="font-label text-sm text-on-surface-variant">Elevate your creative workflow with our intuitive Digital Atelier. From social media masterpieces to cinematic video presentations, Designora makes professional design accessible to everyone.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 px-6 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-4xl font-headline font-extrabold mb-4">The Atelier Suite</h2>
              <p className="text-on-surface-variant font-body">Elevate your creative workflow with our intuitive Digital Atelier. From social media masterpieces to cinematic video presentations, Designora makes professional design accessible to everyone.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="md:col-span-3 bg-white p-8 rounded-xl transition-transform hover:scale-[1.01]">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h3 className="text-2xl font-headline font-bold">100,000+ Premium Templates</h3>
                    <p className="text-on-surface-variant mt-2 max-w-2xl">Elevate your creative workflow with our intuitive Digital Atelier. From social media masterpieces to cinematic video presentations, Designora makes professional design accessible to everyone.</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">

                  <div className="aspect-[3/4] bg-surface-container-high rounded-lg overflow-hidden">
                    <img className="w-full h-full object-cover" alt="social media template" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG7UiL_THsrBkUDECNjGmm2JblsV8sE130CjoGkrzRkLYY7jja65i5bJmX5H_uhGecxvvKzMe1KYPEwYSFN_GyQwz0w8QCIHza9muUu3NRB6zrcLp10wlmJgdyA2REwquucCarEy3cFrhk8unqCkkRXV4DGxBbcVwX5IwjEPBB_K4Sc3M38eZGgtG4hvQRQ_tSgH0qGE6LOBaW8-0Z-sORakD80MCtRr1lAo6zXhxnJD4WT4wHREXBL2xP-Yr-ByiLGDyq50Novu8"/>
                  </div>
                  <div className="aspect-[3/4] bg-surface-container-high rounded-lg overflow-hidden mt-4">
                    <img className="w-full h-full object-cover" alt="poster template" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALVZrO8scHZIB-9KGaaieKlAgaoIoFcfBdQsqPbJiRARtK74mnoyBc8hU1u1AJJQPjY8aB62mRWHJMEGwNWmYWe8FeYVa8Aa2C35VpAX7K7BYjSlrnLahLwKNNzRf19YTt9y1GeAMmavsq6qmpzN-WiFhuegoLD2XoBW60C3ZsNGbKzgswopNhM6K7IfA9PZtyScMaZGd7AyL_97PBylFqzqdfZ1jEW4vlHhn-jDvJabw8FGHrwsyu583Mcwjrz3_9kiFZrhRD1os"/>
                  </div>
                  <div className="aspect-[3/4] bg-surface-container-high rounded-lg overflow-hidden">
                    <img className="w-full h-full object-cover" alt="presentation template" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6kpqTIuJcY5Cpn5NNohokdiHTFFXB-me7ck3Z-kl_2fA1vOuo_m_oEAwkmQO9-dT8oEwadNZOqldQFELnly7JvTfyJqMk9YylUo9F0I--P2pO9TefzxrPOwLsEmmc4TIdupR0FqtOVcR-X-6NuWHSKMXA4AnaHt2N7A9MOGbMjO78gka0lgMfpceBpPhlE4nEGFYyds2U5V6_FQG3SMs6THRy3NkLdzu7CPc-Y1imhtKaE5JIiZuYl4C74zj6VAEYrmcWBKDxr4M"/>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-highest p-8 rounded-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-headline font-bold mb-2">Centralized Brand Kit</h3>
                  <p className="text-on-surface-variant">Elevate your creative workflow with our intuitive Digital Atelier. From social media masterpieces to cinematic video presentations.</p>
                </div>
                <div className="mt-8 flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary shadow-sm"></div>
                  <div className="w-8 h-8 rounded-full bg-secondary shadow-sm"></div>
                  <div className="w-8 h-8 rounded-full bg-tertiary shadow-sm"></div>
                </div>
              </div>

              <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm flex items-center gap-12 overflow-hidden">
                <div className="flex-1">
                  <h3 className="text-2xl font-headline font-bold mb-4">Real-time Collaboration</h3>
                  <p className="text-on-surface-variant mb-6">Elevate your creative workflow with our intuitive Digital Atelier. From social media masterpieces to cinematic video presentations.</p>
                  <div className="flex gap-4">
                    <span className="px-4 py-2 bg-surface-container-low rounded-lg text-sm font-bold text-on-surface">@marketing</span>
                    <span className="px-4 py-2 bg-surface-container-low rounded-lg text-sm font-bold text-on-surface">@design_lead</span>
                  </div>
                </div>
                <div className="hidden lg:block w-64 -mr-12">
                  <img className="rounded-xl shadow-xl rotate-3" alt="collaboration" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGPJf9NMo5L4N73vwS5fM7bs-2_WhVl7DiZyAKk1sfD7X7ThvfvlhYE6mw8HJgKr5byP6f9t0-DwdrbBDvuCt9X9hNzMPkuIrCtZVfAKVXNvp_jv9pSmSXGcgbsUFiGKF67cum-prDn0jXciZdPrs_fIfyRhRARY2hAudbtiIwyMMuXQDNqXp9lHQEoEUK-GWoF-Udh06vvSAo3Cm4so0L1X3AWkpQQb72s-ViQ-UHE8zOT7KUf57puHBJKaNCv36KrNLs9LeEong"/>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold mb-4">What will you create today?</h2>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <button className="px-6 py-2 rounded-full bg-primary text-on-primary font-bold transition-all">Social Media</button>
              <button className="px-6 py-2 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-bold transition-all">Presentations</button>
              <button className="px-6 py-2 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-bold transition-all">Video</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <div className="group relative aspect-square overflow-hidden rounded-2xl bg-surface-container-low">
              <img className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="social media graphics" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDr8oG1uimYib8TaOvZ26dTEmTCBsGJhkf0manBtctKOmK_cwrNASzTiVmG12XGWpjDfKDo2EQf2wqDqteffDa3w_jOSCes2v8nZzBWqxri6ioYLzD8JP1XnQiwxUdvS2IjbpCwuOp85U5okApbOWiQ9OErmkEMw3WIFJ-BLZ2xyXZgBCdTnUvVHBrCiXiyE0GHtyNaNHeqfHk9PqBGjeKyO0nz9ASvKaLQECaiwsT6s2xrl2ZLBbyCputOOSv_pxJ_y8CivISONs"/>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white font-bold text-lg">Social Graphics</p>
              </div>
            </div>
            <div className="group relative aspect-square overflow-hidden rounded-2xl bg-surface-container-low">
              <img className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="presentations" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe0h8ix0k5txGFPckKVRtlLwpCPz138BYmEES7Rndpu3Kcgg8wypXuk_RgthCSxKeINtcKVWPV9ylYJSWES_T1jm0OtqmSkCc0phslWKx1SD_3B6u6X2wIlVnCCXM0V_zueEDMt8jsyQ982QsNlhTC6vJCPF4jRw1GkNoSgfbjWaGU8s-X0n6JSY4RCRX097y78jfxx9W9E924pKEr_QuWl1AE5n_VHForYJ2WoJpzvpRqsaagCjHXdNysK-NsWMRXkvgqFjgy0So"/>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white font-bold text-lg">Presentations</p>
              </div>
            </div>
            <div className="group relative aspect-square overflow-hidden rounded-2xl bg-surface-container-low">
              <img className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="video content" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAloTdk9j5li5oLCKqs2VTJWV_WEBzHPlHMoDLw-YXiVSVqpTymIi1fgb4giXc2U10ZU_N4zUMJ8voBNw8uLgwvQHEHgmRnP1_YZVSdr6Lxs385bCPBhHvrjX4ZmMz037yxBGUTaxllmFou1_FwkDj9qxeQQFarRZ5N80I4qBXpWxXkK1JcbhuonzkzdiNYH4YVLXEj6B4PMXQ6jEN4-WGu1NTCpAleFdCifxfHu6KT8pIoFuU8jkvGoFJtkLq6b8sIM6fFmqPm1wY"/>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white font-bold text-lg">Video Content</p>
              </div>
            </div>

          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#7f29cf] to-[#c185ff] rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-3xl -ml-32 -mb-32 rounded-full"></div>
            <h2 className="text-4xl md:text-6xl font-headline font-extrabold text-white mb-8 relative z-10">Ready to unlock your <br/>creative potential?</h2>
            <p className="text-on-primary text-xl opacity-90 mb-12 max-w-2xl mx-auto relative z-10">Join millions of designers, marketers, and dreamers. Start your journey today.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <Link href="/login">
                <button className="bg-white text-primary text-lg font-headline font-bold rounded-full px-12 py-4 hover:bg-surface-container-low transition-all shadow-xl">
                  Get Started Free
                </button>
              </Link>
              <Link href="/login">
                <button className="bg-transparent border-2 border-white/50 text-white text-lg font-headline font-bold rounded-full px-12 py-4 hover:bg-white/10 transition-all">
                  Join for Free
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <span className="text-2xl font-bold text-primary tracking-tight font-headline block mb-6">Designora</span>
              <p className="text-on-surface-variant max-w-xs leading-relaxed">The all-in-one visual suite for modern creators. Design, collaborate, and grow your brand in one place.</p>
            </div>
            <div>
              <h4 className="font-headline font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-on-surface-variant text-sm">
                <li><Link className="hover:text-primary transition-colors" href="#">Features</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Apps</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-bold mb-6">Explore</h4>
              <ul className="space-y-4 text-on-surface-variant text-sm">
                <li><Link className="hover:text-primary transition-colors" href="#">Design Types</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Brand Kits</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Creator Fund</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-on-surface-variant text-sm">
                <li><Link className="hover:text-primary transition-colors" href="#">About</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Careers</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Newsroom</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-on-surface-variant text-sm">
                <li><Link className="hover:text-primary transition-colors" href="#">Privacy</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Terms</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-outline-variant/30 flex flex-col md:row-reverse md:flex-row justify-between items-center gap-6">
            <p className="text-on-surface-variant text-sm">© 2024 Designora Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}