'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    Users,
    HandCoins,
    Download,
    Calendar,
    ArrowUpRight,
    PieChart
} from 'lucide-react';
import api from '../services/api';
import { cn } from '../lib/utils';

export default function ReportsPage() {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get('/reports/dashboard');
                setSummary(response.data);
            } catch (err) {
                console.error('Failed to fetch report data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-none animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Leadership Reports</h1>
                    <p className="text-muted-foreground mt-1">Comprehensive overview of church growth and financial health.</p>
                </div>
                <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-none text-sm font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors">
                    <Download className="w-4 h-4" />
                    Export PDF
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Members', value: summary?.total_members, icon: Users, color: 'text-blue-400' },
                    { label: 'Active Status', value: `${Math.round((summary?.active_members / summary?.total_members) * 100)}%`, icon: TrendingUp, color: 'text-emerald-400' },
                    { label: 'Monthly Revenue', value: `$${summary?.monthly_giving}`, icon: HandCoins, color: 'text-amber-400' },
                    { label: 'Retention Rate', value: '94%', icon: PieChart, color: 'text-purple-400' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 rounded-none border border-white/5"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-white/5 rounded-none">
                                <stat.icon className={cn("w-5 h-5", stat.color)} />
                            </div>
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                +2.4% <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8 rounded-none">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Financial Trends
                    </h3>
                    <div className="h-64 flex items-end justify-between gap-4 px-4">
                        {[45, 62, 58, 75, 90, 82, 95].map((height, i) => (
                            <div key={i} className="flex-1 group relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-lg group-hover:to-primary/80 transition-all cursor-pointer"
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    ${height}k
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-none">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Attendance Summary
                    </h3>
                    <div className="space-y-6">
                        {summary?.recent_attendance?.map((row: any, idx: number) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-muted-foreground">{row.status}</span>
                                    <span className="font-bold">{row.count}</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-none overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(row.count / summary.total_members) * 100}%` }}
                                        className={cn(
                                            "h-full rounded-none",
                                            row.status === 'Present' ? "bg-emerald-500" : row.status === 'Absent' ? "bg-destructive" : "bg-amber-500"
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
