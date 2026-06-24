# Firebase Auth Demo

A portfolio project demonstrating a complete client-side authentication flow built with React and Firebase Auth.

**Live demo:** _(add your Vercel URL after deploy)_

## Features

- Email/password registration with validation
- Email verification before accessing protected routes
- Google OAuth sign-in
- Password reset via email
- Protected routes with auth state persistence
- Responsive split-pane UI with CSS Modules

## Tech Stack

- **React 19** + **Vite**
- **Firebase Authentication**
- **React Router v6**
- **CSS Modules**

## Getting Started

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and add your Firebase project credentials:

   ```bash
   cp .env.example .env
   ```

   Get these values from the [Firebase Console](https://console.firebase.google.com/) under Project Settings → Your apps → SDK setup and configuration.

3. Enable the following in Firebase Authentication → Sign-in method:
   - Email/Password
   - Google

4. Start the development server:

   ```bash
   npm run dev
   ```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
| `npm run compress-images` | Resize/compress background JPEGs in `public/` |
| `npm run generate-icons` | Regenerate favicons and PWA icons from `public/icon.svg` |

## Deploy to Vercel

1. Push this repo to GitHub (see below).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Vite. No custom build settings needed:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Add environment variables in Vercel → Settings → Environment Variables (same keys as `.env.example`).
5. Deploy.
6. In Firebase Console → Authentication → Settings → **Authorized domains**, add your Vercel domain (e.g. `your-app.vercel.app`).

`vercel.json` is included for React Router client-side routing.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Firebase auth demo"
gh repo create firebase-auth-demo --public --source=. --remote=origin --push
```

Or create the repo manually on GitHub, then:

```bash
git remote add origin https://github.com/AK-Michael/firebase-auth-demo.git
git branch -M main
git push -u origin main
```

## Project Structure

```
src/
├── components/     # GoogleAuthBtn, ProtectedRoute
├── context/        # AuthProvider and auth state
├── hooks/          # useInput form validation hook
├── pages/          # Home, Login, Signup, ForgotPassword, MainPage
├── UI/             # InputField, ErrorMessage
└── firebase.js     # Firebase initialization
```

## Routes

| Path | Access | Description |
| --- | --- | --- |
| `/home` | Public | Landing page |
| `/signup` | Public | Create account |
| `/login` | Public | Sign in |
| `/forgotPass` | Public | Request password reset |
| `/main` | Protected | Authenticated user dashboard |

## Auth Notes

- Email/password users must verify their email before accessing `/main`.
- Google sign-in users are treated as verified by Firebase.
- After signup, users are signed out and redirected to login with instructions to verify their email.

## Images

Background photos are stored in `public/`. If you replace them with high-resolution originals, run `npm run compress-images` to resize them to 1600px width (saves several MB of transfer per page load).

## License

Portfolio project — free to use as a reference.
