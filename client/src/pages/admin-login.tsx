import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import GlassCard from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import ParticleBackground from "@/components/particle-background";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await authService.login(data.username, data.password);
      toast({
        title: "Login successful!",
        description: "Welcome to the admin panel.",
      });
      setLocation("/admin");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Use admin/admin123 for demo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
      <ParticleBackground />
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 gradient-text">Admin Panel</h2>
          
          <GlassCard>
            <h3 className="text-2xl font-bold mb-6 text-center text-neon-cyan">Admin Login</h3>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...form.register("username")}
                />
                {form.formState.errors.username && (
                  <p className="text-red-400 text-sm">{form.formState.errors.username.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-red-400 text-sm">{form.formState.errors.password.message}</p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-neon-cyan to-neon-green text-slate-900 font-semibold hover:from-neon-green hover:to-neon-cyan transition-all duration-300"
              >
                {isLoading ? "Logging in..." : "Login"}
                <LogIn className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
