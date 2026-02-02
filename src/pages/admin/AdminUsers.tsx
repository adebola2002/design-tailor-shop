import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { api } from '@/services/api';
import { Users, UserCheck, UserX } from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const { isUnlocked } = useAdminSession();

  // Mock admin token for unlocked sessions
  const mockToken = 'admin-token-mock';

  useEffect(() => {
    if (isUnlocked) {
      loadUsers();
    } else {
      setError('Admin session not unlocked. Please unlock first.');
      setIsLoading(false);
    }
  }, [isUnlocked]);

  async function loadUsers() {
    try {
      setError(null);
      console.log('Loading users, admin unlocked:', isUnlocked);

      if (!isUnlocked) {
        setError('Admin session not unlocked. Please unlock first.');
        setIsLoading(false);
        return;
      }

      const data = await api.getUsers(mockToken);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Error loading users:', message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'customer':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/5">
        <CardContent className="py-6">
          <h3 className="font-semibold text-destructive mb-2">Error Loading Users</h3>
          <p className="text-sm text-destructive/80 mb-4">{error}</p>
          <Button onClick={loadUsers} variant="outline" size="sm">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Users</h1>
          <p className="text-muted-foreground">Manage user accounts</p>
        </div>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No users found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">
                          {user.first_name && user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : user.email}
                        </h3>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{user.email}</p>
                        <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user.role === 'admin' ? (
                      <UserX className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
