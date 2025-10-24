# TaskZM - Advanced Task Management Application

A comprehensive, enterprise-level task management application built with React, TypeScript, and modern web technologies.

## 🚀 Features

### Core Task Management
- **Weekly Kanban Board**: 7-day view with drag-and-drop functionality
- **AI Auto-Scheduler**: Intelligent bulk task scheduling
- **AI Smart Schedule**: Individual task scheduling recommendations
- **Task Dependencies**: Manage and visualize task relationships
- **Recurring Tasks**: Daily, weekly, and monthly repeating tasks
- **Subtasks**: Break down complex tasks into manageable components
- **Priority System**: Color-coded priority indicators

### Collaboration & Team
- **Real-time Multi-user Support**: Live collaboration features
- **Team Presence Indicators**: See who's online and active
- **Live Activity Tracking**: Monitor team progress
- **Team Member Management**: Add and manage team members
- **Workspace Isolation**: Separate team workspaces
- **Member Role Management**: Control access levels
- **Invitation System**: Invite team members

### Cloud Sync & Persistence
- **Supabase Backend Integration**: Real-time cloud synchronization
- **Offline Support**: Local caching with sync when online
- **Sync Status Indicators**: Visual sync status
- **Configurable Sync Settings**: Customize sync behavior
- **Manual Sync Trigger**: Force synchronization
- **Local Cache Management**: Optimize storage usage

### Productivity & Insights
- **Time Tracking**: Start/stop/pause functionality with session tracking
- **Analytics Dashboard**: Comprehensive productivity metrics
- **Custom Views**: Filters, grouping, and sorting options
- **Export Functionality**: PDF, CSV, iCal, and JSON formats
- **Task Templates**: Pre-defined workflows
- **Multiple Projects/Workspaces**: Organize by project

### User Experience & Customization
- **Dark Mode**: Light, dark, and system theme switching
- **Keyboard Shortcuts**: Power user navigation
- **Enhanced Notifications**: Push notifications with custom reminders
- **External Calendar Sync**: Google, Outlook, Apple, and CalDAV
- **Responsive Design**: Mobile and desktop optimized
- **Accessibility Features**: Screen reader support and keyboard navigation

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Modern component library
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Sonner**: Toast notifications

### Backend
- **Supabase**: Backend-as-a-Service
- **PostgreSQL**: Database
- **Real-time**: Live collaboration
- **Authentication**: User management
- **Storage**: File uploads

### Development
- **Vite**: Build tool and dev server
- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/taskzm.git
   cd taskzm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

### Demo Mode
If you don't have Supabase credentials, the app will run in demo mode with sample data.

## 📱 Mobile Support

### Touch Gestures
- **Swipe Left**: Mark task as done
- **Swipe Right**: Mark task as todo
- **Long Press**: Open task options
- **Pull to Refresh**: Update task list

### Mobile Features
- **Touch-Friendly Interface**: Optimized for mobile devices
- **Haptic Feedback**: Vibration responses
- **Safe Area Support**: iPhone notch compatibility
- **Responsive Design**: Adapts to all screen sizes

## ♿ Accessibility

### Features
- **Screen Reader Support**: Full compatibility
- **Keyboard Navigation**: Complete keyboard control
- **High Contrast Mode**: Enhanced visibility
- **Font Size Options**: Adjustable text size
- **Focus Indicators**: Clear navigation cues
- **ARIA Labels**: Semantic markup

### Accessibility Settings
Access the accessibility panel to configure:
- High contrast mode
- Reduced motion
- Font size adjustments
- Screen reader optimization
- Keyboard navigation enhancements

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # Base UI components
│   └── ...             # Feature components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── data/               # Sample data
└── docs/               # Documentation
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code style
- **Testing**: Comprehensive test coverage
- **Documentation**: Inline and external docs

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Component and hook testing
- **Integration Tests**: Feature testing
- **E2E Tests**: End-to-end workflows
- **Accessibility Tests**: A11y compliance

### Running Tests
```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
npm run test:ci            # CI mode
```

## 📦 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options
- **Vercel**: Recommended for easy deployment
- **Netlify**: Static site hosting
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write tests for new features
- Update documentation
- Follow commit message conventions

### Commit Message Format
```
feat: add new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

## 📚 Documentation

### User Documentation
- [User Guide](./src/docs/UserGuide.md): Comprehensive user manual
- [Keyboard Shortcuts](./src/docs/UserGuide.md#keyboard-shortcuts): Power user shortcuts
- [Mobile Features](./src/docs/UserGuide.md#mobile-features): Touch interactions

### Developer Documentation
- [Developer Guide](./src/docs/DeveloperGuide.md): Technical documentation
- [API Reference](./src/docs/DeveloperGuide.md#api-integration): Backend integration
- [Component Library](./src/docs/DeveloperGuide.md#component-architecture): UI components

## 🐛 Troubleshooting

### Common Issues

#### App Not Loading
1. Check internet connection
2. Clear browser cache
3. Try different browser
4. Check console for errors

#### Tasks Not Saving
1. Verify internet connection
2. Check if logged in
3. Refresh the page
4. Contact support if persistent

#### Performance Issues
1. Close unnecessary tabs
2. Clear browser cache
3. Restart browser
4. Check available memory

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Community support
- **Documentation**: Comprehensive guides
- **Email Support**: Direct assistance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS
- **shadcn/ui**: For the component library
- **Supabase**: For the backend services
- **Community**: For feedback and contributions

## 📞 Support

- **GitHub Issues**: [Report Issues](https://github.com/your-username/taskzm/issues)
- **Discussions**: [Community Forum](https://github.com/your-username/taskzm/discussions)
- **Email**: support@taskzm.app
- **Documentation**: [Full Documentation](./src/docs/)

---

**TaskZM** - Organize, Track, and Complete Your Tasks Efficiently 🚀