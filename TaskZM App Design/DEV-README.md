# TaskZM App - Development Environment

## 🚀 Quick Start

### Option 1: Automated Setup
```bash
./dev-setup.sh
```

### Option 2: Manual Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Access the App

Once the development server is running, open your browser and navigate to:

**http://localhost:3000**

## 🛠️ Development Features

### ✅ Implemented Features
- **Recurring Tasks System** - Create daily, weekly, monthly recurring tasks
- **Task Dependencies** - Link tasks that depend on each other
- **AI Auto-Scheduling** - Intelligent task scheduling
- **Priority Management** - High, medium, low priority tasks
- **Mobile Responsive** - Works on desktop and mobile
- **Real-time Notifications** - Smart notification system
- **Archive System** - Task archiving and restoration
- **Tag Management** - Custom task categorization

### 🔧 Development Tools
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons
- **Sonner** for notifications

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── AddTaskModal.tsx
│   ├── TaskCard.tsx
│   ├── TimelinePanel.tsx
│   └── ...
├── lib/                # Utility functions
│   ├── recurringTasks.ts
│   ├── api.ts
│   └── supabase.ts
├── contexts/           # React contexts
├── data/              # Sample data
└── App.tsx            # Main application
```

## 🎯 Key Components

### Task Management
- **AddTaskModal** - Create/edit tasks with recurring options
- **TaskCard** - Display individual tasks
- **TimelinePanel** - Today's task timeline
- **WeekNavigation** - Weekly view navigation

### Recurring Tasks
- **generateRecurringTasks()** - Creates task instances
- **validateRecurringConfig()** - Validates configuration
- **Visual indicators** - "Repeating" badge on cards

## 🧪 Testing

Run the recurring tasks tests:
```bash
# Tests are located in src/lib/__tests__/recurringTasks.test.ts
# Run with your preferred test runner
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=your_api_url
```

### Vite Configuration
- **Port**: 3000
- **Host**: 0.0.0.0 (accessible from network)
- **Auto-open**: true

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Dependencies issues**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build errors**
   ```bash
   # Check TypeScript errors
   npx tsc --noEmit
   ```

## 📱 Mobile Development

The app is fully responsive and works on:
- **Desktop**: Full kanban board view
- **Mobile**: Today's agenda view
- **Tablet**: Responsive layout

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Custom components** in `src/components/ui/`
- **DM Sans** font family
- **Blue primary color** (#3300ff)

## 🔄 Development Workflow

1. **Start server**: `npm run dev`
2. **Make changes** to components
3. **Hot reload** automatically updates
4. **Test features** in browser
5. **Commit changes** to git

## 📊 Performance

- **Vite** for fast HMR (Hot Module Replacement)
- **React 18** with concurrent features
- **Optimized builds** with tree-shaking
- **Lazy loading** for better performance

---

**Happy coding! 🎉**
