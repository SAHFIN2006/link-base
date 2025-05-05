
# Resource Manager App

A modern, responsive resource management application built with React, TypeScript, and Supabase.

## Features

- **Category Management**: Organize resources into custom categories
- **Resource Management**: Add, edit, and delete web resources with detailed information
- **File Management**: Upload and manage files securely
- **Notes**: Create and manage notes for each category
- **Analytics**: Real-time analytics dashboard with device tracking
- **Favorites**: Mark resources as favorites for quick access
- **Search**: Powerful search functionality across all resources
- **Dark Mode**: Full support for light and dark themes

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL)
- **File Storage**: Supabase Storage
- **Charts**: Recharts

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up Supabase credentials
4. Start the development server with `npm run dev`

## Core Functionality

### Categories

Create and manage categories to organize your resources. Each category can have:
- A custom name
- Description
- Icon (from Lucide library or custom URL)
- Associated resources, notes and files

### Resources

Add web resources with:
- Title and URL
- Description
- Custom tags
- Identification data (owner, contact info, access type)
- Category assignment

### Files

Upload and manage files:
- Supports multiple file types (documents, images, videos, etc.)
- Organized by category
- Preview and download functionality

### Notes

Create rich text notes:
- Organized by category
- Support for formatting and markdown

### Analytics

Track and visualize:
- Resource distribution by category
- Device usage statistics
- Browser and OS distribution
- Historical data trends

## Architecture

The application follows a component-based architecture with:
- Context API for state management
- Custom hooks for data operations
- Typescript for type safety
- Responsive design for all screen sizes
