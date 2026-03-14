'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Save, Users, Search } from 'lucide-react';
import api from '../services/api';

export default function AttendancePage() {
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [attendanceCount, setAttendanceCount] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data);
            if (response.data.length > 0) {
                const initialEvent = response.data[0];
                setSelectedEventId(initialEvent.id.toString());
                setAttendanceCount(initialEvent.attendance_count?.toString() || '0');
            }
        } catch (err) {
            console.error('Failed to fetch events', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEventSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedEventId(id);
        const ev = events.find(event => event.id.toString() === id);
        if (ev) {
            setAttendanceCount(ev.attendance_count?.toString() || '0');
        }
    };

    const handleSave = async () => {
        if (!selectedEventId || !attendanceCount) return;
        setSaving(true);
        try {
            await api.put(`/events/${selectedEventId}/attendance`, { count: parseInt(attendanceCount, 10) });
            // Update local state
            setEvents(prev => prev.map(ev => ev.id.toString() === selectedEventId ? { ...ev, attendance_count: parseInt(attendanceCount, 10) } : ev));
            alert('Attendance saved successfully');
        } catch (err) {
            console.error('Failed to save attendance', err);
            alert('Failed to save attendance');
        } finally {
            setSaving(false);
        }
    };

    const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    const selectedEvent = events.find(e => e.id.toString() === selectedEventId);

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Attendance Tracking</h1>
                <p className="text-gray-500 mt-1">Record the total number of attendees for your services and events.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Event Selector / Input Area */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-primary" />
                            Select Event
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Event</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 font-medium appearance-none"
                                    value={selectedEventId}
                                    onChange={handleEventSelect}
                                >
                                    {events.map(ev => (
                                        <option key={ev.id} value={ev.id}>{new Date(ev.date).toLocaleDateString()} - {ev.title}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedEvent && (
                                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">{selectedEvent.title}</h4>
                                    <p className="text-xs text-gray-500">{new Date(selectedEvent.date).toLocaleDateString()} • {selectedEvent.location}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Total Attendees</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 pl-10 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
                                        value={attendanceCount}
                                        onChange={(e) => setAttendanceCount(e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving || !selectedEventId}
                                className="w-full bg-primary text-white font-bold py-3 p-3 rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? 'Saving...' : 'Save Attendance'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Events List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Recent Service Records</h3>
                            <div className="relative w-64">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto p-0">
                            <table className="w-full text-left text-sm text-gray-500">
                                <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-bold sticky top-0">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Event Title</th>
                                        <th className="px-6 py-4 text-center">Attendees recorded</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {filteredEvents.map((evt) => (
                                        <tr key={evt.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                {new Date(evt.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{evt.title}</div>
                                                <div className="text-xs text-gray-400">{evt.location}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {evt.attendance_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => setSelectedEventId(evt.id.toString())}
                                                    className="text-primary hover:text-primary/80 font-bold text-sm"
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredEvents.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                No events found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
