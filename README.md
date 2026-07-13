# Career Compass

Career Compass is a responsive career-discovery blog platform designed to help students and young professionals explore career paths, understand required skills, and make informed decisions about their future.

The platform provides career guides, learning roadmaps, career comparisons, educational advice, and job-preparation resources in one organized place.

## Problem Being Solved

Career information is often scattered across different websites and social media platforms, making it difficult for students to find clear and reliable guidance.

Career Compass brings useful career information together and allows users to search, filter, read, and save articles based on their interests.

## Features

### Public Features

* Browse career-related articles
* Search articles by title or keyword
* Filter articles by category
* Read full articles
* View featured and related articles
* Switch between light, dark, and system themes
* Responsive design

### User Features

* Create an account
* Log in and log out
* Bookmark articles
* View saved articles
* Access a protected profile page

### Admin Features

* Access a protected admin dashboard
* Add new articles
* Edit existing articles
* Delete articles
* Publish or unpublish articles
* Mark articles as featured
* View article statistics

## Technologies Used

* React
* Vite
* React Router
* Redux Toolkit
* React Redux
* Firebase Authentication
* Cloud Firestore
* Tailwind CSS
* shadcn/ui
* Lucide React
* React Hook Form
* Zod
* Sonner

## Project Structure

```text
career-compass/
├── public/
│   └── images/
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── articles/
│   │   ├── routes/
│   │   ├── theme-provider.jsx
│   │   └── mode-toggle.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Articles.jsx
│   │   ├── ArticleDetails.jsx
│   │   ├── Bookmarks.jsx
│   │   ├── Profile.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── admin/
│   │
│   ├── store/
│   │   ├── store.js
│   │   └── features/
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── firebase/
│   │   └── firebase.js
│   │
│   ├── services/
│   ├── lib/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env.local
├── components.json
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd career-compass
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create an environment file

Create a `.env.local` file in the root folder:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Do not upload `.env.local` to GitHub.

### 4. Start the project

```bash
npm run dev
```

## Firebase Services

The project uses Firebase for:

* User registration and login
* Authentication session management
* Article storage
* User profiles
* Bookmarks
* Administrator permissions

The main Firestore collections are:

```text
articles
users
admins
```

User bookmarks are stored inside each user document as a subcollection.

## Redux State Management

Redux Toolkit manages shared application state such as:

* Articles
* Search and category filters
* Loading states
* Error states
* Bookmarks
* Admin article operations

Asynchronous Firebase operations are handled using `createAsyncThunk`.

## Available Scripts

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Future Improvements

* Add Google authentication
* Add email verification and password reset
* Create a career recommendation quiz
* Add a career comparison tool
* Add article comments and reactions
* Add article view tracking
* Add reading history
* Add internship and scholarship listings
* Add an advanced admin analytics dashboard
* Add charts showing article performance
* Add a rich-text editor for creating articles
* Support article image uploads using Firebase Storage
* Add newsletter subscriptions
* Add notifications for newly published articles
* Add user profile customization
* Add personalized article recommendations
* Add pagination or infinite scrolling
* Add article drafts and scheduled publishing


## Project Status

The project is currently under development.

## License

Licensed under the MIT license
