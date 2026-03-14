import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { customersApi, CustomerFilters, PaginatedResponse } from '../../services/api'
import { Plus, Search, Edit, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Customer {
  id: string;
  name: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  website?: string;
  industry?: string;
  status?: string;
  tags?: string[];
  contacts?: any[];
}

const STATUS_OPTIONS = [
  { value: '', label: 'Alle Status' },
  { value: 'active', label: 'Aktiv' },
  { value: 'inactive', label: 'Inaktiv' },
  { value: 'prospect', label: 'Prospect' },
];

export default function Customers() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Deutschland',
    website: '',
    industry: '',
    status: 'active',
    tags: [] as string[],
  })
  const [tagInput, setTagInput] = useState('')
  const queryClient = useQueryClient()

  const filters: CustomerFilters = {
    search: search || undefined,
    status: status || undefined,
    page,
    limit,
  }

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['customers', filters],
    queryFn: () => customersApi.getAll(filters).then((res) => res.data as PaginatedResponse<Customer>),
  })

  const customers = response?.data || []
  const totalPages = response?.totalPages || 1
  const total = response?.total || 0

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => customersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      setShowModal(false)
      resetForm()
    },
    onError: (error: any) => {
      console.error('Error creating customer:', error)
      alert('Fehler beim Speichern: ' + (error.response?.data?.message || error.message))
    },
  })

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'Deutschland',
      website: '',
      industry: '',
      status: 'active',
      tags: [],
    })
    setTagInput('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) })
  }

  if (isLoading) {
    return <div className="text-center py-10">Laden...</div>
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        Fehler beim Laden: {(error as Error).message}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Kunden</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Neuer Kunde
        </button>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Neuer Kunde</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Firmenname *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Inaktiv</option>
                    <option value="prospect">Prospect</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Branche</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">PLZ</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stadt</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Land</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Tag hinzufügen..."
                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Hinzufügen
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-indigo-600 hover:text-indigo-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              {createMutation.isError && (
                <div className="text-red-600 text-sm">
                  Fehler: {createMutation.error?.response?.data?.message || createMutation.error?.message || 'Unbekannter Fehler'}
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || !formData.name.trim()}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Speichern...' : 'Speichern'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Kunden suchen..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="block w-full sm:w-48 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Customer List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {customers.length === 0 ? (
            <li className="px-4 py-8 text-center text-gray-500">
              Keine Kunden gefunden
            </li>
          ) : (
            customers.map((customer) => (
              <li key={customer.id}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900 truncate"
                      >
                        {customer.name}
                      </Link>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        customer.status === 'active' ? 'bg-green-100 text-green-800' :
                        customer.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {customer.status === 'active' ? 'Aktiv' :
                         customer.status === 'inactive' ? 'Inaktiv' : 'Prospect'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {customer.city} {customer.postalCode}
                    </p>
                    
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {customer.contacts?.length || 0} Kontakte
                      </span>
                      {customer.tags && customer.tags.length > 0 && (
                        <div className="flex gap-1">
                          {customer.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link
                      to={`/customers/${customer.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Kunde wirklich löschen?')) {
                          deleteMutation.mutate(customer.id)
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Zeige {customers.length} von {total} Kunden
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-700">
              Seite {page} von {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
