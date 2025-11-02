# Expense Tracker - Features & Architecture

## 📱 Application Overview

The Expense Tracker is a comprehensive financial management application that helps users track their income, expenses, and savings. Built with modern web technologies, it provides a user-friendly interface with powerful filtering, visualization, and export capabilities.

## ✨ Key Features

### 1. 🔐 User Authentication
- **User Registration**: Create account with email, password, and optional name
- **User Login**: Secure login with JWT token-based authentication
- **Protected Routes**: All transaction pages require authentication
- **Persistent Sessions**: Token stored in localStorage for seamless user experience
- **Password Security**: Bcrypt hashing for secure password storage

### 2. 💰 Transaction Management

#### Income & Expense Tracking
- **Create Transactions**: Add income or expense with details
- **Edit Transactions**: Update existing transactions
- **Delete Transactions**: Remove transactions with confirmation
- **Transaction Details**: Category, description, amount, and date

#### Transaction Types
- **Income**: Track money received (salary, freelance, investments)
- **Expense**: Track money spent (bills, shopping, entertainment)

#### Due Expenses
- **Future Expenses**: Track expenses scheduled for future dates
- **Due Date Management**: View all upcoming expenses in one place
- **Quick Add**: Easy expense creation with pre-filled expense type

### 3. 🔍 Advanced Filtering & Search

#### Global Search
- **Real-time Search**: Search across all pages using header search bar
- **Multi-field Search**: Searches category, description, and amount
- **URL Integration**: Search query preserved in URL for sharing/bookmarking

#### Local Filters
- **Category Filter**: Filter by transaction category
- **Date Range Filter**: Filter by start and end dates
- **Amount Filter**: Filter by amount (greater than, less than, equal to)
- **Description Filter**: Search within transaction descriptions
- **Multiple Filters**: Combine multiple filters for precise results

#### Filter Features
- **Collapsible Filter Panel**: Accordion-style filter section
- **Active Filter Count**: Badge showing number of active filters
- **Clear All Filters**: One-click filter reset
- **Filter Persistence**: Filters maintained during navigation

### 4. 📊 Dashboard & Analytics

#### Summary Cards
- **Total Income**: Overall income with percentage change
- **Total Expenses**: Overall expenses with percentage change
- **Savings**: Net savings (income - expenses) with trend
- **Balance**: Current financial balance

#### Visual Charts

**Statistics Chart**
- Monthly income, expense, and savings comparison
- Bar chart showing trends over time
- Color-coded categories

**Income vs Expense Comparison**
- Donut chart comparing income and expense
- Percentage breakdown with visual indicators
- Net savings calculation
- Toggle between comparison view and category breakdown

**Category Breakdown**
- Pie chart for income/expense categories
- Category percentages and amounts
- Top categories highlighted
- "Show All" option for extensive category lists

**Overview Section**
- Multiple view options:
  - **Comparison View**: Income vs Expense chart
  - **Pie Chart View**: Category breakdown
  - **List View**: Top 3 categories with progress bars
- Toggle between Income and Expense types
- Percentage changes and trend indicators

### 5. 📈 Financial Insights

#### Calculations
- **Total Calculations**: Automatic sum of income and expenses
- **Savings Calculation**: Income minus expenses
- **Percentage Changes**: Month-over-month comparisons
- **Category Breakdown**: Amount and percentage per category
- **Monthly Data**: Aggregated data by month

#### Analytics Features
- Previous month comparisons
- Percentage change indicators
- Category-wise spending analysis
- Monthly trend visualization

### 6. 📥 CSV Export

#### Export Features
- **Filtered Export**: Export only filtered transactions
- **Multiple Pages**: Export from Income, Expense, and Due pages
- **Automatic Naming**: Files named with date and type (e.g., `income_2024-01-15.csv`)
- **Complete Data**: Includes all transaction fields
- **CSV Formatting**: Proper CSV escaping for Excel/Google Sheets compatibility

#### Export Data Fields
- Date
- Type (Income/Expense)
- Category
- Description
- Amount
- Created At

### 7. 🎨 User Interface

#### Design Features
- **Modern UI**: Clean, minimalist design with Tailwind CSS
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Color Coding**: Green for income, red for expenses
- **Dark Sidebar**: Professional sidebar navigation
- **Collapsible Sidebar**: Toggle sidebar for more screen space

#### Navigation
- **Dashboard**: Overview of all finances
- **Income**: Income transaction management
- **Expense**: Expense transaction management
- **Savings**: Savings overview and goals
- **Due**: Future expense tracking

#### User Experience
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation feedback
- **Empty States**: Helpful messages when no data available

