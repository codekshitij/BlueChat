import { Link } from 'react-router-dom';
import { MessageSquare, Plus, Clock, Users, TrendingUp, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { roomService, Room } from '../services/room.service';
import { CreateRoomModal } from '../components/CreateRoomModal';

export function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stats, setStats] = useState({
    activeRooms: 0,
    onlineUsers: 0,
    messagesToday: 0,
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const [roomsData, statsData] = await Promise.all([
        roomService.getRooms(),
        roomService.getStats(),
      ]);
      setRooms(roomsData);
      setStats({
        activeRooms: statsData.activeRooms,
        onlineUsers: statsData.onlineUsers,
        messagesToday: statsData.messagesToday,
      });
      setError(null);
    } catch (err) {
      setError('Failed to load rooms');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="glass-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold gradient-text">BlueChat</h1>
              </Link>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Welcome, <span className="font-semibold text-foreground">{user.username || 'User'}</span>
                </span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-destructive transition-colors"
                >
                  Logout
                </button>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Room
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
              <button 
                onClick={fetchRooms}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all"
              >
                Retry
              </button>
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
              <Link
                key={room.id}
                to={`/chat/${room.id}`}
                className="glass-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {room.name}
                      </h3>
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
                  {room._count && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Threads</span>
                      <span className="text-foreground font-medium">{room._count.threads}</span>
                    </div>
                  )}
                  {room.description && (
                    <p className="text-xs text-muted-foreground mt-2">{room.description}</p>
                  )}
                </div>
              </Link>
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
          fetchRooms(); // Refresh the rooms list
        }}
      />
    </div>
  );
}
