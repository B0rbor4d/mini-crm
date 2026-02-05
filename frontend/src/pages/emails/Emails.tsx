import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emailsApi } from '../../services/api';
import { Mail, MailOpen, Link2 } from 'lucide-react';
import { useState } from 'react';

interface EmailsProps {
  projectId?: string;
}

export default function Emails({ projectId }: EmailsProps) {
  const queryClient = useQueryClient();
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  const { data: emails, isLoading } = useQuery({
    queryKey: ['emails', projectId],
    queryFn: () => emailsApi.getAll({ projectId }).then((res) => res.data),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => emailsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });

  if (isLoading) {
    return <div className="text-center py-10">Laden...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">E-Mails</h2>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {emails?.length === 0 ? (
              <li className="px-4 py-8 text-center text-gray-500">
                Keine E-Mails vorhanden
              </li>
            ) : (
              emails?.map((email: any) => (
                <li
                  key={email.id}
                  onClick={() => {
                    setSelectedEmail(email);
                    if (!email.isRead) {
                      markAsReadMutation.mutate(email.id);
                    }
                  }}
                  className={`px-4 py-4 cursor-pointer hover:bg-gray-50 ${
                    selectedEmail?.id === email.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {email.isRead ? (
                        <MailOpen className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Mail className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          email.isRead ? 'text-gray-600' : 'text-gray-900'
                        }`}
                      >
                        {email.subject}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{email.fromName}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(email.sentAt).toLocaleString('de-DE')}
                      </p>
                      {email.project && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-2">
                          <Link2 className="w-3 h-3 mr-1" />
                          {email.project.name}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div>
        {selectedEmail ? (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{selectedEmail.subject}</h3>
            
            <div className="mb-4 text-sm text-gray-600">
              <p><strong>Von:</strong> {selectedEmail.fromName} &lt;{selectedEmail.fromAddress}&gt;</p>
              <p><strong>Datum:</strong> {new Date(selectedEmail.sentAt).toLocaleString('de-DE')}</p>
            </div>

            <div className="prose max-w-none border-t pt-4">
              <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
            Wählen Sie eine E-Mail aus, um den Inhalt anzuzeigen
          </div>
        )}
      </div>
    </div>
  );
}
