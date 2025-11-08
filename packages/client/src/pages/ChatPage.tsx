import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Users, MoreVertical, Plus, MessageSquare } from 'lucide-react';

interface Thread {
  id: string;
  title: string;
  roomId: string;
  createdAt: string;
  _count: {
    messages: number;
  };
}

interface Message {
  id: string;
  content: string;
  threadId: string;
  userId: string;
  username: string;
  createdAt: string;
}

interface Room {
  id: string;
  name: string;
  description?: string;
  isEphemeral: boolean;
  expiresAt?: string;
  users: Array<{ id: string; username: string }>;
}

export function ChatPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [room, setRoom] = useState<Room | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!roomId) return;
    fetchRoomData();
    fetchThreads();
  }, [roomId]);

  useEffect(() => {
    if (selectedThread) {
      fetchMessages(selectedThread.id);
    }
  }, [selectedThread]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchRoomData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/rooms/${roomId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRoom(data);
      }
    } catch (error) {
      console.error('Failed to fetch room:', error);
    }
  };

  const fetchThreads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/rooms/${roomId}/threads`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setThreads(data);
        if (data.length > 0 && !selectedThread) {
          setSelectedThread(data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (threadId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/threads/${threadId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThread || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/threads/${selectedThread.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage.trim() }),
      });

      if (response.ok) {
        const newMsg = await response.json();
        setMessages([...messages, newMsg]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !roomId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/rooms/${roomId}/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newThreadTitle.trim() }),
      });

      if (response.ok) {
        const newThread = await response.json();
        setThreads([...threads, newThread]);
        setNewThreadTitle('');
        setShowNewThreadModal(false);
        setSelectedThread(newThread);
      }
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FEFAE0] via-[#FAEDCD] to-[#E9EDC9] flex items-center justify-center">
        <div className="text-[#283618] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
                title="Back to dashboard"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{room?.name}</h1>
                {room?.description && (
                  <p className="text-sm text-gray-500 mt-0.5">{room.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{room?.users.length || 0} members</span>
              </div>
              <button 
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200"
                title="Room settings"
              >
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Threads Sidebar */}
          <div className="col-span-3">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-transparent">
                <h2 className="font-bold text-gray-900 text-lg">Threads</h2>
                <button
                  onClick={() => setShowNewThreadModal(true)}
                  className="p-2 hover:bg-white rounded-lg transition-all duration-200 shadow-sm hover:shadow group"
                  title="Create new thread"
                >
                  <Plus className="h-5 w-5 text-blue-600 group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>
              <div className="p-3 space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      selectedThread?.id === thread.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                        : 'hover:bg-gray-50 text-gray-700 hover:shadow-sm'
                    }`}
                  >
                    <div className="font-semibold truncate text-sm mb-1">{thread.title}</div>
                    <div className={`text-xs flex items-center gap-1.5 ${selectedThread?.id === thread.id ? 'text-blue-100' : 'text-gray-500'}`}>
                      <MessageSquare className="h-3 w-3" />
                      {thread._count.messages} {thread._count.messages === 1 ? 'message' : 'messages'}
                    </div>
                  </button>
                ))}
                {threads.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-3">No threads yet</p>
                    <button
                      onClick={() => setShowNewThreadModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      Create the first thread
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="col-span-9">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg flex flex-col h-[calc(100vh-180px)]">
              {selectedThread ? (
                <>
                  {/* Thread Header */}
                  <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-transparent">
                    <h3 className="font-bold text-gray-900 text-lg">{selectedThread.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{messages.length} {messages.length === 1 ? 'message' : 'messages'}</p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-gray-50/30">
                    {messages.map((message) => {
                      const isOwn = message.userId === currentUser.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        >
                          <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                            {!isOwn && (
                              <span className="text-xs font-medium text-gray-600 mb-2 px-3">{message.username}</span>
                            )}
                            <div
                              className={`px-5 py-3 rounded-2xl shadow-sm ${
                                isOwn
                                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md'
                                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                              }`}
                            >
                              <p className="break-words leading-relaxed">{message.content}</p>
                              <span className={`text-xs mt-2 block ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                                {formatTime(message.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 max-w-md">
                          <MessageSquare className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                          <p className="text-gray-700 font-medium mb-2">No messages yet</p>
                          <p className="text-sm text-gray-500">Be the first to start the conversation!</p>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-5 border-t border-gray-100 bg-white">
                    <div className="flex items-end space-x-3">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 placeholder-gray-400"
                        rows={1}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg disabled:shadow-none transform hover:scale-105 disabled:scale-100"
                        title="Send message"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 ml-1">Press Enter to send, Shift + Enter for new line</p>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Select a thread to start chatting</p>
                    <p className="text-sm text-gray-400 mt-2">Choose from the threads on the left</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Thread Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl transform animate-scale-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Thread</h2>
            <form onSubmit={handleCreateThread}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Thread Title</label>
                <input
                  type="text"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  placeholder="Enter a descriptive title..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewThreadModal(false);
                    setNewThreadTitle('');
                  }}
                  className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newThreadTitle.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:shadow-none"
                >
                  Create Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
