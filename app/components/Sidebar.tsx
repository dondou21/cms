'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
    FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';



import { useLanguage } from '../lib/i18n';

export default function Sidebar() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const router = useRouter();
    const [userRole, setUserRole] = useState('');

    const menuItems = [
        { icon: LayoutDashboard, label: t('nav.dashboard'), href: '/dashboard' },
        { icon: Users, label: t('nav.members'), href: '/members' },
        { icon: Building2, label: t('nav.departments'), href: '/departments' },
        { icon: HandCoins, label: t('nav.giving'), href: '/giving' },
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
        <div className="h-screen w-64 bg-card border-r border-border flex flex-col py-6 sticky top-0 transition-colors">
            <div className="flex items-center gap-3 mb-10 px-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Church className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground leading-tight tracking-tight">Impact Center</span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{userRole}</span>
                </div>
            </div>

            <nav className="flex-1 space-y-1.5 px-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                                isActive
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}>
                                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground")} />
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-border mt-auto px-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20 transition-all font-medium text-sm"
                >
                    <LogOut className="w-5 h-5" />
                    <span>{t('nav.logout')}</span>
                </button>
            </div>
        </div>
    );
}
