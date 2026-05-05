'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, Calendar, User, Download, Printer } from 'lucide-react';
import Link from 'next/link';
import api from '../services/api';
import { cn } from '../lib/utils';

export default function FinanceReportsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const response = await api.get('/finance');
            setReports(response.data);
        } catch (err) {
            console.error('Failed to fetch finance reports', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">Finance Reports</h1>
                    <p className="text-muted-foreground mt-1">Manage official ICC Tithes & Offerings reports.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/finance/new"
                        className="bg-primary text-white px-6 py-2.5 rounded-none font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shadow-xl shadow-primary/20"
                    >
                        <Plus className="w-4 h-4" />
                        New Report
                    </Link>
                </div>
            </div>

            <div className="bg-card rounded-none overflow-hidden border border-border shadow-sm">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Recent Reports</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-black">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Programme</th>
                                <th className="px-6 py-4">Responsible</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-foreground">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-6 w-24 bg-muted rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-40 bg-muted rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-32 bg-muted rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 bg-muted rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 bg-muted rounded ml-auto" /></td>
                                    </tr>
                                ))
                            ) : reports.length > 0 ? (
                                reports.map((report) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={report.id}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-black">
                                            {new Date(report.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-muted-foreground uppercase text-xs">
                                            {report.programme}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-xs uppercase">
                                            {report.responsible_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                                Completed
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/finance/${report.id}`}
                                                    className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <Printer className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                                        No finance reports found. Create your first one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
