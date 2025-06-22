# MedsBuddy - Medication Management System

A comprehensive medication management application designed for both patients and caretakers, featuring role-based dashboards, medication tracking, and adherence monitoring.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure SQLite-based login/signup with role management (patient/caretaker)
- **Medication Management**: Full CRUD operations for medications with dosage and frequency tracking
- **Adherence Tracking**: Real-time adherence percentage calculations and progress monitoring
- **Dashboard Analytics**: Comprehensive stats including daily medication intake and streak tracking
- **Responsive Design**: Beautiful, accessible interface optimized for all devices

### Technical Features
- **Real-time Updates**: Instant UI updates when medications are taken
- **Form Validation**: Comprehensive client-side validation with helpful error messages
- **Loading States**: Proper loading indicators and error handling
- **Data Persistence**: SQLite database for reliable data storage
- **Type Safety**: Full TypeScript implementation with proper type definitions

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medication-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   This command will start both the frontend (Vite) and backend (Express) servers concurrently:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

4. **Access the application**
   Open your browser and navigate to http://localhost:5173

## 📊 Usage

### Getting Started
1. **Create an Account**: Register as either a Patient or Caretaker
2. **Add Medications**: Use the "Add Medication" button to add your medications with dosage and frequency
3. **Track Daily Intake**: Mark medications as taken using the "Take Now" button
4. **Monitor Progress**: View your adherence statistics and progress on the dashboard

### User Roles
- **Patient**: Manage personal medications and track daily intake
- **Caretaker**: Oversee medication management for patients under their care

### Key Features
- **Dashboard**: Overview of total medications, daily intake, adherence rate, and current streak
- **Medication Cards**: Visual representation of each medication with status indicators
- **Adherence Tracking**: Automatic calculation of adherence percentages based on prescribed frequency
- **Calendar Integration**: Date-based medication logging and tracking

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive, modern styling
- **React Query** for efficient data fetching and caching
- **React Router** for navigation (ready for multi-page expansion)
- **Lucide React** for consistent iconography

### Backend
- **Express.js** RESTful API server
- **SQLite3** database for lightweight, reliable data storage
- **JWT Authentication** for secure user sessions
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

### Database Schema
```sql
-- Users table
users (id, email, password, name, role, created_at)

-- Medications table
medications (id, user_id, name, dosage, frequency, instructions, created_at)

-- Medication logs table
medication_logs (id, medication_id, taken_date, taken_time, notes)
```

## 🧪 Testing

The project includes comprehensive test coverage using Vitest:

### Run Tests
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage
- **Unit Tests**: Utility functions and validation logic
- **Component Tests**: React component rendering and interactions
- **Hook Tests**: Custom React hooks and API interactions
- **Integration Tests**: End-to-end user workflows

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login

### Medications
- `GET /api/medications` - Fetch user's medications
- `POST /api/medications` - Add new medication
- `DELETE /api/medications/:id` - Delete medication

### Medication Logs
- `GET /api/medications/:id/logs` - Fetch medication logs
- `POST /api/medications/:id/logs` - Log medication intake

### Dashboard
- `GET /api/dashboard/stats` - Fetch dashboard statistics

## 📱 Responsive Design

The application is fully responsive with breakpoints optimized for:
- **Mobile**: < 768px (Touch-friendly interface)
- **Tablet**: 768px - 1024px (Adaptive layout)
- **Desktop**: > 1024px (Multi-column layouts)

## 🎨 Design System

### Color Palette
- **Primary Blue**: #2563EB (buttons, links, accents)
- **Success Green**: #10B981 (positive actions, completion states)
- **Warning Orange**: #F97316 (alerts, attention items)
- **Error Red**: #EF4444 (errors, deletion actions)
- **Neutral Grays**: Multiple shades for text and backgrounds

### Typography
- **Headings**: Inter font family with 120% line height
- **Body Text**: 150% line height for readability
- **Font Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **JWT Tokens**: Secure authentication with 7-day expiration
- **Input Sanitization**: Server-side validation and sanitization
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Controlled cross-origin resource sharing

## 📦 Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create a `.env` file for production:
```env
JWT_SECRET=your-secure-jwt-secret-key
NODE_ENV=production
PORT=3001
```

### Deployment Options
- **Frontend**: Vercel, Netlify, or any static hosting service
- **Backend**: Railway, Heroku, or any Node.js hosting platform
- **Database**: SQLite file can be deployed with the application

## 🛠️ Development

### Code Organization
- **Components**: Reusable UI components in `/src/components`
- **Pages**: Route-level components in `/src/pages`
- **Hooks**: Custom React hooks in `/src/hooks`
- **Contexts**: React context providers in `/src/contexts`
- **Utils**: Utility functions in `/src/utils`
- **Server**: Backend API in `/server`

### Code Quality
- **ESLint**: Configured for React and TypeScript
- **TypeScript**: Strict mode enabled for type safety
- **Prettier**: Code formatting (configure as needed)
- **Husky**: Git hooks for pre-commit checks (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Lucide React** for beautiful, consistent icons
- **Tailwind CSS** for rapid UI development
- **Vite** for fast development and building
- **React Query** for efficient data management

---

**MedsBuddy** - Empowering better medication management through technology 💊✨