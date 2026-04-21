import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }
    } catch (error: any) {
      // Error toasts are handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-zinc-400">
            {isSignup
              ? "Join the elite art community"
              : "Enter your credentials to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
          >
            {isLoading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
            {!isLoading && (
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-zinc-500">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors"
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
