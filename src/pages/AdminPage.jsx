import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/shared/PageTransition';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

const AdminPage = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { signIn, user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await signIn(email, password);
        if (!error) {
            toast({
                title: '🎉 Login Successful!',
                description: "Welcome back! Redirecting to your dashboard...",
            });
            navigate('/admin/dashboard');
        } else {
            // Toast is handled by the auth context
        }
        setLoading(false);
    }

    return (
        <PageTransition>
            <Helmet>
                <title>Admin Login | Cozy Way</title>
                <meta
                    name="description"
                    content="Admin login for Cozy Way, a best homestay in Dharamshala with rooms in Dharamshala."
                />
                <meta
                    name="keywords"
                    content="best homestay in dharamshala, rooms in dharamshala, homestay in dharamshala, stay in dharamshala, dharamshala homestay, dharamshala rooms, cozy way dharamshala, dharmashala homestay, rooms in dharmashala"
                />
            </Helmet>
            <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
                <motion.div 
                    initial={{opacity: 0, y: -20}} 
                    animate={{opacity: 1, y: 0}} 
                    transition={{duration: 0.5}}
                    className="w-full max-w-md"
                >
                    <div className="surface-card p-8 rounded-3xl shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                        <div className="text-center mb-8">
                            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Admin Area</p>
                            <h1 className="text-4xl font-bold font-display text-white mt-3">Admin Login</h1>
                            <p className="text-white/70 mt-2">Access your dashboard</p>
                        </div>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                    className="bg-white/5 border-white/15 text-white placeholder:text-white/50 rounded-2xl"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                    className="bg-white/5 border-white/15 text-white placeholder:text-white/50 rounded-2xl"
                                    disabled={loading}
                                />
                            </div>
                            <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold rounded-full" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
                            </Button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default AdminPage;
