'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Loader2, X, ShieldCheck, Phone, Key, UserCog } from 'lucide-react';
import { getUsers, addUser, updateUser, deleteUser } from './actions';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    setUsers(await getUsers());
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    if (editUser) {
      await updateUser(editUser.id, formData);
    } else {
      await addUser(formData);
    }
    e.currentTarget.reset();
    setEditUser(null);
    setShowForm(false);
    await loadData();
    setIsSubmitting(false);
  };

  const handleEdit = (user: any) => {
    setEditUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if(confirm('هل أنت متأكد من الحذف؟')) {
      await deleteUser(id);
      await loadData();
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'ADMIN': return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-black border border-purple-200">مدير نظام (Admin)</span>;
      case 'CASHIER': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-black border border-green-200">كاشير (POS)</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-black border border-gray-200">موظف (Staff)</span>;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">المستخدمين والصلاحيات</h1>
        </div>
        <button onClick={() => {setShowForm(!showForm); setEditUser(null);}} className="bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black transition-colors flex items-center gap-2 shadow-sm">
          {showForm ? <X className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}
          {showForm ? 'إلغاء' : 'إضافة مستخدم'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">اسم الموظف *</label>
              <div className="relative">
                <UserCog className="w-5 h-5 absolute right-3 top-3 text-gray-400"/>
                <input type="text" name="name" defaultValue={editUser?.name || ''} required className="w-full border border-gray-200 rounded-lg pr-10 pl-4 py-2.5 outline-none focus:border-gray-800" placeholder="الاسم الكامل" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">رقم الجوال (للدخول) *</label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute right-3 top-3 text-gray-400"/>
                <input type="text" name="phone" defaultValue={editUser?.phone || ''} required className="w-full border border-gray-200 rounded-lg pr-10 pl-4 py-2.5 outline-none focus:border-gray-800" placeholder="05xxxxxxxx" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">كلمة المرور {editUser ? '(اتركه فارغاً إذا لم ترد تغييره)' : '*'}</label>
              <div className="relative">
                <Key className="w-5 h-5 absolute right-3 top-3 text-gray-400"/>
                <input type="text" name="password" required={!editUser} className="w-full border border-gray-200 rounded-lg pr-10 pl-4 py-2.5 outline-none focus:border-gray-800" placeholder={editUser ? '••••••••' : 'كلمة مرور قوية'} dir="ltr" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">الصلاحية (Role) *</label>
              <div className="relative">
                <ShieldCheck className="w-5 h-5 absolute right-3 top-3 text-gray-400"/>
                <select name="role" defaultValue={editUser?.role || 'CASHIER'} required className="w-full border border-gray-200 rounded-lg pr-10 pl-4 py-2.5 outline-none focus:border-gray-800 bg-white appearance-none">
                  <option value="CASHIER">كاشير (دخول لنقاط البيع فقط)</option>
                  <option value="ADMIN">مدير نظام (تحكم كامل)</option>
                  <option value="STAFF">موظف مخزون (إدارة المنتجات فقط)</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end mt-2 border-t pt-4">
              <button type="submit" disabled={isSubmitting} className="bg-gray-800 text-white font-bold py-2.5 px-8 rounded-xl hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : (editUser ? 'تحديث الحساب' : 'إنشاء الحساب')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center items-center text-gray-600 flex-col gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="font-bold">جاري تحميل المستخدمين...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">الموظف</th>
                  <th className="p-4 font-semibold text-gray-600">رقم الجوال</th>
                  <th className="p-4 font-semibold text-gray-600">الصلاحية</th>
                  <th className="p-4 font-semibold text-gray-600">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-bold">لا يوجد مستخدمين.</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                            <UserCog className="w-5 h-5"/>
                          </div>
                          <p className="font-bold text-gray-800">{user.name}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-bold text-gray-600" dir="ltr">{user.phone}</p>
                      </td>
                      <td className="p-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => handleEdit(user)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="تعديل">
                          <Edit className="w-5 h-5"/>
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="حذف">
                          <Trash2 className="w-5 h-5"/>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}