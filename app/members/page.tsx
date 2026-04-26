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
import { cn } from '../lib/utils';

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
        
        const headers = ['Title', 'First Name', 'Last Name', 'Email', 'Phone', 'Address', 'Age Range', 'Marital Status', 'Invited By', 'Accepted Christ', 'Wants to Join', 'Status', 'Joined Date'];
        const csvRows = members.map(m => [
            `"${m.civilite || ''}"`,
            `"${(m.first_name || '').replace(/"/g, '""')}"`,
            `"${(m.last_name || '').replace(/"/g, '""')}"`,
            `"${(m.email || '').replace(/"/g, '""')}"`,
            `"${(m.phone || '').replace(/"/g, '""')}"`,
            `"${(m.address || '').replace(/"/g, '""')}"`,
            `"${m.age_range || ''}"`,
            `"${m.marital_status || ''}"`,
            `"${m.invited_by || ''}"`,
            `"${m.accepted_christ ? 'Yes' : 'No'}"`,
            `"${m.want_to_join_icc ? 'Yes' : 'No'}"`,
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
                    <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">{t('members.title')}</h1>
                    <p className="text-muted-foreground mt-1">Manage and connect with your church family.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="bg-card border border-border text-foreground px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-muted transition-colors whitespace-nowrap"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shadow-xl shadow-primary/20"
                    >
                        <Plus className="w-4 h-4" />
                        {t('members.add_member')}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-card border border-border p-2 rounded-2xl w-full max-w-md shadow-sm">
                <div className="pl-3">
                    <Search className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                    type="text"
                    placeholder={t('members.search')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-sm w-full py-2 placeholder:text-muted-foreground text-foreground font-medium"
                />
            </div>

            <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border bg-muted">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('members.first_name')} / {t('members.last_name')}</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('members.email')} / {t('members.phone')}</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('members.age_range')}</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('members.status')}</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-foreground">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-10 w-40 bg-muted rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-10 w-32 bg-muted rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-10 w-24 bg-muted rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 bg-muted rounded-full" /></td>
                                        <td className="px-6 py-4"><div className="h-8 w-8 bg-muted rounded" /></td>
                                    </tr>
                                ))
                            ) : filteredMembers.length > 0 ? (
                                filteredMembers.map((member) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={member.id}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] border border-primary/20">
                                                    {member.civilite}
                                                </div>
                                                <div>
                                                    <div className="font-black text-sm uppercase tracking-tight">{member.first_name} {member.last_name}</div>
                                                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{member.marital_status || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-[10px] font-black uppercase tracking-widest space-y-1 text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-3 h-3 text-primary" />
                                                    {member.email || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-3 h-3 text-primary" />
                                                    {member.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">
                                            {member.age_range || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                member.status === 'active' ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"
                                            )}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-xs font-black uppercase tracking-widest">
                                        {t('members.no_members_found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Member Modal */}
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
                            className="w-full max-w-2xl bg-card rounded-3xl p-8 relative z-10 shadow-2xl border border-border"
                        >
                            <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                                <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">{t('members.add_member')}</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-muted rounded-full transition-colors text-foreground"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAddMember} className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('members.civilite')}</label>
                                        <select
                                            value={formData.civilite}
                                            onChange={(e) => setFormData({ ...formData, civilite: e.target.value })}
                                            className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                        >
                                            <option value="Mr" className="bg-card">Mr</option>
                                            <option value="Mme" className="bg-card">Mme</option>
                                            <option value="Mlle" className="bg-card">Mlle</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('members.first_name')}</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                            className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('members.last_name')}</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                            className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('members.email')}</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('members.phone')}</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1 mb-6">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('members.address')}</label>
                                    <textarea
                                        rows={1}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('members.age_range')}</label>
                                        <select
                                            value={formData.age_range}
                                            onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
                                            className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                        >
                                            <option value="" className="bg-card">Select Range</option>
                                            <option value="Moins de 18 ans" className="bg-card">Moins de 18 ans</option>
                                            <option value="18-24 ans" className="bg-card">18-24 ans</option>
                                            <option value="25-30 ans" className="bg-card">25-30 ans</option>
                                            <option value="31-35 ans" className="bg-card">31-35 ans</option>
                                            <option value="36-40 ans" className="bg-card">36-40 ans</option>
                                            <option value="41-45 ans" className="bg-card">41-45 ans</option>
                                            <option value="46-50 ans" className="bg-card">46-50 ans</option>
                                            <option value="Plus de 50 ans" className="bg-card">Plus de 50 ans</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('members.marital_status')}</label>
                                        <select
                                            value={formData.marital_status}
                                            onChange={(e) => setFormData({ ...formData, marital_status: e.target.value })}
                                            className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                        >
                                            <option value="" className="bg-card">Select Status</option>
                                            <option value="Célibataire" className="bg-card">Célibataire</option>
                                            <option value="Marié(e)" className="bg-card">Marié(e)</option>
                                            <option value="En couple" className="bg-card">En couple</option>
                                            <option value="Séparé(e)" className="bg-card">Séparé(e)</option>
                                            <option value="Veuf(ve)" className="bg-card">Veuf(ve)</option>
                                            <option value="Divorcé(e)" className="bg-card">Divorcé(e)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('members.invited_by')}</label>
                                        <select
                                            value={formData.invited_by}
                                            onChange={(e) => setFormData({ ...formData, invited_by: e.target.value })}
                                            className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                        >
                                            <option value="" className="bg-card">Select Option</option>
                                            <option value="Connaissance" className="bg-card">Une connaissance</option>
                                            <option value="Flyer" className="bg-card">Flyer, affiche...</option>
                                            <option value="Internet" className="bg-card">Internet</option>
                                            <option value="Saint-Esprit" className="bg-card">Saint-Esprit</option>
                                            <option value="Autre" className="bg-card">Autre</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-3 bg-muted p-4 rounded-xl border border-border">
                                        <input
                                            type="checkbox"
                                            id="accepted_christ"
                                            checked={formData.accepted_christ}
                                            onChange={(e) => setFormData({ ...formData, accepted_christ: e.target.checked })}
                                            className="w-4 h-4 rounded border-border bg-card text-primary focus:ring-primary"
                                        />
                                        <label htmlFor="accepted_christ" className="text-[10px] font-black uppercase tracking-widest text-foreground">{t('members.accepted_christ')}</label>
                                    </div>
                                    <div className="flex items-center gap-3 bg-muted p-4 rounded-xl border border-border">
                                        <input
                                            type="checkbox"
                                            id="want_to_join_icc"
                                            checked={formData.want_to_join_icc}
                                            onChange={(e) => setFormData({ ...formData, want_to_join_icc: e.target.checked })}
                                            className="w-4 h-4 rounded border-border bg-card text-primary focus:ring-primary"
                                        />
                                        <label htmlFor="want_to_join_icc" className="text-[10px] font-black uppercase tracking-widest text-foreground">{t('members.want_to_join')}</label>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-6">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('members.comments')}</label>
                                    <textarea
                                        rows={2}
                                        value={formData.comments}
                                        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                        className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] border border-border hover:bg-muted transition-colors text-foreground"
                                    >
                                        {t('members.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-opacity shadow-xl shadow-primary/20"
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
