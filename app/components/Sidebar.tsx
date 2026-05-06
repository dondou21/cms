'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Building2,
    HandCoins,
    CalendarCheck,
    CalendarDays,
    LogOut,
    Church,
    Heart,
    FileText,
    ReceiptText,
    X,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';
import { useLanguage } from '../lib/i18n';

const menuItems = [
    { icon: LayoutDashboard, labelKey: 'nav.dashboard', href: '/dashboard' },
    { icon: Users,           labelKey: 'nav.members',   href: '/members' },
    { icon: Building2,       labelKey: 'nav.departments', href: '/departments' },
    { icon: HandCoins,       labelKey: 'nav.giving',    href: '/giving' },
    { icon: ReceiptText,     labelKey: null, label: 'Finance Reports', href: '/finance' },
    { icon: CalendarCheck,   labelKey: 'nav.attendance', href: '/attendance' },
    { icon: CalendarDays,    labelKey: 'nav.events',    href: '/events' },
    { icon: FileText,        labelKey: 'nav.service_order', href: '/events/service-order' },
    { icon: Heart,           labelKey: null, label: 'Integration', href: '/integration' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

function SidebarContent({ onClose }: { onClose: () => void }) {
    const { t } = useLanguage();
    const pathname = usePathname();
    const router = useRouter();
    const [userRole, setUserRole] = useState('Admin');

    useEffect(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setUserRole(user.role || 'Admin');
            }
        } catch { }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <div className="flex flex-col h-full py-6 bg-card border-r border-border shadow-2xl w-64">
            {/* Logo */}
            <div className="flex items-center justify-between mb-10 px-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 flex items-center justify-center border border-primary/30">
                        <Church className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-foreground leading-tight tracking-tight uppercase">
                            House Of God
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {userRole}
                        </span>
                    </div>
                </div>
                {/* Close button — only visible on mobile */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close menu"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 space-y-1 px-4 overflow-y-auto">
                {menuItems.map((item) => {
                    const label = item.labelKey ? t(item.labelKey) : item.label!;
                    const isActive =
                        pathname === item.href ||
                        (item.href !== '/dashboard' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                        >
                            <div
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 transition-all font-bold text-xs uppercase tracking-widest',
                                    isActive
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        'w-4 h-4 shrink-0',
                                        isActive ? 'text-white' : 'text-muted-foreground'
                                    )}
                                />
                                <span>{label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="pt-6 border-t border-border mt-auto px-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all font-bold text-xs uppercase tracking-widest"
                >
                    <LogOut className="w-4 h-4" />
                    <span>{t('nav.logout')}</span>
                </button>
            </div>
        </div>
    );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <>
            {/* ── Desktop: always visible static sidebar ── */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <SidebarContent onClose={onClose} />
            </div>

            {/* ── Mobile: slide-in drawer ── */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="sidebar-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={onClose}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                        />
                        {/* Drawer */}
                        <motion.div
                            key="sidebar-drawer"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 z-50 lg:hidden"
                        >
                            <SidebarContent onClose={onClose} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
