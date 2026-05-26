Rate My Professor - UKM Academic Portal

📖 Project Overview

This project is a full-stack, AI-enhanced academic portal tailored for Universiti Kebangsaan Malaysia (UKM). It provides a centralized platform where students can browse, evaluate, and share detailed feedback on professors and courses. Designed with a focus on data accessibility and content moderation, the system empowers students to make informed academic decisions while maintaining a safe and verified community environment.
✨ Key Features

* Advanced Review System: Students can submit multifaceted reviews for both professors and specific courses. Reviews track detailed metrics including overall rating, difficulty, clarity, fairness, approachability, and whether a textbook was required.
* AI-Powered Summaries: Integrates Google's Gemini AI (gemini-2.5-flash) to automatically analyze student comments and generate concise, 3-sentence summaries highlighting the main strengths, weaknesses, and general difficulty of professors and courses.
* Admin Dashboard & Content Moderation: Features a secure Admin portal that allows authorized users to perform CRUD (Create, Read, Update, Delete) operations on course and professor data. It also includes a built-in reporting system where administrators can review user-flagged content, dismiss false reports, or delete inappropriate reviews.
* Real-time Database Sync: Uses Supabase to handle relational data across professors, courses, reviews, and reports tables, with dynamic fallback to mock data to ensure the UI remains functional even during database connection issues.
🛠️ Tech Stack

* Frontend: React 19, TypeScript, and Vite.
* Routing: React Router v7 for seamless client-side navigation between dashboards, course lists, and detail views.
* Backend / Database: Supabase (PostgreSQL) with Row Level Security (RLS) enabled for robust data protection.
* Artificial Intelligence: @google/genai SDK for integrating Google's large language models.
* UI & Data Visualization: Recharts for rendering analytics and Lucide-React for modern, scalable iconography.

