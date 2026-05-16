import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emailsApi, customersApi } from '../api';
import { Mail, RefreshCw, MailWarning, Link, Trash2, Search, Inbox } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import type { Email } from '../types';

export function Emails() {
  const [search, setSearch] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();

  const { data: emailsData, isLoading } = useQuery({
    queryKey: ['emails', search],
    queryFn: () => emailsApi.getAll({ search, limit: 50 }),
  });

  const { data: stats } = useQuery({
    queryKey: ['emails-stats'],
    queryFn: () => emailsApi.getStats(),
  });

  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customersApi.getAll(),
  });

  const syncMutation = useMutation({
    mutationFn: () => emailsApi.sync(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['emails-stats'] });
      setIsSyncing(false);
    },
    onError: () => {
      setIsSyncing(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Email> }) =>
      emailsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['emails-stats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => emailsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['emails-stats'] });
      setSelectedEmail(null);
    },
  });

  const handleSync = () => {
    setIsSyncing(true);
    syncMutation.mutate();
  };

  const handleMarkAsRead = (email: Email) => {
    updateMutation.mutate({ id: email.id, data: { isRead: true } });
  };

  const handleAssignCustomer = (emailId: string, customerId: string) => {
    updateMutation.mutate({ id: emailId, data: { customerId } });
  };

  const handleDelete = (id: string) => {
    if (confirm('E-Mail wirklich löschen?')) {
      deleteMutation.mutate(id);
    }
  };

  const emails = emailsData?.data?.data || [];
  const customers = customersData?.data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest-900 dark:text-forest-100">E-Mails</h1>
          <p className="text-forest-500 dark:text-forest-400">IMAP-Postfach verwalten und zuordnen</p>
        </div>
        <Button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Synchronisiere...' : 'Synchronisieren'}
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-forest-500 dark:text-forest-400">Gesamt</p>
                  <p className="text-2xl font-bold text-forest-900 dark:text-forest-100">{stats.data.total}</p>
                </div>
                <Inbox className="h-8 w-8 text-forest-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-forest-500 dark:text-forest-400">Ungelesen</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.data.unread}</p>
                </div>
                <MailWarning className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-forest-500 dark:text-forest-400">Synchronisiert</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.data.synced}</p>
                </div>
                <RefreshCw className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-forest-500 dark:text-forest-400">Nicht zugeordnet</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.data.unassigned}</p>
                </div>
                <Link className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-400" />
        <input
          type="text"
          placeholder="E-Mails durchsuchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-forest-200 dark:border-forest-700 rounded-lg bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100 focus:ring-2 focus:ring-forest-500 focus:border-transparent"
        />
      </div>

      {/* Email List */}
      <div className="space-y-2">
        {isLoading ? (
          <p className="text-forest-500">Lade E-Mails...</p>
        ) : emails.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="h-12 w-12 mx-auto text-forest-300 mb-4" />
              <p className="text-forest-500 dark:text-forest-400">Keine E-Mails vorhanden</p>
              <p className="text-sm text-forest-400 mt-1">Klicken Sie auf "Synchronisieren", um E-Mails aus dem IMAP-Postfach zu laden.</p>
            </CardContent>
          </Card>
        ) : (
          emails.map((email) => (
            <Card
              key={email.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedEmail?.id === email.id ? 'ring-2 ring-forest-500' : ''
              } ${!email.isRead ? 'bg-forest-50 dark:bg-forest-900/50' : ''}`}
              onClick={() => {
                setSelectedEmail(email);
                if (!email.isRead) handleMarkAsRead(email);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!email.isRead && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                      <h3 className={`font-medium truncate ${
                        !email.isRead ? 'text-forest-900 dark:text-forest-100' : 'text-forest-600 dark:text-forest-400'
                      }`}>
                        {email.subject || '(Kein Betreff)'}
                      </h3>
                    </div>
                    <p className="text-sm text-forest-500 dark:text-forest-400 truncate mt-1">
                      Von: {email.fromName || email.fromAddress}
                    </p>
                    <p className="text-sm text-forest-400 dark:text-forest-500 truncate mt-0.5">
                      {email.bodyText?.substring(0, 120).replace(/\n/g, ' ')}...
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    {email.customer && (
                      <Badge variant="secondary">{email.customer.companyName}</Badge>
                    )}
                    {email.attachments && email.attachments.length > 0 && (
                      <Badge variant="default">{email.attachments.length} Anhänge</Badge>
                    )}
                    <span className="text-xs text-forest-400">
                      {email.receivedAt && new Date(email.receivedAt).toLocaleDateString('de-DE')}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleDelete(email.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-forest-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-forest-200 dark:border-forest-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-forest-900 dark:text-forest-100">
                  {selectedEmail.subject || '(Kein Betreff)'}
                </h2>
                <Button variant="ghost" onClick={() => setSelectedEmail(null)}>✕</Button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-forest-500 w-16">Von:</span>
                  <span className="text-forest-900 dark:text-forest-100">
                    {selectedEmail.fromName} &lt;{selectedEmail.fromAddress}&gt;
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-forest-500 w-16">An:</span>
                  <span className="text-forest-900 dark:text-forest-100">
                    {selectedEmail.toAddresses?.join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-forest-500 w-16">Datum:</span>
                  <span className="text-forest-900 dark:text-forest-100">
                    {selectedEmail.receivedAt && new Date(selectedEmail.receivedAt).toLocaleString('de-DE')}
                  </span>
                </div>
              </div>

              {/* Assignment */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-forest-500">Kunde zuordnen:</span>
                <select
                  className="border border-forest-200 dark:border-forest-700 rounded px-2 py-1 text-sm bg-white dark:bg-forest-900 text-forest-900 dark:text-forest-100"
                  value={selectedEmail.customerId || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAssignCustomer(selectedEmail.id, e.target.value);
                      setSelectedEmail({ ...selectedEmail, customerId: e.target.value });
                    }
                  }}
                >
                  <option value="">-- Nicht zugeordnet --</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>{customer.companyName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-forest-900 dark:text-forest-100">
                  {selectedEmail.bodyText || selectedEmail.bodyHtml?.replace(/<[^>]*>/g, '') || '(Kein Inhalt)'}
                </pre>
              </div>

              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div className="mt-6 pt-4 border-t border-forest-200 dark:border-forest-700">
                  <h4 className="text-sm font-medium text-forest-700 dark:text-forest-300 mb-2">Anhänge</h4>
                  <div className="space-y-1">
                    {selectedEmail.attachments.map((att) => (
                      <div key={att.id} className="flex items-center gap-2 text-sm text-forest-600">
                        <span>{att.filename}</span>
                        <span className="text-forest-400">({((att.sizeBytes || 0) / 1024).toFixed(1)} KB)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
