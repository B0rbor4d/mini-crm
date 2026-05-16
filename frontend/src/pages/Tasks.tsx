import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api';
import { Plus, Calendar, User, Trash2, Edit, GripVertical } from 'lucide-react';

interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  color: string;
}

const columns: KanbanColumn[] = [
  { id: 'open', title: 'Offen', status: 'open', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'in_progress', title: 'In Arbeit', status: 'in_progress', color: 'bg-blue-50 dark:bg-blue-950' },
  { id: 'review', title: 'Review', status: 'review', color: 'bg-yellow-50 dark:bg-yellow-950' },
  { id: 'done', title: 'Erledigt', status: 'done', color: 'bg-green-50 dark:bg-green-950' },
];

export const Tasks = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: kanbanData, isLoading } = useQuery({
    queryKey: ['tasks', 'kanban'],
    queryFn: () => tasksApi.getKanban(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tasksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tasksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleDragStart = (task: any) => setDraggedTask(task);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      updateMutation.mutate({ id: draggedTask.id, data: { status } });
    }
    setDraggedTask(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Partial<import('../types').Task> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      priority: formData.get('priority') as any,
      status: formData.get('status') as any,
      dueDate: formData.get('dueDate') as string,
    };
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data });
      setEditingTask(null);
    } else {
      createMutation.mutate(data);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const inputCls = 'mt-1 block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Aufgaben</h1>
        <button
          onClick={() => { setEditingTask(null); setShowForm(true); }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Neue Aufgabe
        </button>
      </div>

      {showForm && (
        <div className="bg-card text-card-foreground border border-border p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">{editingTask ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground">Titel *</label>
                <input name="title" required defaultValue={editingTask?.title} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground">Beschreibung</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingTask?.description}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Priorität</label>
                <select name="priority" defaultValue={editingTask?.priority || 'medium'} className={inputCls}>
                  <option value="low">Niedrig</option>
                  <option value="medium">Mittel</option>
                  <option value="high">Hoch</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Status</label>
                <select name="status" defaultValue={editingTask?.status || 'open'} className={inputCls}>
                  <option value="open">Offen</option>
                  <option value="in_progress">In Arbeit</option>
                  <option value="review">Review</option>
                  <option value="done">Erledigt</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Fälligkeitsdatum</label>
                <input name="dueDate" type="date" defaultValue={editingTask?.dueDate} className={inputCls} />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Speichern
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Wird geladen...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`${column.color} rounded-lg p-4 min-h-[500px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">{column.title}</h3>
                <span className="bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-sm">
                  {(kanbanData?.data[column.status] || []).length}
                </span>
              </div>

              <div className="space-y-3">
                {(kanbanData?.data[column.status] || []).map((task: any) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className="bg-card text-card-foreground p-4 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <GripVertical className="w-4 h-4 text-muted-foreground mr-2" />
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' ? 'Hoch' : task.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => { setEditingTask(task); setShowForm(true); }}
                          className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(task.id)}
                          className="text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-medium text-foreground mb-2">{task.title}</h4>

                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-3">
                        {task.dueDate && (
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString('de-DE')}
                          </span>
                        )}
                        {task.assignedTo && (
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {task.assignedTo.firstName || task.assignedTo.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
