# Intellecta

Intellecta is a multilingual e-learning platform for structured academic and professional learning. It keeps the original project's practical architecture—Next.js App Router, internationalisation, PostgreSQL/Prisma, protected administration, cached public reads, and reusable UI components—while replacing the original domain with an academic learning experience.

## What Intellecta includes

- Course discovery organised by subject.
- Course/article pages with Markdown content and related learning.
- Study resources with optional downloads.
- Contact and learner-support messaging.
- Protected admin dashboard for managing courses, resources, and messages.
- Four interface languages: Arabic, English, French, and Malay.
- RTL support for Arabic and LTR layouts for other locales.
- Responsive UI built with Tailwind CSS.
- PostgreSQL persistence through Prisma.
- JWT + bcrypt authentication for the admin area.
- Cached course/resource reads with targeted cache invalidation.

## Subjects

The course architecture currently supports six subject areas:

1. Courses
2. Programming
3. Mathematics
4. Natural Sciences
5. Business & Economics
6. Languages

These categories are intentionally easy to extend without changing the overall application architecture.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Internationalisation | next-intl |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Authentication | JWT (`jose`) + bcrypt |
| Icons | Tabler Icons |
| Markdown | react-markdown + remark-gfm |

## Project Structure

```text
.
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js routes, public pages, APIs, admin
│   ├── components/         # Reusable public/admin/UI components
│   ├── lib/                # Database, auth, caching and data helpers
│   ├── messages/           # ar/en/fr/ms translations
│   └── types/              # Shared TypeScript types
├── LICENSE                 # MIT License
├── READEME.md              # This file
└── package.json
```

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the database

Create a `.env` file with your PostgreSQL connection string and the environment variables required by the existing authentication/database setup.

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Apply migrations

```bash
npx prisma migrate deploy
```

### 5. Start the development server

```bash
npm run dev
```

The application uses locale-prefixed routes such as:

- `/ar`
- `/en`
- `/fr`
- `/ms`

## Production

Build the application with:

```bash
npm run build
```

Then run:

```bash
npm start
```

## GitHub

This project is prepared to be placed directly into a new, empty GitHub repository.

No `.git` directory is included in this archive. After extracting the project:

```bash
git init
git add .
git commit -m "Initial Intellecta project"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

## License

MIT. See `LICENSE`.
## Design system

Intellecta uses a modern blue-and-white visual system with cyan accents, rounded cards, soft shadows, grid textures, spacious layouts, and contemporary typography. The public experience is designed around discovery, clarity, and energetic learning.
