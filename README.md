
# LinkBase: Resource Organization and Discovery Platform

![LinkBase Platform](https://i.imgur.com/XQGsZcL.png)

LinkBase is a modern web application designed to help users organize, categorize, and discover technology resources across various domains. With an intuitive interface and powerful features, it serves as your personal gateway to the best technology resources on the web.

## Features

### Core Functionality
- **Resource Management**: Add, edit, and delete web resources with titles, descriptions, URLs, and tags.
- **Category Organization**: Group resources into customizable categories with icons.
- **Favorites**: Mark resources as favorites for quick access.
- **Search**: Powerful search functionality with category filtering.
- **Keyboard Shortcuts**: Navigate and interact with the app efficiently using keyboard shortcuts.

### Advanced Features
- **Analytics Dashboard**: Visual insights into your resource collection through charts and statistics.
- **Tag Suggestions**: Smart tag suggestions based on category and existing resources.
- **Import/Export**: Back up or transfer your data collection.
- **Media Resources**: Add YouTube videos alongside traditional web links.
- **Responsive Design**: Works seamlessly across desktop and mobile devices.

## Tech Stack

### Frontend
- **React**: UI component library
- **TypeScript**: Type-safe JavaScript
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching and state management
- **Framer Motion**: Animations and transitions
- **Lucide Icons**: Comprehensive icon library
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Component library built on Radix UI

### Backend
- **Supabase**: Database, authentication, and real-time functionality
- **PostgreSQL**: Relational database

### Development Tools
- **Vite**: Fast build tooling
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Using LinkBase

### For Basic Users

1. **Browse Categories**: Explore pre-defined resource categories on the home page.
2. **Search Resources**: Use the search bar to find specific resources by keywords.
3. **View Resources**: Click on any resource card to visit the linked website.
4. **Mark Favorites**: Click the star icon on any resource to add it to your favorites.

### For Power Users

1. **Customize Categories**: Create your own categories with custom icons.
2. **Add Resources**: Add new resources to any category with detailed metadata.
3. **Tag Management**: Use suggested tags or create custom ones to organize resources.
4. **Keyboard Shortcuts**: Press `?` to view all available keyboard shortcuts.
5. **Import/Export**: Back up your data or import from another source.
6. **Analytics**: View usage statistics and resource distribution.

### For Developers

1. **Component Structure**: The app follows a component-based architecture with reusable UI elements.
2. **State Management**: Data is managed through React contexts and TanStack Query.
3. **Database Structure**: Two main tables - Categories and Resources with appropriate relations.
4. **Real-time Updates**: All changes sync in real-time across clients.
5. **Styling System**: Uses Tailwind CSS with custom design tokens and a comprehensive theming system.

## Keyboard Shortcuts

- `?` - Show keyboard shortcuts menu
- `Shift + /` - Focus search bar
- `Alt + C` - Go to Categories page
- `Alt + M` - Go to My Links page
- `Alt + N` - Add new resource
- `Alt + A` - Go to Analytics page

## Performance and Accessibility

- **Optimized Images**: All images are compressed and optimized for fast loading.
- **Semantic HTML**: Proper HTML structure for better accessibility.
- **Color Contrast**: High contrast ratios for readability.
- **Responsive Design**: Works on all screen sizes from mobile to desktop.
- **Dark/Light Modes**: Choose your preferred visual theme.

---

LinkBase is an ongoing project that welcomes contributions. Feel free to submit issues or pull requests to help improve the platform.
