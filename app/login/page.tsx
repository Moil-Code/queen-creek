'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const QC_CHAMBER_LOGO_URL = '/logo.png';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // Get redirect URL from query params (for invite acceptance flow)
  const redirectUrl = searchParams.get('redirect');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate email domain on client side
    if (!email.endsWith('@queencreekchamber.com') && !email.endsWith('@moilapp.com')) {
      toast({
        title: "Access Denied",
        description: "Only @queencreekchamber.com or @moilapp.com email addresses are allowed for admin accounts",
        type: "error"
      });
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Sign in the admin user directly with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        toast({
          title: "Login Failed",
          description: signInError.message,
          type: "error"
        });
        setLoading(false);
        return;
      }

      if (!data.user) {
        toast({
          title: "Login Failed",
          description: "Could not authenticate user",
          type: "error"
        });
        setLoading(false);
        return;
      }

      // Verify user is an admin by checking metadata
      const userRole = data.user.user_metadata?.role;
      if (userRole !== 'admin') {
        // Sign out if not an admin
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: "Admin account required to access this portal.",
          type: "error"
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in to Admin Dashboard.",
        type: "success"
      });

      // Redirect to the specified URL or dashboard
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        type: "error"
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-work-sans overflow-hidden bg-white">
      <InteractiveGridPattern
        className="stroke-gray-200"
        width={40}
        height={40}
        squares={[30, 30]}
        squaresClassName="stroke-gray-200"
        hoverClassName="fill-qc-primary-faint"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* Logo Section */}
          <div className="text-center mb-8 animate-slide-in">
            <Link href="/" className="inline-block group">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Image
                      src={QC_CHAMBER_LOGO_URL}
                      alt="Queen Creek Chamber Logo"
                      width={240}
                      height={80}
                      className="h-20 object-contain group-hover:scale-105 transition-transform drop-shadow-[0_0_8px_rgba(0,115,181,0.3)]"
                      priority
                    />
                </div>
            </Link>
            <p className="text-gray-600 text-sm">Secure access for platform administrators</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-[24px]  border border-[#1f2a44] p-8 shadow-xl relative overflow-hidden animate-slide-in bg-opacity-95">
             {/* Decorative top accent */}
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-qc-primary via-indigo-500 to-qc-secondary"></div>

            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-qc-primary/20 focus:border-qc-primary transition-all text-gray-900 placeholder-gray-400"
                    placeholder="admin@queencreekchamber.com"
                    required
                    disabled={loading}
                  />
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-11 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-qc-primary/20 focus:border-qc-primary transition-all text-gray-900 placeholder-gray-400"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-qc-primary focus:ring-qc-primary/20" 
                    disabled={loading}
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-qc-primary hover:text-blue-700 font-medium transition-colors">Forgot password?</Link>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-qc-primary text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-qc-primary/20 transition-all duration-300 shadow-lg shadow-qc-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="text-white border-white" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Don't have an admin account? <Link href="/signup" className="text-qc-primary font-semibold hover:underline">Request Access</Link>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/login" className="text-gray-500 hover:text-gray-900 text-sm transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Return to User Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto border-qc-primary" />
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
