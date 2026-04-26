'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Search,
    Plus,
    Mail,
    Phone,
    MapPin,
    MoreVertical,
    Edit2,
    Trash2,
    X,
    Download
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../lib/i18n';

export default function MembersPage() {
    const { t, language, setLanguage } = useLanguage();
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        civilite: 'Mr',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        invited_by: '',
        age_range: '',
        marital_status: '',
        accepted_christ: false,
        want_accompaniment: false,
        usual_church: false,
        want_to_join_icc: false,
        interests: '',
        info_on: '',
        join_gs: false,
        comments: '',
        department_id: ''
    });

    const fetchMembers = async () => {
        try {
            const response = await api.get('/members');
            setMembers(response.data);
        } catch (err) {
            console.error('Failed to fetch members', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/members', formData);
            setShowModal(false);
            fetchMembers();
            setFormData({
                civilite: 'Mr',
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                address: '',
                invited_by: '',
                age_range: '',
                marital_status: '',
                accepted_christ: false,
                want_accompaniment: false,
                usual_church: false,
                want_to_join_icc: false,
                interests: '',
                info_on: '',
                join_gs: false,
                comments: '',
                department_id: ''
            });
        } catch (err) {
            console.error('Failed to add member', err);
        }
    };

    const handleExportCSV = () => {
        if (members.length === 0) return;
        
        const headers = ['Title', 'First Name', 'Last Name', 'Email', 'Phone', 'Address', 'Age Range', 'Status', 'Joined Date'];
        const csvRows = members.map(m => [
            `"${m.civilite || ''}"`,
            `"${(m.first_name || '').replace(/"/g, '""')}"`,
            `"${(m.last_name || '').replace(/"/g, '""')}"`,
            `"${(m.email || '').replace(/"/g, '""')}"`,
            `"${(m.phone || '').replace(/"/g, '""')}"`,
            `"${(m.address || '').replace(/"/g, '""')}"`,
            `"${m.age_range || ''}"`,
            `"${(m.status || '').replace(/"/g, '""')}"`,
            `"${new Date(m.created_at).toLocaleDateString()}"`
        ].join(','));
        
        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'church_members_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredMembers = members.filter(m =>
        `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        m.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">{t('members.title')}</h1>
                    <div className="flex gap-2 mt-2">
                        <button 
                            onClick={() => setLanguage('fr')}
                            className={cn("px-2 py-1 text-xs rounded", language === 'fr' ? "bg-primary text-primary-foreground" : "bg-white/5")}
                        >FR</button>
                        <button 
                            onClick={() => setLanguage('en')}
                            className={cn("px-2 py-1 text-xs rounded", language === 'en' ? "bg-primary text-primary-foreground" : "bg-white/5")}
                        >EN</button>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="bg-white/5 border border-white/10 text-foreground px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors whitespace-nowrap"
                    >
                        <Download className="w-5 h-5" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-5 h-5" />
                        {t('members.add_member')}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-2 rounded-2xl w-full max-w-md">
                <div className="pl-3">
                    <Search className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                    type="text"
                    placeholder={t('members.search')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-sm w-full py-2 placeholder:text-muted-foreground"
                />
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">{t('members.first_name')} / {t('members.last_name')}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">{t('members.email')} / {t('members.phone')}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">{t('members.age_range')}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">{t('members.status')}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-10 w-40 bg-white/5 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-10 w-32 bg-white/5 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-10 w-24 bg-white/5 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 bg-white/5 rounded-full" /></td>
                                        <td className="px-6 py-4"><div className="h-8 w-8 bg-white/5 rounded" /></td>
                                    </tr>
                                ))
                            ) : filteredMembers.length > 0 ? (
                                filteredMembers.map((member) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={member.id}
                                        className="hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {member.civilite}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm">{member.first_name} {member.last_name}</div>
                                                    <div className="text-[10px] text-muted-foreground uppercase">{member.marital_status || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs space-y-1 text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-3 h-3" />
                                                    {member.email || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-3 h-3" />
                                                    {member.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {member.age_range || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                member.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                                            )}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-1 hover:bg-white/10 rounded transition-colors text-muted-foreground">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm">
                                        {t('members.no_members_found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Member Modal */}
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
                            className="w-full max-w-2xl glass-card rounded-3xl p-8 relative z-10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold gradient-text">{t('members.add_member')}</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAddMember} className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('members.civilite')}</label>
                                        <select
                                            value={formData.civilite}
                                            onChange={(e) => setFormData({ ...formData, civilite: e.target.value })}
                                            className="w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                        >
                                            <option value="Mr">Mr</option>
                                            <option value="Mme">Mme</option>
                                            <option value="Mlle">Mlle</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('members.first_name')}</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                            className="w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('members.last_name')}</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                            className="w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('members.email')}</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('members.phone')}</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1 mb-6">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('members.address')}</label>
                                    <textarea
                                        rows={1}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('members.age_range')}</label>
                                        <select
                                            value={formData.age_range}
                                            onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
                                            className="w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                        >
                                            <option value="">Select Range</option>
                                            <option value="Moins de 18 ans">Moins de 18 ans</option>
                                            <option value="18-24 ans">18-24 ans</option>
                                            <option value="25-30 ans">25-30 ans</option>
                                            <option value="31-35 ans">31-35 ans</option>
                                            <option value="36-40 ans">36-40 ans</option>
                                            <option value="41-45 ans">41-45 ans</option>
                                            <option value="46-50 ans">46-50 ans</option>
                                            <option value="Plus de 50 ans">Plus de 50 ans</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('members.marital_status')}</label>
                                        <select
                                            value={formData.marital_status}
                                            onChange={(e) => setFormData({ ...formData, marital_status: e.target.value })}
                                            className="w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Célibataire">Célibataire</option>
                                            <option value="Marié(e)">Marié(e)</option>
                                            <option value="En couple">En couple</option>
                                            <option value="Séparé(e)">Séparé(e)</option>
                                            <option value="Veuf(ve)">Veuf(ve)</option>
                                            <option value="Divorcé(e)">Divorcé(e)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('members.invited_by')}</label>
                                        <select
                                            value={formData.invited_by}
                                            onChange={(e) => setFormData({ ...formData, invited_by: e.target.value })}
                                            className="w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                        >
                                            <option value="">Select Option</option>
                                            <option value="Connaissance">Une connaissance</option>
                                            <option value="Flyer">Flyer, affiche...</option>
                                            <option value="Internet">Internet</option>
                                            <option value="Saint-Esprit">Saint-Esprit</option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                        <input
                                            type="checkbox"
                                            id="accepted_christ"
                                            checked={formData.accepted_christ}
                                            onChange={(e) => setFormData({ ...formData, accepted_christ: e.target.checked })}
                                            className="w-4 h-4 rounded border-white/10 bg-background text-primary focus:ring-primary"
                                        />
                                        <label htmlFor="accepted_christ" className="text-xs font-semibold">{t('members.accepted_christ')}</label>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                        <input
                                            type="checkbox"
                                            id="want_to_join_icc"
                                            checked={formData.want_to_join_icc}
                                            onChange={(e) => setFormData({ ...formData, want_to_join_icc: e.target.checked })}
                                            className="w-4 h-4 rounded border-white/10 bg-background text-primary focus:ring-primary"
                                        />
                                        <label htmlFor="want_to_join_icc" className="text-xs font-semibold">{t('members.want_to_join')}</label>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-6">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('members.comments')}</label>
                                    <textarea
                                        rows={2}
                                        value={formData.comments}
                                        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                        className="w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2 rounded-xl font-semibold border border-white/10 hover:bg-white/5 transition-colors text-sm"
                                    >
                                        {t('members.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-primary text-primary-foreground px-8 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 text-sm"
                                    >
                                        {t('members.save')}
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
