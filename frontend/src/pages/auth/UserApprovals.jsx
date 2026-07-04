import { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { UserCheck, UserX, Clock, Mail, Shield } from "lucide-react";

export default function UserApprovals() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        setLoading(true);
        const { data, error } = await authService.getPendingUsers();
        if (data) {
            setPendingUsers(data);
        }
        setLoading(false);
    };

    const handleApprove = async (userId) => {
        setActionLoading(userId);
        const { error } = await authService.approveUser(userId);
        if (!error) {
            setMessage({ type: 'success', text: 'User approved successfully!' });
            setPendingUsers(prev => prev.filter(u => u.id !== userId));
        } else {
            setMessage({ type: 'error', text: error.message });
        }
        setActionLoading(null);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleReject = async (userId) => {
        setActionLoading(userId);
        const { error } = await authService.rejectUser(userId);
        if (!error) {
            setMessage({ type: 'success', text: 'User rejected.' });
            setPendingUsers(prev => prev.filter(u => u.id !== userId));
        } else {
            setMessage({ type: 'error', text: error.message });
        }
        setActionLoading(null);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <Shield className="text-blue-600" size={32} />
                    Registration Approvals
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">Review and approve new user registration requests</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl text-sm font-medium border ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800 tracking-tight">Pending Requests</h2>
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                        {pendingUsers.length} Pending
                    </span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
                        <p className="font-medium">Loading requests...</p>
                    </div>
                ) : pendingUsers.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 bg-gray-50/50">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="text-gray-400" size={32} />
                        </div>
                        <p className="text-lg font-semibold text-gray-800">No pending requests</p>
                        <p className="text-sm">All registration requests have been processed.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-500 font-semibold border-b border-gray-100">
                                    <th className="px-6 py-4">User Details</th>
                                    <th className="px-6 py-4">Request Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pendingUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600">
                                                    {user.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900">{user.email}</span>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Mail size={12} /> User Account
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleReject(user.id)}
                                                    disabled={actionLoading === user.id}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                                >
                                                    <UserX size={14} /> Reject
                                                </button>
                                                <button
                                                    onClick={() => handleApprove(user.id)}
                                                    disabled={actionLoading === user.id}
                                                    className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                                                >
                                                    <UserCheck size={14} /> Approve
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
