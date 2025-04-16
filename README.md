
# 🔗 LinkBase - Your Personal Technology Resource Manager

![LinkBase Banner](https://placehold.co/1200x400?text=LinkBase)

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#usage">Usage</a> •
  <a href="#developer-guide">Developer Guide</a> •
  <a href="#license">License</a>
</p>

LinkBase is a comprehensive platform for organizing, categorizing, and discovering valuable technology resources. It's designed for developers, researchers, and tech enthusiasts who want to maintain a curated collection of useful links and resources across various technology domains.

## ✨ Features

- **Resource Management**: Save, organize, and categorize all your important tech links in one place
- **Category Organization**: Pre-defined tech categories with descriptive icons for easy navigation
- **Search Functionality**: Quickly find resources using the search feature with category filters
- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes based on your preference
- **Database Integration**: Powered by Supabase for reliable data storage and retrieval
- **Favorites System**: Mark resources as favorites for quick access
- **Tag System**: Add tags to resources for better organization and discovery

## 🎮 Demo

Visit the live demo at: [https://linkbase-demo.com](https://linkbase-demo.com)

## 🛠️ Tech Stack

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind,supabase" />
  </a>
</p>

- **Frontend Framework**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) for lightning-fast development and optimized production builds
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- **Database**: [Supabase](https://supabase.com/) for PostgreSQL database and realtime capabilities
- **Routing**: [React Router](https://reactrouter.com/) for navigation
- **Icons**: [Lucide React](https://lucide.dev/) for beautiful, consistent icons
- **Animation**: [Framer Motion](https://www.framer.com/motion/) for smooth animations
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) for efficient form state management
- **Charts**: [Recharts](https://recharts.org/) for data visualization (where applicable)

## 🚀 Getting Started

### For Users

1. Visit [LinkBase](https://linkbase-demo.com)
2. Browse existing categories or use the search function to find resources
3. Add your own resources by clicking on "Add New Resource"
4. Organize resources by categories and tags
5. Mark important resources as favorites for quick access

### For Developers

#### Prerequisites

- Node.js (v16 or newer)
- npm or yarn package manager

#### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/linkbase.git
   cd linkbase
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and visit `http://localhost:5173`

## 📖 Usage

### Basic Usage

- **Browse Categories**: Explore different technology categories from the homepage or categories page
- **Search Resources**: Use the search bar to find specific resources by keyword
- **View Resource Details**: Click on a resource card to view its details and visit the link
- **Add Resources**: Click the "Add New Resource" button to save a new link to your collection
- **Favorite Resources**: Mark resources as favorites by clicking the star icon

### Power User Features

- **Advanced Search**: Use category filters to narrow down search results
- **Resource Management**: Edit, delete, or favorite resources from the resource cards
- **Tag Navigation**: Click on tags to find related resources
- **Keyboard Shortcuts**: Use keyboard shortcuts for faster navigation (coming soon)
- **Data Export/Import**: Export your link collection or import from other sources (coming soon)

## 🧑‍💻 Developer Guide

### Project Structure

```
linkbase/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ui/         # Base UI components
│   │   └── dialogs/    # Modal dialogs
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── integrations/   # External service integrations
│   │   └── supabase/   # Supabase integration
│   ├── lib/            # Utility functions
│   └── pages/          # Page components
├── .env                # Environment variables
└── ...                 # Configuration files
```

### Key Components

- **Layout**: Main layout component with navbar and footer
- **Navbar**: Navigation bar with theme toggle and mobile menu
- **Footer**: Footer with links and newsletter signup
- **ResourceCard**: Card component for displaying resource items
- **CategoryCard**: Card component for displaying category items

### Database Schema

LinkBase uses a Supabase PostgreSQL database with the following schema:

1. **categories** table:
   - id (UUID, Primary Key)
   - name (Text)
   - description (Text)
   - icon (Text)
   - created_at (Timestamp)
   - updated_at (Timestamp)

2. **resources** table:
   - id (UUID, Primary Key)
   - title (Text)
   - url (Text)
   - description (Text)
   - category_id (UUID, Foreign Key to categories)
   - tags (Text Array)
   - favorite (Boolean)
   - created_at (Timestamp)
   - updated_at (Timestamp)

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">
  Made with ❤️ by Your Name
</p>
