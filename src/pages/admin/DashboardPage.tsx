import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Shield, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  status: 'active' | 'suspended' | 'pending';
  features: string[];
}

const DashboardPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkSuperAdmin();
    loadUsers();
  }, []);

  const checkSuperAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!roleData || roleData.role !== 'super_admin') {
      navigate('/');
    }
  };

  const loadUsers = async () => {
    try {
      const { data: users, error: usersError } = await supabase
        .from('auth.users')
        .select(`
          *,
          user_roles (role),
          user_status (status),
          user_features (feature, enabled)
        `);

      if (usersError) throw usersError;

      setUsers(users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.user_roles?.role || 'user',
        status: user.user_status?.status || 'pending',
        features: user.user_features?.filter(f => f.enabled).map(f => f.feature) || []
      })));
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role, updated_at: new Date() });

      if (error) throw error;
      await loadUsers();
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update role');
    }
  };

  const updateUserStatus = async (userId: string, status: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from('user_status')
        .upsert({
          user_id: userId,
          status,
          suspended_reason: reason,
          suspended_at: status === 'suspended' ? new Date() : null,
          updated_at: new Date()
        });

      if (error) throw error;
      await loadUsers();
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const toggleFeature = async (userId: string, feature: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('user_features')
        .upsert({
          user_id: userId,
          feature,
          enabled,
          updated_at: new Date()
        });

      if (error) throw error;
      await loadUsers();
    } catch (err) {
      console.error('Error toggling feature:', err);
      setError('Failed to update feature');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-amber-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-amber-500 mr-3" />
            <h1 className="text-2xl font-bold text-amber-500">Super Admin Dashboard</h1>
          </div>
          <div className="flex items-center">
            <Users className="w-5 h-5 text-amber-500 mr-2" />
            <span>{users.length} Users</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-gray-900 rounded-lg border border-amber-500/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amber-500/20">
                  <th className="px-6 py-3 text-left text-sm font-medium text-amber-500">User</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-amber-500">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-amber-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-amber-500">Features</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-amber-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/20">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-amber-500/5">
                    <td className="px-6 py-4">
                      <div className="text-sm">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="bg-black border border-amber-900 rounded px-2 py-1 text-sm"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {user.status === 'active' && (
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        )}
                        {user.status === 'suspended' && (
                          <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                        )}
                        {user.status === 'pending' && (
                          <Clock className="w-4 h-4 text-amber-500 mr-2" />
                        )}
                        <select
                          value={user.status}
                          onChange={(e) => updateUserStatus(user.id, e.target.value)}
                          className="bg-black border border-amber-900 rounded px-2 py-1 text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {['claim_shops', 'add_shops', 'edit_shops'].map(feature => (
                          <label key={feature} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={user.features.includes(feature)}
                              onChange={(e) => toggleFeature(user.id, feature, e.target.checked)}
                              className="mr-2"
                            />
                            <span className="text-sm">{feature.replace('_', ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => updateUserStatus(user.id, 'suspended')}
                        className="text-red-500 hover:text-red-400 mr-3"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;