'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Layers,
    Wallet,
    BarChart2,
    ClipboardList,
    Calendar,
    ScrollText,
    UserPlus,
    LogOut,
    Church,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';
import { useLanguage } from '../lib/i18n';

const menuItems = [
    { icon: LayoutDashboard, labelKey: 'nav.dashboard',    href: '/dashboard' },
    { icon: Users,           labelKey: 'nav.members',       href: '/members' },
    { icon: Layers,          labelKey: 'nav.departments',   href: '/departments' },
    { icon: Wallet,          labelKey: 'nav.giving',        href: '/giving' },
    { icon: BarChart2,       labelKey: null, label: 'Finance',     href: '/finance' },
    { icon: ClipboardList,   labelKey: 'nav.attendance',    href: '/attendance' },
    { icon: Calendar,        labelKey: 'nav.events',        href: '/events' },
    { icon: ScrollText,      labelKey: 'nav.service_order', href: '/events/service-order' },
    { icon: UserPlus,        labelKey: null, label: 'Integration', href: '/integration' },
];

export default function Sidebar() {
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
        <aside className="
            flex flex-col flex-shrink-0 h-full
            bg-card border-r border-border
            /* Mobile: icon-only slim bar */
            w-14
            /* Desktop: full sidebar with labels */
            lg:w-60
            transition-all duration-300
        ">
            {/* ── Brand ── */}
            <div className="flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-5 py-5 border-b border-border">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <Church className="w-5 h-5 text-primary" />
                </div>
                {/* Labels hidden on mobile */}
                <div className="hidden lg:block">
                    <p className="text-[13px] font-extrabold text-foreground leading-none tracking-tight">
                        House Of God
                    </p>
                    <p className="text-[10px] font-semibold text-muted-foreground mt-0.5 uppercase tracking-wider">
                        {userRole}
                    </p>
                </div>
            </div>

            {/* ── Nav items ── */}
            <nav className="flex-1 overflow-y-auto py-4 px-1.5 lg:px-3 space-y-0.5">
                {menuItems.map((item) => {
                    const label = item.labelKey ? t(item.labelKey) : item.label!;
                    const isActive =
                        pathname === item.href ||
                        (item.href !== '/dashboard' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={label}   /* tooltip on mobile hover */
                            className="block"
                        >
                            <div
                                className={cn(
                                    'flex items-center gap-3 rounded-lg transition-all duration-150',
                                    /* Mobile: icon only, centered */
                                    'justify-center px-0 py-2.5 lg:justify-start lg:px-3 lg:py-2.5',
                                    isActive
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        'w-[19px] h-[19px] shrink-0',
                                        isActive ? 'text-white' : 'text-muted-foreground'
                                    )}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                {/* Label hidden on mobile */}
                                <span className="hidden lg:block text-sm font-semibold truncate">
                                    {label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* ── Logout ── */}
            <div className="px-1.5 lg:px-3 py-4 border-t border-border">
                <button
                    onClick={handleLogout}
                    title="Logout"
                    className="w-full flex items-center justify-center lg:justify-start gap-3 rounded-lg px-0 py-2.5 lg:px-3 text-sm font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-150"
                >
                    <LogOut className="w-[19px] h-[19px] shrink-0" strokeWidth={2} />
                    <span className="hidden lg:block">{t('nav.logout')}</span>
                </button>
            </div>
        </aside>
    );
}
