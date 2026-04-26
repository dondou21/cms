'use client';

import { Moon, Sun, Languages } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '../lib/i18n';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-end gap-4">
                {/* Language Switcher */}
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <button
                        onClick={() => setLanguage('fr')}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                            language === 'fr' 
                                ? "bg-white dark:bg-gray-700 text-primary shadow-sm" 
                                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                        )}
                    >
                        FR
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                            language === 'en' 
                                ? "bg-white dark:bg-gray-700 text-primary shadow-sm" 
                                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                        )}
                    >
                        EN
                    </button>
                </div>

                {/* Dark Mode Toggle */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-primary transition-all"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>
        </nav>
    );
}
