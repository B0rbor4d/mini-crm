import { useQuery } from '@tanstack/react-query';
import { customersApi, documentsApi, tasksApi } from '../api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, FileText, ClipboardList, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

export const Dashboard = () => {
  const { data: customers } = useQuery({
    queryKey: ['customers', 'dashboard'],
    queryFn: () => customersApi.getAll({ limit: 5 }),
  });

  const { data: documents } = useQuery({
    queryKey: ['documents', 'dashboard'],
    queryFn: () => documentsApi.getAll({ limit: 5 }),
  });

  const { data: tasks } = useQuery({
    queryKey: ['tasks', 'dashboard'],
    queryFn: () => tasksApi.getAll({ limit: 5 }),
  });

  const stats = [
    {
      title: 'Kunden',
      value: customers?.data.total || 0,
      icon: Users,
      color: 'bg-forest-100 text-forest-700 dark:bg-forest-900 dark:text-forest-300',
      trend: '+12%',
    },
    {
      title: 'Dokumente',
      value: documents?.data.total || 0,
      icon: FileText,
      color: 'bg-earth-100 text-earth-700 dark:bg-earth-900/50 dark:text-earth-300',
      trend: '+5%',
    },
    {
      title: 'Aufgaben',
      value: tasks?.data.total || 0,
      icon: ClipboardList,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      trend: '+8%',
    },
    {
      title: 'Aktivität',
      value: '98%',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
      trend: '+3%',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-forest-900">Dashboard</h1>
        <p className="text-forest-500 mt-1">Willkommen zurück! Hier ist ein Überblick über dein CRM.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
                <div className="flex items-center text-green-600 text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Neueste Kunden</CardTitle>
            <CardDescription>Die zuletzt hinzugefügten Kunden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customers?.data.data.map((customer: any) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-forest-200 flex items-center justify-center">
                      <span className="text-forest-700 font-bold">{customer.companyName[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{customer.companyName}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{customer.industry || 'Allgemein'}</Badge>
                </div>
              )) || (
                <p className="text-forest-400 text-center py-4">Keine Kunden vorhanden</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Offene Aufgaben</CardTitle>
            <CardDescription>Deine aktuellen To-Dos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks?.data.data.filter((t: any) => t.status !== 'done').slice(0, 5).map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <div>
                      <p className="font-medium text-foreground">{task.title}</p>
                      {task.dueDate && (
                        <div className="flex items-center text-sm text-forest-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString('de-DE')}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant={
                    task.status === 'open' ? 'default' :
                    task.status === 'in_progress' ? 'secondary' :
                    'outline'
                  }>
                    {task.status === 'open' ? 'Offen' :
                     task.status === 'in_progress' ? 'In Arbeit' :
                     task.status === 'review' ? 'Review' : 'Erledigt'}
                  </Badge>
                </div>
              )) || (
                <p className="text-forest-400 text-center py-4">Keine offenen Aufgaben</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
