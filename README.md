# ThreadDate 🏷️

A community-driven platform for identifying and dating vintage clothing through tags, labels, buttons, and other identifiers. Help preserve fashion history by contributing and verifying vintage identifiers.

**Live Site**: [threaddate.com](https://threaddate.com)

## Features

- 🔍 **Search & Identify**: Search vintage clothing identifiers by brand, era, and category
- 📸 **Submit Identifiers**: Upload photos of tags, buttons, zippers, and other dating markers
- 🗓️ **Era Dating**: Comprehensive era definitions from Pre-1900s to Modern (2020s)
- ✅ **Community Verification**: Vote on submissions to verify accuracy
- 🏢 **Brand Pages**: Detailed brand histories with affiliate marketplace links
- 🎯 **Multiple Identifier Types**: Neck tags, care tags, buttons, zippers, tabs, and more

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Image Handling**: react-image-crop for cropping functionality
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase CLI: `npm install -g supabase`
- Git
- Docker (for local Supabase)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/JohnKirbyCodes/threaddate.git
   cd threaddate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase locally**
   ```bash
   # Start local Supabase services (requires Docker)
   npx supabase start

   # Copy the output credentials - you'll need these for .env.local
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
   ```

5. **Run database migrations**
   ```bash
   # Migrations are automatically applied when you start Supabase
   # To reset the database:
   npx supabase db reset
   ```

6. **Seed the database (optional)**
   ```bash
   # Add sample brands and tags
   npx tsx scripts/seed-comprehensive.ts
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

### Core Tables

- **brands**: Clothing brands with metadata and affiliate links
- **tags**: User-submitted identifiers (tags, buttons, zippers, etc.)
- **profiles**: User profiles extending Supabase auth
- **votes**: Community verification votes
- **tag_evidence**: Supporting documentation for submissions

### Key Features

- **Era Definitions**: 15 distinct eras from Pre-1900s to Modern
- **Identifier Categories**: 9 types including Neck Tag, Care Tag, Button/Snap, Zipper, Tab
- **Row Level Security**: Policies for authenticated submissions and public viewing
- **Full-Text Search**: PostgreSQL trigram search on brand names

## Project Structure

```
threaddate/
├── app/                      # Next.js App Router pages
│   ├── brands/              # Brand listing and detail pages
│   ├── search/              # Search and filter interface
│   ├── submit/              # Tag submission flow
│   ├── tags/                # Tag detail pages
│   └── auth/                # Authentication pages
├── components/              # React components
│   ├── forms/               # Multi-step submission forms
│   ├── tags/                # Tag display components
│   ├── auth/                # Authentication UI
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── queries/             # Database query functions
│   ├── actions/             # Server actions
│   ├── supabase/            # Supabase client config
│   └── validations/         # Input validation schemas
├── supabase/
│   └── migrations/          # Database migration files
└── scripts/                 # Seed and utility scripts
```

## Deployment

### Deploy to Production

1. **Set up Supabase Production**
   - Create a project at [supabase.com](https://supabase.com)
   - Go to Settings → API to get your credentials
   - Link your local project:
     ```bash
     npx supabase link --project-ref YOUR_PROJECT_REF
     ```
   - Push migrations:
     ```bash
     npx supabase db push
     ```

2. **Deploy to Vercel**
   - Push your code to GitHub
   - Import your repository in [Vercel](https://vercel.com)
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Deploy!

3. **Configure Authentication**

   **Google OAuth Setup:**
   - Create OAuth 2.0 Client ID in [Google Cloud Console](https://console.cloud.google.com/)
   - **Authorized JavaScript origins:**
     ```
     https://threaddate.com
     http://localhost:3000
     ```
   - **Authorized redirect URIs:**
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     http://localhost:54321/auth/v1/callback
     ```

   **Supabase Configuration:**
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google and add your Client ID and Secret
   - In Authentication → URL Configuration:
     - **Site URL**: `https://threaddate.com`
     - **Redirect URLs**: `https://threaddate.com/**`

4. **Set up Storage**
   - Storage bucket "tag-images" is created via migration
   - Configure CORS and public access policies as needed

5. **Configure Custom Domain**
   - In Vercel: Settings → Domains → Add `threaddate.com`
   - In Namecheap DNS settings:
     - Add A record: `@` → Vercel IP (or CNAME to Vercel)
     - Add CNAME: `www` → `cname.vercel-dns.com`

## Environment Variables Reference

```env
# Required for all environments
NEXT_PUBLIC_SUPABASE_URL=         # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anonymous/public key
SUPABASE_SERVICE_ROLE_KEY=        # Supabase service role key (server-side only)
```

## Key Features Explained

### Multi-Step Tag Submission
1. **Image Upload & Crop**: Users crop their identifier photo with flexible aspect ratios
2. **Classification**: Select identifier category (tag, button, zipper, etc.)
3. **Details**: Brand, era, and metadata entry
4. **Review**: Final confirmation before submission

### Era Grouping
Tags are displayed chronologically, grouped by era, helping users identify evolution of brand identifiers over time.

### Affiliate Links
Brand pages include affiliate links to:
- Official brand websites
- Wikipedia for brand history
- eBay, Poshmark, Depop for marketplace searches

### Verification System
Community voting system to verify tag accuracy:
- Upvote accurate identifications
- Builds user reputation
- Pending → Verified → Featured pipeline

## Roadmap

- [ ] AI-powered automatic tag classification
- [ ] Mobile app (React Native)
- [ ] Advanced search filters (material, country, manufacturer)
- [ ] User collections and favorites
- [ ] Tag comparison tool
- [ ] Export identification reports
- [ ] Brand timeline visualizations

## Contributing

We welcome contributions! Here's how you can help:

1. **Report Issues**: Found a bug? Open an issue on GitHub
2. **Submit Identifiers**: Use the app to add vintage tags from your collection
3. **Verify Submissions**: Vote on pending tags to help verify accuracy
4. **Add Brands**: Admins can add new brands with historical context

## License

This project is licensed under the MIT License.

## Acknowledgments

Built with [Claude Code](https://claude.com/claude-code) - AI pair programming assistant

## Support

- **Issues**: [GitHub Issues](https://github.com/JohnKirbyCodes/threaddate/issues)
- **Discussions**: [GitHub Discussions](https://github.com/JohnKirbyCodes/threaddate/discussions)

---

Made with ❤️ for vintage clothing enthusiasts
