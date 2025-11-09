import { Link } from 'react-router-dom';
import { MessageSquare, Plus, Clock, Users, TrendingUp, Loader2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { CreateRoomModal } from '../components/CreateRoomModal';
import { InviteUserModal } from '../components/InviteUserModal';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { useRooms } from '../hooks/useRooms';

export function RoomsPage() {
  const { user, logout } = useFirebaseAuth();
  const { rooms, loading, error, deleteRoom, inviteUserToRoom } = useRooms(user?.uid || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [inviteModal, setInviteModal] = useState<{ roomId: string; roomName: string } | null>(null);

  // Check if current user is the admin (creator) of a room
  const isRoomAdmin = (room: { createdBy: string }) => {
    return room.createdBy === user?.uid;
  };

  const getTimeUntilExpiry = (expiresAt: Date | null) => {
    if (!expiresAt) return 'No expiry';
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff < 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  // Calculate stats from rooms data
  const stats = {
    activeRooms: rooms.length,
    onlineUsers: 0, // We'll implement presence later
    messagesToday: 0, // We'll implement this later
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 glass-card border-b border-border backdrop-blur-xl bg-background/80 animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link 
                to="/" 
                className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-5 h-5 text-primary-foreground animate-pulse-slow" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform">
                  BlueChat
                </h1>
              </Link>
              
              {/* User Actions */}
              <div className="flex items-center gap-4">
                {/* User Info */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg glass border border-border/50 hover:border-primary/30 transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Logout
                </button>

                {/* Create Room Button */}
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="relative group px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-2 font-medium">
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    <span>New Room</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-2">Active Rooms</h2>
            <p className="text-muted-foreground">Join a conversation or create your own ephemeral room</p>
          </div>

          {/* Stats Cards */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="glass rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.activeRooms}</p>
                    <p className="text-sm text-muted-foreground">Active Rooms</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6 border border-border hover:border-secondary/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.onlineUsers}</p>
                    <p className="text-sm text-muted-foreground">Online Users</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6 border border-border hover:border-accent/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.messagesToday}</p>
                    <p className="text-sm text-muted-foreground">Messages Today</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="glass-card rounded-xl p-6 border border-destructive/50 text-center">
              <p className="text-destructive mb-4">{error}</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="glass-card rounded-xl p-12 border border-border text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No Rooms Yet</h3>
              <p className="text-muted-foreground mb-6">Create your first ephemeral room to start chatting</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Room
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="relative group">
                <Link
                  to={`/chat/${room.id}`}
                  className="block glass-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {room.name}
                          </h3>
                          {isRoomAdmin(room) && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                          <span>Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Expires in</span>
                      <div className="flex items-center gap-1 text-foreground font-medium">
                        <Clock className="w-4 h-4" />
                        {getTimeUntilExpiry(room.expiresAt)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <span className="text-muted-foreground">Access</span>
                      <div className="flex items-center gap-1 text-foreground font-medium">
                        <Users className="w-4 h-4" />
                        {room.invitedUsers.length + 1} {/* +1 for creator */}
                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Admin Actions (only visible to room creator/admin) */}
                {isRoomAdmin(room) && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setInviteModal({ roomId: room.id, roomName: room.name });
                      }}
                      className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                      title="Invite users"
                      aria-label="Invite users to room"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        if (window.confirm(`Delete room "${room.name}"? This will also delete all threads and messages in this room.`)) {
                          try {
                            await deleteRoom(room.id);
                          } catch (error) {
                            console.error('Failed to delete room:', error);
                            alert('Failed to delete room. Please try again.');
                          }
                        }
                      }}
                      className="p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                      title="Delete room"
                      aria-label="Delete room"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRoomCreated={() => {
          setShowCreateModal(false);
          // Rooms will auto-refresh via real-time listener
        }}
      />

      {/* Invite User Modal */}
      {inviteModal && (
        <InviteUserModal
          isOpen={true}
          onClose={() => setInviteModal(null)}
          onInvite={async (email) => {
            await inviteUserToRoom(inviteModal.roomId, email);
          }}
          roomName={inviteModal.roomName}
        />
      )}
    </div>
  );
}
