import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '../../services/api'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

export default function ProjectDetail() {
  const { id } = useParams()
  
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getOne(id!).then((res) => res.data),
    enabled: !!id,
  })

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      new: 'Neu',
      planning: 'Planung',
      active: 'Aktiv',
      on_hold: 'Pausiert',
      completed: 'Abgeschlossen',
      cancelled: 'Abgebrochen',
    }
    return labels[status] || status
  }

  if (isLoading) {
    return <div className="text-center py-10">Laden...</div>
  }

  if (!project) {
    return <div className="text-center py-10">Projekt nicht gefunden</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{project.name}</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Status:</span> {getStatusLabel(project.status)}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Kunde:</span> {project.customer?.name || 'Kein Kunde'}
            </p>
            {project.budget && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Budget:</span> {project.budget.toLocaleString('de-DE')} €
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Zeitraum</h3>
            {project.startDate && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Start:</span>{' '}
                {format(new Date(project.startDate), 'dd. MMMM yyyy', { locale: de })}
              </p>
            )}
            {project.endDate && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Ende:</span>{' '}
                {format(new Date(project.endDate), 'dd. MMMM yyyy', { locale: de })}
              </p>
            )}
          </div>
        </div>

        {project.description && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Beschreibung</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{project.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
