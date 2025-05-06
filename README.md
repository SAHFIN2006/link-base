
# Resource Manager

A modern web application for organizing and managing resources, categories, files, and notes.

## Core Features

- **Resource Management**: Save and organize web resources with descriptions and tags
- **Categories**: Group resources by customizable categories
- **File Storage**: Upload and manage files associated with categories
- **Notes**: Create and edit notes for each category
- **Analytics**: Track visitor statistics with device information
- **Dark Mode**: Full support for light and dark themes
- **Resource Identification**: Track resource ownership and access types

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Data Visualization**: Recharts
- **Storage**: Supabase (database & storage)

## Application Structure

- **Pages**: Main application views (Dashboard, Categories, Resources, Analytics)
- **Components**: Reusable UI elements organized by functionality
- **Context**: State management for application data
- **Utils**: Helper functions and utilities

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Folder Structure

```
src/
├── components/          # UI components
│   ├── dialogs/         # Modal dialogs
│   ├── ui/              # Base UI components
│   └── animations/      # Visual animations
├── context/             # Application state
├── pages/               # Main application views
├── utils/               # Helper functions
└── hooks/               # Custom React hooks
```

## Key Features

- Tag-based organization
- Resource metadata tracking
- Device analytics
- Responsive design
- Intuitive user interface
- File management
- Notes editor

