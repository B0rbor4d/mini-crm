import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { useToast } from '../components/ui/use-toast';
import {
  User,
  Mail,
  Lock,
  Sun,
  Moon,
  Save,
  TestTube,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { usersApi, emailsApi } from '../api';

export function Settings() {
  const { user, refreshUser } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { toast } = useToast();

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // IMAP state
  const [imapConfig, setImapConfig] = useState({
    host: '',
    port: '993',
    tls: true,
    user: '',
    password: '',
  });
  const [isTestingImap, setIsTestingImap] = useState(false);
  const [imapTestResult, setImapTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSavingImap, setIsSavingImap] = useState(false);

  useEffect(() => {
    emailsApi.getImapConfig().then((res) => {
      setImapConfig({
        host: res.data.host || '',
        port: res.data.port?.toString() || '993',
        tls: res.data.tls !== false,
        user: res.data.user || '',
        password: '',
      });
    });
  }, []);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdatingProfile(true);
    try {
      await usersApi.update(user.id, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
      });
      await refreshUser();
      toast({
        title: 'Profil aktualisiert',
        description: 'Ihre Profildaten wurden erfolgreich gespeichert.',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Profil konnte nicht aktualisiert werden.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Fehler',
        description: 'Die Passwörter stimmen nicht überein.',
        variant: 'destructive',
      });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'Fehler',
        description: 'Das Passwort muss mindestens 6 Zeichen lang sein.',
        variant: 'destructive',
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      if (!user) return;
      await usersApi.updatePassword(user.id, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({
        title: 'Passwort geändert',
        description: 'Ihr Passwort wurde erfolgreich aktualisiert.',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Passwort konnte nicht geändert werden.',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTestImap = async () => {
    setIsTestingImap(true);
    setImapTestResult(null);
    try {
      const response = await emailsApi.testConnection();
      setImapTestResult(response.data);
      toast({
        title: response.data.success ? 'Verbindung erfolgreich' : 'Verbindung fehlgeschlagen',
        description: response.data.message,
        variant: response.data.success ? 'default' : 'destructive',
      });
    } catch (error) {
      setImapTestResult({ success: false, message: 'Test fehlgeschlagen' });
      toast({
        title: 'Fehler',
        description: 'Verbindungstest konnte nicht durchgeführt werden.',
        variant: 'destructive',
      });
    } finally {
      setIsTestingImap(false);
    }
  };

  const handleSaveImap = async () => {
    setIsSavingImap(true);
    try {
      await emailsApi.updateImapConfig({
        host: imapConfig.host,
        port: parseInt(imapConfig.port, 10),
        tls: imapConfig.tls,
        user: imapConfig.user,
        password: imapConfig.password,
      });
      toast({
        title: 'IMAP-Konfiguration gespeichert',
        description: 'Die Einstellungen wurden auf dem Server gespeichert.',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'IMAP-Konfiguration konnte nicht gespeichert werden.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingImap(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-forest-900 dark:text-forest-100">Einstellungen</h1>
        <p className="text-forest-500 dark:text-forest-400">Verwalten Sie Ihr Profil, Passwort und IMAP-Einstellungen</p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Erscheinungsbild
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dunkler Modus</Label>
              <p className="text-sm text-forest-500">Aktivieren Sie den dunklen Modus für eine angenehmere Nutzung bei wenig Licht</p>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Vorname</Label>
              <Input
                id="firstName"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                placeholder="Vorname"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nachname</Label>
              <Input
                id="lastName"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                placeholder="Nachname"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              disabled
              className="bg-forest-50 dark:bg-forest-900"
            />
            <p className="text-xs text-forest-500">Die E-Mail-Adresse kann nicht geändert werden.</p>
          </div>
          <Button
            onClick={handleUpdateProfile}
            disabled={isUpdatingProfile}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isUpdatingProfile ? 'Speichern...' : 'Profil speichern'}
          </Button>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Passwort ändern
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Neues Passwort</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="Neues Passwort"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="Passwort wiederholen"
            />
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Lock className="h-4 w-4" />
            {isChangingPassword ? 'Wird geändert...' : 'Passwort ändern'}
          </Button>
        </CardContent>
      </Card>

      {/* IMAP Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            IMAP-Konfiguration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="text-sm text-green-800 dark:text-green-200">
                <p className="font-medium">Sicher gespeichert</p>
                <p>Die IMAP-Anmeldedaten werden verschlüsselt in der Datenbank gespeichert und sind auch nach einem Neustart verfügbar.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imapHost">IMAP-Server</Label>
              <Input
                id="imapHost"
                value={imapConfig.host}
                onChange={(e) => setImapConfig({ ...imapConfig, host: e.target.value })}
                placeholder="z.B. imap.gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imapPort">Port</Label>
              <Input
                id="imapPort"
                type="number"
                value={imapConfig.port}
                onChange={(e) => setImapConfig({ ...imapConfig, port: e.target.value })}
                placeholder="993"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="imapTls"
              checked={imapConfig.tls}
              onCheckedChange={(checked) => setImapConfig({ ...imapConfig, tls: checked })}
            />
            <Label htmlFor="imapTls">TLS/SSL-Verschlüsselung verwenden</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imapUser">Benutzername</Label>
            <Input
              id="imapUser"
              value={imapConfig.user}
              onChange={(e) => setImapConfig({ ...imapConfig, user: e.target.value })}
              placeholder="E-Mail-Adresse"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imapPassword">Passwort</Label>
            <Input
              id="imapPassword"
              type="password"
              value={imapConfig.password}
              onChange={(e) => setImapConfig({ ...imapConfig, password: e.target.value })}
              placeholder="IMAP-Passwort"
            />
          </div>

          {imapTestResult && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              imapTestResult.success
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}>
              {imapTestResult.success ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="text-sm">{imapTestResult.message}</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleTestImap}
              disabled={isTestingImap}
              variant="outline"
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              {isTestingImap ? 'Teste...' : 'Verbindung testen'}
            </Button>
            <Button
              onClick={handleSaveImap}
              disabled={isSavingImap}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSavingImap ? 'Speichern...' : 'Speichern'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
