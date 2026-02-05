import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LayoutDashboard, Users, FolderKanban, FileText, CheckSquare, Mail, Settings, Shield, LogOut } from 'lucide-react'
import { ReactNode } from 'react'
import { useThemeStore } from '../../store/themeStore'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore()
  const { isDarkMode } = useThemeStore()

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <nav className={`shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">Waldseilgarten CRM</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </NavLink>
                
                <NavLink
                  to="/customers"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  <Users className="w-4 h-4 mr-2" />
                  Kunden
                </NavLink>
                
                <NavLink
                  to="/projects"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  <FolderKanban className="w-4 h-4 mr-2" />
                  Projekte
                </NavLink>
                
                <NavLink
                  to="/documents"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Dokumente
                </NavLink>

                <NavLink
                  to="/tasks"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Aufgaben
                </NavLink>

                <NavLink
                  to="/emails"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  <Mail className="w-4 h-4 mr-2" />
                  E-Mails
                </NavLink>
              </div>
            </div>
            
            <div className="flex items-center">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 mr-4 text-sm font-medium rounded-md ${
                    isActive
                      ? 'text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                <Settings className="w-4 h-4" />
              </NavLink>
              
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `inline-flex items-center px-3 py-2 mr-4 text-sm font-medium rounded-md ${
                      isActive
                        ? 'text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`
                  }
                >
                  <Shield className="w-4 h-4" />
                </NavLink>
              )}
              
              <span className="text-sm text-gray-500 mr-4">{user?.fullName}</span>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