## 🔄 Application Flow

### Authentication Flow

```
1. User visits application
   ↓
2. Check if authenticated (token in localStorage)
   ↓
3a. If authenticated → Redirect to Dashboard
3b. If not authenticated → Redirect to Login
   ↓
4. User registers/logs in
   ↓
5. JWT token stored in localStorage
   ↓
6. User redirected to Dashboard
   ↓
7. Token included in all API requests
```

### Transaction Flow

```
1. User navigates to Income/Expense/Due page
   ↓
2. Application fetches transactions (filtered by type)
   ↓
3. User applies filters/search
   ↓
4. Transactions filtered on client-side
   ↓
5. Filtered results displayed
   ↓
6a. User exports CSV → Downloads filtered transactions
6b. User edits/deletes → Updates via API → UI refreshes
6c. User adds transaction → Creates via API → UI refreshes
```

### Data Flow

```
Frontend (React)
   ↓
Redux Toolkit Query (RTK Query)
   ↓
API Request (with JWT token)
   ↓
Backend (Express)
   ↓
Auth Middleware (JWT verification)
   ↓
Controller (Business logic)
   ↓
MongoDB (Database)
   ↓
Response back to Frontend
```

## 🏗️ Architecture

### Frontend Architecture

**Technology Stack:**
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **RTK Query** - API data fetching
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Hook Form** - Form management

**Component Structure:**
```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Dashboard charts and cards
│   ├── layout/        # Layout components (Header, Sidebar)
│   ├── transactions/  # Transaction forms and lists
│   └── ui/            # Reusable UI components
├── pages/             # Page components
├── store/             # Redux store and API slices
├── hooks/             # Custom React hooks
└── utils/             # Utility functions
```

### Backend Architecture

**Technology Stack:**
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

**Server Structure:**
```
server/src/
├── config/      # Database configuration
├── controllers/ # Business logic
├── middleware/  # Auth and error handling
├── models/      # Database models
├── routes/      # API route definitions
└── server.js    # Entry point
```

## 📋 API Architecture

### RESTful Endpoints

**Authentication Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Authenticate user

**Transaction Endpoints (Protected):**
- `GET /api/transactions` - Get user's transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Request/Response Format

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response Format:**
```json
{
  "message": "Success message",
  "data": { ... }
}
```

## 🔐 Security Features

1. **Password Hashing**: Bcrypt with salt rounds
2. **JWT Tokens**: Secure token-based authentication
3. **Protected Routes**: Middleware verification
4. **User Isolation**: Transactions filtered by user ID
5. **Input Validation**: Server-side validation
6. **CORS Configuration**: Restricted origin access

## 📊 Data Models

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```javascript
{
  user: ObjectId (reference to User),
  type: String (enum: ['income', 'expense']),
  amount: Number (required, min: 0),
  category: String (required),
  description: String (optional),
  date: Date (required),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Key Functionalities

### Filtering Logic
- **Client-side Filtering**: Fast filtering without server requests
- **Combined Filters**: Multiple filters work together
- **Global Search Integration**: Works alongside local filters
- **Real-time Updates**: Instant filter results

### Chart Rendering
- **Responsive Charts**: Adapt to container size
- **Interactive Tooltips**: Hover for details
- **Color Consistency**: Consistent color scheme
- **Data Aggregation**: Automatic calculation and grouping

### Export Functionality
- **CSV Generation**: Proper CSV format with escaping
- **Filter Respect**: Only exported filtered data
- **Filename Generation**: Automatic date-based naming
- **Browser Download**: Native download functionality

## 🚀 Performance Optimizations

1. **Memoization**: `useMemo` for filtered transactions
2. **Code Splitting**: React lazy loading
3. **Efficient Rendering**: React optimization techniques
4. **API Caching**: RTK Query automatic caching
5. **Debounced Search**: Smooth search experience

## 📱 Responsive Design

- **Desktop**: Full feature set with sidebar
- **Tablet**: Adaptive layout with collapsible sidebar
- **Mobile**: Optimized for touch interactions

## 🔮 Future Enhancements

Potential features for future development:
- Email verification
- Password reset functionality
- Data import from CSV/Excel
- Budget setting and tracking
- Recurring transactions
- Multiple currency support
- Receipt/image upload
- Transaction categories customization
- Export to PDF
- Email reports

---

## 📝 Summary

The Expense Tracker application is a full-featured financial management tool that combines powerful functionality with an intuitive user interface. It provides comprehensive transaction tracking, advanced filtering, beautiful visualizations, and convenient export options, all secured with modern authentication practices.

