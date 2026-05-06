'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    UserRoundPlus,
    Wallet,
    ScrollText,
    UserPlus,
    ClipboardList,
    CalendarCheck,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import api from '../services/api';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/i18n';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };

export default function DashboardPage() {
    const { t } = useLanguage();
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Admin');
    const [filter, setFilter] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/reports/dashboard?month=${filter.month}&year=${filter.year}`);
            setSummary(response.data);
        } catch (err) {
            console.error('Failed to fetch dashboard summary', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setUserName(user.name?.split(' ')[0] || 'Admin');
            }
        } catch { }
        fetchDashboard();
    }, [filter]);

    const stats = [
        {
            label: t('dashboard.total_members'),
            value: summary?.total_members?.toLocaleString() ?? '—',
            icon: Users,
            gradient: 'from-violet-500 to-indigo-500',
            trend: summary?.member_trend,
        },
        {
            label: 'Nouveaux Visiteurs',
            value: summary?.monthly_visitors?.toLocaleString() ?? '—',
            icon: UserRoundPlus,
            gradient: 'from-amber-400 to-orange-500',
            trend: summary?.visitor_trend,
        },
        {
            label: t('dashboard.monthly_giving'),
            value: `RWF ${parseFloat(summary?.monthly_giving || 0).toLocaleString()}`,
            icon: Wallet,
            gradient: 'from-emerald-400 to-teal-500',
            trend: summary?.giving_trend,
        },
    ];

    const quickActions = [
        { icon: ScrollText,   label: 'Déroulé',   href: '/events/service-order', color: 'bg-violet-500' },
        { icon: UserPlus,     label: 'Visiteur',   href: '/integration',          color: 'bg-sky-500' },
        { icon: Wallet,       label: 'Offrandes',  href: '/giving',               color: 'bg-emerald-500' },
        { icon: ClipboardList,label: 'Présence',   href: '/attendance',           color: 'bg-amber-500' },
    ];

    return (
        <div className="space-y-8 pb-12">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight">
                        {t('nav.dashboard')}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Welcome back, <span className="font-semibold text-foreground">{userName}</span>. Here's what's happening at House Of God.
                    </p>
                </div>
                {/* Month / Year filter */}
                <div className="flex items-center gap-1 bg-muted/60 border border-border p-1 rounded-lg text-xs font-bold">
                    <select
                        value={filter.month}
                        onChange={(e) => setFilter({ ...filter, month: parseInt(e.target.value) })}
                        className="bg-transparent border-none outline-none px-2 py-1.5 cursor-pointer uppercase tracking-wide"
                    >
                        {['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'].map((m, i) => (
                            <option key={i} value={i + 1}>{m}</option>
                        ))}
                    </select>
                    <div className="w-px h-4 bg-border" />
                    <select
                        value={filter.year}
                        onChange={(e) => setFilter({ ...filter, year: parseInt(e.target.value) })}
                        className="bg-transparent border-none outline-none px-2 py-1.5 cursor-pointer"
                    >
                        {[2023, 2024, 2025, 2026].map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-3 gap-5"
            >
                {loading
                    ? Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-36 rounded-2xl bg-muted animate-pulse" />
                    ))
                    : stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            variants={item}
                            className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm p-6 flex flex-col justify-between gap-4"
                        >
                            {/* Icon badge */}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                                <stat.icon className="w-6 h-6 text-white" strokeWidth={2} />
                            </div>

                            <div>
                                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-black text-foreground tracking-tight leading-none">
                                    {stat.value}
                                </p>
                            </div>

                            {/* Trend badge */}
                            {stat.trend !== undefined && (
                                <div className={cn(
                                    'self-start flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full',
                                    stat.trend >= 0
                                        ? 'bg-emerald-500/10 text-emerald-600'
                                        : 'bg-rose-500/10 text-rose-600'
                                )}>
                                    {stat.trend >= 0
                                        ? <ArrowUpRight className="w-3.5 h-3.5" />
                                        : <ArrowDownRight className="w-3.5 h-3.5" />}
                                    {Math.abs(stat.trend).toFixed(1)}% vs last month
                                </div>
                            )}

                            {/* Decorative circle */}
                            <div className={`absolute -right-6 -top-6 w-28 h-28 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-2xl`} />
                        </motion.div>
                    ))
                }
            </motion.div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Chart + Events */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Attendance chart */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-violet-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">Attendance Trends</h3>
                                <p className="text-[11px] text-muted-foreground">Weekly average — last 6 months</p>
                            </div>
                        </div>
                        <div className="h-48 flex items-end gap-2">
                            {[45, 42, 53, 38, 62, 75].map((height, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 0.9, delay: i * 0.08 }}
                                        className={cn(
                                            'w-full rounded-t-lg transition-all',
                                            i === 5
                                                ? 'bg-gradient-to-t from-violet-600 to-indigo-400'
                                                : 'bg-violet-200 dark:bg-violet-900/50 hover:bg-violet-300'
                                        )}
                                    />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                        {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming events */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-foreground mb-4">{t('dashboard.upcoming_events')}</h3>
                        <div className="space-y-3">
                            {summary?.upcoming_events?.length > 0 ? (
                                summary.upcoming_events.map((evt: any, i: number) => {
                                    const date = new Date(evt.date);
                                    return (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex flex-col items-center justify-center shadow-md shrink-0">
                                                <span className="text-[9px] font-bold uppercase">
                                                    {date.toLocaleString('default', { month: 'short' })}
                                                </span>
                                                <span className="text-lg font-extrabold leading-none">
                                                    {date.getDate()}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground text-sm">{evt.title}</h4>
                                                <p className="text-xs text-muted-foreground mt-0.5">{evt.location} • {evt.time}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-6">No upcoming events scheduled.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Quick Actions + Activity */}
                <div className="space-y-6">

                    {/* Quick Actions */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-foreground mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.href}
                                    href={action.href}
                                    className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl bg-muted/60 border border-border hover:bg-muted transition-all group"
                                >
                                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}>
                                        <action.icon className="w-5 h-5 text-white" strokeWidth={2} />
                                    </div>
                                    <span className="text-[11px] font-bold text-foreground uppercase tracking-wide text-center">
                                        {action.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-foreground mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {summary?.recent_activity?.length > 0 ? (
                                summary.recent_activity.map((act: any, i: number) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <img
                                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${act.first_name}`}
                                            alt="avatar"
                                            className="w-9 h-9 rounded-full bg-muted shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-foreground leading-snug">
                                                <span className="font-semibold">{act.first_name} {act.last_name}</span>{' '}
                                                {act.type === 'joined'
                                                    ? 'joined the community'
                                                    : `donated RWF ${parseFloat(act.amount).toLocaleString()}`}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                                {new Date(act.time).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
