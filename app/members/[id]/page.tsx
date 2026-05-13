'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, CalendarDays, Users, Download } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '../../services/api';
import { useLanguage } from '../../lib/i18n';

export default function MemberProfilePage() {
  const { t } = useLanguage();
  const params = useParams();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/members/${params.id}`);
        setMember(response.data);
      } catch (err) {
        console.error('Failed to load member', err);
        setError('Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchMember();
    }
  }, [params?.id]);

  const handleExportProfile = (format: 'csv' | 'json') => {
    if (!member) return;
    const fields = [
      ['Civilité', member.civilite],
      ['First Name', member.first_name],
      ['Last Name', member.last_name],
      ['Email', member.email],
      ['Phone', member.phone],
      ['Address', member.address],
      ['Department', member.department_name || 'Unassigned'],
      ['Status', member.status],
      ['STAR Member', member.is_star ? 'Yes' : 'No'],
      ['Joined', member.created_at ? new Date(member.created_at).toLocaleDateString() : '—'],
      ['Remarks', member.remarks || ''],
    ];

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(member, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `member-profile-${member.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    const csvContent = [
      ['Field', 'Value'].join(','),
      ...fields.map(([name, value]) => `"${name}" , "${(value || '').toString().replace(/"/g, '""')}"`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `member-profile-${member.id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-none animate-spin" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="space-y-6 py-12 text-center text-muted-foreground">
        <p className="text-sm font-bold">{error || 'Member not found.'}</p>
        <Link href="/members" className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-none font-black uppercase tracking-widest text-xs">
          <ArrowLeft className="w-4 h-4" /> Back to members
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{member.first_name} {member.last_name}</h1>
          <p className="text-muted-foreground mt-1">{member.department_name ? `${member.department_name} · ${member.status}` : member.status}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-end">
          <button
            type="button"
            onClick={() => handleExportProfile('csv')}
            className="inline-flex items-center gap-2 px-4 py-3 bg-card border border-border text-foreground font-bold uppercase tracking-widest text-xs rounded-none hover:bg-muted transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => handleExportProfile('json')}
            className="inline-flex items-center gap-2 px-4 py-3 bg-card border border-border text-foreground font-bold uppercase tracking-widest text-xs rounded-none hover:bg-muted transition-colors"
          >
            <Download className="w-4 h-4" /> Download JSON
          </button>
          <Link href="/members" className="inline-flex items-center gap-2 px-5 py-3 bg-card border border-border text-foreground font-bold uppercase tracking-widest text-xs rounded-none hover:bg-muted transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t('members.back') || 'Back to Members'}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
        <div className="bg-card border border-border rounded-none p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</p>
              <p className="text-lg font-bold text-foreground uppercase tracking-tight">{member.status}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined</p>
              <p className="text-sm font-medium text-foreground">{member.created_at ? new Date(member.created_at).toLocaleDateString() : '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Department</p>
              <p className="text-sm font-medium text-foreground">{member.department_name || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">STAR Member</p>
              <p className="text-sm font-medium text-foreground">{member.is_star ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-none p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</p>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Mail className="w-4 h-4 text-primary" />
                {member.email || '—'}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone</p>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Phone className="w-4 h-4 text-primary" />
                {member.phone || '—'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Address</p>
              <div className="flex items-start gap-2 text-sm text-foreground">
                <MapPin className="w-4 h-4 text-primary mt-1" />
                {member.address || '—'}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Age Range</p>
              <p className="text-sm font-medium text-foreground">{member.age_range || '—'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Marital Status</p>
              <p className="text-sm font-medium text-foreground">{member.marital_status || '—'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Referral Source</p>
              <p className="text-sm font-medium text-foreground">{member.referral_source || '—'}</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Notes</p>
            <p className="text-sm leading-6 text-foreground">{member.remarks || 'No additional notes available.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
