import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../pages/dashboards/DashboardLayout';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../../lib/supabase';

// Types for message
interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  message: string;
  created_at: string;
  status: 'unread' | 'read';
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('contact_messages')
      .select('id, full_name, email, message, created_at, status')
      .order('created_at', { ascending: false });
    if (fetchError) {
      setError(fetchError.message);
      setMessages([]);
      setLoading(false);
      return;
    }
    setMessages((data as ContactMessage[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Filter messages by name or email
  const filteredMessages = messages
    .filter((msg) =>
      msg.full_name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter((msg) => (statusFilter === 'all' ? true : msg.status === statusFilter));

  const updateMessageStatus = async (id: string, status: 'read' | 'unread') => {
    const { error: updateError } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, status } : msg)));
    setSelectedMessage((prev) => (prev?.id === id ? { ...prev, status } : prev));
  };

  // Delete message
  const deleteMessage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const { error: deleteError } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      if (deleteError) {
        setError(deleteError.message);
        return;
      }
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Messages
          <span className="text-sm font-semibold text-slate-500">({filteredMessages.length})</span>
        </h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full px-4 py-2 pl-10 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            className="px-3 py-2 rounded-full border border-slate-200 text-sm bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'read' | 'unread')}
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : error ? (
        <div className="glass-panel p-6 text-sm text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-2 glass-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-600">From</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Message</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Received</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Status</th>
                    <th className="text-left p-4 font-semibold text-slate-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((msg) => (
                    <tr
                      key={msg.id}
                      className={`border-b border-slate-100 last:border-0 cursor-pointer hover:bg-slate-50 ${
                        msg.status === 'unread' ? 'font-semibold bg-blue-50/20' : ''
                      }`}
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (msg.status === 'unread') {
                          updateMessageStatus(msg.id, 'read');
                        }
                      }}
                    >
                      <td className="p-4">
                        <div>
                          <p className="text-slate-900">{msg.full_name}</p>
                          <p className="text-xs text-slate-500">{msg.email}</p>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 max-w-xs truncate">{msg.message}</td>
                      <td className="p-4 text-slate-500 whitespace-nowrap">
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            msg.status === 'unread'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {msg.status === 'unread' ? 'Unread' : 'Read'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(msg.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredMessages.length === 0 && (
                <div className="py-12 text-center text-slate-400">No messages found</div>
              )}
            </div>
          </div>

          {/* Message Detail Panel */}
          <div className="glass-panel p-6">
            {selectedMessage ? (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Message Details</h3>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">From</p>
                    <p className="font-medium text-slate-900">{selectedMessage.full_name}</p>
                    <p className="text-sm text-slate-600">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Received</p>
                    <p className="text-sm text-slate-700">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Message</p>
                    <p className="text-slate-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                  <button
                    onClick={() =>
                      updateMessageStatus(
                        selectedMessage.id,
                        selectedMessage.status === 'read' ? 'unread' : 'read'
                      )
                    }
                    className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                  >
                    Mark as {selectedMessage.status === 'read' ? 'unread' : 'read'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 py-12">
                <p>Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}