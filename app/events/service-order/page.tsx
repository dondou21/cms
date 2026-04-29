'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Printer, Download, Plus, Trash2, ChevronLeft, Church, 
    Clock, User, MessageSquare, Info, FileText, X, Check, Eye, MessageCircle, ExternalLink, ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../lib/i18n';
import { cn } from '../../lib/utils';
import api from '../../services/api';
import { Document as DocxDocument, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

interface Sequence {
    id: string;
    start: string;
    end: string;
    subject: string;
    duration: string;
    intervenants: string;
    type?: 'normal' | 'offering' | 'announcement';
}

interface ServiceCulte {
    id: string;
    title: string;
    sequences: Sequence[];
}

interface AnnouncementItem {
    id: string;
    title: string;
    date: string;
    start: string;
    end: string;
    description: string;
}

export default function ServiceOrderPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('Auditorium HOG, Kacyiru');
    const [theme, setTheme] = useState('2024, ANNEE DE LA CROISSANCE CONTINUE EN CHRIST');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
    const [services, setServices] = useState<ServiceCulte[]>([
        { 
            id: '1', 
            title: '1ER CULTE', 
            sequences: [
                { id: 'seq-1', start: '07:45', end: '08:00', subject: 'Prière d\'intercession', duration: '15\'', intervenants: 'Intercesseur', type: 'normal' },
                { id: 'seq-2', start: '08:00', end: '08:30', subject: 'Louanges et Adorations', duration: '30\'', intervenants: 'M.U.A', type: 'normal' },
            ] 
        }
    ]);

    const [eventsList, setEventsList] = useState<any[]>([]); // New Events Section
    const [annoncesPool, setAnnoncesPool] = useState<AnnouncementItem[]>([
        { 
            id: 'ann-1', 
            title: 'DIME & OFFRANDES', 
            date: '', 
            start: '', 
            end: '', 
            description: "Notre culte est aussi un moment de notre culte où nous apportons dans la maison de Dieu nos Dîmes et nos Offrandes. C'est un acte d'adoration, une reconnaissance à l'Eternel de la fidélité que Dieu nous témoigne chaque jour.\n\n📖 Malachie 3:10-11: Apportez à la maison du trésor toutes les dîmes, afin qu'il y ait de la nourriture dans ma maison; mettez-moi de la sorte à l'épreuve... et vous verrez si je n'ouvre pas pour vous les écluses des cieux...\n\n📖 2 Corinthiens 9:7: Que chacun donne comme il l'a résolu en son coeur, sans tristesse ni contrainte; car Dieu aime celui qui donne avec joie."
        },
    ]);

    const [newAnnonce, setNewAnnonce] = useState({ title: '', date: '', start: '', end: '', description: '' });

    const [savedOrders, setSavedOrders] = useState<any[]>([]);

    const fetchInitialData = async () => {
        try {
            const [eventsRes, ordersRes] = await Promise.all([
                api.get('/events'),
                api.get('/service-orders')
            ]);
            setEvents(eventsRes.data);
            setSavedOrders(ordersRes.data);
        } catch (err) {
            console.error('Failed to fetch data', err);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const calculateDuration = (start: string, end: string): string => {
        if (!start || !end) return '';
        const [h1, m1] = start.split(':').map(Number);
        const [h2, m2] = end.split(':').map(Number);
        let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (diff < 0) diff += 24 * 60; // Handle overnight
        return `${diff}'`;
    };

    const handleSave = async () => {
        try {
            await api.post('/service-orders', {
                event_id: selectedEventId || null,
                title,
                date,
                description,
                location,
                theme,
                sequences: services,
                events_list: eventsList,
                announcements: annoncesPool
            });
            fetchInitialData();
        } catch (err) {
            console.error('Failed to save service order', err);
        }
    };

    const addService = () => {
        setServices([...services, { 
            id: Date.now().toString(), 
            title: `${services.length + 1}${services.length === 0 ? 'ER' : 'ÈME'} CULTE`, 
            sequences: [] 
        }]);
    };

    const removeService = (id: string) => {
        setServices(services.filter(s => s.id !== id));
    };

    const addSequence = (serviceId: string, template?: any) => {
        setServices(services.map(s => {
            if (s.id === serviceId) {
                return {
                    ...s,
                    sequences: [...s.sequences, template || { 
                        id: Date.now().toString(), 
                        start: '', 
                        end: '', 
                        subject: '', 
                        duration: '', 
                        intervenants: '',
                        type: 'normal'
                    }]
                };
            }
            return s;
        }));
    };

    const updateSequence = (serviceId: string, seqId: string, field: keyof Sequence, value: string) => {
        setServices(services.map(s => {
            if (s.id === serviceId) {
                return {
                    ...s,
                    sequences: s.sequences.map(seq => {
                        if (seq.id === seqId) {
                            const updated = { ...seq, [field]: value };
                            if (field === 'start' || field === 'end') {
                                updated.duration = calculateDuration(updated.start, updated.end);
                            }
                            return updated;
                        }
                        return seq;
                    })
                };
            }
            return s;
        }));
    };

    const injectAnnouncement = (ann: AnnouncementItem) => {
        if (services.length === 0) return;
        // Default to first service for now
        const serviceId = services[0].id;
        addSequence(serviceId, {
            id: Date.now().toString(),
            start: '',
            end: '',
            subject: ann.title,
            duration: '',
            intervenants: 'Animateur',
            type: 'announcement'
        });
    };

    const handleEventSelect = (eventId: string) => {
        setSelectedEventId(eventId);
        const event = events.find(e => e.id.toString() === eventId);
        if (event) {
            setDate(new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase());
            setTitle(event.title.toUpperCase());
        }
    };

    const handlePrint = () => {
        handleSave();
        window.print();
    };

    const handleDownloadWord = async () => {
        const tableHeader = new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "DEBUT", bold: true, size: 20 })], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "FIN", bold: true, size: 20 })], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "INTITULÉ", bold: true, size: 20 })], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "DURÉE", bold: true, size: 20 })], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "INTERVENANTS", bold: true, size: 20 })], alignment: AlignmentType.CENTER })] }),
            ],
        });

        const tableRows = cult1.map(item => new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.start, size: 18 })], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.end, size: 18 })], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.subject, size: 18 })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.duration, size: 18 })], alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.intervenants, size: 18 })] })] }),
            ],
        }));

        const doc = new DocxDocument({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: "HOUSE OF GOD - KIGALI", bold: true, size: 32, color: "640D5F" }),
                        ],
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: title || "DÉROULÉ DES CULTES", bold: true, size: 24 }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 200, after: 400 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Date: ${date}`, size: 20 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Lieu: ${location}`, size: 20 }),
                        ],
                        spacing: { after: 400 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: description, size: 18, italic: true }),
                        ],
                        spacing: { after: 400 },
                    }),
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [tableHeader, ...tableRows],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "ANNONCES", bold: true, size: 28, color: "0000FF", underline: {} })],
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 800, after: 400 },
                    }),
                    ...annonces.flatMap(a => [
                        new Paragraph({
                            children: [new TextRun({ text: a.title, bold: true, size: 24, underline: {} })],
                            spacing: { before: 200 },
                        }),
                        ...(a.date || a.start || a.end ? [
                            new Paragraph({
                                children: [new TextRun({ text: `${a.date} ${a.start ? `de ${a.start}` : ''} ${a.end ? `à ${a.end}` : ''}`, size: 18, italic: true })],
                            })
                        ] : []),
                        ...a.description.split('\n').map(line => 
                            new Paragraph({
                                children: [new TextRun({ text: line, size: 18 })],
                            })
                        ),
                    ]),
                ],
            }],
        });

        handleSave();
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `Service_Order_${date.replace(/\s/g, '_')}.docx`);
    };

    const handleShareWhatsApp = () => {
        const text = `📋 DÉROULÉ DU SERVICE: ${title}\n📅 Date: ${date}\n📍 Lieu: ${location}\n✨ Thème: ${theme}\n\n[Document partagé via CMS House Of God]`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleShareEmail = () => {
        const subject = `Déroulé du service - ${title}`;
        const body = `Veuillez trouver ci-dessous les détails du déroulé pour le ${date}.\n\n📋 INTITULÉ: ${title}\n✨ THÈME: ${theme}\n📍 LIEU: ${location}\n\n[Document généré par CMS House Of God]`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const [showManualModal, setShowManualModal] = useState(false);
    const [manualForm, setManualForm] = useState({ date: '', title: '', description: '' });

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setDate(manualForm.date);
        setTitle(manualForm.title);
        setDescription(manualForm.description);
        setShowManualModal(false);
    };

    return (
        <div className="space-y-8 pb-20 no-print">
            <div className="flex items-center justify-between">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm">
                    <ChevronLeft className="w-4 h-4" />
                    {t('nav.events')}
                </button>
                <div className="flex gap-4">
                    <button onClick={() => setShowConfirmModal(true)} className="bg-primary text-white px-8 py-3 rounded-none font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-primary/20">
                        <Eye className="w-4 h-4" />
                        Preview & Save
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card rounded-none border border-border shadow-sm p-8 space-y-8">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 text-foreground">
                                <FileText className="w-5 h-5 text-primary" />
                                Configuration du Déroulé
                            </h2>
                            <button 
                                onClick={() => setShowManualModal(true)}
                                className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-4 py-2 rounded-none hover:bg-primary/20 transition-all"
                            >
                                Saisir Manuellement
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Sélectionner un évènement planifié</label>
                                <select 
                                    value={selectedEventId} 
                                    onChange={(e) => handleEventSelect(e.target.value)}
                                    className="w-full bg-muted border-transparent rounded-none px-4 py-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                                >
                                    <option value="">-- Choisir un évènement --</option>
                                    {events.map(e => (
                                        <option key={e.id} value={e.id}>{new Date(e.date).toLocaleDateString()} - {e.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Charger un Déroulé sauvegardé</label>
                                <select 
                                    onChange={(e) => {
                                        const order = savedOrders.find(o => o.id.toString() === e.target.value);
                                        if (order) {
                                            setDate(order.date);
                                            setTitle(order.title);
                                            setDescription(order.description);
                                            setLocation(order.location);
                                            setTheme(order.theme);
                                            // Handle legacy data or new structure
                                            if (Array.isArray(order.sequences) && order.sequences[0]?.sequences) {
                                                setServices(order.sequences);
                                            } else {
                                                setServices([{ id: '1', title: 'CULTE', sequences: order.sequences }]);
                                            }
                                            setEventsList(order.events_list || []);
                                            setAnnoncesPool(order.announcements);
                                        }
                                    }}
                                    className="w-full bg-muted border-transparent rounded-none px-4 py-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                                >
                                    <option value="">-- Charger un historique --</option>
                                    {savedOrders.map(o => (
                                        <option key={o.id} value={o.id}>{o.date} - {o.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date d'impression</label>
                                    <input value={date} onChange={e => setDate(e.target.value)} placeholder="ex: 28 AVRIL 2024" className="w-full bg-muted border-transparent rounded-none px-4 py-3 text-sm font-bold text-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Titre du Déroulé</label>
                                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="ex: CULTE DE CÉLÉBRATION" className="w-full bg-muted border-transparent rounded-none px-4 py-3 text-sm font-bold text-foreground" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Informations Complémentaires / Description</label>
                                <textarea 
                                    value={description} 
                                    onChange={e => setDescription(e.target.value)} 
                                    placeholder="ex: Vendredi soir de prière - Thème spécifique..."
                                    className="w-full bg-muted border-transparent rounded-none px-4 py-3 text-sm font-bold text-foreground h-24 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-12">
                            {services.map((service, sIndex) => (
                                <div key={service.id} className="space-y-4 pt-6 border-t border-border first:border-t-0 first:pt-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/20 text-primary flex items-center justify-center font-black text-xs">
                                                {sIndex + 1}
                                            </div>
                                            <input 
                                                value={service.title}
                                                onChange={e => {
                                                    const newServices = [...services];
                                                    newServices[sIndex].title = e.target.value;
                                                    setServices(newServices);
                                                }}
                                                className="bg-transparent border-none text-sm font-black uppercase tracking-widest text-primary focus:ring-0 w-64"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => addSequence(service.id, { id: Date.now().toString(), start: '', end: '', subject: 'DÎMES & OFFRANDES', duration: '', intervenants: 'Animateur', type: 'offering' })}
                                                className="text-[9px] font-bold uppercase bg-secondary/10 text-secondary px-2 py-1 hover:bg-secondary/20 transition-all"
                                            >
                                                + Offrande
                                            </button>
                                            <button 
                                                onClick={() => addSequence(service.id, { id: Date.now().toString(), start: '', end: '', subject: 'LOUANGES & ADORATION', duration: '', intervenants: 'Groupe de Louange', type: 'normal' })}
                                                className="text-[9px] font-bold uppercase bg-blue-500/10 text-blue-500 px-2 py-1 hover:bg-blue-500/20 transition-all"
                                            >
                                                + Louange
                                            </button>
                                            <button 
                                                onClick={() => removeService(service.id)} 
                                                className="text-rose-500 p-1 hover:bg-rose-500/10 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto border border-border">
                                        <table className="w-full text-xs font-bold text-foreground">
                                            <thead className="bg-muted text-[10px] text-muted-foreground uppercase">
                                                <tr>
                                                    <th className="p-4 text-left w-24">Début</th>
                                                    <th className="p-4 text-left w-24">Fin</th>
                                                    <th className="p-4 text-left">Intitulé</th>
                                                    <th className="p-4 text-left w-20">Durée</th>
                                                    <th className="p-4 text-left">Intervenants</th>
                                                    <th className="p-4 w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {service.sequences.map((item) => (
                                                    <tr key={item.id} className={cn("hover:bg-muted/30", item.type === 'offering' ? "bg-secondary/5" : item.type === 'announcement' ? "bg-primary/5" : "")}>
                                                        <td className="p-1">
                                                            <input 
                                                                type="time"
                                                                value={item.start} 
                                                                onChange={e => updateSequence(service.id, item.id, 'start', e.target.value)} 
                                                                className="w-full bg-transparent p-2 rounded outline-none font-bold" 
                                                            />
                                                        </td>
                                                        <td className="p-1">
                                                            <input 
                                                                type="time"
                                                                value={item.end} 
                                                                onChange={e => updateSequence(service.id, item.id, 'end', e.target.value)} 
                                                                className="w-full bg-transparent p-2 rounded outline-none font-bold" 
                                                            />
                                                        </td>
                                                        <td className="p-1">
                                                            <input 
                                                                value={item.subject} 
                                                                onChange={e => updateSequence(service.id, item.id, 'subject', e.target.value)} 
                                                                className="w-full bg-transparent p-2 rounded outline-none" 
                                                                placeholder="Sujet..."
                                                            />
                                                        </td>
                                                        <td className="p-1 text-center font-mono text-[10px] text-muted-foreground">{item.duration}</td>
                                                        <td className="p-1">
                                                            <input 
                                                                value={item.intervenants} 
                                                                onChange={e => updateSequence(service.id, item.id, 'intervenants', e.target.value)} 
                                                                className="w-full bg-transparent p-2 rounded outline-none" 
                                                                placeholder="Intervenant..."
                                                            />
                                                        </td>
                                                        <td className="p-1">
                                                            <button 
                                                                onClick={() => {
                                                                    const newServices = [...services];
                                                                    newServices[sIndex].sequences = service.sequences.filter(x => x.id !== item.id);
                                                                    setServices(newServices);
                                                                }} 
                                                                className="text-rose-500 p-2 hover:bg-rose-500/10 transition-colors"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button 
                                        onClick={() => addSequence(service.id)} 
                                        className="bg-muted w-full py-2 text-[9px] font-black uppercase text-primary hover:bg-primary/10 flex items-center justify-center gap-2 transition-all border-x border-b border-border"
                                    >
                                        <Plus className="w-3 h-3" /> Ajouter une séquence
                                    </button>
                                </div>
                            ))}
                            
                            <button 
                                onClick={addService}
                                className="w-full py-6 border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-all flex flex-col items-center gap-2 group"
                            >
                                <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Ajouter un nouveau culte / transition</span>
                            </button>

                            {/* New Events Section */}
                            <div className="pt-12 border-t-2 border-primary/20 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Événements à venir</h3>
                                    <div className="flex gap-2">
                                        <select 
                                            onChange={(e) => {
                                                const ev = events.find(x => x.id.toString() === e.target.value);
                                                if (ev && !eventsList.find(x => x.id === ev.id)) {
                                                    setEventsList([...eventsList, ev]);
                                                }
                                            }}
                                            className="bg-muted border-none text-[10px] font-bold uppercase px-3 py-1 outline-none"
                                        >
                                            <option value="">Sélectionner un événement</option>
                                            {events.map(ev => (
                                                <option key={ev.id} value={ev.id}>{ev.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {eventsList.map(ev => (
                                        <div key={ev.id} className="flex items-center justify-between bg-muted/30 p-4 border border-border group">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-12 h-12 bg-primary/10 text-primary flex flex-col items-center justify-center font-black">
                                                    <span className="text-[10px]">{new Date(ev.date).toLocaleDateString('fr-FR', { day: '2-digit' })}</span>
                                                    <span className="text-[8px] uppercase">{new Date(ev.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-primary">{ev.title}</p>
                                                    <p className="text-[9px] text-muted-foreground">{ev.location} | {ev.time}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setEventsList(eventsList.filter(x => x.id !== ev.id))}
                                                className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {eventsList.length === 0 && (
                                        <div className="text-center py-8 border border-dashed border-border text-muted-foreground text-[10px] font-bold uppercase">
                                            Aucun événement ajouté au déroulé
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-card p-8 rounded-none border border-border shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-border pb-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-none flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-black uppercase tracking-tight text-foreground">Ajouter une Annonce</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Titre de l'annonce</label>
                                <input 
                                    value={newAnnonce.title} 
                                    onChange={e => setNewAnnonce({...newAnnonce, title: e.target.value})}
                                    className="w-full bg-muted border-transparent rounded-none px-4 py-3 text-sm font-bold text-foreground"
                                    placeholder="ex: ACTIONS DE GRÂCES"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</label>
                                    <input 
                                        value={newAnnonce.date} 
                                        onChange={e => setNewAnnonce({...newAnnonce, date: e.target.value})}
                                        className="w-full bg-muted border-transparent rounded-none px-4 py-2 text-xs font-bold text-foreground"
                                        placeholder="ex: Dimanche 28"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Début</label>
                                        <input 
                                            type="time"
                                            value={newAnnonce.start} 
                                            onChange={e => setNewAnnonce({...newAnnonce, start: e.target.value})}
                                            className="w-full bg-muted border-transparent rounded-none px-2 py-2 text-xs font-bold text-foreground"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fin</label>
                                        <input 
                                            type="time"
                                            value={newAnnonce.end} 
                                            onChange={e => setNewAnnonce({...newAnnonce, end: e.target.value})}
                                            className="w-full bg-muted border-transparent rounded-none px-2 py-2 text-xs font-bold text-foreground"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
                                <textarea 
                                    value={newAnnonce.description} 
                                    onChange={e => setNewAnnonce({...newAnnonce, description: e.target.value})}
                                    className="w-full bg-muted border-transparent rounded-none px-4 py-3 text-xs font-bold text-foreground h-32"
                                    placeholder="Détails de l'annonce..."
                                />
                            </div>
                            <button 
                                onClick={() => {
                                    if(newAnnonce.title && newAnnonce.description) {
                                        setAnnoncesPool([...annoncesPool, { ...newAnnonce, id: Date.now().toString() }]);
                                        setNewAnnonce({ title: '', date: '', start: '', end: '', description: '' });
                                    }
                                }}
                                className="w-full bg-primary text-white py-4 rounded-none font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
                            >
                                <Plus className="w-4 h-4" /> Créer l'annonce
                            </button>
                        </div>

                        <div className="pt-6 border-t border-border space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gestion des Annonces</h4>
                                <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5">{annoncesPool.length}</span>
                            </div>
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {annoncesPool.map(a => (
                                    <div key={a.id} className="bg-muted/50 p-4 rounded-none border border-border group relative transition-all hover:border-primary/50">
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => {
                                                    setNewAnnonce(a);
                                                    setAnnoncesPool(annoncesPool.filter(item => item.id !== a.id));
                                                }}
                                                className="text-blue-500 hover:scale-110"
                                                title="Modifier l'annonce"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => injectAnnouncement(a)}
                                                className="text-primary hover:scale-110"
                                                title="Injecter dans le déroulé"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setAnnoncesPool(annoncesPool.filter(item => item.id !== a.id))}
                                                className="text-rose-500 hover:scale-110"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="text-[10px] font-black text-primary uppercase pr-8">{a.title}</p>
                                        <p className="text-[9px] text-muted-foreground mt-1 line-clamp-3 italic leading-relaxed">{a.description}</p>
                                        <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center">
                                            <span className="text-[8px] font-bold text-muted-foreground uppercase">{a.date || 'Toutes dates'}</span>
                                            <button 
                                                onClick={() => injectAnnouncement(a)}
                                                className="text-[8px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:underline"
                                            >
                                                Injecter <ArrowRight className="w-2 h-2" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {annoncesPool.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground italic text-xs">
                                        Aucune annonce créée.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MANUAL ENTRY MODAL */}
            <AnimatePresence>
                {showManualModal && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card w-full max-w-md rounded-none p-8 border border-border shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Ajouter un Évènement</h3>
                                <button onClick={() => setShowManualModal(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleManualSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Titre de l'évènement</label>
                                    <input 
                                        required
                                        value={manualForm.title} 
                                        onChange={e => setManualForm({...manualForm, title: e.target.value})}
                                        className="w-full bg-muted border-transparent rounded-none px-4 py-3 text-sm font-bold text-foreground"
                                        placeholder="ex: Vendredi de Prière"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</label>
                                    <input 
                                        required
                                        type="text"
                                        value={manualForm.date} 
                                        onChange={e => setManualForm({...manualForm, date: e.target.value})}
                                        className="w-full bg-muted border-transparent rounded-none px-4 py-3 text-sm font-bold text-foreground"
                                        placeholder="ex: 30 AVRIL 2024"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description / Sous-titre</label>
                                    <textarea 
                                        value={manualForm.description} 
                                        onChange={e => setManualForm({...manualForm, description: e.target.value})}
                                        className="w-full bg-muted border-transparent rounded-none px-4 py-3 text-sm font-bold text-foreground h-20"
                                        placeholder="ex: Célébration spéciale avec..."
                                    />
                                </div>
                                <button type="submit" className="w-full bg-primary text-white py-4 rounded-none font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                                    Appliquer au Déroulé
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CONFIRMATION MODAL */}
            <AnimatePresence>
                {showConfirmModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-card w-full max-w-5xl max-h-[90vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl border border-border"
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/50">
                                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Aperçu du Déroulé</h2>
                                <button onClick={() => setShowConfirmModal(false)} className="p-2 hover:bg-muted rounded-none text-foreground transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-12 bg-white text-black font-serif">
                                <div className="max-w-4xl mx-auto border border-gray-100 p-10 shadow-sm">
                                    <div className="flex justify-between items-start mb-10 border-b-2 border-primary pb-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 bg-primary rounded-none flex items-center justify-center text-white font-black text-3xl italic">HOG</div>
                                            <div>
                                                <h1 className="text-3xl font-black text-primary uppercase leading-tight">House Of God</h1>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest italic mt-1">Kigali Local Campus</p>
                                            </div>
                                        </div>
                                        <div className="text-right text-xs font-bold text-gray-400">
                                            <p>Date: {date || '---'}</p>
                                            <p>Lieu: {location}</p>
                                        </div>
                                    </div>

                                    <div className="text-center mb-12">
                                        <h2 className="text-2xl font-black uppercase underline underline-offset-8 decoration-primary">{title || 'DÉROULÉ DU SERVICE'}</h2>
                                        {description && <p className="text-sm font-bold mt-6 text-gray-600 italic">« {description} »</p>}
                                        <p className="text-xs font-bold mt-4 text-primary tracking-[0.2em] uppercase">THÈME : {theme}</p>
                                    </div>

                                    <div className="space-y-12">
                                        {services.map((service) => (
                                            <div key={service.id} className="space-y-6">
                                                <h3 className="text-xl font-black uppercase text-primary border-b border-primary/20 pb-2">{service.title}</h3>
                                                <table className="w-full border-collapse border border-gray-300">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="border border-gray-300 p-3 text-[10px] uppercase font-black">Début</th>
                                                            <th className="border border-gray-300 p-3 text-[10px] uppercase font-black">Fin</th>
                                                            <th className="border border-gray-300 p-3 text-[10px] uppercase font-black text-left">Intitulé</th>
                                                            <th className="border border-gray-300 p-3 text-[10px] uppercase font-black">Durée</th>
                                                            <th className="border border-gray-300 p-3 text-[10px] uppercase font-black text-left">Intervenants</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {service.sequences.map(item => (
                                                            <tr key={item.id}>
                                                                <td className="border border-gray-300 p-3 text-xs text-center font-bold">{item.start}</td>
                                                                <td className="border border-gray-300 p-3 text-xs text-center font-bold">{item.end}</td>
                                                                <td className="border border-gray-300 p-3 text-xs font-bold">{item.subject}</td>
                                                                <td className="border border-gray-300 p-3 text-xs text-center font-mono">{item.duration}</td>
                                                                <td className="border border-gray-300 p-3 text-xs">{item.intervenants}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                    </div>

                                    {eventsList.length > 0 && (
                                        <div className="mt-16 space-y-8 no-print-break">
                                            <h3 className="text-xl font-black text-primary border-b-2 border-primary pb-2 uppercase tracking-[0.2em]">Événements à venir</h3>
                                            <div className="grid grid-cols-1 gap-6">
                                                {eventsList.map(ev => (
                                                    <div key={ev.id} className="flex gap-6 items-center">
                                                        <div className="w-16 h-16 border-2 border-primary flex flex-col items-center justify-center font-black">
                                                            <span className="text-sm">{new Date(ev.date).toLocaleDateString('fr-FR', { day: '2-digit' })}</span>
                                                            <span className="text-[10px] uppercase text-primary">{new Date(ev.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black uppercase text-gray-900">{ev.title}</p>
                                                            <p className="text-xs font-bold text-gray-500">{ev.location} | {ev.time}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-20 flex justify-between items-end border-t border-gray-100 pt-8 italic text-[8pt] text-gray-400">
                                        <p>Document généré par CMS House Of God</p>
                                        <p>Secrétariat Local</p>
                                    </div>

                                    <div className="mt-16 space-y-12 no-print-break">
                                    <div className="mt-16 space-y-12 no-print-break">
                                        <h3 className="text-2xl font-black text-primary border-b-2 border-primary pb-2 uppercase tracking-widest text-center">Annonces</h3>
                                        {annoncesPool.map(a => (
                                            <div key={a.id} className="space-y-4">
                                                <h4 className="text-lg font-black uppercase underline decoration-primary decoration-2 underline-offset-4">{a.title}</h4>
                                                {(a.date || a.start || a.end) && (
                                                    <p className="text-sm font-bold text-gray-500 italic">
                                                        📅 {a.date} {a.start && `| 🕒 ${a.start}`} {a.end && ` - ${a.end}`}
                                                    </p>
                                                )}
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{a.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-border bg-muted/50 flex justify-end gap-4">
                                <div className="flex items-center gap-2 border-r border-border pr-4 mr-2">
                                    <button onClick={handleShareWhatsApp} className="p-3 bg-[#25D366] text-white rounded-none hover:opacity-90 transition-all shadow-lg shadow-[#25D366]/20">
                                        <MessageCircle className="w-5 h-5" />
                                    </button>
                                    <button onClick={handleShareEmail} className="p-3 bg-muted text-foreground rounded-none hover:bg-muted/80 transition-all">
                                        <ExternalLink className="w-5 h-5" />
                                    </button>
                                </div>
                                <button onClick={() => setShowConfirmModal(false)} className="px-8 py-3 rounded-none font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:bg-muted transition-colors">Modifier</button>
                                <button onClick={handleDownloadWord} className="bg-card border border-border text-foreground px-8 py-3 rounded-none font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-muted transition-colors shadow-sm">
                                    <Download className="w-4 h-4" /> Export Word
                                </button>
                                <button onClick={handlePrint} className="bg-primary text-white px-10 py-3 rounded-none font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl shadow-primary/20 hover:opacity-90 transition-all">
                                    <Printer className="w-4 h-4" /> Confirmer & Imprimer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* HIDDEN PRINT VERSION */}
            <div className="print-only bg-white p-12 text-black font-serif text-[12pt] leading-tight">
                <div className="flex justify-between items-start mb-8 border-b-2 border-primary pb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary rounded-none flex items-center justify-center text-white font-black text-2xl italic">HOG</div>
                        <div>
                            <h1 className="text-2xl font-black text-primary uppercase">House Of God</h1>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">Kigali Local Campus</p>
                        </div>
                    </div>
                    <div className="text-right text-[10px] font-bold text-gray-400">
                        <p>Date: {date}</p>
                        <p>Lieu: {location}</p>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-xl font-black uppercase underline underline-offset-8">{title || 'DÉROULÉ DES CULTES'}</h2>
                    {description && <p className="text-sm font-bold mt-4 text-gray-600 italic">« {description} »</p>}
                    <p className="text-xs font-bold mt-4 text-primary uppercase tracking-widest">THÈME : {theme}</p>
                </div>

                <div className="space-y-12">
                    {services.map((service) => (
                        <div key={service.id} className="space-y-4">
                            <h3 className="text-lg font-black uppercase text-primary border-b border-primary pb-1">{service.title}</h3>
                            <table className="w-full border-collapse border border-gray-300">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border border-gray-300 p-2 text-xs">DEBUT</th>
                                        <th className="border border-gray-300 p-2 text-xs">FIN</th>
                                        <th className="border border-gray-300 p-2 text-xs">INTITULÉ</th>
                                        <th className="border border-gray-300 p-2 text-xs">DURÉE</th>
                                        <th className="border border-gray-300 p-2 text-xs">INTERVENANTS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {service.sequences.map(item => (
                                        <tr key={item.id}>
                                            <td className="border border-gray-300 p-2 text-xs text-center font-bold">{item.start}</td>
                                            <td className="border border-gray-300 p-2 text-xs text-center font-bold">{item.end}</td>
                                            <td className="border border-gray-300 p-2 text-xs font-bold">{item.subject}</td>
                                            <td className="border border-gray-300 p-2 text-xs text-center">{item.duration}</td>
                                            <td className="border border-gray-300 p-2 text-xs">{item.intervenants}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>

                <div className="mt-20 flex justify-between items-end border-t border-gray-100 pt-8 italic text-[8pt] text-gray-400">
                    <p>Document généré par CMS House Of God</p>
                    <p>Secrétariat Local</p>
                </div>

                <div className="mt-16 page-break-before space-y-10">
                    <h3 className="text-xl font-black text-center uppercase border-b-2 border-primary pb-2 tracking-widest">Annonces</h3>
                    {annoncesPool.map(a => (
                        <div key={a.id} className="space-y-2">
                            <h4 className="text-md font-bold uppercase underline">{a.title}</h4>
                            <p className="text-xs italic text-gray-600">{a.date} {a.start && `| ${a.start}`} {a.end && ` - ${a.end}`}</p>
                            <p className="text-sm whitespace-pre-wrap">{a.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
