'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Plus,
    Users,
    Edit3,
    Trash2,
    X,
    ChevronRight,
    Info
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../lib/i18n';
import { cn } from '../lib/utils';

export default function DepartmentsPage() {
    const { t } = useLanguage();
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data);
        } catch (err) {
            console.error('Failed to fetch departments', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleAddDept = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/departments', formData);
            setShowModal(false);
            fetchDepartments();
            setFormData({ name: '', description: '' });
        } catch (err) {
            console.error('Failed to add department', err);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tight">{t('nav.departments')}</h1>
                    <p className="text-muted-foreground mt-1">Organize your church members into specialized groups.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-white px-6 py-2.5 rounded-none font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shadow-xl shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Create Department
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-48 bg-card rounded-none animate-pulse border border-border" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.map((dept) => (
                        <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card p-6 rounded-none group hover:border-primary transition-all cursor-pointer relative overflow-hidden border border-border shadow-sm"
                        >
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-none group-hover:scale-150 transition-transform duration-700" />

                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-none flex items-center justify-center border border-primary/20">
                                    <Building2 className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 hover:bg-muted rounded-none text-muted-foreground">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-2">{dept.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-10 font-medium">
                                {dept.description || 'No description provided for this department.'}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>Members</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add Department Modal */}
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
                            className="w-full max-w-lg bg-card rounded-none p-8 relative z-10 shadow-2xl border border-border"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">New Department</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-muted rounded-none transition-colors text-foreground"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAddDept} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Department Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Worship Team, Ushering"
                                        className="w-full bg-muted border-transparent rounded-none px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-foreground"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe the purpose of this ministry..."
                                        className="w-full bg-muted border-transparent rounded-none px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none font-bold text-foreground text-sm"
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-4">
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
                                        Save Department
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
