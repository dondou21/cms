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
    X
} from 'lucide-react';
import api from '../services/api';
import { cn } from '../lib/utils';

export default function MembersPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
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
            setFormData({ first_name: '', last_name: '', email: '', phone: '', address: '', status: 'active', department_id: '' });
        } catch (err) {
            console.error('Failed to add member', err);
        }
    };

    const filteredMembers = members.filter(m =>
        `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        m.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Members Directory</h1>
                    <p className="text-muted-foreground mt-1">Manage and organize your church members.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Add New Member
                </button>
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-2 rounded-2xl w-full max-w-md">
                <div className="pl-3">
                    <Search className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                    type="text"
                    placeholder="Search members by name or email..."
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
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Member</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Contact</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Department</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
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
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {member.first_name[0]}{member.last_name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{member.first_name} {member.last_name}</div>
                                                    <div className="text-xs text-muted-foreground">Joined {new Date(member.created_at).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm space-y-1">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {member.email || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {member.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm">{member.department_name || 'Unassigned'}</span>
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
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No members found matching your search.
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
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold gradient-text">Add New Member</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground ml-1">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground ml-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground ml-1">Phone</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground ml-1">Address</label>
                                    <textarea
                                        rows={2}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2.5 rounded-xl font-semibold border border-white/10 hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                                    >
                                        Save Member
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
