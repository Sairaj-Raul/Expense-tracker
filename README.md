# Expense Tracker Application

A full-stack expense tracking application built with React, Node.js, Express, and MongoDB. Track your income, expenses, and savings with beautiful charts and comprehensive filtering options.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher) or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Expense Tracker"
```

### 2. Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
```

**Example MongoDB URI:**

- Local: `mongodb://localhost:27017/expense-tracker`
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/expense-tracker`

4. Start the backend server:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 3. Frontend Setup

1. Open a new terminal and navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

## 📁 Project Structure

```
Expense Tracker/
├── server/                 # Backend API
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth & error middleware
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   └── server.js     # Server entry point
│   └── package.json
│
├── client/                # Frontend React App
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store & API
│   │   ├── utils/        # Utility functions
│   │   └── App.tsx       # Main app component
│   └── package.json
│
└── README.md
```

## 🛠️ Available Scripts

### Backend (server/)

- `npm run dev` - Start development server with nodemon (auto-restart)
- `npm start` - Start production server

### Frontend (client/)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Environment Variables

### Backend (.env)

| Variable     | Description               | Example                                     |
| ------------ | ------------------------- | ------------------------------------------- |
| `PORT`       | Server port number        | `5000`                                      |
| `MONGO_URI`  | MongoDB connection string | `mongodb://localhost:27017/expense-tracker` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key`                           |
| `JWT_EXPIRE` | JWT token expiration time | `30d`                                       |

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Register** - Create a new account with email and password
2. **Login** - Sign in with your credentials
3. **Protected Routes** - All transaction endpoints require authentication
4. **Token Storage** - JWT tokens are stored in localStorage

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Transactions (Protected)

- `GET /api/transactions` - Get all transactions (with filters)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

**Query Parameters:**

- `type` - Filter by type (income/expense)
- `category` - Filter by category
- `startDate` - Start date for range filter
- `endDate` - End date for range filter

## 🗄️ Database

The application uses MongoDB with the following collections:

- **Users** - User accounts (email, password, name)
- **Transactions** - Financial transactions (linked to users)

## 🚨 Troubleshooting

### Backend Issues

1. **MongoDB Connection Failed**

   - Check if MongoDB is running
   - Verify `MONGO_URI` in `.env` file
   - Ensure MongoDB connection string is correct

2. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Or stop the process using port 5000

### Frontend Issues

1. **API Connection Failed**

   - Ensure backend server is running
   - Check CORS settings in `server/src/app.js`
   - Verify proxy settings in `client/vite.config.ts`

2. **Build Errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run lint`

## 📝 Notes

- The frontend proxy is configured to route `/api/*` requests to `http://localhost:5000`
- JWT tokens expire after 30 days by default (configurable via `JWT_EXPIRE`)
- Passwords are hashed using bcrypt before storing in the database
- All transaction data is user-specific (filtered by authenticated user)

## 🔒 Security

- Passwords are hashed with bcrypt
- JWT tokens for secure authentication
- Protected API routes with middleware
- User-specific data isolation
- Input validation on both client and server

## 📦 Production Deployment

### Backend

1. Set production environment variables
2. Build: `npm start` (no build needed, uses Node.js directly)

### Frontend

1. Build: `npm run build`
2. Serve `dist` folder with a static file server (nginx, Apache, etc.)
3. Update API endpoints for production URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

For detailed features and application flow, see [FEATURES.md](./FEATURES.md)
