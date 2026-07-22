# Rate My Professor - Universiti Kebangsaan Malaysia (UKM)

An academic evaluation platform designed specifically for Universiti Kebangsaan Malaysia (UKM) students. It provides verified instructor and course evaluations, interactive grade distribution analytics, and AI-powered insights to help students make informed decisions for their academic journey.

---

## 🌟 Key Features

- **Premium Academic Hero Experience**: 
  - Ambient university library backdrop with custom dark navy gradient overlays.
  - Performance-optimized particle constellation animation with adaptive center density fading.
  - High-contrast spotlight search for instant faculty and course discovery.

- **Comprehensive Instructor & Course Search**:
  - Filter across UKM faculties, departments, and course codes.
  - Detailed instructor profiles with overall rating scores, difficulty indexes, and recommendation percentages.

- **Verified Student Evaluations**:
  - Authentic student reviews with tagged criteria (e.g., Attendance Mandatory, Grade Received, Textbook Required).
  - Upvote/downvote system for helpful feedback moderation.

- **AI-Powered Insights**:
  - Automated sentiment analysis and teaching style summaries powered by Google Gemini AI (`@google/genai`).

- **Interactive Analytics**:
  - Grade distribution charts and historic rating breakdown visualizations using Recharts.

- **Administrator Portal**:
  - Dedicated admin panel for managing reviews, vetting submissions, and maintaining course records.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations & Effects**: [Motion](https://motion.dev/) & [GSAP](https://gsap.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Visualizations**: [Recharts](https://recharts.org/)
- **Backend & Database**: [Supabase](https://supabase.com/) & Google GenAI SDK

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your machine.

### Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/your-username/rate-my-professor-ukm.git
   cd rate-my-professor-ukm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (if required):
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

---

## 📜 Build & Deployment

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📂 Project Structure

```
.
├── components/           # React UI components (Hero, Navigation, Analytics, Cards)
├── src/
│   ├── assets/           # Static image assets and backgrounds
│   ├── index.css         # Global styles and Tailwind imports
│   └── main.tsx          # Application entry point
├── App.tsx               # Main application component & routes
├── package.json          # Project dependencies & scripts
└── vite.config.ts        # Vite configuration
```

---

## 🎓 About UKM

Universiti Kebangsaan Malaysia (The National University of Malaysia) is one of Malaysia's leading public universities, established in 1970. This platform is tailored to support UKM's vibrant student community across all faculties.
