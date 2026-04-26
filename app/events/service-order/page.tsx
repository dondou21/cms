'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Printer, Download, Plus, Trash2, ChevronLeft, Church, Clock, User, MessageSquare, Info, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../lib/i18n';
import { cn } from '../../lib/utils';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
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
    const [date, setDate] = useState('28 AVRIL 2024');
    const [location, setLocation] = useState('Auditorium ICC, Kacyiru');
    const [theme, setTheme] = useState('2024, ANNEE DE LA CROISSANCE CONTINUE EN CHRIST');
    
    const [cult1, setCult1] = useState<ServiceItem[]>([
        { id: '1', start: '07h45', end: '08h00', subject: 'Prière d\'intercession', duration: '15\'', intervenants: 'Intercesseur' },
        { id: '2', start: '08h00', end: '08h30', subject: 'Louanges et Adorations', duration: '30\'', intervenants: 'M.U.A' },
    ]);

    const [cult2, setCult2] = useState<ServiceItem[]>([
        { id: '1', start: '10h30', end: '10h45', subject: 'Prière d\'intercession', duration: '15\'', intervenants: 'Intercesseur' },
    ]);

    const [annonces, setAnnonces] = useState([
        { title: 'ACTIONS DE GRÂCES', content: 'La Famille de Dieu de l\'église ICC Kigali se réjouit...' },
        { title: 'DIME & OFFRANDES', content: 'Notre culte est aussi un moment de notre culte...' },
    ]);

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

        const doc = new Document({
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
                            new TextRun({ text: "DÉROULÉ DES CULTES", bold: true, size: 24 }),
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
                            new TextRun({ text: "1er CULTE", bold: true, size: 20 }),
                        ],
                        spacing: { after: 200 },
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
                        <button onClick={handleDownloadWord} className="bg-card border border-border text-foreground px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-sm hover:bg-muted transition-colors">
                            <Download className="w-4 h-4" />
                            Download .doc
                        </button>
                        <button onClick={handlePrint} className="bg-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-primary/20">
                            <Printer className="w-4 h-4" />
                            {t('service_order.print_btn')}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Editor Section */}
                        <div className="bg-card rounded-3xl border border-border shadow-sm p-8 space-y-8">
                            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 text-foreground">
                                <FileText className="w-5 h-5 text-primary" />
                                {t('service_order.editor')}
                            </h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('service_order.date')}</label>
                                    <input value={date} onChange={e => setDate(e.target.value)} className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('service_order.location')}</label>
                                    <input value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-muted border-transparent rounded-xl px-4 py-3 text-sm font-bold text-foreground" />
                                </div>
                            </div>

                            {/* 1er CULTE */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-primary uppercase tracking-widest">{t('service_order.first_cult')}</h3>
                                <table className="w-full text-xs font-bold text-foreground">
                                    <thead className="bg-muted text-[10px] text-muted-foreground uppercase">
                                        <tr>
                                            <th className="p-3 text-left">{t('service_order.start')}</th>
                                            <th className="p-3 text-left">{t('service_order.end')}</th>
                                            <th className="p-3 text-left">{t('service_order.subject')}</th>
                                            <th className="p-3 text-left">{t('service_order.duration')}</th>
                                            <th className="p-3 text-left">{t('service_order.intervenants')}</th>
                                            <th className="p-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {cult1.map((item, i) => (
                                            <tr key={item.id}>
                                                <td className="p-2"><input value={item.start} onChange={e => {
                                                    const newArr = [...cult1];
                                                    newArr[i].start = e.target.value;
                                                    setCult1(newArr);
                                                }} className="w-full bg-transparent p-1 focus:bg-gray-50 dark:focus:bg-gray-800 rounded outline-none" /></td>
                                                <td className="p-2"><input value={item.end} onChange={e => {
                                                    const newArr = [...cult1];
                                                    newArr[i].end = e.target.value;
                                                    setCult1(newArr);
                                                }} className="w-full bg-transparent p-1 focus:bg-gray-50 dark:focus:bg-gray-800 rounded outline-none" /></td>
                                                <td className="p-2"><input value={item.subject} onChange={e => {
                                                    const newArr = [...cult1];
                                                    newArr[i].subject = e.target.value;
                                                    setCult1(newArr);
                                                }} className="w-full bg-transparent p-1 focus:bg-gray-50 dark:focus:bg-gray-800 rounded outline-none" /></td>
                                                <td className="p-2"><input value={item.duration} onChange={e => {
                                                    const newArr = [...cult1];
                                                    newArr[i].duration = e.target.value;
                                                    setCult1(newArr);
                                                }} className="w-full bg-transparent p-1 focus:bg-gray-50 dark:focus:bg-gray-800 rounded outline-none" /></td>
                                                <td className="p-2"><input value={item.intervenants} onChange={e => {
                                                    const newArr = [...cult1];
                                                    newArr[i].intervenants = e.target.value;
                                                    setCult1(newArr);
                                                }} className="w-full bg-transparent p-1 focus:bg-gray-50 dark:focus:bg-gray-800 rounded outline-none" /></td>
                                                <td className="p-2">
                                                    <button onClick={() => setCult1(cult1.filter(x => x.id !== item.id))} className="text-rose-500 p-1 hover:bg-rose-50 rounded">
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button onClick={() => setCult1([...cult1, { id: Date.now().toString(), start: '', end: '', subject: '', duration: '', intervenants: '' }])} className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1">
                                    <Plus className="w-3 h-3" /> Ajouter Ligne
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-primary text-white p-6 rounded-3xl shadow-xl shadow-primary/20">
                            <Info className="w-8 h-8 mb-4 opacity-50" />
                            <h3 className="font-bold mb-2">Instructions Impression</h3>
                            <p className="text-xs opacity-80 leading-relaxed">Cliquez sur le bouton "Print / PDF" pour générer la version officielle. Assurez-vous que l'option "En-têtes et pieds de page" est désactivée dans les paramètres de votre navigateur.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRINT VERSION (HIDDEN IN UI) */}
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
                    <h2 className="text-xl font-black uppercase underline underline-offset-8">DÉROULÉ DES CULTES DE CÉLÉBRATION</h2>
                    <p className="text-sm font-bold mt-4 text-primary">THÈME : « {theme} »</p>
                </div>

                {/* 1er CULTE PRINT */}
                <div className="mb-10">
                    <div className="bg-primary text-white px-4 py-1 font-black text-center text-sm mb-4 uppercase">1er CULTE</div>
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
                </div>

                {/* ANNONCES PRINT */}
                <div className="mt-12">
                    <h3 className="text-sm font-black text-primary uppercase border-b border-primary mb-4">ANNONCES DU JOUR</h3>
                    {annonces.map((a, i) => (
                        <div key={i} className="mb-6">
                            <h4 className="text-xs font-black uppercase text-gray-700 underline mb-2">{a.title}</h4>
                            <p className="text-xs leading-normal">{a.content}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 flex justify-between items-end border-t border-gray-100 pt-8 italic text-[8pt] text-gray-400">
                    <p>Document généré par CMS Impact Centre Kigali</p>
                    <p>Secrétariat Local</p>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white !important; }
                    @page { margin: 1cm; }
                }
                .print-only { display: none; }
            `}</style>
        </DashboardLayout>
    );
}
