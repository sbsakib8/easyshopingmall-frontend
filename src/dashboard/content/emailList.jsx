"use client";

import React, { useState } from 'react';
import { Trash2, Mail, MailOpen, Clock, User, Phone, MessageSquare, RefreshCw } from 'lucide-react';
import { ContactDelete } from '@/src/hook/content/useContact';
import { useGetEmail } from '@/src/utlis/content/useEmail';
import toast from 'react-hot-toast';

const ContactInboxDashboard = () => {
  const { email, loading, error, refetch } = useGetEmail();
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const contacts = email || [];

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      setDeleting(id);
      await ContactDelete(id);

      if (selectedContact?._id === id) {
        setSelectedContact(null);
      }

      await refetch();
      toast.success('Message deleted successfully!');
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete message. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);

      if (seconds < 60) return `${seconds}s ago`;
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-accent-content text-xl">Loading messages...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center bg-red-500/20 backdrop-blur-lg rounded-2xl border border-red-500/50 p-8 max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-accent-content text-2xl font-bold mb-2">Error Loading Messages</h2>
          <p className="text-red-200 mb-4">Failed to fetch contact messages</p>
          <button
            onClick={handleRefresh}
            className="bg-red-500 hover:bg-red-600 text-accent-content px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 animate-fade-in flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-accent-content mb-2">Contact Inbox</h1>
            <p className="text-purple-200">Manage your customer messages</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-accent-content px-4 py-2 rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
              <h2 className="text-accent-content font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5" />
                All Messages ({contacts.length})
              </h2>
            </div>

            <div className="divide-y divide-white/10 max-h-[600px] overflow-y-auto">
              {contacts.length === 0 ? (
                <div className="p-8 text-center text-purple-200">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No messages yet</p>
                </div>
              ) : (
                contacts.map((contact, index) => (
                  <div
                    key={contact._id || index}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 cursor-pointer transition-all duration-300 hover:bg-white/20 ${selectedContact?._id === contact._id ? 'bg-white/20 border-l-4 border-purple-400' : ''
                      }`}
                    style={{
                      animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MailOpen className="w-4 h-4 text-purple-300 flex-shrink-0" />
                          <h3 className="text-accent-content font-medium truncate">{contact.name}</h3>
                        </div>
                        <p className="text-purple-200 text-sm truncate mb-1">{contact.subject}</p>
                        <p className="text-purple-300 text-xs truncate">{contact.message}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className="text-purple-300 text-xs whitespace-nowrap">
                          {getTimeAgo(contact.createdAt)}
                        </span>
                        <button
                          onClick={(e) => handleDelete(contact._id, e)}
                          disabled={deleting === contact._id}
                          className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                          title="Delete message"
                        >
                          {deleting === contact._id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
            {selectedContact ? (
              <div className="animate-fade-in">
                <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-accent-content">{selectedContact.subject}</h2>
                    <button
                      onClick={(e) => handleDelete(selectedContact._id, e)}
                      disabled={deleting === selectedContact._id}
                      className="text-red-300 hover:text-red-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {deleting === selectedContact._id ? (
                        <>
                          <div className="w-5 h-5 border-2 border-red-300 border-t-transparent rounded-full animate-spin"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-purple-100 text-sm">
                    <Clock className="w-4 h-4" />
                    {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString() : 'Unknown date'}
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Sender Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-200 text-sm">Name</span>
                      </div>
                      <p className="text-accent-content font-medium">{selectedContact.name}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-200 text-sm">Email</span>
                      </div>
                      <p className="text-accent-content font-medium break-all">{selectedContact.email}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Phone className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-200 text-sm">Phone</span>
                      </div>
                      <p className="text-accent-content font-medium">{selectedContact.phone || 'Not provided'}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-200 text-sm">Received</span>
                      </div>
                      <p className="text-accent-content font-medium">{getTimeAgo(selectedContact.createdAt)}</p>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-200 font-medium">Message</span>
                    </div>
                    <p className="text-accent-content leading-relaxed whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center animate-fade-in">
                  <Mail className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                  <p className="text-purple-200 text-lg">Select a message to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactInboxDashboard;