'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Heart, MessageSquare, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { useLanguage } from '../lib/i18n';
import { cn } from '../lib/utils';

export default function IntegrationPage() {
    const { t } = useLanguage();
    const [stats, setStats] = useState<any>(null);
    const [prospects, setProspects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, prosRes] = await Promise.all([
                api.get('/reports/integration-stats'),
                api.get('/members?status=Prospect')
            ]);
            setStats(statsRes.data);
            setProspects(prosRes.data);
        } catch (err) {
            console.error('Failed to fetch integration data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await api.put(`/members/${id}`, { status });
            fetchData();
        } catch (err) {
            console.error('Failed to update member status', err);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="h-[60vh] flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    const cards = [
        { label: 'New Visitors (Month)', value: stats?.new_visitors || 0, icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Want to Join', value: stats?.want_to_join || 0, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
        { label: 'New Converts', value: stats?.new_converts || 0, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { label: 'Pending Follow-up', value: stats?.pending_followup || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-12">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Integration Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Track new members, visitors, and their journey into the family.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm"
                        >
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", card.bg)}>
                                <card.icon className={cn("w-6 h-6", card.color)} />
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.label}</p>
                            <h3 className="text-3xl font-black mt-1">{card.value}</h3>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <h3 className="text-lg font-bold">New Prospects (Waiting for Integration)</h3>
                                <button className="text-sm font-bold text-primary">View All Pipeline</button>
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                {prospects.length > 0 ? prospects.map((p) => (
                                    <div key={p.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {p.first_name[0]}{p.last_name[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold">{p.first_name} {p.last_name}</h4>
                                                <p className="text-xs text-gray-500">{p.phone} • Interested in: {p.interests || 'General'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => handleUpdateStatus(p.id, 'Active')}
                                                className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90"
                                            >
                                                Mark as Integrated
                                            </button>
                                            <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500">
                                                <MessageSquare className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-12 text-center text-gray-500">No pending prospects for integration.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-primary to-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-primary/20">
                            <Heart className="w-10 h-10 mb-4 opacity-50" />
                            <h3 className="text-xl font-bold mb-2">Welcome Team Goal</h3>
                            <p className="text-sm opacity-80 mb-6">Integrate 20 new members this month to reach the community growth target.</p>
                            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                                <div className="bg-white h-full w-3/4" />
                            </div>
                            <p className="text-[10px] font-bold mt-2 uppercase tracking-widest">15 / 20 Members Integrated</p>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h3 className="text-base font-bold mb-4">Upcoming Welcome Meetings</h3>
                            <div className="space-y-4">
                                {[1, 2].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                        <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-xl flex flex-col items-center justify-center shadow-sm">
                                            <span className="text-[10px] font-bold text-primary">MAY</span>
                                            <span className="text-sm font-black leading-none">1{i}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">New Member Orientation</p>
                                            <p className="text-[10px] text-gray-500">Room 302 • 10:00 AM</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-300 ml-auto" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
