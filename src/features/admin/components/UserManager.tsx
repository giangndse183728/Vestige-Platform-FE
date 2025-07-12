import { useState, useMemo } from 'react';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pencil, Trash2, BarChart3, Users, Search, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function UserManager() {
  const { usersQuery, updateUser, deleteUser, bulkUpdate, getUserStatistics, getUserActivitySummary } = useAdminUsers();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editData, setEditData] = useState<any | null>(null);
  const [bulkSelected, setBulkSelected] = useState<number[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [userStats, setUserStats] = useState<any | null>(null);
  const [activitySummary, setActivitySummary] = useState<any | null>(null);
  const [showActivity, setShowActivity] = useState(false);

  const users = usersQuery.data?.data || usersQuery.data || [];

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    return users.filter((u: any) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setEditData({ ...user });
  };

  const handleSave = async () => {
    if (!editData) return;
    try {
      await updateUser.mutateAsync({ userId: editData.userId, data: editData });
      toast.success('User updated!');
      setSelectedUser(null);
      setEditData(null);
    } catch (e: any) {
      toast.error(e?.message || 'Update failed');
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await deleteUser.mutateAsync(userId);
      toast.success('User deactivated!');
    } catch (e: any) {
      toast.error(e?.message || 'Delete failed');
    }
  };

  const handleBulkUpdate = async (status: string) => {
    try {
      await bulkUpdate.mutateAsync({ userIds: bulkSelected, status });
      toast.success('Bulk update successful!');
      setBulkSelected([]);
    } catch (e: any) {
      toast.error(e?.message || 'Bulk update failed');
    }
  };

  const handleShowStats = async (userId: number) => {
    setShowStats(true);
    setUserStats(null);
    try {
      const stats = await getUserStatistics(userId);
      setUserStats(stats);
    } catch (e) {
      setUserStats(null);
    }
  };

  const handleShowActivity = async () => {
    setShowActivity(true);
    setActivitySummary(null);
    try {
      const summary = await getUserActivitySummary();
      setActivitySummary(summary);
    } catch (e) {
      setActivitySummary(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-metal font-bold flex items-center gap-2">
          <Users className="w-6 h-6" /> User Management
        </h2>
        <div className="flex gap-2">
          <Button onClick={handleShowActivity} variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" /> Activity Summary
          </Button>
          <Input
            placeholder="Search user..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
        </div>
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4"><input type="checkbox" checked={bulkSelected.length === filteredUsers.length && filteredUsers.length > 0} onChange={e => setBulkSelected(e.target.checked ? filteredUsers.map((u: any) => u.userId) : [])} /></th>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Username</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user: any) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="py-2 px-4 text-center">
                  <input type="checkbox" checked={bulkSelected.includes(user.userId)} onChange={e => setBulkSelected(e.target.checked ? [...bulkSelected, user.userId] : bulkSelected.filter(id => id !== user.userId))} />
                </td>
                <td className="py-2 px-4">{user.userId}</td>
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.firstName} {user.lastName}</td>
                <td className="py-2 px-4">
                  <Badge variant={user.roleName === 'ADMIN' ? 'default' : 'secondary'}>{user.roleName}</Badge>
                </td>
                <td className="py-2 px-4">
                  {user.accountStatus === 'ACTIVE' ? (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                  )}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(user)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(user.userId)}><Trash2 className="w-4 h-4" /></Button>
                  <Button size="sm" variant="outline" onClick={() => handleShowStats(user.userId)}><BarChart3 className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {bulkSelected.length > 0 && (
        <div className="flex gap-2 items-center mt-2">
          <span className="font-gothic">Bulk actions for {bulkSelected.length} users:</span>
          <Button size="sm" onClick={() => handleBulkUpdate('ACTIVE')}><CheckCircle className="w-4 h-4 mr-1" /> Set Active</Button>
          <Button size="sm" variant="destructive" onClick={() => handleBulkUpdate('INACTIVE')}><XCircle className="w-4 h-4 mr-1" /> Set Inactive</Button>
        </div>
      )}
      {/* Edit Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={open => { if (!open) { setSelectedUser(null); setEditData(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editData && (
            <div className="space-y-4">
              <Input label="Username" value={editData.username} onChange={e => setEditData({ ...editData, username: e.target.value })} />
              <Input label="Email" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} />
              <Input label="First Name" value={editData.firstName} onChange={e => setEditData({ ...editData, firstName: e.target.value })} />
              <Input label="Last Name" value={editData.lastName} onChange={e => setEditData({ ...editData, lastName: e.target.value })} />
              <Input label="Role" value={editData.roleName} onChange={e => setEditData({ ...editData, roleName: e.target.value })} />
              <Input label="Status" value={editData.accountStatus} onChange={e => setEditData({ ...editData, accountStatus: e.target.value })} />
              <div className="flex gap-2 justify-end">
                <Button onClick={handleSave} size="sm">Save</Button>
                <Button onClick={() => { setSelectedUser(null); setEditData(null); }} size="sm" variant="outline">Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* User Statistics Dialog */}
      <Dialog open={showStats} onOpenChange={open => setShowStats(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Statistics</DialogTitle>
          </DialogHeader>
          {userStats ? (
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">{JSON.stringify(userStats, null, 2)}</pre>
          ) : (
            <div>Loading...</div>
          )}
        </DialogContent>
      </Dialog>
      {/* Activity Summary Dialog */}
      <Dialog open={showActivity} onOpenChange={open => setShowActivity(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Activity Summary</DialogTitle>
          </DialogHeader>
          {activitySummary ? (
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">{JSON.stringify(activitySummary, null, 2)}</pre>
          ) : (
            <div>Loading...</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 