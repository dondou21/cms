'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, CalendarDays, ExternalLink, MessageCircle } from 'lucide-react';
import api from '../services/api';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

import { useLanguage } from '../lib/i18n';

export default function DashboardPage() {
    const { t } = useLanguage();
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Admin');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserName(user.name?.split(' ')[0] || 'Admin');
            } catch (e) { }
        }

        const fetchDashboard = async () => {
            try {
                const response = await api.get('/reports/dashboard');
                setSummary(response.data);
            } catch (err) {
                console.error('Failed to fetch dashboard summary', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    const stats = [
        { label: t('dashboard.total_members'), value: summary?.total_members?.toLocaleString() || '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', change: '', changeColor: 'text-emerald-500', changeBg: 'bg-emerald-50' },
        { label: t('dashboard.active_members'), value: summary?.active_members?.toLocaleString() || '0', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', change: '', changeColor: 'text-emerald-500', changeBg: 'bg-emerald-50' },
        { label: t('dashboard.monthly_giving'), value: `$${parseFloat(summary?.monthly_giving || 0).toLocaleString()}`, icon: CalendarDays, color: 'text-orange-500', bg: 'bg-orange-50', change: '', changeColor: 'text-rose-500', changeBg: 'bg-rose-50' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{t('nav.dashboard')}</h1>
                <p className="text-muted-foreground mt-1">Welcome back, {userName}.</p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {stats.map((stat, index) => (
                    <motion.div key={index} variants={item} className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 ${stat.bg} dark:bg-gray-800 rounded-lg flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            {stat.change && (
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${stat.changeBg} ${stat.changeColor}`}>
                                    {stat.change}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground mb-1 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-3xl font-black text-foreground tracking-tight">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Attendance Trends</h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Weekly average for the past 6 months</p>
                            </div>
                        </div>
                        <div className="mt-8 h-56 flex items-end gap-2">
                            {[45, 42, 53, 38, 62, 75].map((height, i) => (
                                <div key={i} className="flex-1 group relative flex flex-col items-center">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={`w-full rounded-t-sm transition-all ${i === 5 ? 'bg-primary' : 'bg-primary/30 group-hover:bg-primary/40'}`}
                                    />
                                    <span className="text-[10px] font-black text-muted-foreground mt-3 uppercase tracking-widest">
                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <h3 className="text-lg font-black text-foreground mb-4 uppercase tracking-tight">{t('dashboard.upcoming_events')}</h3>
                        <div className="space-y-3">
                            {summary?.upcoming_events?.length > 0 ? (
                                summary.upcoming_events.map((evt: any, i: number) => {
                                    const date = new Date(evt.date);
                                    return (
                                        <div key={i} className="flex items-center justify-between bg-muted/50 border border-border p-4 rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary text-white rounded-lg flex flex-col items-center justify-center shadow-md shadow-primary/20">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">{date.toLocaleString('default', { month: 'short' })}</span>
                                                    <span className="text-lg font-extrabold leading-none mt-0.5">{date.getDate()}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-foreground">{evt.title}</h4>
                                                    <p className="text-xs text-muted-foreground font-medium">{evt.location} • {evt.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No upcoming events scheduled.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Recent Activity</h3>
                        </div>
                        <div className="space-y-6">
                            {summary?.recent_activity?.length > 0 ? (
                                summary.recent_activity.map((act: any, i: number) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-orange-600 font-bold overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${act.first_name}`} alt="avatar" className="w-10 h-10 object-cover" />
                                            </div>
                                        </div>
                                        <div className="flex-1 pt-0.5 text-xs">
                                            <p className="text-foreground leading-tight">
                                                <span className="font-bold">{act.first_name} {act.last_name}</span> {act.type === 'joined' ? 'joined the community' : `donated $${parseFloat(act.amount).toFixed(2)}`}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground font-medium mt-1">{new Date(act.time).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-4">No recent activity.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
