import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { supabase } from '@/integrations/supabase/client';
import { extractErrorMessage } from '@/lib/supabase-helpers';
import { Users, UserCheck, UserX } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  phone_number: string | null;
  delivery_address: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const { isUnlocked } = useAdminSession();

  const loadUsers = useCallback(async () => {
    try {
      setError(null);

      if (!isUnlocked) {
        setError('Admin session not unlocked. Please unlock first.');
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (error) {
      const message = extractErrorMessage(error);
      console.error('Error loading users:', message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isUnlocked]);

  useEffect(() => {
    if (isUnlocked) {
      loadUsers();
    } else {
      setError('Admin session not unlocked. Please unlock first.');
      setIsLoading(false);
    }
  }, [isUnlocked, loadUsers]);

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'customer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
                          {user.full_name || user.email || 'Unknown User'}
                        </h3>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{user.email}</p>
                        {user.phone_number && <p>Phone: {user.phone_number}</p>}
                        {user.delivery_address && <p>Address: {user.delivery_address}</p>}
                        <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user.role === 'admin' ? (
                      <UserCheck className="h-5 w-5 text-green-600" />
                    ) : (
                      <UserX className="h-5 w-5 text-muted-foreground" />
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
