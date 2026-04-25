'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Church } from 'lucide-react';
import api from '../services/api';
import { cn } from '../lib/utils';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = async (testEmail: string) => {
        setLoading(true);
        setError('');
        setEmail(testEmail);
        setPassword('password123');
        try {
            const response = await api.post('/auth/login', { email: testEmail, password: 'password123' });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-float" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 glass-card rounded-2xl relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 premium-shadow">
                        <Church className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold gradient-text">Welcome Back</h1>
                    <p className="text-muted-foreground mt-2">Enter your credentials to access CMS</p>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    <p className="text-center text-sm font-semibold text-muted-foreground mb-4">Select your role to continue</p>
                    <button type="button" onClick={() => handleQuickLogin('admin@church.com')} className="w-full text-sm py-4 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-all border border-blue-200 disabled:opacity-50 shadow-sm flex items-center justify-center gap-2" disabled={loading}>
                        <LogIn className="w-4 h-4" /> System Admin
                    </button>
                    <button type="button" onClick={() => handleQuickLogin('pastor@church.com')} className="w-full text-sm py-4 bg-emerald-50 text-emerald-600 font-bold rounded-xl hover:bg-emerald-100 transition-all border border-emerald-200 disabled:opacity-50 shadow-sm flex items-center justify-center gap-2" disabled={loading}>
                        <LogIn className="w-4 h-4" /> Pastor / Leader
                    </button>
                    <button type="button" onClick={() => handleQuickLogin('secretary@church.com')} className="w-full text-sm py-4 bg-purple-50 text-purple-600 font-bold rounded-xl hover:bg-purple-100 transition-all border border-purple-200 disabled:opacity-50 shadow-sm flex items-center justify-center gap-2" disabled={loading}>
                        <LogIn className="w-4 h-4" /> Secretary / Clerk
                    </button>
                    <button type="button" onClick={() => handleQuickLogin('finance@church.com')} className="w-full text-sm py-4 bg-amber-50 text-amber-600 font-bold rounded-xl hover:bg-amber-100 transition-all border border-amber-200 disabled:opacity-50 shadow-sm flex items-center justify-center gap-2" disabled={loading}>
                        <LogIn className="w-4 h-4" /> Finance Officer
                    </button>
                </div>

                <p className="text-center text-sm text-gray-500 font-medium mt-8">
                    Don't have an account?{' '}
                    <button
                        onClick={() => router.push('/register')}
                        className="text-primary hover:underline font-bold"
                    >
                        Register here
                    </button>
                </p>
            </motion.div>
        </div>
    );
}
