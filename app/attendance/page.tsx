'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Save, Users, Search, ClipboardList, TrendingUp, History } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../lib/i18n';
import { cn } from '../lib/utils';

export default function AttendancePage() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'individual' | 'report'>('individual');
    
    // Individual Check-in State
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [attendanceCount, setAttendanceCount] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Service Report State
    const [reports, setReports] = useState<any[]>([]);
    const [prevReport, setPrevReport] = useState<any>(null);
    const [reportData, setReportData] = useState({
        date: new Date().toISOString().split('T')[0],
        programme: '',
        organisateur: '',
        departement: 'SECRETARIAT',
        adults_men: 0,
        adults_women: 0,
        juniors_boys: 0,
        juniors_girls: 0,
        visitors_total: 0,
        visitors_joining: 0,
        salvation_total: 0,
        salvation_joining: 0,
        problems: '',
        general_remarks: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [evRes, repRes] = await Promise.all([
                api.get('/events'),
                api.get('/service-reports')
            ]);
            setEvents(evRes.data);
            setReports(repRes.data);
            if (evRes.data.length > 0) {
                const initialEvent = evRes.data[0];
                setSelectedEventId(initialEvent.id.toString());
                setAttendanceCount(initialEvent.attendance_count?.toString() || '0');
            }
            if (repRes.data.length > 0) {
                setPrevReport(repRes.data[0]);
            }
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveIndividual = async () => {
        if (!selectedEventId || !attendanceCount) return;
        setSaving(true);
        try {
            await api.put(`/events/${selectedEventId}/attendance`, { count: parseInt(attendanceCount, 10) });
            setEvents(prev => prev.map(ev => ev.id.toString() === selectedEventId ? { ...ev, attendance_count: parseInt(attendanceCount, 10) } : ev));
            alert('Attendance saved successfully');
        } catch (err) {
            console.error('Failed to save attendance', err);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveReport = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/service-reports', reportData);
            alert('Report saved successfully');
            fetchInitialData();
            setActiveTab('individual'); // Switch back to history or list
        } catch (err) {
            console.error('Failed to save report', err);
        } finally {
            setSaving(false);
        }
    };

    // Auto-calculations
    const totalAdults = Number(reportData.adults_men) + Number(reportData.adults_women);
    const totalJuniors = Number(reportData.juniors_boys) + Number(reportData.juniors_girls);
    const totalSouls = totalAdults + totalJuniors;

    const getProgression = (current: number, prev: number) => {
        if (!prev) return null;
        const diff = current - prev;
        return {
            val: diff,
            color: diff >= 0 ? 'text-emerald-600' : 'text-rose-600',
            icon: diff >= 0 ? '+' : ''
        };
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-none animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{t('nav.attendance')}</h1>
                    <p className="text-muted-foreground mt-1">Manage service attendance and detailed ministry reports.</p>
                </div>
                <div className="flex bg-card p-1 rounded-none border border-border shadow-sm self-start">
                    <button
                        onClick={() => setActiveTab('individual')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-none text-sm font-bold transition-all",
                            activeTab === 'individual' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-muted"
                        )}
                    >
                        <Users className="w-4 h-4" />
                        Check-in
                    </button>
                    <button
                        onClick={() => setActiveTab('report')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-none text-sm font-bold transition-all",
                            activeTab === 'report' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-muted"
                        )}
                    >
                        <ClipboardList className="w-4 h-4" />
                        {t('reports.service_report')}
                    </button>
                </div>
            </div>

            {activeTab === 'individual' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card p-6 rounded-none border border-border shadow-sm">
                            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <CalendarDays className="w-5 h-5 text-primary" />
                                Select Event
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Event</label>
                                    <select
                                        className="w-full bg-muted border-transparent rounded-none p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground font-bold"
                                        value={selectedEventId}
                                        onChange={(e) => {
                                            const id = e.target.value;
                                            setSelectedEventId(id);
                                            const ev = events.find(event => event.id.toString() === id);
                                            if (ev) setAttendanceCount(ev.attendance_count?.toString() || '0');
                                        }}
                                    >
                                        {events.map(ev => (
                                            <option key={ev.id} value={ev.id} className="bg-card">{new Date(ev.date).toLocaleDateString()} - {ev.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Total Attendees</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="number"
                                            className="w-full bg-muted border-transparent rounded-none p-3 pl-10 text-xl font-black focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                            value={attendanceCount}
                                            onChange={(e) => setAttendanceCount(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveIndividual}
                                    disabled={saving || !selectedEventId}
                                    className="w-full bg-primary text-white font-black uppercase tracking-widest text-xs py-4 rounded-none shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {saving ? 'Saving...' : 'Save Attendance'}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="bg-card rounded-none border border-border shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <h3 className="text-lg font-bold text-foreground">Attendance History</h3>
                                <div className="relative w-64">
                                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search events..."
                                        className="w-full bg-muted border-transparent rounded-none pl-9 pr-3 py-1.5 text-xs text-foreground"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="overflow-auto max-h-[500px]">
                                <table className="w-full text-left text-sm text-muted-foreground">
                                    <thead className="bg-muted text-[10px] uppercase text-muted-foreground font-black tracking-widest sticky top-0">
                                        <tr>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Event Title</th>
                                            <th className="px-6 py-4 text-center">Attendees</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border bg-card">
                                        {events.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase())).map((evt) => (
                                            <tr key={evt.id} className="hover:bg-muted/30">
                                                <td className="px-6 py-4 font-bold text-foreground">{new Date(evt.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-foreground">{evt.title}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-none text-[10px] font-black bg-primary/10 text-primary uppercase tracking-widest">
                                                        {evt.attendance_count || 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => setSelectedEventId(evt.id.toString())} className="text-primary font-black uppercase tracking-widest text-[10px]">Update</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSaveReport} className="max-w-5xl mx-auto space-y-8">
                    {/* Header Details */}
                    <div className="bg-card p-8 rounded-none border border-border shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-border pb-4">
                            <ClipboardList className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-black uppercase tracking-tight text-foreground">{t('reports.service_report')}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Département</label>
                                <input
                                    type="text"
                                    value={reportData.departement}
                                    readOnly
                                    className="w-full bg-muted border-transparent rounded-none px-4 py-3 text-sm font-bold text-muted-foreground focus:outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date</label>
                                <input
                                    type="date"
                                    required
                                    value={reportData.date}
                                    onChange={(e) => setReportData({ ...reportData, date: e.target.value })}
                                    className="w-full bg-muted border-transparent rounded-none px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Programme</label>
                                <input
                                    type="text"
                                    placeholder="ex: Culte de célébration"
                                    value={reportData.programme}
                                    onChange={(e) => setReportData({ ...reportData, programme: e.target.value })}
                                    className="w-full bg-muted border-transparent rounded-none px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Organisateur</label>
                                <input
                                    type="text"
                                    value={reportData.organisateur}
                                    onChange={(e) => setReportData({ ...reportData, organisateur: e.target.value })}
                                    className="w-full bg-muted border-transparent rounded-none px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats Tables */}
                    <div className="grid grid-cols-1 gap-8">
                        {/* Frequentation */}
                        <div className="bg-card rounded-none border border-border shadow-sm overflow-hidden">
                            <div className="bg-primary p-4 text-white font-black uppercase tracking-widest text-sm flex justify-between items-center">
                                <span>{t('reports.attendance_stats')}</span>
                                <TrendingUp className="w-4 h-4" />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm font-bold text-foreground">
                                    <thead className="bg-muted/50 text-[10px] uppercase text-muted-foreground border-b border-border">
                                        <tr>
                                            <th className="px-6 py-4 w-12">#</th>
                                            <th className="px-6 py-4">{t('reports.description')}</th>
                                            <th className="px-6 py-4 text-center">{t('reports.nbr')}</th>
                                            <th className="px-6 py-4 text-center">{t('reports.progression_prev')}</th>
                                            <th className="px-6 py-4 text-center">{t('reports.progression_avg')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {/* Adults Header */}
                                        <tr className="bg-primary/5">
                                            <td colSpan={5} className="px-6 py-2 text-primary uppercase text-[10px] font-black tracking-widest">{t('reports.adults')}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 text-muted-foreground">1</td>
                                            <td className="px-6 py-4">{t('reports.men')}</td>
                                            <td className="px-6 py-4 text-center"><input type="number" value={reportData.adults_men} onChange={(e) => setReportData({...reportData, adults_men: Number(e.target.value)})} className="w-20 mx-auto text-center bg-muted border-transparent rounded-none py-1 font-bold" /></td>
                                            <td className="px-6 py-4 text-center">{getProgression(reportData.adults_men, prevReport?.adults_men)?.val ?? '-'}</td>
                                            <td className="px-6 py-4 text-center">-</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 text-muted-foreground">2</td>
                                            <td className="px-6 py-4">{t('reports.women')}</td>
                                            <td className="px-6 py-4 text-center"><input type="number" value={reportData.adults_women} onChange={(e) => setReportData({...reportData, adults_women: Number(e.target.value)})} className="w-20 mx-auto text-center bg-muted border-transparent rounded-none py-1 font-bold" /></td>
                                            <td className="px-6 py-4 text-center">{getProgression(reportData.adults_women, prevReport?.adults_women)?.val ?? '-'}</td>
                                            <td className="px-6 py-4 text-center">-</td>
                                        </tr>
                                        <tr className="bg-muted/50 font-black">
                                            <td className="px-6 py-4"></td>
                                            <td className="px-6 py-4 uppercase text-xs">{t('reports.total_adults')}</td>
                                            <td className="px-6 py-4 text-center text-primary text-lg">{totalAdults}</td>
                                            <td className="px-6 py-4 text-center">{getProgression(totalAdults, (prevReport?.adults_men || 0) + (prevReport?.adults_women || 0))?.val ?? '-'}</td>
                                            <td className="px-6 py-4 text-center">-</td>
                                        </tr>
                                        {/* Juniors Header */}
                                        <tr className="bg-primary/5">
                                            <td colSpan={5} className="px-6 py-2 text-primary uppercase text-[10px] font-black tracking-widest">{t('reports.juniors')}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 text-muted-foreground">3</td>
                                            <td className="px-6 py-4">{t('reports.girls')}</td>
                                            <td className="px-6 py-4 text-center"><input type="number" value={reportData.juniors_girls} onChange={(e) => setReportData({...reportData, juniors_girls: Number(e.target.value)})} className="w-20 mx-auto text-center bg-muted border-transparent rounded-none py-1 font-bold" /></td>
                                            <td className="px-6 py-4 text-center">{getProgression(reportData.juniors_girls, prevReport?.juniors_girls)?.val ?? '-'}</td>
                                            <td className="px-6 py-4 text-center">-</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 text-muted-foreground">4</td>
                                            <td className="px-6 py-4">{t('reports.boys')}</td>
                                            <td className="px-6 py-4 text-center"><input type="number" value={reportData.juniors_boys} onChange={(e) => setReportData({...reportData, juniors_boys: Number(e.target.value)})} className="w-20 mx-auto text-center bg-muted border-transparent rounded-none py-1 font-bold" /></td>
                                            <td className="px-6 py-4 text-center">{getProgression(reportData.juniors_boys, prevReport?.juniors_boys)?.val ?? '-'}</td>
                                            <td className="px-6 py-4 text-center">-</td>
                                        </tr>
                                        <tr className="bg-muted/50 font-black">
                                            <td className="px-6 py-4"></td>
                                            <td className="px-6 py-4 uppercase text-xs">{t('reports.total_juniors')}</td>
                                            <td className="px-6 py-4 text-center text-primary text-lg">{totalJuniors}</td>
                                            <td className="px-6 py-4 text-center">{getProgression(totalJuniors, (prevReport?.juniors_boys || 0) + (prevReport?.juniors_girls || 0))?.val ?? '-'}</td>
                                            <td className="px-6 py-4 text-center">-</td>
                                        </tr>
                                        {/* Grand Total */}
                                        <tr className="bg-primary text-white font-black">
                                            <td className="px-6 py-5"></td>
                                            <td className="px-6 py-5 uppercase text-base">{t('reports.total_souls')}</td>
                                            <td className="px-6 py-5 text-center text-2xl">{totalSouls}</td>
                                            <td className="px-6 py-5 text-center">{getProgression(totalSouls, (prevReport?.adults_men || 0) + (prevReport?.adults_women || 0) + (prevReport?.juniors_boys || 0) + (prevReport?.juniors_girls || 0))?.val ?? '-'}</td>
                                            <td className="px-6 py-5 text-center">-</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Integration */}
                        <div className="bg-card rounded-none border border-border shadow-sm overflow-hidden">
                            <div className="bg-primary p-4 text-white font-black uppercase tracking-widest text-sm flex justify-between items-center">
                                <span>{t('reports.integration')}</span>
                                <History className="w-4 h-4" />
                            </div>
                            <div className="p-6 space-y-6">
                                <table className="w-full text-left text-sm font-bold text-foreground">
                                    <thead className="bg-muted/50 text-[10px] uppercase text-muted-foreground border-b border-border">
                                        <tr>
                                            <th className="px-6 py-4 w-12">#</th>
                                            <th className="px-6 py-4">{t('reports.description')}</th>
                                            <th className="px-6 py-4 text-center">{t('reports.nbr')}</th>
                                            <th className="px-6 py-4 text-center">{t('reports.progression_prev')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        <tr>
                                            <td className="px-6 py-4 text-muted-foreground">1</td>
                                            <td className="px-6 py-4 uppercase text-xs">{t('reports.visitors_total')}</td>
                                            <td className="px-6 py-4 text-center"><input type="number" value={reportData.visitors_total} onChange={(e) => setReportData({...reportData, visitors_total: Number(e.target.value)})} className="w-20 mx-auto text-center bg-muted border-transparent rounded-none py-1 font-bold" /></td>
                                            <td className="px-6 py-4 text-center">{getProgression(reportData.visitors_total, prevReport?.visitors_total)?.val ?? '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Remarks Section */}
                    <div className="bg-card p-8 rounded-none border border-border shadow-sm space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">{t('reports.problems')}</label>
                                <textarea
                                    rows={3}
                                    value={reportData.problems}
                                    onChange={(e) => setReportData({ ...reportData, problems: e.target.value })}
                                    className="w-full bg-muted border-transparent rounded-none p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none text-foreground"
                                    placeholder="Décrivez les problèmes techniques ou logistiques..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">{t('reports.general_remarks')}</label>
                                <textarea
                                    rows={3}
                                    value={reportData.general_remarks}
                                    onChange={(e) => setReportData({ ...reportData, general_remarks: e.target.value })}
                                    className="w-full bg-muted border-transparent rounded-none p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none text-foreground"
                                    placeholder="Notes spirituelles, climat du culte, témoignages..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => setActiveTab('individual')}
                            className="px-8 py-4 rounded-none font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:bg-muted transition-colors"
                        >
                            {t('members.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-primary text-white px-10 py-4 rounded-none font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Enregistrer le Rapport'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
