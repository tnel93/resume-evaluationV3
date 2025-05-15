# Resume Evaluation & Rewriting Platform

A Next.js 14 application with TailwindCSS that provides a front-end shell for a Resume Evaluation & Rewriting platform. This MVP focuses on the React layer with placeholder iframes for future back-end integration.

## Features

- **Landing Page** - Hero section, value propositions, and CTA button
- **Main Workflow Layout** - Three iframe placeholders for resume upload, gap report, and rewrite wizard
- **Template Gallery** - Grid of resume templates with preview functionality
- **Global UI Elements** - Navigation, dark mode toggle, and toast notifications
- **Responsive Design** - Mobile-friendly interface with adaptive layouts

## Tech Stack

- Next.js 14
- TypeScript
- TailwindCSS
- HeadlessUI for modals and dialogs
- Lucide icons
- React Hot Toast for notifications

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/resume-evaluation.git
   cd resume-evaluation
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Deployment to Vercel

This project is optimized for deployment on Vercel:

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Run the following command from the project directory:
   ```bash
   vercel
   ```
4. Follow the prompts to deploy your application

## Project Structure

```
resume-evaluation/
├── public/
│   └── templates/       # Resume template thumbnails
├── src/
│   ├── app/
│   │   ├── app/         # Main workflow page with iframe placeholders
│   │   ├── templates/   # Template gallery page
│   │   ├── layout.tsx   # Root layout with global providers
│   │   └── page.tsx     # Landing page
│   ├── components/
│   │   ├── layout/      # Layout components (Navbar, etc.)
│   │   └── ui/          # Reusable UI components
│   └── lib/
│       └── ThemeContext.tsx  # Dark mode context provider
├── .eslintrc.json
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Future Integration Points

The application includes placeholder iframes that will be integrated with back-end microservices:

1. **iframe-upload** - For resume upload and parsing functionality
2. **iframe-gap-report** - For displaying ATS compatibility and keyword gap analysis
3. **iframe-rewrite-wizard** - For the resume rewriting Q&A and preview

Each iframe has TODO comments indicating where integration will occur.

## Performance

The application is optimized for performance with a Lighthouse score of 90+.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
