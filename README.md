# DevConnect — Social Platform for Developers

A full-stack social networking application. Features real-time notifications, infinite scroll feeds, user profiles with follow systems, and full CRUD operations - all powered by a modern React + Supabase architecture.

Designed, built, and shipped solo in 2 weeks.

## Live Demo

🔗 [Live Demo](#)

---

## Features

### Core Social Features

- **Authentication** — Secure email/password auth with protected and public route guards
- **Posts** — Create, edit, and delete posts with optional image uploads
- **Comments** — Threaded comment system with real-time updates
- **Likes** — Optimistic-UI like/unlike with instant feedback
- **Follow System** — Follow/unfollow users with live follower/following counts
- **User Profiles** — Editable profiles with avatar, cover photo, bio, and username
- **Notifications** — Real-time push notifications for likes, comments, and follows via Supabase Realtime

### UX & Performance

- **Infinite Scroll** — Intersection Observer-based pagination for feeds
- **Optimistic Updates** — Instant UI feedback on likes before server confirmation
- **Responsive Design** — Desktop sidebar + mobile bottom navigation
- **Dark Theme** — Custom glassmorphism design system with Tailwind CSS v4
- **Confirmation Modals** — Safe delete flows for posts, comments, and accounts

---

## Tech Stack

| Layer                | Technology                                   |
| -------------------- | -------------------------------------------- |
| **Frontend**         | React 19, React Router 7                     |
| **State Management** | Redux Toolkit (slices, async thunks)         |
| **Backend / BaaS**   | Supabase (Auth, Database, Storage, Realtime) |
| **Styling**          | Tailwind CSS v4                              |
| **Build Tool**       | Vite 8                                       |
| **Icons**            | Lucide React                                 |
| **Code Quality**     | ESLint, Prettier                             |

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # PageLayout, Sidebar, RightBar, BottomNav, AuthLayout
│   └── ui/              # Button, Avatar, Spinner, PostCard, ConfirmModal, etc.
├── constants/           # Navigation link definitions
├── context/             # AuthContext (Supabase session management)
├── features/
│   ├── posts/           # postsSlice + postsThunks (feed, profile, CRUD)
│   ├── user/            # userSlice, userThunks, followSlice
│   └── notifications/   # notificationSlice (real-time unread count)
├── hooks/               # useInfiniteScroll custom hook
├── pages/               # Login, Register, Home, Profile, Settings, Notification, PostDetails, NotFound
├── services/            # Supabase client initialization
├── store/               # Redux store configuration
└── utils/               # formatTimeAgo utility
```

---

## Architecture Highlights

### State Management

- **Redux Toolkit** with separated slice/thunk files following the [ducks pattern](https://redux.js.org/style-guide/#structure-files-as-feature-folders-with-single-file-logic)
- `forEachPostList` helper to DRY up mutations across feed, profile, and current post state
- `PAGE_SIZE` constant shared between thunks and slice for pagination consistency

### Component Architecture

- **Composed PostCard** — Split into `PostAuthorHeader`, `PostActions`, `PostCommentSection` sub-components
- **Reusable UI layer** — `Button` (with loading/variants), `Avatar` (with size system), `Spinner`, `ConfirmModal`
- **Layout system** — `PageLayout` for authenticated routes, `AuthLayout` for login/register
- **Navigation constants** — Centralized route definitions consumed by Sidebar and BottomNav

### Supabase Integration

- **Auth** — Session-based with `onAuthStateChange` listener
- **Database** — Relational queries with nested `select()` joins (posts → users → likes → comments)
- **Storage** — Image uploads to `post_images`, `avatars`, `covers` buckets
- **Realtime** — `postgres_changes` channel for live notification delivery

### Performance Patterns

- **Optimistic updates** — `toggleLikeThunk` dispatches UI change before API call, rolls back on failure
- **Infinite scroll** — Custom `useInfiniteScroll` hook wrapping Intersection Observer
- **Blob URL cleanup** — `URL.revokeObjectURL` in `EditProfileModal` prevents memory leaks
- **Deduplication** — Feed pagination filters duplicate posts on append

---

### Installation

```bash
# Clone the repository
git clone https://github.com/ahmedtika74/DevConnect.git
cd DevConnect

# Install dependencies
npm install

# Create environment variables
cp .env.example .env.local
```

Add your Supabase credentials to `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
# Start the development server
npm run dev
```

### Database Schema

```sql
-- Core tables
create table users (
  id uuid primary key references auth.users(id),
  username text unique not null,
  full_name text not null,
  bio text,
  avatar_url text,
  cover_url text,
  created_at timestamptz default now()
);

create table posts (
  id bigint generated always as identity primary key,
  user_id uuid references users(id) on delete cascade,
  content text,
  image_url text,
  created_at timestamptz default now()
);

create table comments (
  id bigint generated always as identity primary key,
  post_id bigint references posts(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create table likes (
  id bigint generated always as identity primary key,
  post_id bigint references posts(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  unique(post_id, user_id)
);

create table follows (
  id bigint generated always as identity primary key,
  follower_id uuid references users(id) on delete cascade,
  following_id uuid references users(id) on delete cascade,
  unique(follower_id, following_id)
);

create table notifications (
  id bigint generated always as identity primary key,
  user_id uuid references users(id) on delete cascade,
  sender_id uuid references users(id) on delete cascade,
  type text not null,
  post_id bigint references posts(id) on delete cascade,
  is_read boolean default false,
  created_at timestamptz default now()
);
```

---

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |
