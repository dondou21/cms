'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Heart, MessageSquare, ArrowRight, CheckCircle2, Clock, X, ChevronRight, Share2, Info } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { useLanguage } from '../lib/i18n';
import { cn } from '../lib/utils';

export default function IntegrationPage() {
    const { t } = useLanguage();
    const [stats, setStats] = useState<any>(null);
    const [prospects, setProspects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const [visitorForm, setVisitorForm] = useState({
        civilite: '',
        last_name: '',
        first_name: '',
        phone: '',
        email: '',
        address: '',
        age_range: '',
        marital_status: '',
        invited_by: '',
        referral_source: '',
        accepted_christ: false,
        want_accompaniment: false,
        usual_church: '',
        interests: [] as string[],
        other_info_request: ''
    });

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

    const handleRegisterVisitor = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Register as a member with 'Prospect' status
            await api.post('/members', {
                ...visitorForm,
                status: 'Prospect',
                want_to_join_icc: true
            });
            setShowRegisterModal(false);
            setVisitorForm({
                civilite: '', last_name: '', first_name: '', phone: '', email: '', address: '',
                age_range: '', marital_status: '', invited_by: '', referral_source: '',
                accepted_christ: false, want_accompaniment: false, usual_church: '',
                interests: [], other_info_request: ''
            });
            fetchData();
            alert('Visitor registered successfully!');
        } catch (err) {
            console.error('Failed to register visitor', err);
        } finally {
            setSaving(false);
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Integration Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage first-time visitors and their follow-up journey.</p>
                    </div>
                    <button
                        onClick={() => setShowRegisterModal(true)}
                        className="bg-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:opacity-90 flex items-center gap-2 self-start transition-all active:scale-95"
                    >
                        <UserPlus className="w-4 h-4" />
                        Nouveau Visiteur (Fiche de Bienvenue)
                    </button>
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
                        {/* Prospects List ... existing ... */}
                    </div>
                    {/* Sidebar Stats ... existing ... */}
                </div>

                <AnimatePresence>
                    {showRegisterModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                            >
                                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-primary/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                            <Heart className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black uppercase tracking-tight">Fiche de Bienvenue</h2>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Enregistrement Nouveau Visiteur</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowRegisterModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleRegisterVisitor} className="flex-1 overflow-y-auto p-8 space-y-10">
                                    {/* Civilité & Nom */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Civilité</label>
                                            <div className="flex gap-4">
                                                {['M.', 'Mme', 'Mlle'].map(c => (
                                                    <button
                                                        key={c}
                                                        type="button"
                                                        onClick={() => setVisitorForm({ ...visitorForm, civilite: c })}
                                                        className={cn(
                                                            "px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                                                            visitorForm.civilite === c ? "bg-primary text-white border-primary" : "bg-gray-50 dark:bg-gray-800 border-transparent text-gray-500"
                                                        )}
                                                    >{c}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Nom</label>
                                            <input required value={visitorForm.last_name} onChange={e => setVisitorForm({ ...visitorForm, last_name: e.target.value })} className="w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Prénom</label>
                                            <input required value={visitorForm.first_name} onChange={e => setVisitorForm({ ...visitorForm, first_name: e.target.value })} className="w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all" />
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Téléphone</label>
                                            <input required value={visitorForm.phone} onChange={e => setVisitorForm({ ...visitorForm, phone: e.target.value })} className="w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Email</label>
                                            <input type="email" value={visitorForm.email} onChange={e => setVisitorForm({ ...visitorForm, email: e.target.value })} className="w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all" />
                                        </div>
                                    </div>

                                    {/* Tranche d'âge & État Civil */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Tranche d'âge</label>
                                            <select value={visitorForm.age_range} onChange={e => setVisitorForm({ ...visitorForm, age_range: e.target.value })} className="w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
                                                <option value="">Sélectionner...</option>
                                                <option>18-24 ans</option>
                                                <option>25-34 ans</option>
                                                <option>35-44 ans</option>
                                                <option>45-54 ans</option>
                                                <option>55-64 ans</option>
                                                <option>65 ans et +</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">État Civil</label>
                                            <select value={visitorForm.marital_status} onChange={e => setVisitorForm({ ...visitorForm, marital_status: e.target.value })} className="w-full bg-gray-50 dark:bg-gray-800 border-transparent rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
                                                <option value="">Sélectionner...</option>
                                                <option>Célibataire</option>
                                                <option>Marié(e)</option>
                                                <option>Divorcé(e)</option>
                                                <option>Veuf/Veuve</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Referral Section */}
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Comment avez-vous connu ICC ?</h4>
                                        <div className="flex flex-wrap gap-4">
                                            {['Saint-Esprit', 'Réseaux Sociaux', 'Site Web', 'Par un ami', 'Affiche/Flyer'].map(s => (
                                                <label key={s} className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="referral" value={s} checked={visitorForm.referral_source === s} onChange={e => setVisitorForm({...visitorForm, referral_source: e.target.value})} className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-bold">{s}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <input placeholder="Précisez le nom de l'invitant (si applicable)" value={visitorForm.invited_by} onChange={e => setVisitorForm({...visitorForm, invited_by: e.target.value})} className="w-full bg-white dark:bg-gray-900 border-transparent rounded-xl px-4 py-3 text-sm font-bold mt-2" />
                                    </div>

                                    {/* Spiritual Status */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <label className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-2xl cursor-pointer">
                                            <input type="checkbox" checked={visitorForm.accepted_christ} onChange={e => setVisitorForm({...visitorForm, accepted_christ: e.target.checked})} className="w-5 h-5 rounded-lg text-emerald-500" />
                                            <div>
                                                <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">J'ai accepté Christ aujourd'hui</p>
                                                <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">Nouveau Départ</p>
                                            </div>
                                        </label>
                                        <label className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-2xl cursor-pointer">
                                            <input type="checkbox" checked={visitorForm.want_accompaniment} onChange={e => setVisitorForm({...visitorForm, want_accompaniment: e.target.checked})} className="w-5 h-5 rounded-lg text-primary" />
                                            <div>
                                                <p className="text-sm font-black text-primary">Je souhaite être accompagné(e)</p>
                                                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Suivi Spirituel</p>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-4 pt-6">
                                        <button type="button" onClick={() => setShowRegisterModal(false)} className="px-8 py-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all">Annuler</button>
                                        <button type="submit" disabled={saving} className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
                                            {saving ? 'Enregistrement...' : 'Enregistrer la Fiche'}
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
