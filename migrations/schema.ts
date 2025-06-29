import { sqliteTable, AnySQLiteColumn, integer, text, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const activities = sqliteTable("activities", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	title: text().notNull(),
	description: text().notNull(),
	icon: text().notNull(),
	category: text().notNull(),
	image: text(),
});

export const articles = sqliteTable("articles", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	title: text().notNull(),
	excerpt: text().notNull(),
	content: text().notNull(),
	category: text().notNull(),
	image: text().notNull(),
	date: text().notNull(),
	published: integer().default(1),
});

export const biodata = sqliteTable("biodata", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	title: text().notNull(),
	bio: text().notNull(),
	email: text().notNull(),
	phone: text().notNull(),
	location: text().notNull(),
	profileImage: text("profile_image"),
});

export const contactMessages = sqliteTable("contact_messages", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	email: text().notNull(),
	message: text().notNull(),
	date: text().notNull(),
	read: integer().default(0),
});

export const education = sqliteTable("education", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	degree: text().notNull(),
	institution: text().notNull(),
	year: text().notNull(),
	description: text(),
});

export const experiences = sqliteTable("experiences", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	position: text().notNull(),
	company: text().notNull(),
	duration: text().notNull(),
	description: text().notNull(),
	startDate: text("start_date").notNull(),
	endDate: text("end_date"),
	image: text(),
});

export const services = sqliteTable("services", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	price: text().notNull(),
	description: text(),
});

export const skills = sqliteTable("skills", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	level: text().notNull(),
	percentage: integer().notNull(),
	icon: text().notNull(),
	category: text().notNull(),
});

export const socialLinks = sqliteTable("social_links", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	platform: text().notNull(),
	url: text().notNull(),
	icon: text().notNull(),
});

export const users = sqliteTable("users", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	username: text().notNull(),
	password: text().notNull(),
},
(table) => [
	uniqueIndex("users_username_unique").on(table.username),
]);

export const projects = sqliteTable("projects", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	title: text().notNull(),
	description: text().notNull(),
	year: text().notNull(),
	link: text(),
	image: text(),
});

