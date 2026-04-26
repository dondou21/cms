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
        <div className="flex bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-16 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-8 flex-shrink-0 transition-colors">
                    <div className="flex-1 max-w-xl">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search members, events, or transactions..."
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-700 dark:text-gray-200"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-gray-500">
                        {/* Language Switcher */}
                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                            <button
                                onClick={() => setLanguage('fr')}
                                className={cn(
                                    "px-3 py-1 text-[10px] font-bold rounded-lg transition-all",
                                    language === 'fr' 
                                        ? "bg-white dark:bg-gray-700 text-primary shadow-sm" 
                                        : "text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                )}
                            >FR</button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={cn(
                                    "px-3 py-1 text-[10px] font-bold rounded-lg transition-all",
                                    language === 'en' 
                                        ? "bg-white dark:bg-gray-700 text-primary shadow-sm" 
                                        : "text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                )}
                            >EN</button>
                        </div>

                        {/* Theme Toggle */}
                        <button 
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
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
