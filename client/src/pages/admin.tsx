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

  // Experience form
  const experienceForm = useForm({
    resolver: zodResolver(insertExperienceSchema),
    defaultValues: {
      position: "",
      company: "",
      duration: "",
      description: "",
      startDate: "",
      endDate: "",
    },
  });

  const experienceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/experiences", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Experience added successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      experienceForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to add experience", variant: "destructive" });
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/experiences/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Experience deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
    },
    onError: () => {
      toast({ title: "Failed to delete experience", variant: "destructive" });
    },
  });

  // Education form
  const educationForm = useForm({
    resolver: zodResolver(insertEducationSchema),
    defaultValues: {
      degree: "",
      institution: "",
      year: "",
      description: "",
    },
  });

  const educationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/education", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Education added successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/education"] });
      educationForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to add education", variant: "destructive" });
    },
  });

  const deleteEducationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/education/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Education deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/education"] });
    },
    onError: () => {
      toast({ title: "Failed to delete education", variant: "destructive" });
    },
  });

  // Activities form
  const activityForm = useForm({
    resolver: zodResolver(insertActivitySchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "",
      category: "",
    },
  });

  const activityMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/activities", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Activity added successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      activityForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to add activity", variant: "destructive" });
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/activities/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Activity deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
    onError: () => {
      toast({ title: "Failed to delete activity", variant: "destructive" });
    },
  });

  // Articles form
  const articleForm = useForm({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "",
      image: "",
      date: "",
      published: true,
    },
  });

  const articleMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/articles", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Article added successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/articles/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      articleForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to add article", variant: "destructive" });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/articles/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Article deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/articles/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: () => {
      toast({ title: "Failed to delete article", variant: "destructive" });
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

        {/* Experience Section */}
        {activeSection === "experience" && (
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-neon-cyan">Manage Experience</h3>
            </div>
            
            {/* Experience List */}
            <div className="space-y-4 mb-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-slate-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h5 className="font-semibold text-lg text-neon-cyan">{exp.position}</h5>
                      <p className="text-white">{exp.company}</p>
                      <p className="text-sm text-slate-400">{exp.duration}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteExperienceMutation.mutate(exp.id)}
                      disabled={deleteExperienceMutation.isPending}
                      className="text-red-400 border-red-400 hover:bg-red-400 hover:text-slate-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-slate-300">{exp.description}</p>
                </div>
              ))}
            </div>
            
            {/* Add Experience Form */}
            <form
              onSubmit={experienceForm.handleSubmit((data) => experienceMutation.mutate(data))}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...experienceForm.register("position")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...experienceForm.register("company")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., Jan 2020 - Dec 2022"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...experienceForm.register("duration")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...experienceForm.register("startDate")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...experienceForm.register("endDate")}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="expDescription">Description</Label>
                <Textarea
                  id="expDescription"
                  rows={3}
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan resize-none"
                  {...experienceForm.register("description")}
                />
              </div>
              
              <Button
                type="submit"
                disabled={experienceMutation.isPending}
                className="md:col-span-2 bg-gradient-to-r from-neon-cyan to-neon-green text-slate-900 font-semibold"
              >
                {experienceMutation.isPending ? "Adding..." : "Add Experience"}
                <Plus className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </GlassCard>
        )}

        {/* Education Section */}
        {activeSection === "education" && (
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-neon-cyan">Manage Education</h3>
            </div>
            
            {/* Education List */}
            <div className="space-y-4 mb-8">
              {education.map((edu) => (
                <div key={edu.id} className="bg-slate-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h5 className="font-semibold text-lg text-neon-cyan">{edu.degree}</h5>
                      <p className="text-white">{edu.institution}</p>
                      <p className="text-sm text-slate-400">{edu.year}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteEducationMutation.mutate(edu.id)}
                      disabled={deleteEducationMutation.isPending}
                      className="text-red-400 border-red-400 hover:bg-red-400 hover:text-slate-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {edu.description && (
                    <p className="text-slate-300">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
            
            {/* Add Education Form */}
            <form
              onSubmit={educationForm.handleSubmit((data) => educationMutation.mutate(data))}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  placeholder="e.g., Bachelor of Computer Science"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...educationForm.register("degree")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  placeholder="e.g., University of Technology"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...educationForm.register("institution")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  placeholder="e.g., 2018 - 2022"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...educationForm.register("year")}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="eduDescription">Description (Optional)</Label>
                <Textarea
                  id="eduDescription"
                  rows={3}
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan resize-none"
                  {...educationForm.register("description")}
                />
              </div>
              
              <Button
                type="submit"
                disabled={educationMutation.isPending}
                className="md:col-span-2 bg-gradient-to-r from-neon-cyan to-neon-green text-slate-900 font-semibold"
              >
                {educationMutation.isPending ? "Adding..." : "Add Education"}
                <Plus className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </GlassCard>
        )}

        {/* Activities Section */}
        {activeSection === "activities" && (
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-neon-cyan">Manage Activities</h3>
            </div>
            
            {/* Activities List */}
            <div className="space-y-4 mb-8">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-slate-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <i className={`${activity.icon} text-2xl text-neon-cyan mr-4`}></i>
                      <div>
                        <h5 className="font-semibold text-lg">{activity.title}</h5>
                        <p className="text-sm text-slate-400">{activity.category}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteActivityMutation.mutate(activity.id)}
                      disabled={deleteActivityMutation.isPending}
                      className="text-red-400 border-red-400 hover:bg-red-400 hover:text-slate-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-slate-300">{activity.description}</p>
                </div>
              ))}
            </div>
            
            {/* Add Activity Form */}
            <form
              onSubmit={activityForm.handleSubmit((data) => activityMutation.mutate(data))}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <Label htmlFor="activityTitle">Title</Label>
                <Input
                  id="activityTitle"
                  placeholder="e.g., Open Source Contributor"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...activityForm.register("title")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activityCategory">Category</Label>
                <Input
                  id="activityCategory"
                  placeholder="e.g., Development"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...activityForm.register("category")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activityIcon">Icon Class</Label>
                <Input
                  id="activityIcon"
                  placeholder="e.g., fas fa-code"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...activityForm.register("icon")}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="activityDescription">Description</Label>
                <Textarea
                  id="activityDescription"
                  rows={3}
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan resize-none"
                  {...activityForm.register("description")}
                />
              </div>
              
              <Button
                type="submit"
                disabled={activityMutation.isPending}
                className="md:col-span-2 bg-gradient-to-r from-neon-cyan to-neon-green text-slate-900 font-semibold"
              >
                {activityMutation.isPending ? "Adding..." : "Add Activity"}
                <Plus className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </GlassCard>
        )}

        {/* Articles Section */}
        {activeSection === "articles" && (
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-neon-cyan">Manage Articles</h3>
            </div>
            
            {/* Articles List */}
            <div className="space-y-4 mb-8">
              {articles.map((article) => (
                <div key={article.id} className="bg-slate-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div>
                        <h5 className="font-semibold text-lg text-neon-cyan">{article.title}</h5>
                        <p className="text-sm text-slate-400">{article.category} • {article.date}</p>
                        <p className="text-sm text-slate-500 mt-1">{article.excerpt}</p>
                        <span className={`text-xs px-2 py-1 rounded ${article.published ? 'bg-green-600' : 'bg-red-600'} mt-2 inline-block`}>
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteArticleMutation.mutate(article.id)}
                      disabled={deleteArticleMutation.isPending}
                      className="text-red-400 border-red-400 hover:bg-red-400 hover:text-slate-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add Article Form */}
            <form
              onSubmit={articleForm.handleSubmit((data) => {
                // Set current date if not provided
                if (!data.date) {
                  data.date = new Date().toLocaleDateString();
                }
                articleMutation.mutate(data);
              })}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <Label htmlFor="articleTitle">Title</Label>
                <Input
                  id="articleTitle"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...articleForm.register("title")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="articleCategory">Category</Label>
                <Input
                  id="articleCategory"
                  placeholder="e.g., Web Development"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...articleForm.register("category")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="articleImage">Image URL</Label>
                <Input
                  id="articleImage"
                  placeholder="https://example.com/image.jpg"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...articleForm.register("image")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="articleDate">Date</Label>
                <Input
                  id="articleDate"
                  type="date"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...articleForm.register("date")}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="articleExcerpt">Excerpt</Label>
                <Textarea
                  id="articleExcerpt"
                  rows={2}
                  placeholder="Brief description of the article..."
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan resize-none"
                  {...articleForm.register("excerpt")}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="articleContent">Content</Label>
                <Textarea
                  id="articleContent"
                  rows={6}
                  placeholder="Full article content..."
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan resize-none"
                  {...articleForm.register("content")}
                />
              </div>
              
              <div className="flex items-center space-x-2 md:col-span-2">
                <input
                  type="checkbox"
                  id="published"
                  className="w-4 h-4 text-neon-cyan bg-gray-100 border-gray-300 rounded focus:ring-neon-cyan"
                  {...articleForm.register("published")}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
              
              <Button
                type="submit"
                disabled={articleMutation.isPending}
                className="md:col-span-2 bg-gradient-to-r from-neon-cyan to-neon-green text-slate-900 font-semibold"
              >
                {articleMutation.isPending ? "Adding..." : "Add Article"}
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
