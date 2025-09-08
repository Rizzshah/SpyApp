# Frontend Team Guidelines

## 📦 NPM Packages (Preferred Stack)

\- UI & Styling

* Tailwind CSS  
* Shadcn UI \+ \- State Management & Data Handling

* React Query (server-state management)  
* Redux Toolkit / Zustand (local state management)

\- Forms & Validation

* React Hook Form  
* ZOD / YUP (schema validation)

\- Data & Visualization

* React Data Table  
* React Charts

\- Communication & Realtime

* Socket.io  
* Firebase

\- UI Enhancements

* React Hot Toast (notifications)  
* Slick Slider / Owl Carousel

# 📚 Framework & Core Library

Next.js (Latest Version) — primary framework for SSR, routing, and optimizations.

# ⚡ Rendering Strategy

* Server-Side Rendering (SSR) for SEO-sensitive or dynamic pages.  
* Static Site Generation (SSG) for content-heavy or rarely updated pages.  
* Client-Side Rendering (CSR) only when necessary.

# 📂 Project Directory Structure

src/  
  components/  
    buttons/  
    tables/  
    cards/  
    navbars/  
    sliders/  
    modals/  
    sidebar/  
    forms/  
      input/  
      select/  
      date/  
      calendar/  
  features/  
    \[page-name\]/  
  utils/  
  services/  
  assets/  
  validators/ (ZOD schemas)  
  types/  
  hooks/  
config/  
  tailwind.config.js  
  prettier.config.js

# 🎨 Configuration Standards

\- Tailwind Config → Maintain consistent theme, colors, spacing, typography.

\- Prettier Config → Enforce unified formatting rules across the repo.

# 🌱 Git Workflow Rules

## Branching

* Always branch off from development.  
* Use feature/\<name\> for new features.  
* Use fix/\<name\> for bug fixes.  
* Use hotfix/\<name\> for urgent production fixes.

## Commits

* Follow conventional commits (e.g., feat: add login form, fix: resolve table pagination bug).  
* Keep commits atomic and meaningful.

## Pull Requests (PRs)

* Always open PRs against development.  
* Ensure linting and formatting checks pass.  
* Add a brief description and reference related issue/task ID.