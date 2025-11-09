import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, MessageSquare, Plus } from 'lucide-react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { useThreads } from '../hooks/useThreads';
import { useMessages } from '../hooks/useMessages';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Room {
  id: string;
  name: string;
  createdBy: string;
  invitedUsers: string[];
  createdAt: Date;
  expiresAt: Date;
}

export function ChatPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useFirebaseAuth();

  console.log('ChatPage: roomId from params:', roomId);
  console.log('ChatPage: user?.uid:', user?.uid);

  const [room, setRoom] = useState<Room | null>(null);
  const [roomLoading, setRoomLoading] = useState(true);
  const { threads, loading: threadsLoading, createThread, deleteThread, error: threadsError } = useThreads(roomId || '', user?.uid || null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  
  console.log('ChatPage: threads:', threads);
  console.log('ChatPage: threadsLoading:', threadsLoading);
  console.log('ChatPage: threadsError:', threadsError);
  const { messages, loading: messagesLoading, sendMessage } = useMessages(
    selectedThreadId || '',
    roomId || '',
    user?.uid || null
  );
  const [newMessage, setNewMessage] = useState('');
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [sending, setSending] = useState(false);

  // Fetch room data and check access
  useEffect(() => {
    if (!roomId || !user) return;
    
    const fetchRoom = async () => {
      try {
        const roomDoc = await getDoc(doc(db, 'rooms', roomId));
        if (roomDoc.exists()) {
          const data = roomDoc.data();
          const roomData = {
            id: roomDoc.id,
            name: data.name,
            createdBy: data.createdBy,
            invitedUsers: data.invitedUsers || [],
            createdAt: data.createdAt?.toDate() || new Date(),
            expiresAt: data.expiresAt?.toDate() || new Date(),
          };

          // Check if user has access to this room
          const hasAccess = roomData.createdBy === user.uid || roomData.invitedUsers.includes(user.uid);
          
          if (!hasAccess) {
            alert('You do not have access to this room. Please ask the room creator for an invitation.');
            navigate('/rooms');
            return;
          }

          setRoom(roomData);
        } else {
          alert('Room not found');
          navigate('/rooms');
        }
      } catch (error) {
        console.error('Failed to fetch room:', error);
        alert('Failed to load room');
        navigate('/rooms');
      } finally {
        setRoomLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, user, navigate]);

  // Auto-select first thread
  useEffect(() => {
    if (threads.length > 0 && !selectedThreadId) {
      setSelectedThreadId(threads[0].id);
    }
  }, [threads, selectedThreadId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThreadId || !user || sending) return;

    setSending(true);
    try {
      await sendMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !user) return;

    try {
      await createThread(newThreadTitle.trim());
      setNewThreadTitle('');
      setShowNewThreadModal(false);
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };

  const formatTime = (date: Date) => {
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

  const selectedThread = threads.find(t => t.id === selectedThreadId);

  if (roomLoading || threadsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin shadow-2xl shadow-blue-500/30"></div>
          <p className="text-white/80 text-lg font-medium animate-pulse">Loading your chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-black to-blue-800/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-600/3 via-transparent to-transparent rounded-full"></div>
      </div>

      {/* Header */}
      <div className="z-10 backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/rooms')}
                className="group p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                title="Back to rooms"
              >
                <ArrowLeft className="h-6 w-6 text-white group-hover:text-blue-300 transition-colors" />
              </button>
              <div className="animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{room?.name}</h1>
                    <p className="text-blue-200/80 text-sm">Welcome to your chat room</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {room && room.createdBy === user?.uid && (
                <div className="animate-bounce-in">
                  <span className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 border border-white/20">
                    👑 Admin
                  </span>
                </div>
              )}
              <div className="text-right">
                <p className="text-white/80 text-sm">Active Users</p>
                <p className="text-blue-300 font-semibold">{room?.invitedUsers?.length || 1}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Threads Sidebar */}
          <div className="col-span-3 animate-slide-in-left">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 overflow-hidden shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-500">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="font-bold text-xl text-white">Threads</h2>
                </div>
                <button
                  onClick={() => setShowNewThreadModal(true)}
                  className="group p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                  title="Create new thread"
                >
                  <Plus className="h-5 w-5 text-blue-300 group-hover:text-white transition-colors" />
                </button>
              </div>
              <div className="p-4 space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent">
                {threads.map((thread, index) => (
                  <div
                    key={thread.id}
                    className={`relative group rounded-2xl transition-all duration-300 hover:scale-[1.02] animate-fade-in ${
                      index % 3 === 0 ? 'delay-100' : index % 3 === 1 ? 'delay-200' : 'delay-300'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedThreadId(thread.id)}
                      className={`w-full text-left p-5 rounded-2xl transition-all duration-300 ${
                        selectedThreadId === thread.id
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105'
                          : 'hover:bg-white/10 text-white/90 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold truncate text-sm pr-8 flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          selectedThreadId === thread.id ? 'bg-white' : 'bg-blue-400'
                        }`}></div>
                        {thread.title}
                      </div>
                      <div className="text-xs text-white/60 mt-1">
                        {thread.createdBy === user?.uid ? 'Created by you' : 'Thread'}
                      </div>
                    </button>
                    {(thread.createdBy === user?.uid || (room && room.createdBy === user?.uid)) && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete thread "${thread.title}"? This will also delete all messages in this thread.`)) {
                            try {
                              await deleteThread(thread.id);
                              if (selectedThreadId === thread.id) {
                                setSelectedThreadId(null);
                              }
                            } catch (error) {
                              console.error('Failed to delete thread:', error);
                              alert('Failed to delete thread. Please try again.');
                            }
                          }
                        }}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 ${
                          selectedThreadId === thread.id
                            ? 'hover:bg-white/20 text-white'
                            : 'hover:bg-red-500/20 text-red-400 hover:text-red-300'
                        }`}
                        title="Delete thread"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                {threads.length === 0 && (
                  <div className="text-center py-16 animate-fade-in">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-blue-300" />
                    </div>
                    <p className="text-white/70 text-sm mb-4">No threads yet</p>
                    <button
                      onClick={() => setShowNewThreadModal(true)}
                      className="text-blue-300 hover:text-white font-medium transition-colors duration-300 hover:underline"
                    >
                      Create the first thread →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="col-span-9 animate-slide-in-right">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 flex flex-col h-[calc(100vh-220px)] shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-500">
              {selectedThread ? (
                <>
                  {/* Thread Header */}
                  <div className="px-8 py-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-2xl text-white mb-2">{selectedThread.title}</h3>
                        <div className="flex items-center gap-4">
                          <span className="text-blue-200/80 text-sm">
                            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                          </span>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-sm">Active</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-white/70 text-sm">Real-time</span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent">
                    {messagesLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="relative">
                          <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin shadow-lg shadow-blue-500/30"></div>
                          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-300"></div>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-16 animate-fade-in">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <MessageSquare className="h-10 w-10 text-blue-300" />
                        </div>
                        <p className="font-semibold text-white mb-3 text-lg">No messages yet</p>
                        <p className="text-blue-200/80 text-sm max-w-md">Be the first to start the conversation! Share your thoughts and connect with others in this thread.</p>
                      </div>
                    ) : (
                      messages.map((message, index) => {
                        const isOwn = message.userId === user?.uid;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-slide-in-up ${
                              index % 4 === 0 ? 'delay-100' : index % 4 === 1 ? 'delay-200' : index % 4 === 2 ? 'delay-300' : 'delay-500'
                            }`}
                          >
                            <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col group`}>
                              {!isOwn && (
                                <div className="flex items-center gap-2 mb-3 px-4">
                                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">
                                      {message.userId.substring(0, 2).toUpperCase()}
                                    </span>
                                  </div>
                                  <span className="text-xs font-medium text-blue-200">
                                    User {message.userId.substring(0, 8)}
                                  </span>
                                </div>
                              )}
                              <div
                                className={`px-6 py-4 rounded-3xl shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                                  isOwn
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md shadow-blue-500/30'
                                    : 'bg-white/10 backdrop-blur-sm text-white rounded-bl-md border border-white/20 shadow-blue-500/20'
                                }`}
                              >
                                <p className="break-words leading-relaxed">{message.content}</p>
                                <div className={`text-xs mt-3 flex items-center gap-2 ${
                                  isOwn ? 'text-blue-100' : 'text-blue-200/70'
                                }`}>
                                  <span>{formatTime(message.createdAt)}</span>
                                  {isOwn && (
                                    <div className="flex gap-1">
                                      <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-8 border-t border-white/10 bg-gradient-to-r from-blue-500/5 to-blue-600/5 rounded-b-3xl">
                    <div className="flex items-end space-x-4">
                      <div className="flex-1 relative">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e);
                            }
                          }}
                          placeholder="Type your message... ✨"
                          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none text-white placeholder-blue-200/70 transition-all duration-300 hover:bg-white/15"
                          rows={1}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-blue-200/50">
                          Press Enter to send
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl transition-all duration-300 flex items-center space-x-3 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        title="Send message"
                      >
                        {sending ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        )}
                        <span className="font-medium hidden sm:inline">Send</span>
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center animate-fade-in">
                  <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                      <MessageSquare className="h-12 w-12 text-blue-300" />
                    </div>
                    <h3 className="font-bold text-2xl text-white mb-4">Select a thread</h3>
                    <p className="text-blue-200/80 text-sm leading-relaxed">
                      Choose a conversation thread from the sidebar to start chatting with others in this room.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Thread Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 w-full max-w-lg mx-4 border border-white/20 shadow-2xl shadow-blue-500/30 animate-scale-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Create New Thread</h2>
              <p className="text-blue-200/80">Start a new conversation in this room</p>
            </div>
            <form onSubmit={handleCreateThread} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Thread Title</label>
                <input
                  type="text"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  placeholder="What's this thread about? ✨"
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-200/70 transition-all duration-300 hover:bg-white/15"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewThreadModal(false);
                    setNewThreadTitle('');
                  }}
                  className="px-8 py-3 hover:bg-white/10 rounded-3xl transition-all duration-300 font-medium text-white hover:text-blue-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newThreadTitle.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
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
