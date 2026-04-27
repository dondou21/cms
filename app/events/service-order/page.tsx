'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Printer, Download, Plus, Trash2, ChevronLeft, Church, 
    Clock, User, MessageSquare, Info, FileText, X, Check, Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../lib/i18n';
import { cn } from '../../lib/utils';
import api from '../../services/api';
import { Document as DocxDocument, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

interface ServiceItem {
    id: string;
    start: string;
    end: string;
    subject: string;
    duration: string;
    intervenants: string;
}

export default function ServiceOrderPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('Auditorium ICC, Kacyiru');
    const [theme, setTheme] = useState('2024, ANNEE DE LA CROISSANCE CONTINUE EN CHRIST');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
    const [cult1, setCult1] = useState<ServiceItem[]>([
        { id: '1', start: '07h45', end: '08h00', subject: 'Prière d\'intercession', duration: '15\'', intervenants: 'Intercesseur' },
        { id: '2', start: '08h00', end: '08h30', subject: 'Louanges et Adorations', duration: '30\'', intervenants: 'M.U.A' },
    ]);

    const [annonces, setAnnonces] = useState([
        { title: 'ACTIONS DE GRÂCES', content: 'La Famille de Dieu de l\'église ICC Kigali se réjouit...' },
        { title: 'DIME & OFFRANDES', content: 'Notre culte est aussi un moment de notre culte...' },
    ]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                setEvents(response.data);
            } catch (err) {
                console.error('Failed to fetch events', err);
            }
        };
        fetchEvents();
    }, []);

    const handleEventSelect = (eventId: string) => {
        setSelectedEventId(eventId);
        const event = events.find(e => e.id.toString() === eventId);
        if (event) {
            setDate(new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase());
            setTitle(event.title.toUpperCase());
        }
    };

    const handlePrint = () => {
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
                            new TextRun({ text: "IMPACT CENTRE CHRÉTIEN - KIGALI", bold: true, size: 32, color: "0000FF" }),
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
                ],
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `Service_Order_${date.replace(/\s/g, '_')}.docx`);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-20 no-print">
                <div className="flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm">
                        <ChevronLeft className="w-4 h-4" />
                        {t('nav.events')}
                    </button>
                    <div className="flex gap-4">
                        <button onClick={() => setShowConfirmModal(true)} className="bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-primary/20">
                            <Eye className="w-4 h-4" />
                            Preview & Save
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-card rounded-3xl border border-border shadow-sm p-8 space-y-8">
                            <div className="flex items-center justify-between border-b border-border pb-4">
                                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 text-foreground">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Configuration du Déroulé
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Sélectionner un évènement planifié</label>
                                    <select 
                                        value={selectedEventId} 
                                        onChange={(e) => handleEventSelect(e.target.value)}
                                        className="w-full bg-muted border-transparent rounded-xl px-4 py-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                                    >
                                        <option value="">-- Choisir un évènement --</option>
                                        {events.map(e => (
                                            <option key={e.id} value={e.id}>{new Date(e.date).toLocaleDateString()} - {e.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date d'impression</label>
                                        <input value={date} onChange={e => setDate(e.target.value)} placeholder="ex: 28 AVRIL 2024" className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Titre du Déroulé</label>
                                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="ex: CULTE DE CÉLÉBRATION" className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Informations Complémentaires / Description</label>
                                    <textarea 
                                        value={description} 
                                        onChange={e => setDescription(e.target.value)} 
                                        placeholder="ex: Vendredi soir de prière - Thème spécifique..."
                                        className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground h-24 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-border">
                                <h3 className="text-sm font-black text-primary uppercase tracking-widest">Chronogramme du Service</h3>
                                <div className="overflow-x-auto rounded-2xl border border-border">
                                    <table className="w-full text-xs font-bold text-foreground">
                                        <thead className="bg-muted text-[10px] text-muted-foreground uppercase">
                                            <tr>
                                                <th className="p-4 text-left">Début</th>
                                                <th className="p-4 text-left">Fin</th>
                                                <th className="p-4 text-left">Intitulé</th>
                                                <th className="p-4 text-left">Durée</th>
                                                <th className="p-4 text-left">Intervenants</th>
                                                <th className="p-4 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {cult1.map((item, i) => (
                                                <tr key={item.id} className="hover:bg-muted/30">
                                                    <td className="p-2"><input value={item.start} onChange={e => {
                                                        const newArr = [...cult1];
                                                        newArr[i].start = e.target.value;
                                                        setCult1(newArr);
                                                    }} className="w-full bg-transparent p-2 rounded outline-none" /></td>
                                                    <td className="p-2"><input value={item.end} onChange={e => {
                                                        const newArr = [...cult1];
                                                        newArr[i].end = e.target.value;
                                                        setCult1(newArr);
                                                    }} className="w-full bg-transparent p-2 rounded outline-none" /></td>
                                                    <td className="p-2"><input value={item.subject} onChange={e => {
                                                        const newArr = [...cult1];
                                                        newArr[i].subject = e.target.value;
                                                        setCult1(newArr);
                                                    }} className="w-full bg-transparent p-2 rounded outline-none" /></td>
                                                    <td className="p-2"><input value={item.duration} onChange={e => {
                                                        const newArr = [...cult1];
                                                        newArr[i].duration = e.target.value;
                                                        setCult1(newArr);
                                                    }} className="w-full bg-transparent p-2 rounded outline-none" /></td>
                                                    <td className="p-2"><input value={item.intervenants} onChange={e => {
                                                        const newArr = [...cult1];
                                                        newArr[i].intervenants = e.target.value;
                                                        setCult1(newArr);
                                                    }} className="w-full bg-transparent p-2 rounded outline-none" /></td>
                                                    <td className="p-2">
                                                        <button onClick={() => setCult1(cult1.filter(x => x.id !== item.id))} className="text-rose-500 p-2 hover:bg-rose-500/10 rounded-lg transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <button onClick={() => setCult1([...cult1, { id: Date.now().toString(), start: '', end: '', subject: '', duration: '', intervenants: '' }])} className="bg-muted px-4 py-2 rounded-xl text-[10px] font-black uppercase text-primary hover:bg-primary/10 flex items-center gap-2 transition-all">
                                    <Plus className="w-3 h-3" /> Ajouter une séquence
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                <Info className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-black uppercase tracking-tight text-foreground mb-4">Aide & Instructions</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Le titre et la date seront automatiquement mis à jour si vous sélectionnez un évènement dans la liste.
                                <br /><br />
                                La description apparaîtra juste en dessous du titre dans le document final.
                                <br /><br />
                                Utilisez le bouton **Preview & Save** pour voir le résultat final avant d'exporter.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

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
                                <button onClick={() => setShowConfirmModal(false)} className="p-2 hover:bg-muted rounded-full text-foreground transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-12 bg-white text-black font-serif">
                                <div className="max-w-4xl mx-auto border border-gray-100 p-10 shadow-sm">
                                    <div className="flex justify-between items-start mb-10 border-b-2 border-primary pb-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-3xl italic">ICC</div>
                                            <div>
                                                <h1 className="text-3xl font-black text-primary uppercase leading-tight">Impact Centre Chrétien</h1>
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
                                            {cult1.map(item => (
                                                <tr key={item.id}>
                                                    <td className="border border-gray-300 p-3 text-xs text-center font-bold">{item.start}</td>
                                                    <td className="border border-gray-300 p-3 text-xs text-center font-bold">{item.end}</td>
                                                    <td className="border border-gray-300 p-3 text-xs">{item.subject}</td>
                                                    <td className="border border-gray-300 p-3 text-xs text-center">{item.duration}</td>
                                                    <td className="border border-gray-300 p-3 text-xs">{item.intervenants}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="mt-20 flex justify-between items-end border-t border-gray-100 pt-8 italic text-[8pt] text-gray-400">
                                        <p>Document généré par CMS Impact Centre Kigali</p>
                                        <p>Secrétariat Local</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-border bg-muted/50 flex justify-end gap-4">
                                <button onClick={() => setShowConfirmModal(false)} className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:bg-muted transition-colors">Modifier</button>
                                <button onClick={handleDownloadWord} className="bg-card border border-border text-foreground px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-muted transition-colors shadow-sm">
                                    <Download className="w-4 h-4" /> Export Word
                                </button>
                                <button onClick={handlePrint} className="bg-primary text-white px-10 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl shadow-primary/20 hover:opacity-90 transition-all">
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
                        <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white font-black text-2xl italic">ICC</div>
                        <div>
                            <h1 className="text-2xl font-black text-primary uppercase">Impact Centre Chrétien</h1>
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
                        {cult1.map(item => (
                            <tr key={item.id}>
                                <td className="border border-gray-300 p-2 text-xs text-center">{item.start}</td>
                                <td className="border border-gray-300 p-2 text-xs text-center">{item.end}</td>
                                <td className="border border-gray-300 p-2 text-xs">{item.subject}</td>
                                <td className="border border-gray-300 p-2 text-xs text-center">{item.duration}</td>
                                <td className="border border-gray-300 p-2 text-xs">{item.intervenants}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-20 flex justify-between items-end border-t border-gray-100 pt-8 italic text-[8pt] text-gray-400">
                    <p>Document généré par CMS Impact Centre Kigali</p>
                    <p>Secrétariat Local</p>
                </div>
            </div>
        </DashboardLayout>
    );
}



        </DashboardLayout>
    );
}
