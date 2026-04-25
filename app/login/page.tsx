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

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background/50 border border-border rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="admin@church.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-background/50 border border-border rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-8 shadow-lg shadow-primary/20",
                            loading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {loading ? "Signing in..." : (
                            <>
                                <LogIn className="w-5 h-5" />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                {/* Predefined Local Testing Credentials */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-4">Local Test Credentials</p>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-xs text-gray-600 font-mono space-y-2">
                        <p className="text-center text-gray-400 mb-2 font-sans font-semibold border-b border-gray-200 pb-2">Password for all users: <span className="font-bold text-gray-800">password123</span></p>
                        <div className="flex justify-between">
                            <span>Admin:</span> <span className="font-bold text-blue-600">admin@church.com</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Pastor:</span> <span className="font-bold text-emerald-600">pastor@church.com</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Secretary:</span> <span className="font-bold text-purple-600">secretary@church.com</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Finance:</span> <span className="font-bold text-amber-600">finance@church.com</span>
                        </div>
                    </div>
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
