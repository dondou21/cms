'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Building2,
    HandCoins,
    CalendarCheck,
    CalendarDays,
    BarChart3,
    LogOut,
    Church,
    Heart,
    FileText,
    X,
    Menu
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';



import { useLanguage } from '../lib/i18n';

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { t } = useLanguage();
    const pathname = usePathname();
    const router = useRouter();
    const [userRole, setUserRole] = useState('');

    const menuItems = [
        { icon: LayoutDashboard, label: t('nav.dashboard'), href: '/dashboard' },
        { icon: Users, label: t('nav.members'), href: '/members' },
        { icon: Building2, label: t('nav.departments'), href: '/departments' },
        { icon: HandCoins, label: t('nav.giving'), href: '/giving' },
        { icon: FileText, label: 'Finance Reports', href: '/finance' },
        { icon: CalendarCheck, label: t('nav.attendance'), href: '/attendance' },
        { icon: CalendarDays, label: t('nav.events'), href: '/events' },
        { icon: FileText, label: t('nav.service_order'), href: '/events/service-order' },
        { icon: Heart, label: 'Integration', href: '/integration' },
    ];

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserRole(user.role || 'Admin');
            } catch (e) { }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col py-6 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-0 shadow-2xl",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between mb-10 px-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-none flex items-center justify-center border border-primary/30">
                            <Church className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-foreground leading-tight tracking-tight uppercase">House Of God</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{userRole}</span>
                        </div>
                    </div>
                    {/* Close button for mobile */}
                    <button onClick={onClose} className="lg:hidden p-2 text-muted-foreground hover:text-foreground">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1.5 px-4 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || 
                            (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link key={item.href} href={item.href} onClick={() => {
                                if (window.innerWidth < 1024) onClose();
                            }}>
                                <div className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-none transition-all font-bold text-xs uppercase tracking-widest",
                                        isActive
                                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}>
                                    <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-muted-foreground")} />
                                    <span>{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-border mt-auto px-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-none text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all font-bold text-xs uppercase tracking-widest"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav.logout')}</span>
                    </button>
                </div>
            </div>
        </>
    );
}
