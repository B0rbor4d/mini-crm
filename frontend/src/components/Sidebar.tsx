import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  Mail,
  Shield,
  Settings,
  LogOut,
  TreePine,
  Sun,
  Moon,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Kunden', path: '/customers', icon: Users },
  { label: 'Dokumente', path: '/documents', icon: FileText },
  { label: 'Aufgaben', path: '/tasks', icon: ClipboardList },
  { label: 'E-Mails', path: '/emails', icon: Mail },
  { label: 'Benutzer', path: '/users', icon: Shield, adminOnly: true },
  { label: 'Einstellungen', path: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  return (
    <div className="flex flex-col h-full w-64 bg-forest-800 dark:bg-forest-950 text-white">
      {/* Logo */}
      <div className="p-6 border-b border-forest-700 dark:border-forest-800">
        <div className="flex items-center space-x-3">
          <TreePine className="w-8 h-8 text-forest-300" />
          <div>
            <h1 className="text-lg font-bold font-heading">Waldseilgarten</h1>
            <p className="text-xs text-forest-300">CRM</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') return null;
          
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-forest-600 dark:bg-forest-700 text-white'
                  : 'text-forest-200 hover:bg-forest-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Dark Mode Toggle + User */}
      <div className="p-4 border-t border-forest-700 dark:border-forest-800 space-y-3">
        <button
          onClick={toggleDarkMode}
          className="flex items-center space-x-3 w-full px-4 py-2 text-forest-200 hover:bg-forest-700 hover:text-white rounded-lg transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span>{isDarkMode ? 'Hell' : 'Dunkel'}</span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-forest-600 dark:bg-forest-700 flex items-center justify-center">
            <span className="text-sm font-bold">
              {user?.firstName?.[0] || user?.email?.[0] || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-forest-300 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 w-full px-4 py-2 text-forest-200 hover:bg-forest-700 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Abmelden</span>
        </button>
      </div>
    </div>
  );
};
