# Career Compass

Career Compass is a responsive career-discovery platform that helps students and young professionals explore career paths, understand the skills and education required, and make informed career decisions.

Users can browse career guides, search and filter articles, complete a career-interest quiz, and save useful articles for later.

## Features

### Public Features

* Browse career articles
* Search articles by title or keyword
* Filter articles by category
* Read complete career guides
* View related articles
* Complete a career-interest quiz
* Receive career-category recommendations
* Submit enquiries through the contact form
* Switch between light, dark, and system themes
* Responsive design for mobile, tablet, and desktop

### Authentication Features

* Create an account
* Sign in using email and password
* Sign in with Google
* Reset a forgotten password
* Log out securely
* Maintain the user session after refreshing the page

### User Features

* Bookmark articles
* Remove bookmarks
* View saved articles on a protected page

### Admin Features

* Access a protected admin dashboard
* Add new articles
* Edit existing articles
* Delete articles
* Upload article thumbnails
* Save articles as drafts
* Publish articles
* View published and draft article totals

## Technologies Used

* React
* Vite
* React Router DOM
* Redux Toolkit
* React Redux
* Firebase Authentication
* Cloud Firestore
* Firebase Storage
* Tailwind CSS
* shadcn/ui
* Lucide React
* React Hook Form
* Zod
* Sonner
* next-themes

## Project Structure

```text
career-compass/
│
├── public/
│   └── data/
│       └── careerQuiz.json
│
├── src/
│   ├── assets/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── admin/
│   │   ├── ui/
│   │   ├── AdminRoute.jsx
│   │   ├── AuthListener.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── ThemeProvider.jsx
│   │   └── ThemeToggle.jsx
│   │
│   ├── firebase/
│   │   └── firebase.js
│   │
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   └── MainLayout.jsx
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AddArticle.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditArticle.jsx
│   │   │   └── ManageArticles.jsx
│   │   ├── ArticleDetails.jsx
│   │   ├── Articles.jsx
│   │   ├── Bookmarks.jsx
│   │   ├── CareerQuiz.jsx
│   │   ├── Contact.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.jsx
│   │   ├── SignIn.jsx
│   │   └── SignUp.jsx
│   │
│   ├── services/
│   │   ├── articleService.js
│   │   └── authService.js
│   │
│   ├── store/
│   │   ├── articleSlice.js
│   │   ├── authSlice.js
│   │   ├── bookmarkSlice.js
│   │   └── store.js
│   │
│   ├── validation/
│   │   ├── articleSchema.js
│   │   └── authSchema.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package.json
├── README.md
└── vite.config.js
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <https://github.com/wanjiruaisha/career-campus.git>
cd career-compass
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create the Environment File

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Do not upload the `.env` file to GitHub.

### 4. Configure Firebase

Enable the following Firebase services:

* Email and password authentication
* Google authentication
* Cloud Firestore
* Firebase Storage

Create these Firestore collections:

```text
articles
users
```

### 5. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173
```

## Available Scripts

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

## Collaboration

Follow these steps when working with other contributors.

### 1. Get the Latest Version

Clone the project when working on it for the first time:

```bash
git clone <https://github.com/wanjiruaisha/career-campus.git>
cd career-compass
npm install
```

When the project already exists on your computer, switch to the main branch and download the latest changes:

```bash
git checkout main
git pull origin main
```

### 2. Create a New Branch

Do not work directly on the `main` branch.

Create a branch for the feature or fix you are working on:

```bash
git checkout -b feature/article-search
```

Other branch-name examples:

```text
feature/career-quiz
feature/bookmarks
fix/navbar-mobile-menu
fix/article-loading-error
```

### 3. Make Your Changes

Update the necessary files and test the application:

```bash
npm run dev
```

Before submitting your work, also run:

```bash
npm run lint
npm run build
```

### 4. Commit Your Changes

Check which files were changed:

```bash
git status
```

Add the changed files:

```bash
git add .
```

Create a clear commit:

```bash
git commit -m "Add article search functionality"
```

### 5. Push Your Branch

```bash
git push origin feature/article-search
```

### 6. Create a Pull Request

After pushing:

1. Open the repository on GitHub.
2. Select **Compare & pull request**.
3. Choose `main` as the base branch.
4. Add a clear title and description.
5. Explain what was changed and how it was tested.
6. Submit the pull request for review.

Do not merge the pull request until the changes have been reviewed.

### 7. Update Your Branch

When the main branch changes before your work is merged:

```bash
git checkout main
git pull origin main
git checkout feature/article-search
git merge main
```

Resolve any merge conflicts, test the project again, and push the updated branch:

```bash
git push origin feature/article-search
```

## Contribution Guidelines

Contributions are welcome.

Before contributing:

* Create a separate branch for each feature or fix
* Follow the existing project structure
* Avoid changing unrelated files
* Use clear component and variable names
* Test the project before creating a pull request
* Do not commit `.env` files or private Firebase credentials
* Write clear commit messages
* Describe your changes clearly in the pull request

A useful pull-request description should include:

```text
## Changes

- Added article search
- Added an empty search-results state
- Improved mobile responsiveness

## Testing

- Tested search using article titles
- Tested search using keywords
- Ran npm run lint
- Ran npm run build
```

## Future Improvements

* Add a career-coaches directory
* Add coach profiles and areas of expertise
* Add coach-contact or consultation requests
* Add a career-comparison tool
* Add article comments and reactions
* Add internship and scholarship listings
* Add article-view tracking
* Add reading history
* Add an advanced admin analytics dashboard
* Add newsletter subscriptions
* Add notifications for new articles
* Add personalised article recommendations
* Add pagination or infinite scrolling
* Add scheduled article publishing
* Add more career-quiz questions
* Allow administrators to manage quiz questions
 
 ## Author
 **Aisha Wanjiru**


## License
This project is licensed under the MIT License.
