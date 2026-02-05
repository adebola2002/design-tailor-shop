 import { useState } from 'react';
 import { useAdminSession } from '@/contexts/AdminSessionContext';
 import { useToast } from '@/hooks/use-toast';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Eye, EyeOff, Save, Key, Lock, LogOut } from 'lucide-react';
 import { useNavigate } from 'react-router-dom';
 
 export default function AdminSettings() {
   const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [showCurrent, setShowCurrent] = useState(false);
   const [showNew, setShowNew] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
 
   const { verifyPassword, updatePassword, lock } = useAdminSession();
   const { toast } = useToast();
   const navigate = useNavigate();
 
   const handlePasswordChange = async (e: React.FormEvent) => {
     e.preventDefault();
 
     if (!currentPassword || !newPassword || !confirmPassword) {
       toast({ title: 'Missing fields', description: 'Please fill all password fields.', variant: 'destructive' });
       return;
     }
 
     if (!verifyPassword(currentPassword)) {
       toast({ title: 'Invalid', description: 'Current password is incorrect.', variant: 'destructive' });
       return;
     }
 
     if (newPassword !== confirmPassword) {
       toast({ title: 'Mismatch', description: 'New passwords do not match.', variant: 'destructive' });
       return;
     }
 
     if (newPassword.length < 6) {
       toast({ title: 'Too short', description: 'Password must be at least 6 characters.', variant: 'destructive' });
       return;
     }
 
     setIsSaving(true);
     try {
       updatePassword(newPassword);
       toast({ title: 'Password Updated', description: 'Your admin password has been changed.' });
       setCurrentPassword('');
       setNewPassword('');
       setConfirmPassword('');
     } finally {
       setIsSaving(false);
     }
   };
 
   const handleLockAdmin = () => {
     lock();
     navigate('/admin/unlock');
   };
 
   return (
     <div className="space-y-6">
       <div>
         <h1 className="text-3xl font-display font-bold">Settings</h1>
         <p className="text-muted-foreground">Manage admin panel settings</p>
       </div>
 
       <div className="grid gap-6 max-w-xl">
         {/* Change Password */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Key className="h-5 w-5" />
               Change Admin Password
             </CardTitle>
             <CardDescription>
               Update the local admin password used to unlock the panel
             </CardDescription>
           </CardHeader>
           <CardContent>
             <form onSubmit={handlePasswordChange} className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="current">Current Password</Label>
                 <div className="relative">
                   <Input
                     id="current"
                     type={showCurrent ? 'text' : 'password'}
                     value={currentPassword}
                     onChange={(e) => setCurrentPassword(e.target.value)}
                     placeholder="••••••••"
                     className="pr-10"
                   />
                   <button
                     type="button"
                     onClick={() => setShowCurrent(!showCurrent)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                   >
                     {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                   </button>
                 </div>
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="new">New Password</Label>
                 <div className="relative">
                   <Input
                     id="new"
                     type={showNew ? 'text' : 'password'}
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     placeholder="••••••••"
                     className="pr-10"
                   />
                   <button
                     type="button"
                     onClick={() => setShowNew(!showNew)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                   >
                     {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                   </button>
                 </div>
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="confirm">Confirm New Password</Label>
                 <Input
                   id="confirm"
                   type="password"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   placeholder="••••••••"
                 />
               </div>
 
               <Button type="submit" disabled={isSaving} className="gap-2">
                 <Save className="h-4 w-4" />
                 {isSaving ? 'Saving...' : 'Update Password'}
               </Button>
             </form>
           </CardContent>
         </Card>
 
         {/* Lock Admin */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Lock className="h-5 w-5" />
               Session Security
             </CardTitle>
             <CardDescription>
               Lock the admin panel to require password again
             </CardDescription>
           </CardHeader>
           <CardContent>
             <Button variant="destructive" onClick={handleLockAdmin} className="gap-2">
               <LogOut className="h-4 w-4" />
               Lock Admin Panel
             </Button>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 }