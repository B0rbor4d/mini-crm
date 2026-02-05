import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../../services/api';
import { Plus, CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface TasksProps {
  projectId?: string;
}

export default function Tasks({ projectId }: TasksProps) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium' });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => tasksApi.getAll(projectId).then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => tasksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowForm(false);
      setNewTask({ title: '', priority: 'medium' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tasksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'todo':
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'low':
      default:
        return <AlertCircle className="w-4 h-4 text-green-500" />;
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Laden...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Aufgaben</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Neue Aufgabe
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <input
            type="text"
            placeholder="Aufgabentitel"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="block w-full mb-3 px-3 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            className="block w-full mb-3 px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="low">Niedrig</option>
            <option value="medium">Mittel</option>
            <option value="high">Hoch</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={() => createMutation.mutate({ ...newTask, projectId })}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Speichern
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tasks?.length === 0 ? (
            <li className="px-4 py-8 text-center text-gray-500">
              Keine Aufgaben vorhanden
            </li>
          ) : (
            tasks?.map((task: any) => (
              <li key={task.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <button
                      onClick={() =>
                        updateMutation.mutate({
                          id: task.id,
                          data: { status: task.status === 'done' ? 'todo' : 'done' },
                        })
                      }
                      className="mr-3"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.project && (
                        <p className="text-sm text-gray-500">{task.project.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getPriorityIcon(task.priority)}
                    <button
                      onClick={() => deleteMutation.mutate(task.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      ×
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
