'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, HelpCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '../lib/i18n';
import { cn } from '../lib/utils';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);
    const { theme, setTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            setIsLoaded(true);
        }
    }, [router]);

    if (!isLoaded || !mounted) return null;

    return (
        <div className="flex bg-background min-h-screen text-foreground font-sans transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8 flex-shrink-0 transition-colors">
                    <div className="flex-1 max-w-xl">
                        <div className="relative">
                            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search members, events, or transactions..."
                                className="w-full bg-muted/50 border border-border rounded-none pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-muted-foreground">
                        {/* Language Switcher */}
                        <div className="flex bg-muted p-1 rounded-none">
                            <button
                                onClick={() => setLanguage('fr')}
                                className={cn(
                                    "px-3 py-1 text-[10px] font-bold rounded-none transition-all",
                                    language === 'fr' 
                                        ? "bg-white dark:bg-gray-700 text-primary shadow-sm" 
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >FR</button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={cn(
                                    "px-3 py-1 text-[10px] font-bold rounded-none transition-all",
                                    language === 'en' 
                                        ? "bg-white dark:bg-gray-700 text-primary shadow-sm" 
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >EN</button>
                        </div>

                        {/* Theme Toggle */}
                        <button 
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 hover:bg-muted rounded-none transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button className="p-2 hover:bg-muted rounded-none transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-none" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto w-full max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLoaded ? 'loaded' : 'loading'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
