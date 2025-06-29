import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import GlassCard from "@/components/glass-card";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LogOut, Edit, Trash2, Plus, Check } from "lucide-react";
import {
  insertBiodataSchema, insertSkillSchema, insertExperienceSchema,
  insertEducationSchema, insertActivitySchema, insertArticleSchema,
  insertServiceSchema, insertProjectSchema, insertSocialLinkSchema,
  type Biodata, type Skill, type Experience, type Education,
  type Activity, type Article, type ContactMessage,
  type Service, type InsertService, type Project, type SocialLink
} from "@shared/schema";
import { Dialog } from "@/components/ui/dialog";
import ParticleBackground from "@/components/particle-background";

type AdminSection = "biodata" | "skills" | "experience" | "education" | "activities" | "articles" | "services" | "contacts" | "projects" | "social-links";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<AdminSection>("biodata");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  // Edit states for all entities
  const [editActivity, setEditActivity] = useState<Activity | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [isEditSkillModalOpen, setIsEditSkillModalOpen] = useState(false);
  
  const [editExperience, setEditExperience] = useState<Experience | null>(null);
  const [isEditExperienceModalOpen, setIsEditExperienceModalOpen] = useState(false);
  
  const [editEducation, setEditEducation] = useState<Education | null>(null);
  const [isEditEducationModalOpen, setIsEditEducationModalOpen] = useState(false);
  
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [isEditArticleModalOpen, setIsEditArticleModalOpen] = useState(false);

  const [editProject, setEditProject] = useState<Project | null>(null);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);

  const [editSocialLink, setEditSocialLink] = useState<SocialLink | null>(null);
  const [isEditSocialLinkModalOpen, setIsEditSocialLinkModalOpen] = useState(false);

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

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: socialLinks = [] } = useQuery<SocialLink[]>({
    queryKey: ["/api/social-links"],
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
      image: "",
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
      image: "",
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

  const editActivityForm = useForm({
    resolver: zodResolver(insertActivitySchema.partial()),
    defaultValues: {
      title: "",
      description: "",
      icon: "",
      category: "",
      image: "",
    },
  });

  useEffect(() => {
    if (editActivity) {
      editActivityForm.reset({
        ...editActivity,
        image: editActivity.image || undefined
      });
    }
  }, [editActivity]);

  const updateActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!editActivity) return;
      const response = await apiRequest("PUT", `/api/activities/${editActivity.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Activity updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setIsEditModalOpen(false);
      setEditActivity(null);
    },
    onError: () => {
      toast({ title: "Failed to update activity", variant: "destructive" });
    },
  });

  // Edit forms for other entities
  const editSkillForm = useForm({
    resolver: zodResolver(insertSkillSchema.partial()),
    defaultValues: {
      name: "",
      level: "",
      percentage: 0,
      icon: "",
      category: "",
    },
  });

  useEffect(() => {
    if (editSkill) {
      editSkillForm.reset(editSkill);
    }
  }, [editSkill]);

  const updateSkillMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!editSkill) return;
      const response = await apiRequest("PUT", `/api/skills/${editSkill.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Skill updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      setIsEditSkillModalOpen(false);
      setEditSkill(null);
    },
    onError: () => {
      toast({ title: "Failed to update skill", variant: "destructive" });
    },
  });

  const editExperienceForm = useForm({
    resolver: zodResolver(insertExperienceSchema.partial()),
    defaultValues: {
      position: "",
      company: "",
      duration: "",
      description: "",
      startDate: "",
      endDate: "",
      image: "",
    },
  });

  useEffect(() => {
    if (editExperience) {
      editExperienceForm.reset({
        ...editExperience,
        endDate: editExperience.endDate || undefined,
        image: editExperience.image || undefined
      });
    }
  }, [editExperience]);

  const updateExperienceMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!editExperience) return;
      const response = await apiRequest("PUT", `/api/experiences/${editExperience.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Experience updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      setIsEditExperienceModalOpen(false);
      setEditExperience(null);
    },
    onError: () => {
      toast({ title: "Failed to update experience", variant: "destructive" });
    },
  });

  const editEducationForm = useForm({
    resolver: zodResolver(insertEducationSchema.partial()),
    defaultValues: {
      degree: "",
      institution: "",
      year: "",
      description: "",
    },
  });

  useEffect(() => {
    if (editEducation) {
      editEducationForm.reset({
        ...editEducation,
        description: editEducation.description || undefined
      });
    }
  }, [editEducation]);

  const updateEducationMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!editEducation) return;
      const response = await apiRequest("PUT", `/api/education/${editEducation.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Education updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/education"] });
      setIsEditEducationModalOpen(false);
      setEditEducation(null);
    },
    onError: () => {
      toast({ title: "Failed to update education", variant: "destructive" });
    },
  });

  const editArticleForm = useForm({
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

  useEffect(() => {
    if (editArticle) {
      editArticleForm.reset({
        ...editArticle,
        published: editArticle.published ?? true
      });
    }
  }, [editArticle]);

  const updateArticleMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!editArticle) return;
      const response = await apiRequest("PUT", `/api/articles/${editArticle.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Article updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/articles/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      setIsEditArticleModalOpen(false);
      setEditArticle(null);
    },
    onError: () => {
      toast({ title: "Failed to update article", variant: "destructive" });
    },
  });

  const serviceForm = useForm<InsertService>({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
    },
  });

  const serviceMutation = useMutation({
    mutationFn: async (data: InsertService) => {
      const response = await apiRequest("POST", "/api/services", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Service added successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      serviceForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to add service", variant: "destructive" });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/services/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Service deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
    onError: () => {
      toast({ title: "Failed to delete service", variant: "destructive" });
    },
  });

  const projectForm = useForm({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      year: "",
      link: "",
      image: "",
    },
  });

  const projectMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Project added successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      projectForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to add project", variant: "destructive" });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Project deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: () => {
      toast({ title: "Failed to delete project", variant: "destructive" });
    },
  });

  const editProjectForm = useForm({
    resolver: zodResolver(insertProjectSchema.partial()),
    defaultValues: {
      title: "",
      description: "",
      year: "",
      link: "",
      image: "",
    },
  });

  useEffect(() => {
    if (editProject) {
      editProjectForm.reset({
        ...editProject,
        link: editProject.link || undefined,
        image: editProject.image || undefined
      });
    }
  }, [editProject]);

  const updateProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!editProject) return;
      const response = await apiRequest("PUT", `/api/projects/${editProject.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Project updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsEditProjectModalOpen(false);
      setEditProject(null);
    },
    onError: () => {
      toast({ title: "Failed to update project", variant: "destructive" });
    },
  });

  // Social Link form
  const socialLinkForm = useForm({
    resolver: zodResolver(insertSocialLinkSchema),
    defaultValues: {
      platform: "",
      url: "",
      icon: "",
    },
  });

  const socialLinkMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/social-links", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Social link added successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/social-links"] });
      socialLinkForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to add social link", variant: "destructive" });
    },
  });

  const deleteSocialLinkMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/social-links/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Social link deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/social-links"] });
    },
    onError: () => {
      toast({ title: "Failed to delete social link", variant: "destructive" });
    },
  });

  const editSocialLinkForm = useForm({
    resolver: zodResolver(insertSocialLinkSchema.partial()),
    defaultValues: {
      platform: "",
      url: "",
      icon: "",
    },
  });

  useEffect(() => {
    if (editSocialLink) {
      editSocialLinkForm.reset(editSocialLink);
    }
  }, [editSocialLink, editSocialLinkForm]);

  const updateSocialLinkMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!editSocialLink) return;
      const response = await apiRequest("PUT", `/api/social-links/${editSocialLink.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Social link updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/social-links"] });
      setIsEditSocialLinkModalOpen(false);
      setEditSocialLink(null);
    },
    onError: () => {
      toast({ title: "Failed to update social link", variant: "destructive" });
    },
  });

  const navItems = [
    { id: "biodata", label: "Biodata" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "activities", label: "Activities" },
    { id: "articles", label: "Articles" },
    { id: "services", label: "Services" },
    { id: "contacts", label: "Contact Messages" },
    { id: "projects", label: "Projects" },
    { id: "social-links", label: "Social Links" },
  ];

  function resetEditStates() {
    setEditSkill(null);
    setEditExperience(null);
    setEditEducation(null);
    setEditActivity(null);
    setEditArticle(null);
    setEditProject(null);
    setEditSocialLink(null);
  }

  return (
    <div className="min-h-screen pt-20 py-8 relative overflow-hidden">
      <ParticleBackground />
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
                <Label htmlFor="profileImage">Profile Image</Label>
                <FileUpload
                  endpoint="/api/upload/biodata"
                  onUploadSuccess={(imageUrl) => {
                    biodataForm.setValue("profileImage", imageUrl);
                    toast({ title: "Image uploaded successfully!" });
                  }}
                  onUploadError={(error) => {
                    toast({ title: "Upload failed", description: error, variant: "destructive" });
                  }}
                  label="Upload Profile Image"
                />
                {biodataForm.watch("profileImage") && (
                  <div className="mt-2">
                    <img
                      src={biodataForm.watch("profileImage") || ""}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-slate-600"
                    />
                  </div>
                )}
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
                      onClick={() => { resetEditStates(); setEditSkill(skill); setIsEditSkillModalOpen(true); }}
                      className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-slate-900"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSkillMutation.mutate(skill.id)}
                      disabled={deleteSkillMutation.isPending}
                      className="text-red-400 border-red-400 hover:bg-red-400 hover:text-slate-900"
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
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { resetEditStates(); setEditExperience(exp); setIsEditExperienceModalOpen(true); }}
                        className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-slate-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
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
              
              <div className="space-y-2">
                <Label htmlFor="experienceImage">Company/Project Image</Label>
                <FileUpload
                  endpoint="/api/upload/experience"
                  onUploadSuccess={(imageUrl) => {
                    experienceForm.setValue("image", imageUrl);
                    toast({ title: "Image uploaded successfully!" });
                  }}
                  onUploadError={(error) => {
                    toast({ title: "Upload failed", description: error, variant: "destructive" });
                  }}
                  label="Upload Company/Project Image"
                />
                {experienceForm.watch("image") && (
                  <div className="mt-2">
                    <img
                      src={experienceForm.watch("image") || ""}
                      alt="Experience"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-slate-600"
                    />
                  </div>
                )}
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
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { resetEditStates(); setEditEducation(edu); setIsEditEducationModalOpen(true); }}
                        className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-slate-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
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
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { resetEditStates(); setEditActivity(activity); setIsEditModalOpen(true); }}
                        className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-slate-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
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
              
              <div className="space-y-2">
                <Label htmlFor="activityImage">Activity Image</Label>
                <FileUpload
                  endpoint="/api/upload/activity"
                  onUploadSuccess={(imageUrl) => {
                    activityForm.setValue("image", imageUrl);
                    toast({ title: "Image uploaded successfully!" });
                  }}
                  onUploadError={(error) => {
                    toast({ title: "Upload failed", description: error, variant: "destructive" });
                  }}
                  label="Upload Activity Image"
                />
                {activityForm.watch("image") && (
                  <div className="mt-2">
                    <img
                      src={activityForm.watch("image") || ""}
                      alt="Activity"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-slate-600"
                    />
                  </div>
                )}
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
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { resetEditStates(); setEditArticle(article); setIsEditArticleModalOpen(true); }}
                        className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-slate-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
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
                console.log("DATA SUBMIT:", data);
                articleMutation.mutate(data);
              }, (errors) => {
                console.log("FORM ERRORS:", errors);
                toast({ 
                  title: "Form tidak valid", 
                  description: JSON.stringify(errors, null, 2), 
                  variant: "destructive" 
                });
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
                <Label htmlFor="articleImage">Article Image</Label>
                <FileUpload
                  endpoint="/api/upload/article"
                  onUploadSuccess={(imageUrl) => {
                    articleForm.setValue("image", imageUrl);
                    toast({ title: "Image uploaded successfully!" });
                  }}
                  onUploadError={(error) => {
                    toast({ title: "Upload failed", description: error, variant: "destructive" });
                  }}
                  label="Upload Article Image"
                />
                {articleForm.watch("image") && (
                  <div className="mt-2">
                    <img
                      src={articleForm.watch("image") || ""}
                      alt="Article"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-slate-600"
                    />
                  </div>
                )}
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

        {/* Services Section */}
        {activeSection === "services" && (
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-neon-cyan">Manage Services</h3>
            </div>
            {/* List Services */}
            <div className="space-y-4 mb-8">
              {services.length > 0 ? services.map((service) => (
                <div key={service.id} className="flex items-center justify-between bg-slate-800 rounded-lg p-4">
                  <div>
                    <h5 className="font-semibold text-lg text-neon-cyan">{service.name}</h5>
                    <p className="text-neon-green font-semibold">{service.price}</p>
                    {service.description && <p className="text-slate-300 mt-1">{service.description}</p>}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteServiceMutation.mutate(service.id)}
                    disabled={deleteServiceMutation.isPending}
                    className="text-red-400 border-red-400 hover:bg-red-400 hover:text-slate-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )) : (
                <div className="text-center text-slate-400">No services available.</div>
              )}
            </div>
            {/* Add Service Form */}
            <form
              onSubmit={serviceForm.handleSubmit((data) => serviceMutation.mutate(data))}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name</Label>
                <Input
                  id="serviceName"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...serviceForm.register("name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servicePrice">Price</Label>
                <Input
                  id="servicePrice"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...serviceForm.register("price")}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="serviceDescription">Description (Optional)</Label>
                <Textarea
                  id="serviceDescription"
                  rows={2}
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan resize-none"
                  {...serviceForm.register("description")}
                />
              </div>
              <Button
                type="submit"
                disabled={serviceMutation.isPending}
                className="md:col-span-2 bg-gradient-to-r from-neon-cyan to-neon-green text-slate-900 font-semibold"
              >
                {serviceMutation.isPending ? "Adding..." : "Add Service"}
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

        {/* Projects Section */}
        {activeSection === "projects" && (
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-neon-cyan">Manage Projects</h3>
            </div>
            {/* Projects List */}
            <div className="space-y-4 mb-8">
              {projects.map((project) => (
                <div key={project.id} className="bg-slate-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h5 className="font-semibold text-lg text-neon-cyan">{project.title}</h5>
                      <p className="text-white">{project.year}</p>
                      {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-neon-cyan underline text-sm">{project.link}</a>}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => { resetEditStates(); setEditProject(project); setIsEditProjectModalOpen(true); }} className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-slate-900"><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => deleteProjectMutation.mutate(project.id)} disabled={deleteProjectMutation.isPending} className="text-red-400 border-red-400 hover:bg-red-400 hover:text-slate-900"><Trash2 className="h-4 w-4" /></Button>
                    </div>

                  </div>
                  {project.image && <img src={project.image} alt={project.title} className="w-32 h-32 object-cover rounded-lg border-2 border-slate-600 mb-2" />}
                  <p className="text-slate-300">{project.description}</p>
                </div>
              ))}
            </div>
            {/* Add Project Form */}
            <form onSubmit={projectForm.handleSubmit((data) => projectMutation.mutate(data))} className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="projectTitle">Title</Label>
                <Input id="projectTitle" className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan" {...projectForm.register("title")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectYear">Year</Label>
                <Input id="projectYear" className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan" {...projectForm.register("year")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectLink">Link (optional)</Label>
                <Input id="projectLink" className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan" {...projectForm.register("link")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectImage">Project Image</Label>
                <FileUpload endpoint="/api/upload/activity" onUploadSuccess={(imageUrl) => { projectForm.setValue("image", imageUrl); toast({ title: "Image uploaded successfully!" }); }} onUploadError={(error) => { toast({ title: "Upload failed", description: error, variant: "destructive" }); }} label="Upload Project Image" />
                {projectForm.watch("image") && (<div className="mt-2"><img src={projectForm.watch("image") || ""} alt="Project" className="w-32 h-32 object-cover rounded-lg border-2 border-slate-600" /></div>)}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="projectDescription">Description</Label>
                <Textarea id="projectDescription" rows={3} className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan resize-none" {...projectForm.register("description")} />
              </div>
              <Button type="submit" disabled={projectMutation.isPending} className="md:col-span-2 bg-gradient-to-r from-neon-cyan to-neon-green text-slate-900 font-semibold">{projectMutation.isPending ? "Adding..." : "Add Project"}<Plus className="ml-2 h-4 w-4" /></Button>
            </form>
            {/* Edit Project Modal */}
            {isEditProjectModalOpen && (
              <Dialog open={isEditProjectModalOpen} onOpenChange={setIsEditProjectModalOpen}>
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                  <div className="bg-slate-900 rounded-xl p-8 w-full max-w-lg">
                    <h3 className="text-xl font-bold mb-4 text-neon-cyan">Edit Project</h3>
                    <form onSubmit={editProjectForm.handleSubmit((data) => updateProjectMutation.mutate(data))} className="space-y-4">
                      <div>
                        <Label htmlFor="editProjectTitle">Title</Label>
                        <Input id="editProjectTitle" className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan" {...editProjectForm.register("title")} />
                      </div>
                      <div>
                        <Label htmlFor="editProjectYear">Year</Label>
                        <Input id="editProjectYear" className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan" {...editProjectForm.register("year")} />
                      </div>
                      <div>
                        <Label htmlFor="editProjectLink">Link</Label>
                        <Input id="editProjectLink" className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan" {...editProjectForm.register("link")} />
                      </div>
                      <div>
                        <Label htmlFor="editProjectImage">Project Image</Label>
                        <FileUpload endpoint="/api/upload/activity" onUploadSuccess={(imageUrl) => editProjectForm.setValue("image", imageUrl)} label="Upload Project Image" />
                        {editProjectForm.watch("image") && (<div className="mt-2"><img src={editProjectForm.watch("image") || ""} alt="Project" className="w-32 h-32 object-cover rounded-lg border-2 border-slate-600" /></div>)}
                      </div>
                      <div>
                        <Label htmlFor="editProjectDescription">Description</Label>
                        <Textarea id="editProjectDescription" rows={3} className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan resize-none" {...editProjectForm.register("description")} />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditProjectModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={updateProjectMutation.isPending}>{updateProjectMutation.isPending ? "Saving..." : "Save Changes"}</Button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog>
            )}
          </GlassCard>
        )}

        {/* Social Links Section */}
        {activeSection === "social-links" && (
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-neon-cyan">Manage Social Links</h3>
            </div>
            
            {/* Social Links List */}
            <div className="space-y-4 mb-8">
              {socialLinks.length > 0 ? (
                socialLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                        <i className={`${link.icon} text-xl text-neon-cyan`}></i>
                      </div>
                      <div>
                        <h5 className="font-semibold text-lg text-neon-cyan">{link.platform}</h5>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-neon-cyan underline text-sm hover:text-neon-green transition-colors"
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { resetEditStates(); setEditSocialLink(link); setIsEditSocialLinkModalOpen(true); }}
                        className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-slate-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteSocialLinkMutation.mutate(link.id)}
                        disabled={deleteSocialLinkMutation.isPending}
                        className="text-red-400 border-red-400 hover:bg-red-400 hover:text-slate-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  No social links added yet.
                </div>
              )}
            </div>
            
            {/* Add Social Link Form */}
            <form
              onSubmit={socialLinkForm.handleSubmit((data) => socialLinkMutation.mutate(data))}
              className="grid md:grid-cols-3 gap-6"
            >
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Input
                  id="platform"
                  placeholder="e.g., Instagram, LinkedIn, WhatsApp"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...socialLinkForm.register("platform")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://www.instagram.com/your_username"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...socialLinkForm.register("url")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Class</Label>
                <Input
                  id="icon"
                  placeholder="fab fa-instagram"
                  className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan"
                  {...socialLinkForm.register("icon")}
                />
              </div>
              <Button
                type="submit"
                disabled={socialLinkMutation.isPending}
                className="md:col-span-3 bg-gradient-to-r from-neon-cyan to-neon-green text-slate-900 font-semibold"
              >
                {socialLinkMutation.isPending ? "Adding..." : "Add Social Link"}
                <Plus className="ml-2 h-4 w-4" />
              </Button>
            </form>

            {/* Edit Social Link Modal */}
            {isEditSocialLinkModalOpen && (
              <Dialog open={isEditSocialLinkModalOpen} onOpenChange={setIsEditSocialLinkModalOpen}>
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                  <div className="bg-slate-900 rounded-xl p-8 w-full max-w-lg">
                    <h3 className="text-xl font-bold mb-4 text-neon-cyan">Edit Social Link</h3>
                    <form onSubmit={editSocialLinkForm.handleSubmit((data) => updateSocialLinkMutation.mutate(data))} className="space-y-4">
                      <div>
                        <Label htmlFor="editPlatform">Platform</Label>
                        <Input 
                          id="editPlatform" 
                          className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan" 
                          {...editSocialLinkForm.register("platform")} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="editUrl">URL</Label>
                        <Input 
                          id="editUrl" 
                          className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan" 
                          {...editSocialLinkForm.register("url")} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="editIcon">Icon Class</Label>
                        <Input 
                          id="editIcon" 
                          className="bg-transparent border-2 border-slate-600 focus:border-neon-cyan" 
                          {...editSocialLinkForm.register("icon")} 
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditSocialLinkModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={updateSocialLinkMutation.isPending}>
                          {updateSocialLinkMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog>
            )}
          </GlassCard>
        )}
      </div>
    </div>
  );
}

