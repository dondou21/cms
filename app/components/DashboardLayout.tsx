'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, HelpCircle } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            setIsLoaded(true);
        }
    }, [router]);

    if (!isLoaded) return null;

    return (
        <div className="flex bg-gray-50 min-h-screen text-gray-900 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 flex-shrink-0">
                    <div className="flex-1 max-w-xl">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search members, events, or transactions..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-gray-700"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-500">
                        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                        </button>
                        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                            <HelpCircle className="w-5 h-5" />
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
