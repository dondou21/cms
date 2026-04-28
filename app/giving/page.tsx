'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HandCoins,
    Plus,
    Search,
    Calendar,
    User,
    DollarSign,
    Filter,
    ArrowUpRight,
    TrendingUp,
    X,
    Download
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../lib/i18n';
import { cn } from '../lib/utils';

export default function GivingPage() {
    const { t } = useLanguage();
    const [givings, setGivings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [events, setEvents] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        event_id: '',
        donor_name: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'Offering'
    });

    const fetchGivings = async () => {
        try {
            const response = await api.get('/givings');
            setGivings(response.data);
        } catch (err) {
            console.error('Failed to fetch giving records', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data);
        } catch (err) {
            console.error('Failed to fetch events', err);
        }
    };

    useEffect(() => {
        fetchGivings();
        fetchEvents();
    }, []);

    const handleRecordGiving = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/givings', formData);
            setShowModal(false);
            fetchGivings();
            setFormData({
                event_id: '',
                donor_name: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                type: 'Offering'
            });
        } catch (err) {
            console.error('Failed to record contribution', err);
        }
    };

    const handleExportCSV = () => {
        if (givings.length === 0) return;
        
        const headers = ['Event', 'Donor', 'Amount', 'Type', 'Date'];
        const csvRows = givings.map(g => [
            `"${(g.event_title || 'General').replace(/"/g, '""')}"`,
            `"${(g.donor_name || 'Anonymous').replace(/"/g, '""')}"`,
            `"${parseFloat(g.amount).toFixed(2)}"`,
            `"${(g.type || '').replace(/"/g, '""')}"`,
            `"${new Date(g.date).toLocaleDateString()}"`
        ].join(','));
        
        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'church_giving_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalGiving = givings.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const types = ['Tithe', 'Offering', 'Thanksgiving', 'Donation', 'Other'];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">{t('nav.giving')}</h1>
                    <p className="text-muted-foreground mt-1">Track and manage financial contributions securely.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="bg-card border border-border text-foreground px-4 py-2.5 rounded-none font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-muted transition-colors whitespace-nowrap"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-primary text-white px-6 py-2.5 rounded-none font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shadow-xl shadow-primary/20"
                    >
                        <Plus className="w-4 h-4" />
                        Record Contribution
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border p-6 rounded-none relative overflow-hidden shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary/10 rounded-none flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Collections</p>
                            <h3 className="text-3xl font-black text-foreground tracking-tight mt-1">${totalGiving.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-none overflow-hidden border border-border shadow-sm">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Contribution History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-black">
                                <th className="px-6 py-4">Event</th>
                                <th className="px-6 py-4">Donor</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-foreground">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-6 w-40 bg-muted rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-muted rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-24 bg-muted rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-24 bg-muted rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-6 bg-muted rounded" /></td>
                                    </tr>
                                ))
                            ) : givings.length > 0 ? (
                                givings.map((g) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={g.id}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-bold text-muted-foreground">
                                            {g.event_title || 'General'}
                                        </td>
                                        <td className="px-6 py-4 font-black">
                                            {g.donor_name || 'Anonymous'}
                                        </td>
                                        <td className="px-6 py-4 font-black text-primary font-mono text-lg">
                                            ${parseFloat(g.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-none bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                                                {g.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-muted-foreground">
                                            {new Date(g.date).toLocaleDateString()}
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-bold">
                                        No contributions recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-card border border-border rounded-none p-8 relative z-10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Record Contribution</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-muted rounded-none transition-colors text-foreground"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleRecordGiving} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Associated Event</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <select
                                            value={formData.event_id}
                                            onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                                            className="w-full bg-muted border-transparent rounded-none pl-10 pr-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                        >
                                            <option value="" className="bg-card text-foreground">General / No Event</option>
                                            {events.map(e => (
                                                <option key={e.id} value={e.id} className="bg-card text-foreground">{e.title} ({new Date(e.date).toLocaleDateString()})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Donor Name (Optional)</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="Enter donor name if known"
                                            value={formData.donor_name}
                                            onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                                            className="w-full bg-muted border-transparent rounded-none pl-10 pr-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount ($)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                className="w-full bg-muted border-transparent rounded-none pl-10 pr-4 py-3 text-sm font-black text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="date"
                                                required
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full bg-muted border-transparent rounded-none pl-10 pr-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Contribution Type</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {types.map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type })}
                                                className={cn(
                                                    "py-2 rounded-none text-[10px] font-black transition-all border uppercase tracking-widest",
                                                    formData.type === type
                                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                                        : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                                                )}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2.5 rounded-none font-black uppercase tracking-widest text-[10px] border border-border hover:bg-muted transition-colors text-foreground"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-primary text-white px-8 py-2.5 rounded-none font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-opacity shadow-xl shadow-primary/20"
                                    >
                                        Record Contribution
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
