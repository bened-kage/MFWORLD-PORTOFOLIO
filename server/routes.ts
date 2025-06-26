import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBiodataSchema, insertSkillSchema, insertExperienceSchema, insertEducationSchema,
  insertActivitySchema, insertArticleSchema, insertContactMessageSchema, insertSocialLinkSchema,
  insertServiceSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple session middleware for admin authentication
  let isAuthenticated = false;

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!isAuthenticated) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      isAuthenticated = true;
      res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    isAuthenticated = false;
    res.json({ message: "Logout successful" });
  });

  app.get("/api/auth/status", (req, res) => {
    res.json({ isAuthenticated });
  });

  // Biodata routes
  app.get("/api/biodata", async (req, res) => {
    try {
      const biodata = await storage.getBiodata();
      res.json(biodata);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch biodata" });
    }
  });

  app.put("/api/biodata", requireAuth, async (req, res) => {
    try {
      const validatedData = insertBiodataSchema.parse(req.body);
      const biodata = await storage.updateBiodata(validatedData);
      res.json(biodata);
    } catch (error) {
      res.status(400).json({ message: "Invalid biodata data" });
    }
  });

  // Skills routes
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", requireAuth, async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validatedData);
      res.json(skill);
    } catch (error) {
      res.status(400).json({ message: "Invalid skill data" });
    }
  });

  app.put("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(id, validatedData);
      res.json(skill);
    } catch (error) {
      res.status(400).json({ message: "Failed to update skill" });
    }
  });

  app.delete("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSkill(id);
      if (success) {
        res.json({ message: "Skill deleted successfully" });
      } else {
        res.status(404).json({ message: "Skill not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  // Experience routes
  app.get("/api/experiences", async (req, res) => {
    try {
      const experiences = await storage.getExperiences();
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  app.post("/api/experiences", requireAuth, async (req, res) => {
    try {
      const validatedData = insertExperienceSchema.parse(req.body);
      const experience = await storage.createExperience(validatedData);
      res.json(experience);
    } catch (error) {
      res.status(400).json({ message: "Invalid experience data" });
    }
  });

  app.put("/api/experiences/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertExperienceSchema.partial().parse(req.body);
      const experience = await storage.updateExperience(id, validatedData);
      res.json(experience);
    } catch (error) {
      res.status(400).json({ message: "Failed to update experience" });
    }
  });

  app.delete("/api/experiences/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteExperience(id);
      if (success) {
        res.json({ message: "Experience deleted successfully" });
      } else {
        res.status(404).json({ message: "Experience not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete experience" });
    }
  });

  // Education routes
  app.get("/api/education", async (req, res) => {
    try {
      const education = await storage.getEducation();
      res.json(education);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch education" });
    }
  });

  app.post("/api/education", requireAuth, async (req, res) => {
    try {
      const validatedData = insertEducationSchema.parse(req.body);
      const education = await storage.createEducation(validatedData);
      res.json(education);
    } catch (error) {
      res.status(400).json({ message: "Invalid education data" });
    }
  });

  app.put("/api/education/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertEducationSchema.partial().parse(req.body);
      const education = await storage.updateEducation(id, validatedData);
      res.json(education);
    } catch (error) {
      res.status(400).json({ message: "Failed to update education" });
    }
  });

  app.delete("/api/education/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEducation(id);
      if (success) {
        res.json({ message: "Education deleted successfully" });
      } else {
        res.status(404).json({ message: "Education not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete education" });
    }
  });

  // Activities routes
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", requireAuth, async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data" });
    }
  });

  app.put("/api/activities/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertActivitySchema.partial().parse(req.body);
      const activity = await storage.updateActivity(id, validatedData);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ message: "Failed to update activity" });
    }
  });

  app.delete("/api/activities/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteActivity(id);
      if (success) {
        res.json({ message: "Activity deleted successfully" });
      } else {
        res.status(404).json({ message: "Activity not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete activity" });
    }
  });

  // Articles routes
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getPublishedArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/all", requireAuth, async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.post("/api/articles", requireAuth, async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data" });
    }
  });

  app.put("/api/articles/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(id, validatedData);
      res.json(article);
    } catch (error) {
      res.status(400).json({ message: "Failed to update article" });
    }
  });

  app.delete("/api/articles/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteArticle(id);
      if (success) {
        res.json({ message: "Article deleted successfully" });
      } else {
        res.status(404).json({ message: "Article not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Contact messages routes
  app.get("/api/contact-messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  app.post("/api/contact-messages", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact message data" });
    }
  });

  app.put("/api/contact-messages/:id/read", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markMessageAsRead(id);
      if (success) {
        res.json({ message: "Message marked as read" });
      } else {
        res.status(404).json({ message: "Message not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  app.delete("/api/contact-messages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContactMessage(id);
      if (success) {
        res.json({ message: "Contact message deleted successfully" });
      } else {
        res.status(404).json({ message: "Contact message not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contact message" });
    }
  });

  // Social links routes
  app.get("/api/social-links", async (req, res) => {
    try {
      const links = await storage.getSocialLinks();
      res.json(links);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social links" });
    }
  });

  app.post("/api/social-links", requireAuth, async (req, res) => {
    try {
      const validatedData = insertSocialLinkSchema.parse(req.body);
      const link = await storage.createSocialLink(validatedData);
      res.json(link);
    } catch (error) {
      res.status(400).json({ message: "Invalid social link data" });
    }
  });

  app.put("/api/social-links/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSocialLinkSchema.partial().parse(req.body);
      const link = await storage.updateSocialLink(id, validatedData);
      res.json(link);
    } catch (error) {
      res.status(400).json({ message: "Failed to update social link" });
    }
  });

  app.delete("/api/social-links/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSocialLink(id);
      if (success) {
        res.json({ message: "Social link deleted successfully" });
      } else {
        res.status(404).json({ message: "Social link not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete social link" });
    }
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post("/api/services", requireAuth, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.json(service);
    } catch (error) {
      res.status(400).json({ message: "Invalid service data" });
    }
  });

  app.put("/api/services/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, validatedData);
      res.json(service);
    } catch (error) {
      res.status(400).json({ message: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteService(id);
      if (success) {
        res.json({ message: "Service deleted successfully" });
      } else {
        res.status(404).json({ message: "Service not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
