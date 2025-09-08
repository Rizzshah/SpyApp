# SpinWheel Landing Page

A Next.js application with a spinning wheel landing page, user data collection, and admin dashboard.

## Features

🎯 **Interactive Spinning Wheel**
- Animated spinning wheel with attractive prizes
- Smooth animations using Framer Motion
- Responsive design for all devices

📊 **User Tracking & Analytics**
- Comprehensive visitor tracking
- Device, browser, and OS detection
- Location tracking (with user permission)
- IP address logging

👤 **User Data Collection**
- Post-spin form for contact information
- Email, phone, and location collection
- GPS coordinates capture
- Form validation with Zod

🔐 **Admin Dashboard**
- Secure admin login system
- User management interface
- Visitor analytics and tracking data
- Real-time statistics

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/spinwheel-app
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system. If you're using MongoDB locally:

```bash
# Start MongoDB service
mongod
```

Or use MongoDB Atlas for cloud hosting.

### 4. Setup Admin User

```bash
npm run setup-admin
```

This will create a default admin user:
- **Username**: admin
- **Password**: admin123

⚠️ **Important**: Change the default password after first login!

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin pages
│   │   ├── login/         # Admin login
│   │   └── dashboard/     # Admin dashboard
│   ├── api/               # API routes
│   │   ├── users/         # User management API
│   │   ├── tracking/      # Visitor tracking API
│   │   └── admin/         # Admin API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Landing page
│   └── providers.tsx      # App providers
├── components/            # React components
│   ├── ui/               # UI components
│   ├── modals/           # Modal components
│   └── SpinWheel.tsx     # Main spinning wheel
├── models/               # MongoDB models
│   ├── User.ts           # User model
│   ├── Admin.ts          # Admin model
│   └── VisitorTracking.ts # Tracking model
├── services/             # API services
├── utils/                # Utility functions
├── validators/           # Zod schemas
└── types/                # TypeScript types
```

## Usage

### Landing Page
1. Users visit the landing page
2. They see an attractive spinning wheel
3. Click "Spin to Win" to play
4. After spinning, a form appears to collect contact info
5. Success message is shown after form submission

### Admin Dashboard
1. Navigate to `/admin/login`
2. Login with admin credentials
3. View user data, visitor tracking, and analytics
4. Monitor system activity and statistics

## API Endpoints

### Public Endpoints
- `POST /api/users` - Submit user form data
- `POST /api/tracking` - Track visitor activity

### Admin Endpoints (Auth Required)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get registered users
- `GET /api/admin/tracking` - Get visitor tracking data

## Features in Detail

### Spinning Wheel
- 8 different prize segments
- Realistic physics animation
- Random prize selection
- Customizable prizes and colors

### User Tracking
- IP address detection
- User agent parsing
- Device type identification
- Browser and OS detection
- Geographic location (optional)
- Page view tracking
- Session management

### Data Collection
- Email validation
- Phone number validation
- Location input
- GPS coordinates (with permission)
- Device fingerprinting
- Timestamp tracking

### Admin Features
- Secure authentication with JWT
- User management
- Visitor analytics
- Real-time statistics
- Data export capabilities

## Customization

### Adding New Prizes
Edit `src/utils/helpers.ts`:

```typescript
export const spinWheelPrizes = [
  '🎁 Your Prize 1',
  '🏆 Your Prize 2',
  // Add more prizes...
];
```

### Styling
- Modify `tailwind.config.js` for theme customization
- Edit component styles in respective files
- Add custom CSS in `globals.css`

### Database Schema
- User model: Contact info, device data, location
- Admin model: Login credentials, roles
- VisitorTracking: Session data, page views, analytics

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms
- Ensure Node.js 18+ support
- Configure environment variables
- Set up MongoDB connection
- Deploy with build command: `npm run build`

## Security Considerations

- JWT tokens for admin authentication
- Password hashing with bcrypt
- Input validation with Zod
- Rate limiting (recommended for production)
- CORS configuration
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational and commercial use. Please ensure compliance with data privacy regulations (GDPR, CCPA) when collecting user data.

## Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with details
4. Include error logs and environment info

---

**Note**: This application collects user data. Ensure compliance with local privacy laws and regulations. Add appropriate privacy policies and terms of service for production use.
