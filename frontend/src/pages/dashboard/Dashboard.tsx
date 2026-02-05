import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../../services/api'
import { Users, FolderKanban, CheckCircle, Clock } from 'lucide-react'
import type { AxiosResponse } from 'axios'

interface DashboardStats {
  counts: {
    totalCustomers: number
    totalProjects: number
    activeProjects: number
    completedProjects: number
  }
  recentCustomers: Array<{
    id: string
    name: string
    city: string
  }>
  recentProjects: Array<{
    id: string
    name: string
    customer?: {
      name: string
    }
  }>
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats().then((res: AxiosResponse<DashboardStats>) => res.data),
  })

  if (isLoading) {
    return <div className="text-center py-10">Laden...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Gesamtkunden
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats?.counts?.totalCustomers || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FolderKanban className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Gesamtprojekte
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats?.counts?.totalProjects || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Aktive Projekte
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats?.counts?.activeProjects || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Abgeschlossen
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats?.counts?.completedProjects || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Neueste Kunden
            </h3>
            <div className="mt-4">
              {stats?.recentCustomers?.length === 0 ? (
                <p className="text-gray-500">Keine Kunden vorhanden</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {stats?.recentCustomers?.map((customer: any) => (
                    <li key={customer.id} className="py-3">
                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.city}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Neueste Projekte
            </h3>
            <div className="mt-4">
              {stats?.recentProjects?.length === 0 ? (
                <p className="text-gray-500">Keine Projekte vorhanden</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {stats?.recentProjects?.map((project: any) => (
                    <li key={project.id} className="py-3">
                      <p className="text-sm font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-500">
                        {project.customer?.name || 'Kein Kunde'}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
