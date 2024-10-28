# Reminders App

A full-stack, responsive reminders application built with Next.js, featuring real-time search, calendar integration, and prioritization system.

## Features

- 🎯 **Priority-based Task Management**: High, Medium, and Low priority levels with visual indicators
- 📅 **Calendar Integration**: Visual date picker with reminder indicators
- 🔍 **Real-time Search**: Instant search across all reminder fields
- 🔄 **Smart Filtering**: Filter by date, priority, status, and more
- ↩️ **Undo Actions**: Restore accidentally deleted reminders
- ⌨️ **Keyboard Shortcuts**: Quick access with keyboard commands

## Tech Stack

- **Frontend**:
  - Next.js 13 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - shadcn/ui
  - date-fns
  - react-hot-toast

- **Backend**:
  - Next.js API Routes
  - Prisma
  - PostgreSQL

## Prerequisites
Please ensure you have installed:
- Node.js (version 18.0 or higher)
- npm or yarn
- PostgreSQL

## Installation

1. Clone the repo:
```bash
git clone https://github.com/yourusername/reminders-app.git
cd reminders-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```

Update `.env` with your DB credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/reminders"
```

4. Set up the DB:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.



## API Routes

```typescript
GET    /api/reminders      // Fetch all reminders
POST   /api/reminders      // Create new reminder
PUT    /api/reminders/:id  // Update reminder
DELETE /api/reminders/:id  // Delete reminder
```

## Performance Considerations

- Memoized filtering operations
- Debounced search input
- Optimistic updates
- Proper error boundaries
- Efficient re-renders

## If you wish to contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Contact

Abhishek - [@abhishekxr](https://www.linkedin.com/in/abhishekxr)

