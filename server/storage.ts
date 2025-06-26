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
      name: "John Developer",
      title: "Full Stack Developer",
      bio: "Passionate developer creating modern web applications with cutting-edge technologies. Experienced in React, Node.js, and cloud solutions.",
      email: "john@portfolio.com",
      phone: "+62 812-3456-7890",
      location: "Jakarta, Indonesia",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
    });

    // Initialize sample skills
    this.skills.set(1, { id: 1, name: "JavaScript", level: "Expert", percentage: 95, icon: "fab fa-js-square", category: "Frontend" });
    this.skills.set(2, { id: 2, name: "React", level: "Advanced", percentage: 90, icon: "fab fa-react", category: "Frontend" });
    this.skills.set(3, { id: 3, name: "Node.js", level: "Advanced", percentage: 85, icon: "fab fa-node-js", category: "Backend" });
    this.skills.set(4, { id: 4, name: "TypeScript", level: "Advanced", percentage: 88, icon: "fab fa-js-square", category: "Programming" });
    this.skills.set(5, { id: 5, name: "Python", level: "Intermediate", percentage: 75, icon: "fab fa-python", category: "Backend" });

    // Initialize sample experiences
    this.experiences.set(1, {
      id: 1,
      position: "Senior Full Stack Developer",
      company: "TechCorp Indonesia",
      duration: "Jan 2022 - Present",
      description: "Leading development of modern web applications using React, Node.js, and cloud technologies. Managed a team of 5 developers and improved application performance by 40%.",
      startDate: "2022-01-01",
      endDate: null
    });
    this.experiences.set(2, {
      id: 2,
      position: "Frontend Developer",
      company: "StartupXYZ",
      duration: "Jun 2020 - Dec 2021",
      description: "Developed responsive user interfaces using React and TypeScript. Collaborated with design team to implement modern UI/UX solutions.",
      startDate: "2020-06-01",
      endDate: "2021-12-31"
    });

    // Initialize sample education
    this.education.set(1, {
      id: 1,
      degree: "Bachelor of Computer Science",
      institution: "Universitas Indonesia",
      year: "2016 - 2020",
      description: "Graduated Cum Laude with focus on Software Engineering and Web Development."
    });

    // Initialize sample activities
    this.activities.set(1, {
      id: 1,
      title: "Open Source Contributor",
      description: "Active contributor to various open source projects on GitHub, focusing on React and Node.js libraries.",
      icon: "fab fa-github",
      category: "Development"
    });
    this.activities.set(2, {
      id: 2,
      title: "Tech Community Speaker",
      description: "Regular speaker at tech meetups and conferences about modern web development.",
      icon: "fas fa-microphone",
      category: "Community"
    });

    // Initialize sample articles
    this.articles.set(1, {
      id: 1,
      title: "Building Modern React Applications",
      excerpt: "Learn how to build scalable and maintainable React applications using modern best practices.",
      content: "React has evolved significantly over the years. In this article, we'll explore the latest patterns and practices for building modern React applications...",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      date: "2024-01-15",
      published: true
    });
    this.articles.set(2, {
      id: 2,
      title: "Node.js Performance Optimization",
      excerpt: "Tips and techniques to optimize your Node.js applications for better performance.",
      content: "Performance is crucial for any web application. Here are some proven techniques to optimize your Node.js applications...",
      category: "Backend Development",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      date: "2024-01-10",
      published: true
    });

    // Initialize default social links
    this.socialLinks.set(1, { id: 1, platform: "GitHub", url: "https://github.com/johndeveloper", icon: "fab fa-github" });
    this.socialLinks.set(2, { id: 2, platform: "LinkedIn", url: "https://linkedin.com/in/johndeveloper", icon: "fab fa-linkedin" });
    this.socialLinks.set(3, { id: 3, platform: "Twitter", url: "https://twitter.com/johndeveloper", icon: "fab fa-twitter" });

    // Initialize default services
    this.services.set(1, { id: 1, name: "Website Development", price: "Rp 25.000.000+", description: "Custom website development with modern technologies" });
    this.services.set(2, { id: 2, name: "Web Application", price: "Rp 50.000.000+", description: "Full-stack web applications with database integration" });
    this.services.set(3, { id: 3, name: "UI/UX Design", price: "Rp 15.000.000+", description: "Modern UI/UX design services" });
    this.services.set(4, { id: 4, name: "Consultation", price: "Rp 500.000/jam", description: "Technical consultation and code review" });

    this.currentId = 20;
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
