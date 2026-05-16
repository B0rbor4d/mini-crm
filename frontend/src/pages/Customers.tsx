import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '../api';
import { Search, Plus, Trash2, Edit } from 'lucide-react';

export const Customers = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['customers', page, search],
    queryFn: () => customersApi.getAll({ page, limit: 10, search: search || undefined }),
  });

  const createMutation = useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: customersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      companyName: formData.get('companyName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      industry: formData.get('industry') as string,
    };

    if (editingCustomer) {
      // TODO: Implement update
    } else {
      createMutation.mutate(data);
    }
  };

  const inputCls = 'mt-1 block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kunden</h1>
        <button
          onClick={() => { setEditingCustomer(null); setShowForm(true); }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Neuer Kunde
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Kunden suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {showForm && (
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow mb-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">{editingCustomer ? 'Kunde bearbeiten' : 'Neuer Kunde'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground">Firmenname *</label>
                <input name="companyName" required defaultValue={editingCustomer?.companyName} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">E-Mail</label>
                <input name="email" type="email" defaultValue={editingCustomer?.email} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Telefon</label>
                <input name="phone" defaultValue={editingCustomer?.phone} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Branche</label>
                <input name="industry" defaultValue={editingCustomer?.industry} className={inputCls} />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createMutation.isPending ? 'Wird gespeichert...' : 'Speichern'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Firmenname</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">E-Mail</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Telefon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Branche</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">Wird geladen...</td>
              </tr>
            ) : data?.data.data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">Keine Kunden gefunden</td>
              </tr>
            ) : (
              data?.data.data.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">{customer.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{customer.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{customer.industry}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => { setEditingCustomer(customer); setShowForm(true); }}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(customer.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.data.total > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Seite {page} von {Math.ceil(data.data.total / 10)}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-border rounded text-foreground hover:bg-muted disabled:opacity-50"
            >
              Zurück
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * 10 >= data.data.total}
              className="px-3 py-1 border border-border rounded text-foreground hover:bg-muted disabled:opacity-50"
            >
              Weiter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
