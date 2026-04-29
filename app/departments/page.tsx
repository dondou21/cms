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
    Info,
    Crown,
    Clock,
    Calendar,
    ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../lib/i18n';
import { cn } from '../lib/utils';

export default function DepartmentsPage() {
    const { t } = useLanguage();
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedDept, setSelectedDept] = useState<any>(null);
    const [deptDetails, setDeptDetails] = useState<{ roles: any[], programs: any[] }>({ roles: [], programs: [] });
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [roleForm, setRoleForm] = useState({ member_id: '', role_name: '' });
    const [progForm, setProgForm] = useState({ day_of_week: 'Monday', time: '', activity: '' });
    const [members, setMembers] = useState<any[]>([]);

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

    const fetchDeptDetails = async (id: number) => {
        try {
            const response = await api.get(`/departments/${id}/details`);
            setDeptDetails(response.data);
        } catch (err) {
            console.error('Failed to fetch department details', err);
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
        fetchDepartments();
        fetchMembers();
    }, []);

    useEffect(() => {
        if (selectedDept) {
            fetchDeptDetails(selectedDept.id);
        }
    }, [selectedDept]);

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
                            onClick={() => {
                                setSelectedDept(dept);
                                setShowDetails(true);
                            }}
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
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-10 font-medium leading-relaxed">
                                {dept.description || 'No description provided for this department.'}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <Crown className="w-3.5 h-3.5" />
                                    <span>Leaders & Programs</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                    Détails <ArrowRight className="w-3 h-3" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Department Details Modal */}
            <AnimatePresence mode="wait">
                {showDetails && selectedDept && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDetails(false)}
                            className="absolute inset-0 bg-background/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-4xl bg-card rounded-none relative z-10 shadow-2xl border border-border flex flex-col md:flex-row"
                        >
                            {/* Left Panel: Roles */}
                            <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-border">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">{selectedDept.name}</h2>
                                    <button onClick={() => setShowDetails(false)} className="md:hidden"><X className="w-6 h-6" /></button>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Leaders & Rôles</h4>
                                        <div className="flex gap-2">
                                            <select 
                                                value={roleForm.member_id}
                                                onChange={e => setRoleForm({ ...roleForm, member_id: e.target.value })}
                                                className="bg-muted border-none text-[8px] font-black uppercase px-2 py-1 outline-none"
                                            >
                                                <option value="">Membre</option>
                                                {members.map(m => (
                                                    <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
                                                ))}
                                            </select>
                                            <input 
                                                placeholder="Rôle (ex: Leader)" 
                                                value={roleForm.role_name}
                                                onChange={e => setRoleForm({ ...roleForm, role_name: e.target.value })}
                                                className="bg-muted border-none text-[8px] font-black uppercase px-2 py-1 outline-none w-24"
                                            />
                                            <button 
                                                onClick={async () => {
                                                    if (roleForm.member_id && roleForm.role_name) {
                                                        await api.post(`/departments/${selectedDept.id}/roles`, roleForm);
                                                        setRoleForm({ member_id: '', role_name: '' });
                                                        fetchDeptDetails(selectedDept.id);
                                                    }
                                                }}
                                                className="bg-primary text-white p-1"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {deptDetails.roles.map(role => (
                                            <div key={role.id} className="flex items-center justify-between bg-muted/50 p-4 border border-border">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-primary/20 text-primary flex items-center justify-center">
                                                        <Crown className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-primary">{role.role_name}</p>
                                                        <p className="text-[9px] font-bold text-foreground">{role.first_name} {role.last_name}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={async () => {
                                                        await api.delete(`/departments/${selectedDept.id}/roles/${role.id}`);
                                                        fetchDeptDetails(selectedDept.id);
                                                    }}
                                                    className="text-rose-500"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Programs */}
                            <div className="flex-1 p-8 bg-muted/30">
                                <div className="flex items-center justify-between mb-8">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Programme Hebdomadaire</h4>
                                    <button onClick={() => setShowDetails(false)} className="hidden md:block text-foreground"><X className="w-6 h-6" /></button>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-2">
                                        <select 
                                            value={progForm.day_of_week}
                                            onChange={e => setProgForm({ ...progForm, day_of_week: e.target.value })}
                                            className="bg-muted border border-border text-[8px] font-black uppercase px-2 py-2 outline-none"
                                        >
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                        <input 
                                            type="time" 
                                            value={progForm.time}
                                            onChange={e => setProgForm({ ...progForm, time: e.target.value })}
                                            className="bg-muted border border-border text-[8px] font-black px-2 py-2 outline-none"
                                        />
                                        <input 
                                            placeholder="Activité" 
                                            value={progForm.activity}
                                            onChange={e => setProgForm({ ...progForm, activity: e.target.value })}
                                            className="col-span-2 bg-muted border border-border text-[8px] font-black uppercase px-2 py-2 outline-none"
                                        />
                                        <button 
                                            onClick={async () => {
                                                if (progForm.time && progForm.activity) {
                                                    await api.post(`/departments/${selectedDept.id}/programs`, progForm);
                                                    setProgForm({ day_of_week: 'Monday', time: '', activity: '' });
                                                    fetchDeptDetails(selectedDept.id);
                                                }
                                            }}
                                            className="col-span-2 bg-primary text-white py-2 font-black text-[9px] uppercase tracking-widest"
                                        >
                                            Ajouter au Programme
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {deptDetails.programs.map(prog => (
                                            <div key={prog.id} className="flex items-center justify-between bg-card p-3 border border-border">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-primary/10 text-primary flex items-center justify-center">
                                                        <Clock className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-primary">{prog.day_of_week} | {prog.time}</p>
                                                        <p className="text-[9px] font-bold text-muted-foreground">{prog.activity}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={async () => {
                                                        await api.delete(`/departments/${selectedDept.id}/programs/${prog.id}`);
                                                        fetchDeptDetails(selectedDept.id);
                                                    }}
                                                    className="text-rose-500"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
