import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import GlassCard from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Instagram } from "lucide-react";
import type { Biodata, SocialLink, Service, InsertContactMessage } from "@shared/schema";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();

  const { data: biodata } = useQuery<Biodata>({
    queryKey: ["/api/biodata"],
  });

  const { data: socialLinks = [] } = useQuery<SocialLink[]>({
    queryKey: ["/api/social-links"],
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact-messages", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const getIconForPlatform = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <Github className="h-6 w-6" />;
      case "linkedin":
        return <Linkedin className="h-6 w-6" />;
      case "twitter":
        return <Twitter className="h-6 w-6" />;
      case "instagram":
        return <Instagram className="h-6 w-6" />;
      default:
        return <div className="h-6 w-6" />;
    }
  };

  return (
    <div id="contact" className="min-h-screen pt-20 py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 gradient-text">Get In Touch</h2>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <GlassCard>
              <h3 className="text-2xl font-bold mb-6 text-neon-cyan">Let's Work Together</h3>
              <p className="text-slate-300 mb-8">
                I'm always interested in new opportunities and exciting projects. 
                Let's discuss how we can bring your ideas to life.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="text-neon-cyan h-6 w-6 mr-4" />
                  <span>{biodata?.email || "contact@portfolio.com"}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="text-neon-cyan h-6 w-6 mr-4" />
                  <span>{biodata?.phone || "+1 (555) 123-4567"}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-neon-cyan h-6 w-6 mr-4" />
                  <span>{biodata?.location || "San Francisco, CA"}</span>
                </div>
              </div>
              
              {socialLinks.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4">Follow Me</h4>
                  <div className="flex space-x-4">
                    {socialLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-neon-cyan transition-colors"
                      >
                        {getIconForPlatform(link.platform)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
            
            {/* Pricing/Services */}
            {services.length > 0 && (
              <GlassCard>
                <h3 className="text-2xl font-bold mb-6 text-neon-cyan">Services & Pricing</h3>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex justify-between items-center border-b border-slate-700 pb-2">
                      <span>{service.name}</span>
                      <span className="text-neon-green font-semibold">{service.price}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
          
          {/* Contact Form */}
          <GlassCard>
            <h3 className="text-2xl font-bold mb-6 text-neon-cyan">Send Message</h3>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-red-400 text-sm">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-red-400 text-sm">{form.formState.errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan resize-none"
                  {...form.register("message")}
                />
                {form.formState.errors.message && (
                  <p className="text-red-400 text-sm">{form.formState.errors.message.message}</p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full bg-gradient-to-r from-neon-cyan to-neon-green text-slate-900 font-semibold hover:from-neon-green hover:to-neon-cyan transition-all duration-300 transform hover:scale-105"
              >
                {contactMutation.isPending ? "Sending..." : "Send Message"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
