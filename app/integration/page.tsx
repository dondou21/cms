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
        usual_church: false,
        want_to_join_icc: false,
        desires_contact_leader: false,
        desires_impact_group: false,
        desires_house_church: false,
        desires_formation_001: false,
        info_request_mui: false,
        info_request_events: false,
        join_gs: false,
        comments: ''
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
            await api.post('/members', {
                ...visitorForm,
                status: 'Prospect'
            });
            setShowRegisterModal(false);
            setVisitorForm({
                civilite: '', last_name: '', first_name: '', phone: '', email: '', address: '',
                age_range: '', marital_status: '', invited_by: '', referral_source: '',
                accepted_christ: false, want_accompaniment: false, usual_church: false,
                want_to_join_icc: false, desires_contact_leader: false, desires_impact_group: false,
                desires_house_church: false, desires_formation_001: false, info_request_mui: false,
                info_request_events: false, join_gs: false, comments: ''
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
        { key: 'new_visitors', label: 'New Visitors (Month)', value: stats?.new_visitors || 0, icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { key: 'want_to_join', label: 'Want to Join', value: stats?.want_to_join || 0, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
        { key: 'new_converts', label: 'New Converts', value: stats?.new_converts || 0, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { key: 'pending_followup', label: 'Pending Follow-up', value: stats?.pending_followup || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">{t('integration.title')}</h1>
                        <p className="text-muted-foreground mt-1">{t('integration.description')}</p>
                    </div>
                    <button
                        onClick={() => setShowRegisterModal(true)}
                        className="bg-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:opacity-90 flex items-center gap-2 self-start transition-all active:scale-95"
                    >
                        <UserPlus className="w-4 h-4" />
                        {t('integration.new_visitor_btn')}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card p-6 rounded-3xl border border-border shadow-sm"
                        >
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", card.bg)}>
                                <card.icon className={cn("w-6 h-6", card.color)} />
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t(`integration.stats.${card.key}`)}</p>
                            <h3 className="text-3xl font-black mt-1 text-foreground">{card.value}</h3>
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
                                className="bg-card w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-border"
                            >
                                <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
                                            <Heart className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Fiche de Bienvenue</h2>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Enregistrement Nouveau Visiteur</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowRegisterModal(false)} className="p-2 hover:bg-muted rounded-full text-foreground">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleRegisterVisitor} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
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
                                                            visitorForm.civilite === c ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-muted border-transparent text-muted-foreground"
                                                        )}
                                                    >{c}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Nom</label>
                                            <input required value={visitorForm.last_name} onChange={e => setVisitorForm({ ...visitorForm, last_name: e.target.value })} className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Prénom</label>
                                            <input required value={visitorForm.first_name} onChange={e => setVisitorForm({ ...visitorForm, first_name: e.target.value })} className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all" />
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Téléphone</label>
                                            <input required value={visitorForm.phone} onChange={e => setVisitorForm({ ...visitorForm, phone: e.target.value })} className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Email</label>
                                            <input type="email" value={visitorForm.email} onChange={e => setVisitorForm({ ...visitorForm, email: e.target.value })} className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all" />
                                        </div>
                                    </div>

                                    {/* Tranche d'âge & État Civil */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Tranche d'âge</label>
                                            <select value={visitorForm.age_range} onChange={e => setVisitorForm({ ...visitorForm, age_range: e.target.value })} className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
                                                <option value="" className="bg-card">Sélectionner...</option>
                                                <option className="bg-card">18-24 ans</option>
                                                <option className="bg-card">25-34 ans</option>
                                                <option className="bg-card">35-44 ans</option>
                                                <option className="bg-card">45-54 ans</option>
                                                <option className="bg-card">55-64 ans</option>
                                                <option className="bg-card">65 ans et +</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">État Civil</label>
                                            <select value={visitorForm.marital_status} onChange={e => setVisitorForm({ ...visitorForm, marital_status: e.target.value })} className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
                                                <option value="" className="bg-card">Sélectionner...</option>
                                                <option className="bg-card">Célibataire</option>
                                                <option className="bg-card">Marié(e)</option>
                                                <option className="bg-card">Divorcé(e)</option>
                                                <option className="bg-card">Veuf/Veuve</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Referral Section */}
                                    <div className="bg-muted p-6 rounded-2xl space-y-4 border border-border">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Comment avez-vous connu ICC ?</h4>
                                        <div className="flex flex-wrap gap-4">
                                            {['Saint-Esprit', 'Réseaux Sociaux', 'Site Web', 'Par un ami', 'Affiche/Flyer'].map(s => (
                                                <label key={s} className="flex items-center gap-2 cursor-pointer group">
                                                    <input type="radio" name="referral" value={s} checked={visitorForm.referral_source === s} onChange={e => setVisitorForm({...visitorForm, referral_source: e.target.value})} className="w-4 h-4 text-primary focus:ring-primary" />
                                                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{s}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <input placeholder="Précisez le nom de l'invitant (si applicable)" value={visitorForm.invited_by} onChange={e => setVisitorForm({...visitorForm, invited_by: e.target.value})} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-bold mt-2 text-foreground" />
                                    </div>

                                    {/* Spiritual Status */}
                                    <div className="bg-muted p-6 rounded-2xl space-y-6 border border-border">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Vie Spirituelle</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" checked={visitorForm.accepted_christ} onChange={e => setVisitorForm({...visitorForm, accepted_christ: e.target.checked})} className="w-5 h-5 rounded-lg text-primary focus:ring-primary" />
                                                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">Avez-vous accepté Christ comme Seigneur et Sauveur?</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" checked={visitorForm.want_accompaniment} onChange={e => setVisitorForm({...visitorForm, want_accompaniment: e.target.checked})} className="w-5 h-5 rounded-lg text-primary focus:ring-primary" />
                                                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">Souhaitez-vous être accompagné(e) dans cette démarche?</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" checked={visitorForm.usual_church} onChange={e => setVisitorForm({...visitorForm, usual_church: e.target.checked})} className="w-5 h-5 rounded-lg text-primary focus:ring-primary" />
                                                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">Avez-vous une église habituelle?</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" checked={visitorForm.want_to_join_icc} onChange={e => setVisitorForm({...visitorForm, want_to_join_icc: e.target.checked})} className="w-5 h-5 rounded-lg text-primary focus:ring-primary" />
                                                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">Souhaitez-vous intégrer Impact Centre Chrétien?</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Desires Section */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Vous souhaitez intégrer ICC, désirez-vous :</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { key: 'desires_contact_leader', label: 'Être contacté par téléphone ou rendez-vous' },
                                                { key: 'desires_impact_group', label: "Intégrer un Groupe d'Impact" },
                                                { key: 'desires_house_church', label: 'Intégrer une Église de Maison' },
                                                { key: 'desires_formation_001', label: 'Être inscrit à la formation Cours 001' },
                                            ].map(item => (
                                                <label key={item.key} className="flex items-center gap-3 p-4 bg-muted border border-border rounded-2xl cursor-pointer hover:border-primary transition-all group">
                                                    <input type="checkbox" checked={(visitorForm as any)[item.key]} onChange={e => setVisitorForm({...visitorForm, [item.key]: e.target.checked})} className="w-5 h-5 rounded-lg text-primary focus:ring-primary" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{item.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Info Requests */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Souhaitez-vous recevoir des informations sur :</h4>
                                        <div className="flex flex-wrap gap-4">
                                            <label className="flex items-center gap-3 p-4 bg-muted rounded-xl cursor-pointer border border-border hover:border-primary transition-all">
                                                <input type="checkbox" checked={visitorForm.info_request_mui} onChange={e => setVisitorForm({...visitorForm, info_request_mui: e.target.checked})} className="w-4 h-4 text-primary focus:ring-primary" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Le ministère des Jeunes d'Impact (MUI)</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-4 bg-muted rounded-xl cursor-pointer border border-border hover:border-primary transition-all">
                                                <input type="checkbox" checked={visitorForm.info_request_events} onChange={e => setVisitorForm({...visitorForm, info_request_events: e.target.checked})} className="w-4 h-4 text-primary focus:ring-primary" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Les prochains évènements (séminaires...)</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* GS & Comments */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Souhaitez-vous intégrer un Groupe de Suivi (GS) ?</label>
                                            <div className="flex gap-4">
                                                <button type="button" onClick={() => setVisitorForm({ ...visitorForm, join_gs: true })} className={cn("px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all", visitorForm.join_gs ? "bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/20" : "bg-muted border-border text-muted-foreground")}>Oui</button>
                                                <button type="button" onClick={() => setVisitorForm({ ...visitorForm, join_gs: false })} className={cn("px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all", !visitorForm.join_gs ? "bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-500/20" : "bg-muted border-border text-muted-foreground")}>Non</button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Commentaire / Besoin particulier</label>
                                            <textarea value={visitorForm.comments} onChange={e => setVisitorForm({ ...visitorForm, comments: e.target.value })} className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground h-24 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ex: Besoin de prière..." />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-4 pt-8 border-t border-border">
                                        <button type="button" onClick={() => setShowRegisterModal(false)} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted rounded-2xl transition-all">Annuler</button>
                                        <button type="submit" disabled={saving} className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50">
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
