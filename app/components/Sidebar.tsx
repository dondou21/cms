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
    { icon: ClipboardList,   labelKey: 'nav.attendance',   href: '/attendance' },
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

    // Fix: only mark a parent active if no more-specific child item matches
    const isActive = (href: string) => {
        if (pathname === href) return true;
        if (href === '/dashboard') return false;
        // Exact prefix match AND no more specific sidebar item matches
        if (pathname.startsWith(href + '/') || pathname.startsWith(href + '?')) {
            const moreSpecificMatch = menuItems.some(
                (m) => m.href !== href && m.href.startsWith(href) && pathname.startsWith(m.href)
            );
            return !moreSpecificMatch;
        }
        return false;
    };

    return (
        <aside className="flex flex-col flex-shrink-0 h-full w-60 bg-[#1d4ed8] text-white">
            {/* ── Brand ── */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Church className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-[13px] font-extrabold text-white leading-none tracking-tight">
                        House Of God
                    </p>
                    <p className="text-[10px] font-semibold text-white/50 mt-0.5 uppercase tracking-wider">
                        {userRole}
                    </p>
                </div>
            </div>

            {/* ── Nav Links ── */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest px-3 mb-2">
                    Main Menu
                </p>
                {menuItems.map((item) => {
                    const label = item.labelKey ? t(item.labelKey) : item.label!;
                    const active = isActive(item.href);

                    return (
                        <Link key={item.href} href={item.href} className="block">
                            <div className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                                active
                                    ? 'bg-white/20 text-white font-semibold shadow-sm'
                                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                            )}>
                                <item.icon
                                    className={cn('w-[18px] h-[18px] shrink-0', active ? 'text-white' : 'text-white/50')}
                                    strokeWidth={active ? 2.5 : 2}
                                />
                                <span className="truncate">{label}</span>
                                {active && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* ── Logout ── */}
            <div className="px-3 py-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all duration-150"
                >
                    <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
                    <span>{t('nav.logout')}</span>
                </button>
            </div>
        </aside>
    );
}
