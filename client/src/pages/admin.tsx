import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import GlassCard from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LogOut, Edit, Trash2, Plus, Check } from "lucide-react";
import {
  insertBiodataSchema, insertSkillSchema, insertExperienceSchema,
  insertEducationSchema, insertActivitySchema, insertArticleSchema,
  type Biodata, type Skill, type Experience, type Education,
  type Activity, type Article, type ContactMessage
} from "@shared/schema";

type AdminSection = "biodata" | "skills" | "experience" | "education" | "activities" | "articles" | "contacts";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<AdminSection>("biodata");
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const { data: biodata } = useQuery<Biodata>({
    queryKey: ["/api/biodata"],
  });

  const { data: skills = [] } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const { data: experiences = [] } = useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
  });

  const { data: education = [] } = useQuery<Education[]>({
    queryKey: ["/api/education"],
  });

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ["/api/articles/all"],
  });

  const { data: contactMessages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
  });

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const status = await authService.getStatus();
        if (!status.isAuthenticated) {
          setLocation("/admin-login");
        }
      } catch (error) {
        setLocation("/admin-login");
      }
    };
    checkAuth();
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setLocation("/admin-login");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  // Biodata form
  const biodataForm = useForm({
    resolver: zodResolver(insertBiodataSchema),
    defaultValues: biodata || {
      name: "",
      title: "",
      bio: "",
      email: "",
      phone: "",
      location: "",
      profileImage: "",
    },
  });

  useEffect(() => {
    if (biodata) {
      biodataForm.reset(biodata);
    }
  }, [biodata, biodataForm]);

  const biodataMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/biodata", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Biodata updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/biodata"] });
    },
    onError: () => {
      toast({ title: "Failed to update biodata", variant: "destructive" });
    },
  });

  // Skill form
  const skillForm = useForm({
    resolver: zodResolver(insertSkillSchema),
    defaultValues: {
      name: "",
      level: "",
      percentage: 0,
      icon: "",
      category: "",
    },
  });

  const skillMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/skills", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Skill added successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      skillForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to add skill", variant: "destructive" });
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/skills/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Skill deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
    },
    onError: () => {
      toast({ title: "Failed to delete skill", variant: "destructive" });
    },
  });

  // Contact message mutations
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PUT", `/api/contact-messages/${id}/read`);
    },
    onSuccess: () => {
      toast({ title: "Message marked as read" });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contact-messages/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Message deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
    },
  });

  const navItems = [
    { id: "biodata", label: "Biodata" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "activities", label: "Activities" },
    { id: "articles", label: "Articles" },
    { id: "contacts", label: "Contact Messages" },
  ];

  return (
    <div className="min-h-screen pt-20 py-8">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-5xl font-bold gradient-text">Admin Dashboard</h2>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          {navItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => setActiveSection(item.id as AdminSection)}
              variant={activeSection === item.id ? "default" : "outline"}
              className={
                activeSection === item.id
                  ? "bg-gradient-to-r from-neon-cyan to-neon-green text-slate-900"
                  : "glass-effect"
              }
            >
              {item.label}
            </Button>
          ))}
        </div>

        {/* Biodata Section */}
        {activeSection === "biodata" && (
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-neon-cyan">Manage Biodata</h3>
            </div>
            
            <form
              onSubmit={biodataForm.handleSubmit((data) => biodataMutation.mutate(data))}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...biodataForm.register("name")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...biodataForm.register("title")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...biodataForm.register("email")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...biodataForm.register("phone")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...biodataForm.register("location")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Image URL</Label>
                <Input
                  id="profileImage"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...biodataForm.register("profileImage")}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio Description</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan resize-none"
                  {...biodataForm.register("bio")}
                />
              </div>
              
              <Button
                type="submit"
                disabled={biodataMutation.isPending}
                className="md:col-span-2 bg-gradient-to-r from-neon-cyan to-neon-green text-slate-900 font-semibold"
              >
                {biodataMutation.isPending ? "Updating..." : "Update Biodata"}
              </Button>
            </form>
          </GlassCard>
        )}

        {/* Skills Section */}
        {activeSection === "skills" && (
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-neon-cyan">Manage Skills</h3>
            </div>
            
            {/* Skills List */}
            <div className="space-y-4 mb-8">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <i className={`${skill.icon} text-2xl text-neon-cyan mr-4`}></i>
                    <div>
                      <h5 className="font-semibold">{skill.name}</h5>
                      <p className="text-sm text-slate-400">{skill.level} - {skill.percentage}%</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSkillMutation.mutate(skill.id)}
                      disabled={deleteSkillMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add Skill Form */}
            <form
              onSubmit={skillForm.handleSubmit((data) => skillMutation.mutate(data))}
              className="grid md:grid-cols-2 lg:grid-cols-5 gap-4"
            >
              <div className="space-y-2">
                <Label htmlFor="skillName">Skill Name</Label>
                <Input
                  id="skillName"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...skillForm.register("name")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skillLevel">Level</Label>
                <Input
                  id="skillLevel"
                  placeholder="e.g., Expert"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...skillForm.register("level")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skillPercentage">Percentage</Label>
                <Input
                  id="skillPercentage"
                  type="number"
                  min="0"
                  max="100"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...skillForm.register("percentage", { valueAsNumber: true })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skillIcon">Icon Class</Label>
                <Input
                  id="skillIcon"
                  placeholder="e.g., fab fa-js-square"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...skillForm.register("icon")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skillCategory">Category</Label>
                <Input
                  id="skillCategory"
                  placeholder="e.g., Frontend"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...skillForm.register("category")}
                />
              </div>
              
              <Button
                type="submit"
                disabled={skillMutation.isPending}
                className="md:col-span-2 lg:col-span-5 bg-gradient-to-r from-neon-cyan to-neon-green text-slate-900 font-semibold"
              >
                {skillMutation.isPending ? "Adding..." : "Add Skill"}
                <Plus className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </GlassCard>
        )}

        {/* Contact Messages Section */}
        {activeSection === "contacts" && (
          <GlassCard>
            <h3 className="text-2xl font-bold text-neon-cyan mb-6">Contact Messages</h3>
            
            <div className="space-y-4">
              {contactMessages.length > 0 ? (
                contactMessages.map((message) => (
                  <div key={message.id} className="bg-slate-800 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="font-semibold text-lg">{message.name}</h5>
                        <p className="text-neon-cyan">{message.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-slate-400">{message.date}</span>
                        {!message.read && (
                          <div className="text-xs text-red-400 mt-1">Unread</div>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-300 mb-4">{message.message}</p>
                    <div className="flex space-x-2">
                      {!message.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsReadMutation.mutate(message.id)}
                          disabled={markAsReadMutation.isPending}
                          className="text-green-400 border-green-400 hover:bg-green-400 hover:text-slate-900"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteMessageMutation.mutate(message.id)}
                        disabled={deleteMessageMutation.isPending}
                        className="text-red-400 border-red-400 hover:bg-red-400 hover:text-slate-900"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  No contact messages yet.
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {/* Placeholder sections for other admin features */}
        {(activeSection === "experience" || activeSection === "education" || activeSection === "activities" || activeSection === "articles") && (
          <GlassCard>
            <h3 className="text-2xl font-bold text-neon-cyan mb-6">
              Manage {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h3>
            <div className="text-center py-8 text-slate-400">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} management coming soon...
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
