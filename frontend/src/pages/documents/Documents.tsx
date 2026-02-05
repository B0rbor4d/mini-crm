import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../../services/api';
import { Upload, File, Download, Trash2 } from 'lucide-react';

interface DocumentsProps {
  projectId?: string;
}

export default function Documents({ projectId }: DocumentsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents', projectId],
    queryFn: () => documentsApi.getAll(projectId).then((res) => res.data),
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, data }: { file: File; data: any }) =>
      documentsApi.upload(file, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setIsUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      uploadMutation.mutate({
        file,
        data: { projectId },
      });
    }
  };

  const handleDownload = async (id: string, filename: string) => {
    const response = await documentsApi.download(id);
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="text-center py-10">Laden...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Dokumente</h2>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Hochladen...' : 'Dokument hochladen'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {documents?.length === 0 ? (
            <li className="px-4 py-8 text-center text-gray-500">
              Keine Dokumente vorhanden
            </li>
          ) : (
            documents?.map((doc: any) => (
              <li key={doc.id}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                  <div className="flex items-center flex-1 min-w-0">
                    <File className="w-8 h-8 text-gray-400 mr-3" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {doc.originalName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {doc.sizeFormatted} • {new Date(doc.createdAt).toLocaleDateString('de-DE')}
                      </p>
                      {doc.project && (
                        <p className="text-sm text-gray-500">
                          Projekt: {doc.project.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleDownload(doc.id, doc.originalName)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(doc.id)}
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
    </div>
  );
}
