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
    X
} from 'lucide-react';
import api from '../services/api';
import { cn } from '../lib/utils';

export default function GivingPage() {
    const [givings, setGivings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [members, setMembers] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        member_id: '',
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

    const fetchMembers = async () => {
        try {
            const response = await api.get('/members');
            setMembers(response.data);
        } catch (err) {
            console.error('Failed to fetch members', err);
        }
    };

    useEffect(() => {
        fetchGivings();
        fetchMembers();
    }, []);

    const handleRecordGiving = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/givings', formData);
            setShowModal(false);
            fetchGivings();
            setFormData({
                member_id: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                type: 'Offering'
            });
        } catch (err) {
            console.error('Failed to record contribution', err);
        }
    };

    const totalGiving = givings.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const types = ['Tithe', 'Offering', 'Thanksgiving', 'Donation', 'Other'];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Giving & Contributions</h1>
                    <p className="text-muted-foreground mt-1">Track and manage financial contributions securely.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Record Contribution
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Collections</p>
                            <h3 className="text-2xl font-bold mt-1">${totalGiving.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Contribution History</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground">
                            <Filter className="w-3.5 h-3.5" />
                            Filter By Type
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-muted-foreground text-xs uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Member</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-6 w-40 bg-white/5 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-white/5 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-24 bg-white/5 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-24 bg-white/5 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-6 bg-white/5 rounded" /></td>
                                    </tr>
                                ))
                            ) : givings.length > 0 ? (
                                givings.map((g) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={g.id}
                                        className="hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{g.member_name || 'Anonymous'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-amber-400 font-mono">${parseFloat(g.amount).toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                                {g.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-muted-foreground italic">
                                                {new Date(g.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-muted-foreground hover:text-foreground">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No contributions recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg glass-card rounded-3xl p-8 relative z-10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold gradient-text">Record Contribution</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleRecordGiving} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground ml-1">Member</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <select
                                            required
                                            value={formData.member_id}
                                            onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                                            className="w-full bg-background/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                        >
                                            <option value="" className="bg-background text-foreground">Select a member</option>
                                            {members.map(m => (
                                                <option key={m.id} value={m.id} className="bg-background text-foreground">{m.first_name} {m.last_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-muted-foreground ml-1">Amount ($)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                className="w-full bg-background/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-muted-foreground ml-1">Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="date"
                                                required
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full bg-background/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground ml-1">Contribution Type</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {types.map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type })}
                                                className={cn(
                                                    "py-2 rounded-lg text-xs font-bold transition-all border",
                                                    formData.type === type
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10"
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
                                        className="px-6 py-2.5 rounded-xl font-semibold border border-white/10 hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
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
