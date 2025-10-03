# Local Domination Platform

An agency-focused website builder and SEO management system for local service businesses, based on the Local Domination Blueprint.

## Overview

The Local Domination Platform helps agencies manage multiple local service business clients through a proven 6-phase methodology. The platform combines website building, competitor intelligence, keyword research, AI-powered content generation, and technical SEO automation into one unified system.

## Features

### Core Functionality

- **Agency Dashboard**: Centralized command center with real-time metrics and quick actions
- **Client Management**: Add and manage multiple client profiles with business details
- **6-Phase Blueprint Tracking**: Visual progress tracking through the proven methodology
  - Phase 1: Foundation (Account setup and website launch)
  - Phase 2: Intelligence Gathering (Competitor and market analysis)
  - Phase 3: Build Your Advantage (Technical SEO and content creation)
  - Phase 4: Conversion Optimization (Trust signals and lead capture)
  - Phase 5: Growth Acceleration (Content marketing and expansion)
  - Phase 6: Domination (Performance monitoring and improvement)

### Analysis & Research Tools

- **Competitor Analysis**: Track competitor websites, reviews, strengths, and weaknesses
- **Keyword Research**: Generate and organize hundreds of targeted local keywords
- **Content Library**: Manage SEO-optimized content for service pages, location pages, and blog posts

### Technical Stack

- **Frontend**: Astro + React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL database with Row Level Security)
- **Authentication**: Supabase Auth with email/password
- **Deployment**: Static site generation ready for Vercel/Netlify

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (database already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Database Schema

The platform uses Supabase with the following tables:

- **agencies**: Agency account information and settings
- **clients**: Client business information managed by agencies
- **projects**: Project tracking through the 6-phase blueprint
- **tasks**: Individual checklist items within each phase
- **competitors**: Competitor analysis data
- **keywords**: Keyword research results and tracking
- **content_library**: Generated content and templates

All tables include Row Level Security (RLS) policies ensuring agencies can only access their own data.

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthForm.tsx
│   ├── ClientForm.tsx
│   ├── PhaseTracker.tsx
│   ├── CompetitorAnalysis.tsx
│   └── KeywordResearch.tsx
├── layouts/            # Astro layouts
│   ├── Layout.astro
│   └── DashboardLayout.astro
├── lib/                # Utilities and configurations
│   └── supabase.ts
└── pages/              # Route pages
    ├── index.astro
    ├── login.astro
    ├── signup.astro
    ├── dashboard.astro
    ├── clients/
    │   ├── index.astro
    │   ├── new.astro
    │   └── [id].astro
    ├── projects.astro
    ├── content.astro
    └── settings.astro
```

## Key Features Implemented

### Authentication System
- Email/password signup and login
- Protected routes with authentication checks
- Agency profile creation on signup

### Client Management
- Add new clients with business details
- View client list with search and filtering
- Individual client dashboards with project details

### Phase Tracking
- Visual 6-phase progress tracker
- Per-phase completion percentages
- Task management within each phase

### Competitor Analysis
- Add multiple competitors per client
- Track review counts and ratings
- Document strengths and weaknesses
- Generate competitive insights

### Keyword Research
- AI-powered keyword generation
- Filter by difficulty, intent, and priority
- Track search volume and ranking positions
- Export capabilities

### Content Library
- Organize content by type and status
- Track word counts and creation dates
- Filter by client, type, and status

## Usage

1. **Sign Up**: Create an agency account
2. **Add Clients**: Input client business information
3. **Track Progress**: Monitor clients through the 6 phases
4. **Analyze Competition**: Research and document competitors
5. **Generate Keywords**: Create targeted keyword lists
6. **Create Content**: Build SEO-optimized content
7. **Monitor Performance**: Track project progress and results

## Security

- Row Level Security (RLS) enabled on all tables
- Multi-tenant architecture with data isolation
- Secure authentication with Supabase Auth
- Environment variables for sensitive data

## Deployment

The application is ready to deploy to:
- Vercel (recommended)
- Netlify
- Any static hosting provider

Build command: `npm run build`
Output directory: `dist`

## Future Enhancements

Potential features for future development:
- Website builder with drag-and-drop interface
- Automated schema markup generation
- Google Search Console integration
- Analytics dashboard with ranking tracking
- Team member management
- Client reporting automation
- Webhook integrations
- API for external tools

## License

This project is based on the Local Domination Blueprint methodology.
