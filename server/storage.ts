import 'dotenv/config';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "../shared/schema.js";

const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/portfolio";

console.log("Database connection string:", connectionString ? "Set" : "Not set");

const client = postgres(connectionString, {
  connect_timeout: 30,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  onnotice: (notice) => console.log("Database notice:", notice),
  onparameter: (param) => console.log("Database parameter:", param),
});

export const drizzleDb = drizzle(client, { schema });

// Test database connection
export async function testConnection() {
  try {
    await client`SELECT 1`;
    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

// USER CRUD
export async function getUser(id: number) {
  const result = await drizzleDb.select().from(schema.users).where(eq(schema.users.id, id));
  return result[0];
}
export async function getUserByUsername(username: string) {
  const result = await drizzleDb.select().from(schema.users).where(eq(schema.users.username, username));
  return result[0];
}
export async function createUser(user: schema.InsertUser) {
  const result = await drizzleDb.insert(schema.users).values(user).returning();
  return result[0];
}

// BIODATA CRUD
export async function getBiodata() {
  const result = await drizzleDb.select().from(schema.biodata);
  return result[0];
}
export async function updateBiodata(data: schema.InsertBiodata) {
  const existing = await getBiodata();
  if (existing) {
    await drizzleDb.update(schema.biodata).set(data).where(eq(schema.biodata.id, existing.id));
    return { ...existing, ...data };
  } else {
    const result = await drizzleDb.insert(schema.biodata).values(data).returning();
    return result[0];
  }
}

// SKILLS CRUD
export async function getSkills() {
  return await drizzleDb.select().from(schema.skills);
}
export async function getSkill(id: number) {
  const result = await drizzleDb.select().from(schema.skills).where(eq(schema.skills.id, id));
  return result[0];
}
export async function createSkill(skill: schema.InsertSkill) {
  const result = await drizzleDb.insert(schema.skills).values(skill).returning();
  return result[0];
}
export async function updateSkill(id: number, skill: Partial<schema.InsertSkill>) {
  await drizzleDb.update(schema.skills).set(skill).where(eq(schema.skills.id, id));
  return getSkill(id);
}
export async function deleteSkill(id: number) {
  await drizzleDb.delete(schema.skills).where(eq(schema.skills.id, id));
  return true;
}

// EXPERIENCES CRUD
export async function getExperiences() {
  return await drizzleDb.select().from(schema.experiences);
}
export async function getExperience(id: number) {
  const result = await drizzleDb.select().from(schema.experiences).where(eq(schema.experiences.id, id));
  return result[0];
}
export async function createExperience(experience: schema.InsertExperience) {
  const result = await drizzleDb.insert(schema.experiences).values(experience).returning();
  return result[0];
}
export async function updateExperience(id: number, experience: Partial<schema.InsertExperience>) {
  await drizzleDb.update(schema.experiences).set(experience).where(eq(schema.experiences.id, id));
  return getExperience(id);
}
export async function deleteExperience(id: number) {
  await drizzleDb.delete(schema.experiences).where(eq(schema.experiences.id, id));
  return true;
}

// EDUCATION CRUD
export async function getEducation() {
  return await drizzleDb.select().from(schema.education);
}
export async function getEducationItem(id: number) {
  const result = await drizzleDb.select().from(schema.education).where(eq(schema.education.id, id));
  return result[0];
}
export async function createEducation(education: schema.InsertEducation) {
  const result = await drizzleDb.insert(schema.education).values(education).returning();
  return result[0];
}
export async function updateEducation(id: number, education: Partial<schema.InsertEducation>) {
  await drizzleDb.update(schema.education).set(education).where(eq(schema.education.id, id));
  return getEducationItem(id);
}
export async function deleteEducation(id: number) {
  await drizzleDb.delete(schema.education).where(eq(schema.education.id, id));
  return true;
}

// ACTIVITIES CRUD
export async function getActivities() {
  return await drizzleDb.select().from(schema.activities);
}
export async function getActivity(id: number) {
  const result = await drizzleDb.select().from(schema.activities).where(eq(schema.activities.id, id));
  return result[0];
}
export async function createActivity(activity: schema.InsertActivity) {
  const result = await drizzleDb.insert(schema.activities).values(activity).returning();
  return result[0];
}
export async function updateActivity(id: number, activity: Partial<schema.InsertActivity>) {
  await drizzleDb.update(schema.activities).set(activity).where(eq(schema.activities.id, id));
  return getActivity(id);
}
export async function deleteActivity(id: number) {
  await drizzleDb.delete(schema.activities).where(eq(schema.activities.id, id));
  return true;
}

// ARTICLES CRUD
export async function getArticles() {
  return await drizzleDb.select().from(schema.articles);
}
export async function getPublishedArticles() {
  return await drizzleDb.select().from(schema.articles).where(eq(schema.articles.published, true));
}
export async function getArticle(id: number) {
  const result = await drizzleDb.select().from(schema.articles).where(eq(schema.articles.id, id));
  return result[0];
}
export async function createArticle(article: schema.InsertArticle) {
  const result = await drizzleDb.insert(schema.articles).values(article).returning();
  return result[0];
}
export async function updateArticle(id: number, article: Partial<schema.InsertArticle>) {
  await drizzleDb.update(schema.articles).set(article).where(eq(schema.articles.id, id));
  return getArticle(id);
}
export async function deleteArticle(id: number) {
  await drizzleDb.delete(schema.articles).where(eq(schema.articles.id, id));
  return true;
}

// CONTACT MESSAGES CRUD
export async function getContactMessages() {
  return await drizzleDb.select().from(schema.contactMessages);
}
export async function createContactMessage(message: schema.InsertContactMessage) {
  const now = new Date().toISOString();
  const result = await drizzleDb.insert(schema.contactMessages).values({ ...message, date: now, read: false }).returning();
  return result[0];
}
export async function markMessageAsRead(id: number) {
  await drizzleDb.update(schema.contactMessages).set({ read: true }).where(eq(schema.contactMessages.id, id));
  return true;
}
export async function deleteContactMessage(id: number) {
  await drizzleDb.delete(schema.contactMessages).where(eq(schema.contactMessages.id, id));
  return true;
}

// SOCIAL LINKS CRUD
export async function getSocialLinks() {
  return await drizzleDb.select().from(schema.socialLinks);
}
export async function createSocialLink(link: schema.InsertSocialLink) {
  const result = await drizzleDb.insert(schema.socialLinks).values(link).returning();
  return result[0];
}
export async function updateSocialLink(id: number, link: Partial<schema.InsertSocialLink>) {
  await drizzleDb.update(schema.socialLinks).set(link).where(eq(schema.socialLinks.id, id));
  return getSocialLink(id);
}
export async function getSocialLink(id: number) {
  const result = await drizzleDb.select().from(schema.socialLinks).where(eq(schema.socialLinks.id, id));
  return result[0];
}
export async function deleteSocialLink(id: number) {
  await drizzleDb.delete(schema.socialLinks).where(eq(schema.socialLinks.id, id));
  return true;
}

// SERVICES CRUD
export async function getServices() {
  return await drizzleDb.select().from(schema.services);
}
export async function createService(service: schema.InsertService) {
  const result = await drizzleDb.insert(schema.services).values(service).returning();
  return result[0];
}
export async function updateService(id: number, service: Partial<schema.InsertService>) {
  await drizzleDb.update(schema.services).set(service).where(eq(schema.services.id, id));
  return getService(id);
}
export async function getService(id: number) {
  const result = await drizzleDb.select().from(schema.services).where(eq(schema.services.id, id));
  return result[0];
}
export async function deleteService(id: number) {
  await drizzleDb.delete(schema.services).where(eq(schema.services.id, id));
  return true;
}

// PROJECTS CRUD
export async function getProjects() {
  return await drizzleDb.select().from(schema.projects);
}
export async function createProject(project: schema.InsertProject) {
  const result = await drizzleDb.insert(schema.projects).values(project).returning();
  return result[0];
}
export async function updateProject(id: number, data: Partial<schema.InsertProject>) {
  await drizzleDb.update(schema.projects).set(data).where(eq(schema.projects.id, id));
  return getProject(id);
}
export async function deleteProject(id: number) {
  await drizzleDb.delete(schema.projects).where(eq(schema.projects.id, id));
  return true;
}
export async function getProject(id: number) {
  const result = await drizzleDb.select().from(schema.projects).where(eq(schema.projects.id, id));
  return result[0];
}

// Seed admin user
async function seedAdmin() {
  try {
    const existingAdmin = await getUserByUsername("admin");
    if (!existingAdmin) {
      await createUser({
        username: "admin",
        password: "admin123"
      });
      console.log("Admin user created");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
}

// Initialize database with delay to ensure connection is ready
setTimeout(() => {
  seedAdmin();
}, 1000);
