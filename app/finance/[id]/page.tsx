'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Church, Mail, Phone, MapPin } from 'lucide-react';
import api from '../../services/api';
import { cn } from '../../lib/utils';

export default function FinanceReportDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await api.get(`/finance/${id}`);
                setReport(response.data);
            } catch (err) {
                console.error('Failed to fetch report', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading) return <div className="p-8 text-center animate-pulse font-black uppercase text-xs tracking-widest">Loading Report...</div>;
    if (!report) return <div className="p-8 text-center text-destructive font-black uppercase text-xs tracking-widest">Report not found</div>;

    const handlePrint = () => {
        window.print();
    };

    const currencies = ['RWF', 'USD', 'EUR'];
    const channels = ['CAISSE', 'BANQUE', 'MOMO'];
    const categories = ['DIMES', 'OFFRANDES', 'ACTIONS DE GRACE'];

    const calculateCashTotal = (currency: string) => {
        const values = report.cash_breakdown[currency] as Record<string, string | number>;
        return Object.entries(values).reduce((total, [denom, count]) => {
            if (denom === 'Autres') return total + (Number(count) || 0);
            return total + (Number(denom) * (Number(count) || 0));
        }, 0);
    };

    const calculateBreakdownTotal = (currency: string, channel: string) => {
        const cats = report.category_breakdown[currency][channel] as Record<string, string | number>;
        return Object.values(cats).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
    };

    const calculateGrandTotal = (currency: string) => {
        return channels.reduce((sum, channel) => sum + calculateBreakdownTotal(currency, channel), 0);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Header / Actions (Hidden on print) */}
            <div className="flex items-center justify-between print:hidden">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-bold text-[10px] uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to list
                </button>
                <button
                    onClick={handlePrint}
                    className="bg-primary text-white px-8 py-3 rounded-none font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:opacity-90 transition-opacity shadow-xl shadow-primary/20"
                >
                    <Printer className="w-4 h-4" /> Print Official Report
                </button>
            </div>

            {/* Official Report Container */}
            <div className="bg-white text-gray-900 p-12 shadow-2xl border border-gray-200 print:shadow-none print:border-none print:p-0 min-h-[297mm]">
                {/* ICC Header */}
                <div className="flex justify-between items-start border-b-2 border-primary pb-6 mb-8">
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Church className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none text-primary">Impact Centre Chrétien</h1>
                            <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mt-1">Église Locale de Kigali</p>
                        </div>
                    </div>
                    <div className="text-right text-[10px] font-bold uppercase tracking-widest space-y-1 text-gray-500">
                        <div className="flex items-center justify-end gap-2"><MapPin className="w-3 h-3" /> KG 5 Ave, Kacyiru, Kigali, Rwanda</div>
                        <div className="flex items-center justify-end gap-2"><Phone className="w-3 h-3" /> +250 788 233 851</div>
                        <div className="flex items-center justify-end gap-2"><Mail className="w-3 h-3" /> icc.rwanda@gmail.com</div>
                    </div>
                </div>

                {/* Bible Verse */}
                <div className="text-center italic text-[11px] font-medium text-gray-600 mb-8 max-w-2xl mx-auto">
                    "2 Corinthiens 9 ... {'<<'} Sachez-le, celui qui sème peu moissonnera peu, et celui qui sème abondamment moissonnera abondamment. Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte ; car Dieu aime celui qui donne avec joie. {'>>'}"
                </div>

                {/* Report Title */}
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-end border-b border-gray-200 pb-2">
                        <h2 className="text-lg font-black uppercase tracking-tight text-primary underline">RAPPORT DES DIMES ET OFFRANDES</h2>
                        <div className="text-sm font-black">Date : <span className="underline ml-2">{new Date(report.date).toLocaleDateString()}</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 text-sm font-bold">
                        <div>DÉPARTEMENT : <span className="text-primary uppercase ml-2">FINANCE</span></div>
                        <div>PROGRAMME : <span className="uppercase ml-2 border-b border-gray-300 flex-1 inline-block min-w-[200px]">{report.programme}</span></div>
                    </div>
                    <div className="text-sm font-bold">STAR(s) au Service : <span className="ml-2 border-b border-gray-300 pb-1">{report.stars_on_service}</span></div>
                </div>

                {/* Cash Table */}
                <div className="mb-10">
                    <div className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 flex justify-between">
                        <span>COMPTAGE CAISSE LIQUIDE</span>
                        <span>Détails par dénomination</span>
                    </div>
                    <div className="grid grid-cols-3 gap-0 border border-gray-300 border-t-0">
                        {currencies.map(curr => (
                            <div key={curr} className="border-r border-gray-300 last:border-r-0">
                                <div className="bg-sky-500 text-white text-[9px] font-black px-4 py-1.5 uppercase text-center">{curr}</div>
                                <table className="w-full text-[10px] font-bold border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 border-b border-gray-300">
                                            <th className="px-2 py-1 text-left">DENOM</th>
                                            <th className="px-2 py-1 text-center">NBR</th>
                                            <th className="px-2 py-1 text-right">TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {Object.entries(report.cash_breakdown[curr] as Record<string, string | number>).map(([denom, count]) => (
                                            <tr key={denom}>
                                                <td className="px-2 py-1 text-gray-500">{denom}</td>
                                                <td className="px-2 py-1 text-center">{(Number(count) || 0) > 0 ? count : '-'}</td>
                                                <td className="px-2 py-1 text-right">
                                                    {denom === 'Autres' 
                                                        ? (Number(count) || 0).toLocaleString() 
                                                        : (Number(denom) * (Number(count) || 0)).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-50 font-black">
                                            <td colSpan={2} className="px-2 py-2 uppercase text-[8px]">Total {curr}</td>
                                            <td className="px-2 py-2 text-right">{calculateCashTotal(curr).toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Table */}
                <div className="mb-10">
                    <div className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2">
                        CAISSE / BANQUE / MOBILE MONEY
                    </div>
                    <div className="border border-gray-300 border-t-0 overflow-hidden">
                        <table className="w-full text-[10px] font-bold border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 border border-gray-300 text-left">MODE</th>
                                    {categories.map(cat => <th key={cat} className="px-4 py-2 border border-gray-300 text-center">{cat}</th>)}
                                    <th className="px-4 py-2 border border-gray-300 text-right text-primary">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currencies.map(curr => (
                                    <React.Fragment key={curr}>
                                        <tr className="bg-sky-500/10">
                                            <td colSpan={5} className="px-4 py-1.5 font-black uppercase text-[9px] text-sky-600 border border-gray-300">{curr} Analysis</td>
                                        </tr>
                                        {channels.map(channel => (
                                            <tr key={`${curr}-${channel}`}>
                                                <td className="px-4 py-2 border border-gray-300 text-gray-500">{channel}</td>
                                                {categories.map(cat => (
                                                    <td key={cat} className="px-4 py-2 border border-gray-300 text-center">
                                                        {report.category_breakdown[curr][channel][cat].toLocaleString()}
                                                    </td>
                                                ))}
                                                <td className="px-4 py-2 border border-gray-300 text-right bg-gray-50">
                                                    {calculateBreakdownTotal(curr, channel).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-100 font-black">
                                            <td className="px-4 py-3 border border-gray-300 uppercase text-primary">Grand Total {curr}</td>
                                            <td colSpan={3} className="px-4 py-3 border border-gray-300"></td>
                                            <td className="px-4 py-3 border border-gray-300 text-right text-lg text-primary">{calculateGrandTotal(curr).toLocaleString()}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="space-y-12">
                    <div className="text-sm font-bold">
                        REMARQUE : <span className="ml-2 border-b border-gray-300 pb-1 italic font-medium text-gray-600">{report.remarks || 'Néant'}</span>
                    </div>
                    
                    <div className="flex justify-between items-end pt-10">
                        <div className="text-center">
                            <div className="text-[10px] font-black uppercase tracking-widest mb-16">NOM & SIGNATURE RESPONSABLE</div>
                            <div className="border-t border-gray-400 w-64 pt-2">
                                <span className="text-sm font-black uppercase">{report.responsible_name}</span>
                            </div>
                        </div>
                        <div className="text-right italic font-black text-primary text-lg">
                            Gloire à Jésus !
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
