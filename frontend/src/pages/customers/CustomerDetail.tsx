import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { customersApi } from '../../services/api'

export default function CustomerDetail() {
  const { id } = useParams()
  
  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customersApi.getOne(id!).then((res) => res.data),
    enabled: !!id,
  })

  if (isLoading) {
    return <div className="text-center py-10">Laden...</div>
  }

  if (!customer) {
    return <div className="text-center py-10">Kunde nicht gefunden</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{customer.name}</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
            <p className="text-gray-600">{customer.address}</p>
            <p className="text-gray-600">{customer.postalCode} {customer.city}</p>
            <p className="text-gray-600">{customer.country}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Kontaktdaten</h3>
            <p className="text-gray-600">Website: {customer.website || '-'}</p>
            <p className="text-gray-600">Branche: {customer.industry || '-'}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ansprechpartner</h3>
          {customer.contacts?.length === 0 ? (
            <p className="text-gray-500">Keine Ansprechpartner vorhanden</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {customer.contacts?.map((contact: any) => (
                <li key={contact.id} className="py-3">
                  <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                  <p className="text-sm text-gray-500">{contact.phone}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
