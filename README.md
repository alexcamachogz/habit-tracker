# Habit Tracker

A modern, intuitive habit tracking application built with React, TypeScript, and Tailwind CSS. Track your daily habits, monitor progress, and build consistent routines with a clean, user-friendly interface.

## Features

### 🎯 Habit Management
- Create custom habits with different frequencies (daily, weekly, custom)
- Track detailed information for each habit completion
- Organize habits by categories (gym, skincare, reading, nutrition, others)
- Set habit descriptions and custom icons

### 📊 Progress Tracking
- Real-time progress visualization for daily completion rates
- Track completion streaks and success rates
- Detailed logging system with timestamps and late marking
- Visual feedback with progress bars and completion indicators

### 📱 User Interface
- Clean, modern design with intuitive navigation
- Responsive layout that works on all devices
- Icon-based habit identification with Lucide React icons
- Real-time loading states and smooth animations

### 📈 Analytics & Insights
- Daily progress overview with completion percentages
- Weekly and monthly progress tracking
- Habit statistics including streaks and success rates
- Visual celebration of completed daily routines

## Tech Stack

- **Frontend:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Build Tool:** Vite
- **State Management:** React Context with useReducer
- **Development:** ESLint for code quality

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── nav/            # Navigation components
│   └── ui/             # UI components (icon renderer, etc.)
├── context/            # React Context for state management
├── layouts/            # Page layout components
├── lib/                # Utility functions and helpers
│   ├── habitUtils.ts   # Habit-related utility functions
│   └── mockData.ts     # Sample data for development
├── pages/              # Page components
├── types/              # TypeScript type definitions
│   └── habit.ts        # Habit-related type definitions
└── App.tsx             # Main application component
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd habit-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## Data Models

### Habit
- **id**: Unique identifier
- **name**: Habit display name
- **icon**: Lucide icon name or emoji
- **frequency**: Daily, weekly, or custom frequency settings
- **category**: Organization category
- **trackingType**: Simple or detailed tracking
- **logs**: Record of completions with timestamps

### Habit Log
- **date**: Completion date (YYYY-MM-DD)
- **completed**: Boolean completion status
- **details**: Category-specific tracking data
- **markedLate**: Whether completion was marked after the target date
- **timestamp**: When the log was created

## Features in Detail

### Frequency Types
- **Daily**: Habit should be completed every day
- **Weekly**: Habit should be completed on specific days of the week
- **Custom**: Custom frequency with count and period settings

### Tracking Types
- **Simple**: Basic completion tracking
- **Detailed**: Enhanced tracking with category-specific details
  - Gym: Exercise type and duration
  - Skincare: Morning/evening routine tracking
  - Reading: Minutes read and pages completed
  - Nutrition: Meal completion tracking

### Categories
- **Gym**: Physical exercise and fitness activities
- **Skincare**: Beauty and self-care routines
- **Reading**: Book and learning activities
- **Nutrition**: Diet and meal planning
- **Others**: General habits and custom activities

## State Management

The app uses React Context with useReducer for state management:

- **AppContext**: Main application state including habits, user data, and UI state
- **Actions**: Predefined actions for habit CRUD operations and log management
- **Reducer**: Pure functions handling state updates

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/) for fast development
- Icons provided by [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)