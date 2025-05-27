# Happy Home Renovation - Full Stack Web Application

A complete web solution for a home renovation business with user authentication, admin dashboard, gallery management, and contact form functionality.

![Happy Home Renovation](frontend\src\assets\Hero.png)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Admin Dashboard](#admin-dashboard)
- [Component Organization](#component-organization)
- [Deployment](#deployment)
- [License](#license)

## Features

### User Features
- **Home Page** - Showcases company services and highlights
- **Services Page** - Detailed information about renovation services offered
- **Gallery** - Protected image gallery of past projects (requires login)
- **Contact Form** - Allows visitors to send inquiries and requests
- **User Authentication** - Registration and login system for customers
- **User Profiles** - Personal information management for registered users

### Admin Features
- **Admin Dashboard** - Central management interface
- **Message Management** - View and respond to contact form submissions
- **Gallery Management** - Upload, manage, and organize project images
- **Admin Authentication** - Secure login for administrative access
- **Admin Profile** - Update admin credentials and information

## Tech Stack

### Frontend
- **React.js** - UI library
- **TypeScript** - Type safety for components
- **Vite** - Fast development server and build tool
- **React Router** - Navigation and routing
- **Framer Motion** - Animations and transitions
- **Context API** - State management
- **React Hook Form** - Form validation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web server framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage and management

## Project Structure

```
HH/
├── backend/                   # Backend API server
│   ├── config/                # Configuration files
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   └── db.js              # Database connection
│   ├── controllers/           # Request handlers
│   │   ├── authController.js  # Admin authentication
│   │   ├── contactController.js # Contact form handling
│   │   ├── imageController.js # Gallery image management
│   │   └── userController.js  # User authentication
│   ├── middleware/            # Custom middleware
│   │   ├── authMiddleware.js  # Admin auth middleware
│   │   └── userAuthMiddleware.js # User auth middleware
│   ├── models/                # Mongoose models
│   │   ├── Admin.js           # Admin user model
│   │   ├── Contact.js         # Contact message model
│   │   ├── Image.js           # Gallery image model
│   │   └── User.js            # User model
│   ├── routes/                # API routes
│   │   ├── authRoutes.js      # Admin auth routes
│   │   ├── contactRoutes.js   # Contact form routes
│   │   ├── imageRoutes.js     # Gallery image routes
│   │   └── userRoutes.js      # User auth routes
│   ├── scripts/               # Utility scripts
│   │   └── seedAdmin.js       # Create admin user
│   ├── .env                   # Environment variables
│   ├── package.json           # Dependencies
│   └── server.js              # Entry point
│
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── assets/            # Static assets
│   │   ├── components/        # Reusable components
│   │   │   ├── about/         # About page components
│   │   │   ├── contact/       # Contact page components
│   │   │   ├── gallery/       # Gallery components
│   │   │   ├── home/          # Home page components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── services/      # Services page components
│   │   │   └── shared/        # Shared components
│   │   ├── context/           # React Context providers
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin pages
│   │   │   └── user/          # User pages
│   │   ├── styles/            # Global styles
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── index.html             # HTML template
│   ├── package.json           # Dependencies
│   ├── tsconfig.json          # TypeScript config
│   └── vite.config.js         # Vite configuration
│
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14.0.0 or later)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd HH
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables (see Environment Variables section)

5. Seed the admin user:
   ```bash
   cd ../backend
   node scripts/seedAdmin.js
   ```

6. Start the development servers:

   Backend:
   ```bash
   cd backend
   npm start
   ```

   Frontend:
   ```bash
   cd frontend
   npm start
   ```

7. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration for OTP
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-app-password
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/profile` - Update user profile

### Admin
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get admin profile
- `PUT /api/auth/profile` - Update admin profile

### Contact
- `POST /api/contact` - Submit a contact message
- `GET /api/contact` - Get all contact messages (admin only)
- `DELETE /api/contact/:id` - Delete a contact message (admin only)

### Gallery
- `GET /api/gallery` - Get all gallery images
- `POST /api/gallery` - Upload a new image (admin only)
- `DELETE /api/gallery/:id` - Delete an image (admin only)

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. When a user or admin logs in, they receive a token that is stored in localStorage and included in subsequent API requests.

### User Authentication
Regular users can access protected routes like the Gallery and User Profile after logging in.

#### Email Verification
The system includes email verification during registration:
1. Users enter their email and click "Verify Email"
2. A 6-digit OTP is sent to their email
3. After verifying their email with the OTP, they can complete registration
4. OTPs expire after 10 minutes for security

### Admin Authentication
Admin users have additional privileges:
- Default admin credentials:
  - Email: admin@happyhome.com
  - Password: a******
- Admin login automatically opens a new tab with the admin dashboard
- Admin authentication grants access to all admin routes

## Admin Dashboard

The admin dashboard provides comprehensive management tools:

1. **Messages** - View and manage contact form submissions
2. **Gallery Management** - Upload, organize, and delete project images
3. **Admin Settings** - Update admin profile and password

## Deployment

### Backend Deployment
The backend can be deployed to platforms like Heroku, DigitalOcean, or AWS.

Example for Heroku:
```bash
heroku create
git subtree push --prefix backend heroku main
```

### Frontend Deployment
The React frontend can be deployed to Netlify, Vercel, or similar services.

Example for Netlify:
```bash
cd frontend
npm run build
netlify deploy --prod
```

## Component Organization

### Page Components
- **Home** - Landing page with hero section, featured services, projects, and testimonials
- **Services** - Service details and process steps
- **Gallery** - Project showcase with filtering capabilities
- **About** - Company information, values, and team members
- **Contact** - Contact form and company information
- **Login/Signup** - User authentication forms
- **UserProfile** - User profile management

### Admin Components
- **AdminLogin** - Admin authentication
- **AdminMessages** - View and manage contact form submissions
- **AdminImageUpload** - Gallery image management
- **AdminSettings** - Admin profile management

### Layout Components
- **Layout** - Main layout wrapper with header and footer
- **AdminLayout** - Admin dashboard layout
- **Header** - Navigation with responsive menu
- **Footer** - Site footer with links and information

### Shared Components
- **Logo** - Company logo component
- **PageHeader** - Consistent page headers
- **ProtectedRoute** - Route protection for authenticated users
- **AnimatedSection** - Framer Motion animated components
- **ScrollToTop** - Automatic scroll restoration

## License

This project is licensed under the MIT License.

---

© 2025 Happy Home Renovation. All rights reserved.
