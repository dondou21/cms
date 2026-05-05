'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, Calculator, Plus, Trash2, ArrowLeft, Church } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import { cn } from '../../lib/utils';

export default function NewFinanceReport() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Header Info
    const [header, setHeader] = useState({
        date: new Date().toISOString().split('T')[0],
        programme: '',
        stars_on_service: '',
        remarks: '',
        responsible_name: ''
    });

    // Cash Breakdown
    const [cash, setCash] = useState({
        RWF: { '5000': 0, '2000': 0, '1000': 0, '500': 0, '100': 0, 'Autres': 0 },
        USD: { '100': 0, '50': 0, '20': 0, '10': 0, '5': 0, '1': 0 },
        EUR: { '100': 0, '50': 0, '20': 0, '10': 0, '5': 0 }
    });

    // Category & Channel Breakdown
    const currencies = ['RWF', 'USD', 'EUR'];
    const channels = ['CAISSE', 'BANQUE', 'MOMO'];
    const categories = ['DIMES', 'OFFRANDES', 'ACTIONS DE GRACE'];

    const [breakdown, setBreakdown] = useState(
        currencies.reduce((acc, curr) => ({
            ...acc,
            [curr]: channels.reduce((cAcc, cCurr) => ({
                ...cAcc,
                [cCurr]: categories.reduce((catAcc, catCurr) => ({
                    ...catAcc,
                    [catCurr]: 0
                }), {})
            }), {})
        }), {})
    );

    // Totals Calculation
    const calculateCashTotal = (currency: string) => {
        const values = cash[currency as keyof typeof cash];
        return Object.entries(values).reduce((total, [denom, count]) => {
            if (denom === 'Autres') return total + (Number(count) || 0);
            return total + (Number(denom) * (Number(count) || 0));
        }, 0);
    };

    const calculateBreakdownTotal = (currency: string, channel: string) => {
        const cats = (breakdown as any)[currency][channel];
        return Object.values(cats).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
    };

    const calculateGrandTotal = (currency: string) => {
        return channels.reduce((sum, channel) => sum + calculateBreakdownTotal(currency, channel), 0);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.post('/finance', {
                ...header,
                cash_breakdown: cash,
                category_breakdown: breakdown
            });
            router.push('/finance');
        } catch (err) {
            console.error('Failed to save report', err);
            alert('Failed to save report. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-bold text-[10px] uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to reports
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-primary text-white px-8 py-3 rounded-none font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:opacity-90 transition-opacity shadow-xl shadow-primary/20 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Report</>}
                    </button>
                </div>
            </div>

            <div className="bg-card border border-border p-8 rounded-none shadow-sm space-y-10">
                {/* Header Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-b border-border pb-8">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Report Date</label>
                        <input
                            type="date"
                            value={header.date}
                            onChange={(e) => setHeader({ ...header, date: e.target.value })}
                            className="w-full bg-muted border border-border px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Programme (e.g. Culte Dominical)</label>
                        <input
                            type="text"
                            placeholder="Programme title"
                            value={header.programme}
                            onChange={(e) => setHeader({ ...header, programme: e.target.value })}
                            className="w-full bg-muted border border-border px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Responsible Name</label>
                        <input
                            type="text"
                            placeholder="Who is filing this?"
                            value={header.responsible_name}
                            onChange={(e) => setHeader({ ...header, responsible_name: e.target.value })}
                            className="w-full bg-muted border border-border px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <div className="lg:col-span-3 space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">STAR(s) au Service</label>
                        <textarea
                            rows={1}
                            placeholder="List members on duty"
                            value={header.stars_on_service}
                            onChange={(e) => setHeader({ ...header, stars_on_service: e.target.value })}
                            className="w-full bg-muted border border-border px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                        />
                    </div>
                </div>

                {/* Cash Breakdown Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Calculator className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Comptage Caisse Liquide</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {currencies.map(curr => (
                            <div key={curr} className="space-y-4">
                                <div className="bg-primary px-4 py-2 text-white text-xs font-black tracking-widest uppercase">{curr}</div>
                                <div className="space-y-2 border border-border p-4 bg-muted/30">
                                    {Object.keys(cash[curr as keyof typeof cash]).map(denom => (
                                        <div key={denom} className="flex items-center gap-4">
                                            <span className="w-16 text-[10px] font-black text-muted-foreground uppercase">{denom}</span>
                                            <input
                                                type="number"
                                                placeholder="Nbr"
                                                className="w-full bg-background border border-border px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    setCash({
                                                        ...cash,
                                                        [curr]: { ...cash[curr as keyof typeof cash], [denom]: val }
                                                    });
                                                }}
                                            />
                                        </div>
                                    ))}
                                    <div className="pt-2 mt-2 border-t border-border flex justify-between items-center px-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Total {curr}</span>
                                        <span className="text-sm font-black text-foreground">{calculateCashTotal(curr).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Channels & Categories Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Church className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Caisse / Banque / Mobile Money</h2>
                    </div>
                    <div className="space-y-12">
                        {currencies.map(curr => (
                            <div key={curr} className="space-y-4">
                                <div className="bg-secondary px-4 py-2 text-white text-xs font-black tracking-widest uppercase">{curr} Details</div>
                                <div className="overflow-x-auto border border-border">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-muted text-[10px] font-black uppercase tracking-widest">
                                                <th className="px-4 py-3 border border-border">Source</th>
                                                {categories.map(cat => <th key={cat} className="px-4 py-3 border border-border">{cat}</th>)}
                                                <th className="px-4 py-3 border border-border text-primary">TOTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {channels.map(channel => (
                                                <tr key={channel}>
                                                    <td className="px-4 py-3 border border-border font-black bg-muted/50">{channel}</td>
                                                    {categories.map(cat => (
                                                        <td key={cat} className="p-0 border border-border">
                                                            <input
                                                                type="number"
                                                                className="w-full h-full bg-transparent border-none px-4 py-3 focus:ring-1 focus:ring-primary font-bold text-xs"
                                                                onChange={(e) => {
                                                                    const val = Number(e.target.value);
                                                                    const newBreakdown = { ...breakdown };
                                                                    (newBreakdown as any)[curr][channel][cat] = val;
                                                                    setBreakdown(newBreakdown);
                                                                }}
                                                            />
                                                        </td>
                                                    ))}
                                                    <td className="px-4 py-3 border border-border font-black text-foreground">
                                                        {calculateBreakdownTotal(curr, channel).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="bg-primary/5 font-black">
                                                <td className="px-4 py-4 border border-border uppercase tracking-widest text-[10px] text-primary">Grand Total {curr}</td>
                                                <td colSpan={3} className="px-4 py-4 border border-border text-right text-muted-foreground uppercase text-[8px] tracking-tighter italic align-middle">Sum of all categories</td>
                                                <td className="px-4 py-4 border border-border text-lg text-primary">{calculateGrandTotal(curr).toLocaleString()}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Remarks Section */}
                <div className="pt-8 border-t border-border">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Remarques</label>
                        <textarea
                            rows={4}
                            placeholder="Any observations or issues..."
                            value={header.remarks}
                            onChange={(e) => setHeader({ ...header, remarks: e.target.value })}
                            className="w-full bg-muted border border-border px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
