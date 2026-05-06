'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Bell, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '../lib/i18n';
import { cn } from '../lib/utils';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const { language, setLanguage } = useLanguage();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch — render nothing until client is ready
    if (!mounted) return null;

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans">
            {/* Sidebar (desktop: static, mobile: drawer via AnimatePresence) */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main content column */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

                {/* ── Top Header ── */}
                <header className="h-16 shrink-0 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 z-30">

                    {/* Left: hamburger + search */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Hamburger — only on mobile */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                            aria-label="Open menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Search bar — hidden on small screens */}
                        <div className="hidden md:block flex-1 max-w-md">
                            <div className="relative">
                                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search members, events, transactions…"
                                    className="w-full bg-muted/50 border border-border pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: controls */}
                    <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                        {/* Language switcher */}
                        <div className="flex bg-muted p-1">
                            {(['fr', 'en'] as const).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={cn(
                                        'px-3 py-1 text-[10px] font-bold transition-all uppercase',
                                        language === lang
                                            ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>

                        {/* Theme toggle */}
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark'
                                ? <Sun className="w-5 h-5 text-yellow-400" />
                                : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Notifications */}
                        <button className="relative p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                        </button>
                    </div>
                </header>

                {/* ── Page content ── */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="page"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
