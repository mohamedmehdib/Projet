"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Sun, Moon, Menu, X, ChevronDown } from "lucide-react";

interface Language {
  code: string;
  label: string;
  name: string;
  subtext: string;
  flag: string;
  alt: string;
}

const LANGUAGES: Language[] = [
  {
    code: "fr",
    label: "FR",
    name: "Français",
    subtext: "Français (FR)",
    flag: "/flags/france.png",
    alt: "Drapeau France",
  },
  {
    code: "en",
    label: "EN",
    name: "English",
    subtext: "English (UK)",
    flag: "/flags/uk.png",
    alt: "United Kingdom Flag",
  },
];

// Custom hook to use layout effect safely on client side
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(LANGUAGES[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const langDropdownRef = useRef<HTMLDivElement>(null);
  const isThemeSwitchingRef = useRef(false);

  // Check user authentication state from localStorage
  useEffect(() => {
    try {
      const token = localStorage.getItem("auth_token");
      setIsAuthenticated(!!token);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  // Track scroll position & scroll progress to update navbar styling
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 20);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min((currentScroll / totalHeight) * 100, 100));
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Immediately sync React state with documentElement (already initialized by head script)
  useIsomorphicLayoutEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  // Initialize Language from localStorage before paint
  useIsomorphicLayoutEffect(() => {
    const savedLang = localStorage.getItem("preferred_lang");
    if (savedLang) {
      const match = LANGUAGES.find((l) => l.code === savedLang);
      if (match) {
        setSelectedLang(match);
        document.documentElement.setAttribute("lang", match.code);
      }
    }
  }, []);

  // Close language dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangDropdownOpen(false);
      }
    };

    if (langDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [langDropdownOpen]);

  // Handle Language Selection
  const handleSelectLanguage = (lang: Language) => {
    setSelectedLang(lang);
    localStorage.setItem("preferred_lang", lang.code);
    document.documentElement.setAttribute("lang", lang.code);
    window.dispatchEvent(new CustomEvent("languagechange", { detail: lang.code }));
    setLangDropdownOpen(false);
  };

  // Toggle Dark / Light Theme Logic
  const toggleTheme = () => {
    if (isThemeSwitchingRef.current) return;
    isThemeSwitchingRef.current = true;

    // 1. Enable theme transition class during the switch
    document.documentElement.classList.add("theme-transitioning");

    // 2. Flip theme attributes and local state
    const nextTheme = isDarkMode ? "light" : "dark";
    if (nextTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }

    // 3. Remove transition class right after transition completes
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
      isThemeSwitchingRef.current = false;
    }, 250);
  };

  const navLinks = [
    { label: "Accueil", href: "#home", id: "home" },
    { label: "Rôles & Espaces", href: "#roles", id: "roles" },
    { label: "Témoignages", href: "#testimonials", id: "testimonials" },
    { label: "Demande d'Offre", href: "#contact-sales", id: "contact-sales" },
    { label: "FAQ", href: "#faq", id: "faq" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <header
      className={`animate-nav-in fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-primary/85 backdrop-blur-md border-b border-secondary/20 py-2.5 px-6 sm:px-10 md:px-14 shadow-lg shadow-black/5"
          : "bg-primary py-4 sm:py-5 px-6 sm:px-10 md:px-16 border-b border-transparent"
      }`}
    >
      <div className="relative flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo & Brand Name using logo.svg */}
        <a href="#home" className="flex items-center gap-2.5 group shrink-0 select-none">
          <div className="relative transition-transform duration-300 group-hover:scale-105 flex items-center">
            <Image
              src="/logo.svg"
              alt="UniPlan Logo"
              width={36}
              height={36}
              priority
              className="h-8 sm:h-9 w-8 sm:w-9 object-contain drop-shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-secondary leading-none">
              Uni<span className="text-accent">Plan</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-secondary/50 uppercase leading-tight mt-0.5">
              Academic SaaS
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links (Centered) */}
        <nav
          onMouseLeave={() => setHoveredNav(null)}
          className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
        >
          {navLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onMouseEnter={() => setHoveredNav(item.id)}
              className={`relative px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 select-none ${
                hoveredNav === item.id
                  ? "text-secondary bg-secondary/10"
                  : "text-secondary/75 hover:text-secondary"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Controls: Language Toggle, Theme Toggle, CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Toggle Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="h-11 px-3 rounded-xl border transition-all duration-200 text-secondary flex items-center gap-2.5 cursor-pointer shadow-xs select-none border-secondary/20 hover:border-secondary/40 hover:bg-secondary/5"
              aria-label="Sélectionner la langue"
              aria-expanded={langDropdownOpen}
              aria-haspopup="listbox"
            >
              {/* Active Flag */}
              <div suppressHydrationWarning className="relative w-5 h-5 rounded-full overflow-hidden shadow-xs ring-1 ring-secondary/20 shrink-0 bg-secondary/5">
                <Image
                  src={selectedLang.flag}
                  alt={selectedLang.alt}
                  width={20}
                  height={20}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Language Code */}
              <span suppressHydrationWarning className="text-xs font-bold tracking-wider text-secondary">
                {selectedLang.label}
              </span>

              {/* Chevron Indicator */}
              <ChevronDown
                className={`w-3.5 h-3.5 text-secondary/60 transition-transform duration-200 ${
                  langDropdownOpen ? "rotate-180 text-secondary" : ""
                }`}
              />
            </button>

            {/* Language Dropdown Menu */}
            <div
              role="listbox"
              aria-hidden={!langDropdownOpen}
              className={`absolute right-0 mt-2 w-56 rounded-2xl border border-secondary/20 bg-primary shadow-2xl p-2 z-50 origin-top-right transition-all duration-200 ease-out ${
                langDropdownOpen
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="px-2.5 py-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-secondary/50">
                <span>Langue</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary/70">
                  {LANGUAGES.length}
                </span>
              </div>

              <div className="h-px bg-secondary/10 my-1 mx-1" />

              <div className="flex flex-col gap-1">
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLang.code === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={langDropdownOpen ? 0 : -1}
                      onClick={() => handleSelectLanguage(lang)}
                      className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-all duration-150 group cursor-pointer ${
                        isSelected
                          ? "bg-accent/15 text-secondary font-medium border border-accent/30 shadow-xs"
                          : "text-secondary/80 hover:text-secondary hover:bg-secondary/10 border border-transparent"
                      }`}
                    >
                      <div
                        className={`relative w-6 h-6 rounded-full overflow-hidden shrink-0 ring-1 shadow-xs transition-transform duration-150 group-hover:scale-105 ${
                          isSelected ? "ring-accent" : "ring-secondary/20"
                        }`}
                      >
                        <Image
                          src={lang.flag}
                          alt={lang.alt}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-sm font-semibold tracking-tight text-secondary">
                            {lang.name}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors ${
                              isSelected
                                ? "bg-accent text-white"
                                : "bg-secondary/10 text-secondary/60 group-hover:bg-secondary/20"
                            }`}
                          >
                            {lang.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-secondary/50 truncate">
                          {lang.subtext}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="h-11 w-11 rounded-xl border border-secondary/20 text-secondary flex items-center justify-center cursor-pointer hover:border-secondary/40 hover:bg-secondary/5 active:scale-95 transition-all duration-200 shadow-xs"
            aria-label="Basculer le mode sombre"
            title={isDarkMode ? "Passer en Mode Clair" : "Passer en Mode Sombre"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* Portail Numérique / Dashboard Button */}
          <a
            href={isAuthenticated ? "/dashboard" : "/login"}
            className="group relative text-xs sm:text-sm font-semibold bg-accent text-white px-5 h-11 rounded-xl shadow-md hover:opacity-95 hover:shadow-indigo-500/25 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">Dashboard</span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        {/* Mobile Action Controls & Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Language Trigger */}
          <button
            onClick={() => {
              const currentIndex = LANGUAGES.findIndex((l) => l.code === selectedLang.code);
              const nextIndex = (currentIndex + 1) % LANGUAGES.length;
              handleSelectLanguage(LANGUAGES[nextIndex]);
            }}
            className="h-10 px-2.5 rounded-xl border border-secondary/20 text-secondary flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-secondary/5 active:scale-95 transition-all"
            aria-label="Changer de langue"
          >
            <div className="relative w-4 h-4 rounded-full overflow-hidden ring-1 ring-secondary/20 shrink-0">
              <Image
                src={selectedLang.flag}
                alt={selectedLang.alt}
                width={16}
                height={16}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-bold">{selectedLang.label}</span>
          </button>

          {/* Mobile Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-primary/60 border border-secondary/20 text-secondary cursor-pointer shadow-xs active:scale-95 transition-transform"
            aria-label="Basculer le mode sombre"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-secondary hover:bg-secondary/10 transition-colors cursor-pointer"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 transition-transform duration-200 rotate-90" />
            ) : (
              <Menu className="w-5 h-5 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`grid lg:hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${
          mobileMenuOpen
            ? "grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-secondary/10"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <nav className="flex flex-col gap-2.5 pb-2">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-secondary/75 hover:text-secondary py-1"
              >
                {item.label}
              </a>
            ))}

            {/* Mobile Language Segmented Selector */}
            <div className="pt-3 pb-1 border-t border-secondary/10">
              <p className="text-[11px] font-semibold text-secondary/50 uppercase tracking-wider mb-2">
                Langue
              </p>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLang.code === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguage(lang)}
                      className={`flex items-center justify-center gap-2 py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-accent text-white border-accent shadow-sm"
                          : "bg-secondary/5 border-secondary/15 text-secondary hover:bg-secondary/10"
                      }`}
                    >
                      <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0 ring-1 ring-white/20">
                        <Image
                          src={lang.flag}
                          alt={lang.alt}
                          width={16}
                          height={16}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>{lang.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-secondary/10">
              <a
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-secondary hover:text-accent py-2 text-left cursor-pointer"
              >
                Connexion Enseignant / Étudiant
              </a>
              <a
                href={isAuthenticated ? "/dashboard" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold bg-accent text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md w-full text-center cursor-pointer block"
              >
                {isAuthenticated ? "Accéder à l'Espace" : "Portail Numérique"}
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Top/Bottom Dynamic Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );
}
