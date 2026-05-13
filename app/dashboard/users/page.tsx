'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, UserCog, Check, X, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { cn } from '../../lib/utils';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

const ROLES = ['Admin', 'Pastor/Leader', 'Secretary/Clerk', 'Finance Officer', 'Viewer'];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState<number | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        setUpdating(userId);
        try {
            await api.patch(`/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update role');
        } finally {
            setUpdating(null);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground mt-1">Manage user roles and permissions</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-none premium-shadow">
                    <Shield className="w-6 h-6 text-primary" />
                </div>
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Role</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Assign New Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.map((user) => (
                            <motion.tr 
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-muted/20 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="font-semibold">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2 py-1 text-[10px] font-bold uppercase tracking-tighter",
                                        user.role === 'Admin' ? "bg-red-500/10 text-red-500" :
                                        user.role === 'Pastor/Leader' ? "bg-purple-500/10 text-purple-500" :
                                        "bg-blue-500/10 text-blue-500"
                                    )}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <select
                                        disabled={updating === user.id}
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="bg-background border border-border rounded-none px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all disabled:opacity-50"
                                    >
                                        {ROLES.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
