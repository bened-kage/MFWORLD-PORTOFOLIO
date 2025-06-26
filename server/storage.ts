import { 
  users, biodata, skills, experiences, education, activities, articles, contactMessages, socialLinks, services,
  type User, type InsertUser, type Biodata, type InsertBiodata, type Skill, type InsertSkill,
  type Experience, type InsertExperience, type Education, type InsertEducation, type Activity, type InsertActivity,
  type Article, type InsertArticle, type ContactMessage, type InsertContactMessage, type SocialLink, type InsertSocialLink,
  type Service, type InsertService
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Biodata methods
  getBiodata(): Promise<Biodata | undefined>;
  updateBiodata(data: InsertBiodata): Promise<Biodata>;

  // Skills methods
  getSkills(): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: number): Promise<boolean>;

  // Experience methods
  getExperiences(): Promise<Experience[]>;
  getExperience(id: number): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience>;
  deleteExperience(id: number): Promise<boolean>;

  // Education methods
  getEducation(): Promise<Education[]>;
  getEducationItem(id: number): Promise<Education | undefined>;
  createEducation(education: InsertEducation): Promise<Education>;
  updateEducation(id: number, education: Partial<InsertEducation>): Promise<Education>;
  deleteEducation(id: number): Promise<boolean>;

  // Activities methods
  getActivities(): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity>;
  deleteActivity(id: number): Promise<boolean>;

  // Articles methods
  getArticles(): Promise<Article[]>;
  getPublishedArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: number): Promise<boolean>;

  // Contact messages methods
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: number): Promise<boolean>;
  deleteContactMessage(id: number): Promise<boolean>;

  // Social links methods
  getSocialLinks(): Promise<SocialLink[]>;
  createSocialLink(link: InsertSocialLink): Promise<SocialLink>;
  updateSocialLink(id: number, link: Partial<InsertSocialLink>): Promise<SocialLink>;
  deleteSocialLink(id: number): Promise<boolean>;

  // Services methods
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private biodata: Map<number, Biodata>;
  private skills: Map<number, Skill>;
  private experiences: Map<number, Experience>;
  private education: Map<number, Education>;
  private activities: Map<number, Activity>;
  private articles: Map<number, Article>;
  private contactMessages: Map<number, ContactMessage>;
  private socialLinks: Map<number, SocialLink>;
  private services: Map<number, Service>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.biodata = new Map();
    this.skills = new Map();
    this.experiences = new Map();
    this.education = new Map();
    this.activities = new Map();
    this.articles = new Map();
    this.contactMessages = new Map();
    this.socialLinks = new Map();
    this.services = new Map();
    this.currentId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Initialize default admin user
    this.users.set(1, { id: 1, username: "admin", password: "admin123" });
    
    // Initialize default biodata
    this.biodata.set(1, {
      id: 1,
      name: "Portfolio Owner",
      title: "Full Stack Developer",
      bio: "Passionate developer creating modern web applications with cutting-edge technologies.",
      email: "contact@portfolio.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
    });

    // Initialize default social links
    this.socialLinks.set(1, { id: 1, platform: "GitHub", url: "https://github.com", icon: "fab fa-github" });
    this.socialLinks.set(2, { id: 2, platform: "LinkedIn", url: "https://linkedin.com", icon: "fab fa-linkedin" });
    this.socialLinks.set(3, { id: 3, platform: "Twitter", url: "https://twitter.com", icon: "fab fa-twitter" });

    // Initialize default services
    this.services.set(1, { id: 1, name: "Website Development", price: "$2,500+", description: "Custom website development" });
    this.services.set(2, { id: 2, name: "Web Application", price: "$5,000+", description: "Full-stack web applications" });
    this.services.set(3, { id: 3, name: "UI/UX Design", price: "$1,500+", description: "Modern UI/UX design services" });
    this.services.set(4, { id: 4, name: "Consultation", price: "$150/hour", description: "Technical consultation" });

    this.currentId = 10;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Biodata methods
  async getBiodata(): Promise<Biodata | undefined> {
    return Array.from(this.biodata.values())[0];
  }

  async updateBiodata(data: InsertBiodata): Promise<Biodata> {
    const existing = Array.from(this.biodata.values())[0];
    const id = existing?.id || this.currentId++;
    const biodata: Biodata = { ...data, id };
    this.biodata.set(id, biodata);
    return biodata;
  }

  // Skills methods
  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values());
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    return this.skills.get(id);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const id = this.currentId++;
    const newSkill: Skill = { ...skill, id };
    this.skills.set(id, newSkill);
    return newSkill;
  }

  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill> {
    const existing = this.skills.get(id);
    if (!existing) throw new Error("Skill not found");
    const updated: Skill = { ...existing, ...skill };
    this.skills.set(id, updated);
    return updated;
  }

  async deleteSkill(id: number): Promise<boolean> {
    return this.skills.delete(id);
  }

  // Experience methods
  async getExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values());
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const id = this.currentId++;
    const newExperience: Experience = { ...experience, id };
    this.experiences.set(id, newExperience);
    return newExperience;
  }

  async updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience> {
    const existing = this.experiences.get(id);
    if (!existing) throw new Error("Experience not found");
    const updated: Experience = { ...existing, ...experience };
    this.experiences.set(id, updated);
    return updated;
  }

  async deleteExperience(id: number): Promise<boolean> {
    return this.experiences.delete(id);
  }

  // Education methods
  async getEducation(): Promise<Education[]> {
    return Array.from(this.education.values());
  }

  async getEducationItem(id: number): Promise<Education | undefined> {
    return this.education.get(id);
  }

  async createEducation(education: InsertEducation): Promise<Education> {
    const id = this.currentId++;
    const newEducation: Education = { ...education, id };
    this.education.set(id, newEducation);
    return newEducation;
  }

  async updateEducation(id: number, education: Partial<InsertEducation>): Promise<Education> {
    const existing = this.education.get(id);
    if (!existing) throw new Error("Education not found");
    const updated: Education = { ...existing, ...education };
    this.education.set(id, updated);
    return updated;
  }

  async deleteEducation(id: number): Promise<boolean> {
    return this.education.delete(id);
  }

  // Activities methods
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const newActivity: Activity = { ...activity, id };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  async updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity> {
    const existing = this.activities.get(id);
    if (!existing) throw new Error("Activity not found");
    const updated: Activity = { ...existing, ...activity };
    this.activities.set(id, updated);
    return updated;
  }

  async deleteActivity(id: number): Promise<boolean> {
    return this.activities.delete(id);
  }

  // Articles methods
  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }

  async getPublishedArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(article => article.published);
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const id = this.currentId++;
    const newArticle: Article = { ...article, id };
    this.articles.set(id, newArticle);
    return newArticle;
  }

  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article> {
    const existing = this.articles.get(id);
    if (!existing) throw new Error("Article not found");
    const updated: Article = { ...existing, ...article };
    this.articles.set(id, updated);
    return updated;
  }

  async deleteArticle(id: number): Promise<boolean> {
    return this.articles.delete(id);
  }

  // Contact messages methods
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentId++;
    const newMessage: ContactMessage = { 
      ...message, 
      id, 
      date: new Date().toLocaleDateString(),
      read: false 
    };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const message = this.contactMessages.get(id);
    if (!message) return false;
    message.read = true;
    this.contactMessages.set(id, message);
    return true;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    return this.contactMessages.delete(id);
  }

  // Social links methods
  async getSocialLinks(): Promise<SocialLink[]> {
    return Array.from(this.socialLinks.values());
  }

  async createSocialLink(link: InsertSocialLink): Promise<SocialLink> {
    const id = this.currentId++;
    const newLink: SocialLink = { ...link, id };
    this.socialLinks.set(id, newLink);
    return newLink;
  }

  async updateSocialLink(id: number, link: Partial<InsertSocialLink>): Promise<SocialLink> {
    const existing = this.socialLinks.get(id);
    if (!existing) throw new Error("Social link not found");
    const updated: SocialLink = { ...existing, ...link };
    this.socialLinks.set(id, updated);
    return updated;
  }

  async deleteSocialLink(id: number): Promise<boolean> {
    return this.socialLinks.delete(id);
  }

  // Services methods
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async createService(service: InsertService): Promise<Service> {
    const id = this.currentId++;
    const newService: Service = { ...service, id };
    this.services.set(id, newService);
    return newService;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const existing = this.services.get(id);
    if (!existing) throw new Error("Service not found");
    const updated: Service = { ...existing, ...service };
    this.services.set(id, updated);
    return updated;
  }

  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }
}

export const storage = new MemStorage();
