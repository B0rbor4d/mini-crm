import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../api';
import { Upload, Trash2, Download, Archive, X, Check, Loader2 } from 'lucide-react';

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export const Documents = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentsApi.getAll(),
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ files }: { files: File[] }) => {
      const initialProgress = files.map(file => ({
        fileName: file.name,
        progress: 0,
        status: 'uploading' as const,
      }));
      setUploadProgress(initialProgress);

      try {
        const result = await documentsApi.uploadMultiple(files, undefined, undefined, (progress) => {
          setUploadProgress(prev =>
            prev.map(p =>
              files.some(f => f.name === p.fileName)
                ? { ...p, progress }
                : p
            )
          );
        });

        setUploadProgress(prev => prev.map(p => ({ ...p, progress: 100, status: 'completed' as const })));
        setTimeout(() => setUploadProgress([]), 3000);
        return result;
      } catch (error) {
        setUploadProgress(prev => prev.map(p => ({ ...p, status: 'error' as const })));
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: documentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setSelectedDocs(new Set());
    },
  });

  const zipDownloadMutation = useMutation({
    mutationFn: async () => {
      const response = await documentsApi.downloadZip(Array.from(selectedDocs));
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'documents.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) uploadMutation.mutate({ files });
  }, [uploadMutation]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) uploadMutation.mutate({ files });
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedDocs(newSelected);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getFileIcon = (mimeType?: string) => {
    if (mimeType?.startsWith('image/')) return '🖼️';
    if (mimeType?.includes('pdf')) return '📄';
    if (mimeType?.includes('word') || mimeType?.includes('document')) return '📝';
    if (mimeType?.includes('excel') || mimeType?.includes('sheet')) return '📊';
    return '📎';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dokumente</h1>
        <div className="flex space-x-3">
          {selectedDocs.size > 0 && (
            <>
              <button
                onClick={() => zipDownloadMutation.mutate()}
                disabled={zipDownloadMutation.isPending}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Archive className="w-4 h-4 mr-2" />
                {zipDownloadMutation.isPending ? 'Wird erstellt...' : `ZIP (${selectedDocs.size})`}
              </button>
              <button
                onClick={() => setSelectedDocs(new Set())}
                className="flex items-center px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted"
              >
                <X className="w-4 h-4 mr-2" />
                Auswahl aufheben
              </button>
            </>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploadMutation.isPending ? 'Wird hochgeladen...' : 'Hochladen'}
          </button>
        </div>
        <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="hidden" />
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-border hover:border-muted-foreground'
        }`}
      >
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">
          {isDragging ? 'Dateien hier ablegen...' : 'Dateien hierher ziehen oder klicken zum Auswählen'}
        </p>
        <p className="text-sm text-muted-foreground mt-1">Max. 50MB pro Datei, bis zu 10 Dateien</p>
      </div>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="bg-card border border-border rounded-lg shadow p-4 mb-6">
          <h3 className="font-semibold mb-3 text-foreground">Upload-Fortschritt</h3>
          <div className="space-y-2">
            {uploadProgress.map((item) => (
              <div key={item.fileName} className="flex items-center">
                <span className="text-sm w-48 truncate text-foreground">{item.fileName}</span>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        item.status === 'completed' ? 'bg-green-500' : item.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm w-16 text-right text-muted-foreground">
                  {item.status === 'completed' ? (
                    <Check className="w-4 h-4 text-green-500 inline" />
                  ) : item.status === 'error' ? (
                    <X className="w-4 h-4 text-red-500 inline" />
                  ) : (
                    `${item.progress}%`
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) setSelectedDocs(new Set(data?.data.data.map(d => d.id)));
                    else setSelectedDocs(new Set());
                  }}
                  checked={(data?.data.data.length || 0) > 0 && selectedDocs.size === (data?.data.data.length || 0)}
                  className="rounded border-input"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Datei</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Typ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Größe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Hochgeladen</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </td>
              </tr>
            ) : data?.data.data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">Keine Dokumente vorhanden</td>
              </tr>
            ) : (
              data?.data.data.map((doc) => (
                <tr
                  key={doc.id}
                  className={selectedDocs.has(doc.id) ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-muted/50'}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedDocs.has(doc.id)}
                      onChange={() => toggleSelection(doc.id)}
                      className="rounded border-input"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getFileIcon(doc.mimeType)}</span>
                      <div>
                        <span className="font-medium block text-foreground">{doc.originalName}</span>
                        {doc.version && doc.version > 1 && (
                          <span className="text-xs text-muted-foreground">Version {doc.version}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{doc.mimeType || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{formatFileSize(doc.sizeBytes)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {new Date(doc.createdAt).toLocaleDateString('de-DE')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <a
                      href={`/api/documents/${doc.id}/download`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3 inline-block"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => deleteMutation.mutate(doc.id)}
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
    </div>
  );
};
