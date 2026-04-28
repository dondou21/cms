'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarDays,
    Plus,
    MapPin,
    Clock,
    Users,
    BarChart,
    Edit,
    Trash2,
    X,
    Calendar as CalendarIcon
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../lib/i18n';
import { cn } from '../lib/utils';

export default function EventsPage() {
    const { t } = useLanguage();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: ''
    });

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data);
        } catch (err) {
            console.error('Failed to fetch events', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowModal(false);
            fetchEvents();
            setFormData({ title: '', description: '', date: '', time: '', location: '' });
        } catch (err) {
            console.error('Failed to add event', err);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tight">{t('nav.events')}</h1>
                    <p className="text-muted-foreground mt-1">Schedule and manage your services and community gatherings.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-white px-6 py-2.5 rounded-none font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shadow-xl shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Schedule Event
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-24 bg-card rounded-none animate-pulse border border-border" />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {events.map((event) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-card p-6 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-all border border-border shadow-sm"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-none flex flex-col items-center justify-center text-primary border border-primary/20">
                                    <span className="text-[10px] font-black uppercase tracking-widest">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-2xl font-black leading-none">{new Date(event.date).getDate()}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{event.title}</h3>
                                    <div className="flex flex-wrap items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            <Clock className="w-3.5 h-3.5" />
                                            {event.time?.substring(0, 5) || 'TBA'}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {event.location || 'Church Main Hall'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-none bg-muted text-[10px] font-black uppercase tracking-widest hover:bg-muted/80 transition-colors text-foreground border border-border">
                                    <Users className="w-3.5 h-3.5" />
                                    Register
                                </button>
                                <div className="w-px h-8 bg-border mx-2" />
                                <button className="p-2 hover:bg-muted rounded-none text-muted-foreground transition-colors">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-destructive/10 rounded-none text-destructive transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add Event Modal */}
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
                                <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Schedule New Event</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-muted rounded-none transition-colors text-foreground"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAddEvent} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Event Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Sunday Morning Service"
                                        className="w-full bg-muted border-transparent rounded-none px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-foreground"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date</label>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="date"
                                                required
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full bg-muted border-transparent rounded-none pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-foreground"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="time"
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                className="w-full bg-muted border-transparent rounded-none pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-foreground"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="e.g. Main Auditorium"
                                            className="w-full bg-muted border-transparent rounded-none pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-foreground"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Short summary of the event..."
                                        className="w-full bg-muted border-transparent rounded-none px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none text-sm font-bold text-foreground"
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
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
                                        Create Event
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
