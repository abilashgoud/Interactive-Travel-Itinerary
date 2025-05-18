# TripCraft - Your Interactive Travel Itinerary Builder

![TripCraft Logo](https://img.shields.io/badge/TripCraft-Your%20Travel%20Companion-teal?style=for-the-badge)

TripCraft is a beautiful, intuitive travel itinerary planning application that helps travelers organize their adventures with ease. Create, customize, and manage your travel plans with a responsive and visually appealing interface.

![Screenshot of TripCraft](https://images.unsplash.com/photo-1674840690385-520922dbd526?auto=format&w=400&h=200&fit=crop)

## ✨ Features

- **Intuitive Day-Based Planning**: Organize your trip day-by-day with customizable names
- **Activity Management**: Add, edit, and delete activities with time scheduling
- **Drag-and-Drop Organization**: Easily reorder days and activities with smooth drag-and-drop functionality
- **Multiple View Options**:
  - **List View**: Detailed view of all your days and activities
  - **Calendar View**: Visualize your trip on a calendar grid
  - **Grid View**: Compact overview of your entire itinerary
- **Timeline Scheduler**: Visual timeline interface for scheduling activities with snap-to-slot functionality
- **Export to PDF**: Generate a beautifully formatted PDF of your itinerary for offline access
- **Persistent Storage**: Your itinerary is automatically saved to your browser's local storage

## 🛠️ Technologies

- **Frontend**: React with Vite
- **Styling**: Tailwind CSS and custom components
- **UI Components**: Custom components built with Radix UI primitives
- **Animations**: Framer Motion for smooth transitions and animations
- **Drag & Drop**: React Beautiful DnD for intuitive interactions
- **PDF Export**: html2pdf for document generation
- **Icons**: Lucide React for consistent iconography

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/tripcraft.git
cd tripcraft
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📋 Usage

1. **Create Your Itinerary**: Start by naming your itinerary and adding days
2. **Add Activities**: Click "Add Activity" to include activities for each day
3. **Organize**: Drag and drop to reorder days or activities
4. **Timeline View**: Click the "Timeline" button to schedule activities visually
5. **Export**: Generate a PDF version of your itinerary for sharing or printing

## 🧩 Code Structure

```
tripcraft/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable UI components
│   │   ├── ui/      # Basic UI elements
│   │   └── itinerary/ # Itinerary-specific components
│   ├── contexts/    # React context providers
│   ├── lib/         # Utility functions and helpers
│   ├── pages/       # Main application pages
│   ├── App.jsx      # Main application component
│   └── main.jsx     # Application entry point
└── index.html       # HTML template
```

## 🧠 Design Decisions

- **User Experience**: Focus on intuitive interactions with drag-and-drop functionality and visual feedback
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Performance**: Optimized rendering with React hooks and proper state management
- **Visual Appeal**: Cohesive color scheme and smooth animations enhance the user experience

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Background images from [Unsplash](https://unsplash.com/)
- Font pairings: Inter and Playfair Display

---

Made with ❤️ by your Abilash
