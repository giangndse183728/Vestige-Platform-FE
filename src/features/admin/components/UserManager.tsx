import { useState, useMemo } from 'react';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2, BarChart3, Users, Search, CheckCircle, XCircle, Eye, Package, ShoppingCart, CreditCard, ShieldCheck, ShieldX } from 'lucide-react';
import { toast } from 'sonner';
import React from 'react'; // Added missing import for React

// Helper to format date string
function formatDateString(val: string) {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function UserManager() {
  const { 
    usersQuery, 
    updateUser, 
    deleteUser, 
    bulkUpdate, 
    getUserStatistics, 
    getUserActivitySummary,
    deactivateUser,
    getUserAdmin
  } = useAdminUsers();
  
  const [search, setSearch] = useState('');
  const [bulkSelected, setBulkSelected] = useState<number[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [userStats, setUserStats] = useState<any | null>(null);
  const [activitySummary, setActivitySummary] = useState<any | null>(null);
  const [showActivity, setShowActivity] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userDetails, setUserDetails] = useState<any | null>(null);

  // Đảm bảo users luôn là mảng
  const users = Array.isArray(usersQuery.data?.data?.content) ? usersQuery.data.data.content : [];

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    return users.filter((u: any) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const handleViewDetails = (user: any) => {
    setUserDetails(user);
    setShowUserDetails(true);
    setUserStats(null);
    // Fetch user statistics for the stats cards
    getUserStatistics(user.userId)
      .then(stats => setUserStats(stats))
      .catch(() => setUserStats(null));
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await deleteUser.mutateAsync(userId);
      toast.success('User deactivated successfully!');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to deactivate user');
    }
  };

  const handleBulkUpdate = async (status: string) => {
    try {
      await bulkUpdate.mutateAsync({ userIds: bulkSelected, status });
      toast.success('Bulk update completed successfully!');
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
      toast.error('Failed to load user statistics');
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
      toast.error('Failed to load activity summary');
    }
  };

  const handleBanUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to ban (deactivate) this user?')) return;
    try {
      await deactivateUser.mutateAsync(userId);
      toast.success('User has been banned (deactivated) successfully!');
      setShowUserDetails(false);
      usersQuery.refetch();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to ban user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          <p className="text-sm text-gray-500">Manage all users and their account status</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search by username, email, or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={handleShowActivity} variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" /> Activity Summary
          </Button>
        </div>
      </div>

      <Card className="overflow-x-auto">
        {usersQuery.isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : usersQuery.error ? (
          <div className="text-red-600 py-8 text-center">
            {usersQuery.error?.message || 'Failed to load users'}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input 
                    type="checkbox" 
                    checked={bulkSelected.length === filteredUsers.length && filteredUsers.length > 0} 
                    onChange={e => setBulkSelected(e.target.checked ? filteredUsers.map((u: any) => u.userId) : [])} 
                  />
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Flags</th>
                <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredUsers) && filteredUsers.map((user: any) => (
                <tr key={user.userId} className="hover:bg-gray-50 border-b">
                  <td className="py-3 px-6">
                    <input 
                      type="checkbox" 
                      checked={bulkSelected.includes(user.userId)} 
                      onChange={e => setBulkSelected(e.target.checked ? [...bulkSelected, user.userId] : bulkSelected.filter(id => id !== user.userId))} 
                    />
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-900">{user.userId}</td>
                  <td className="py-3 px-6 text-sm text-gray-900">{user.username}</td>
                  <td className="py-3 px-6 text-sm text-gray-900">{user.email}</td>
                  <td className="py-3 px-6 text-sm text-gray-900">{user.firstName} {user.lastName}</td>
                  <td className="py-3 px-6">
                    <Badge variant={user.roleName === 'ADMIN' ? 'default' : 'secondary'}>
                      {user.roleName}
                    </Badge>
                  </td>
                  <td className="py-3 px-6">
                    {user.accountStatus === 'ACTIVE' ? (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                    )}
                  </td>
                  <td className="py-3 px-6 flex gap-2 items-center">
                  {user.isLegitProfile ? (
                    <ShieldCheck className="w-5 h-5 text-green-500" aria-label="Legit profile" />
                  ) : (
                    <ShieldX className="w-5 h-5 text-gray-400" aria-label="Not legit profile" />
                  )}
                  {user.isVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-500" aria-label="Verified" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" aria-label="Not verified" />
                  )}
                </td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(user)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {bulkSelected.length > 0 && (
        <div className="flex gap-2 items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">Bulk actions for {bulkSelected.length} users:</span>
          <Button size="sm" onClick={() => handleBulkUpdate('ACTIVE')}>
            <CheckCircle className="w-4 h-4 mr-1" /> Set Active
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleBulkUpdate('INACTIVE')}>
            <XCircle className="w-4 h-4 mr-1" /> Set Inactive
          </Button>
        </div>
      )}

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={open => setShowUserDetails(open)}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {userDetails ? (
            <div className="space-y-6">
              {/* Profile Card Layout */}
              <div className="flex flex-col items-center gap-2 mb-4">
                {/* Avatar */}
                {userDetails.profilePictureUrl && typeof userDetails.profilePictureUrl === 'string' && userDetails.profilePictureUrl.startsWith('http') ? (
                  <img src={userDetails.profilePictureUrl} alt="avatar" className="w-24 h-24 rounded-full border object-cover shadow" />
                ) : (
                  <div className="w-24 h-24 rounded-full border bg-gray-200 flex items-center justify-center text-4xl text-gray-400">?
                  </div>
                )}
                {/* Name and Role */}
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-gray-900">{userDetails.username || userDetails.fullName || 'Unknown User'}</div>
                  {userDetails.roleName && (
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${userDetails.roleName === 'ADMIN' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}>{userDetails.roleName}</span>
                  )}
                </div>
                {/* Email */}
                {userDetails.email && (
                  <div className="text-base font-semibold text-blue-700 mt-1 break-all">{userDetails.email}</div>
                )}
              </div>
              {/* Info grid 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
                {Object.entries(userDetails).map(([key, value]) => {
                  if (key === 'userId' || key === 'username' || key === 'roleName' || key === 'profilePictureUrl' || key === 'email') return null;
                  if (typeof value === 'object' && value !== null) return null;
                  let displayValue = value;
                  if (key === 'accountStatus') {
                    displayValue = (
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${value === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase()}
                      </span>
                    );
                  } else if (/date|at/i.test(key) && typeof value === 'string') {
                    displayValue = formatDateString(value);
                  } else if (value === null || value === undefined || value === '') {
                    displayValue = <span className="text-gray-400">—</span>;
                  } else if (typeof value === 'boolean') {
                    displayValue = value ? 'Yes' : 'No';
                  } else if (typeof value !== 'string' && typeof value !== 'number' && !React.isValidElement(value)) {
                    displayValue = String(value);
                  }
                  return (
                    <div key={key} className="flex flex-col border bg-gray-50 px-4 py-3 min-h-[60px] justify-center rounded">
                      <div className="text-xs uppercase tracking-wide mb-1 text-gray-500">{key}</div>
                      <div className="text-base break-all text-gray-900 font-semibold">{displayValue as React.ReactNode}</div>
                    </div>
                  );
                })}
              </div>
              {/* User statistics cards */}
              {userStats && userStats.data && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold text-blue-900">{userStats.data.totalOrders ?? 0}</p>
                    <p className="text-sm text-blue-700">Total Orders</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 text-center">
                    <Package className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold text-green-900">{userStats.data.totalProductsListed ?? 0}</p>
                    <p className="text-sm text-green-700">Products Listed</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6 text-center">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold text-purple-900">{userStats.data.totalOrderValue ?? 0}</p>
                    <p className="text-sm text-purple-700">Total Order Value</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-6 text-center">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                    <p className="text-2xl font-bold text-yellow-900">{userStats.data.completedOrders ?? 0}</p>
                    <p className="text-sm text-yellow-700">Completed Orders</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-6 text-center">
                    <Package className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                    <p className="text-2xl font-bold text-pink-900">{userStats.data.activeProducts ?? 0}</p>
                    <p className="text-sm text-pink-700">Active Products</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <Package className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-2xl font-bold text-gray-900">{userStats.data.soldProducts ?? 0}</p>
                    <p className="text-sm text-gray-700">Sold Products</p>
                  </div>
                </div>
              )}
              {/* Ban button at the bottom */}
              <div className="flex justify-center mt-8">
                <Button
                  className="px-10 py-4 text-lg font-bold bg-red-600 hover:bg-red-700 text-white rounded shadow-lg"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to ban (deactivate) this user?')) {
                      handleBanUser(userDetails.userId);
                    }
                  }}
                  disabled={deactivateUser.isPending}
                >
                  {deactivateUser.isPending ? 'Banning...' : 'Ban User'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">No user details available</div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Statistics Dialog */}
      <Dialog open={showStats} onOpenChange={open => setShowStats(open)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Statistics</DialogTitle>
          </DialogHeader>
          {userStats ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{JSON.stringify(userStats, null, 2)}</pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Activity Summary Dialog */}
      <Dialog open={showActivity} onOpenChange={open => setShowActivity(open)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>User Activity Summary</DialogTitle>
          </DialogHeader>
          {activitySummary ? (
            (() => {
              const data = activitySummary.data || {};
              const statCards = [
                {
                  label: 'Active Users (30d)',
                  value: data.activeUsersLast30Days,
                  color: 'bg-blue-50 text-blue-900',
                  icon: <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />,
                },
                {
                  label: 'Total Users',
                  value: data.totalUsers,
                  color: 'bg-green-50 text-green-900',
                  icon: <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />,
                },
                {
                  label: 'Verified Users',
                  value: data.verifiedUsers,
                  color: 'bg-purple-50 text-purple-900',
                  icon: <CheckCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />,
                },
                {
                  label: 'New Users (30d)',
                  value: data.newUsersLast30Days,
                  color: 'bg-yellow-50 text-yellow-900',
                  icon: <Users className="w-8 h-8 mx-auto mb-2 text-yellow-600" />,
                },
                {
                  label: 'Legitimate Users',
                  value: data.legitimateUsers,
                  color: 'bg-pink-50 text-pink-900',
                  icon: <Badge className="w-8 h-8 mx-auto mb-2 text-pink-600" />,
                },
                {
                  label: 'Report Period',
                  value: data.reportPeriodDays ? `${data.reportPeriodDays} days` : '—',
                  color: 'bg-gray-100 text-gray-900',
                  icon: <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-600" />,
                },
              ];
              // For breakdown chart
              const breakdown = data.accountStatusBreakdown || {};
              const breakdownKeys = Object.keys(breakdown);
              const totalBreakdown = Object.values(breakdown).map(Number).reduce((a, b) => a + b, 0);
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {statCards.map((card, idx) => (
                      <div key={idx} className={`${card.color} rounded-lg p-6 text-center`}>
                        {card.icon}
                        <p className="text-2xl font-bold">{card.value ?? 0}</p>
                        <p className="text-sm mt-1">{card.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 