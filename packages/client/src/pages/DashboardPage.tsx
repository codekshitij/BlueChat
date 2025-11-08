import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  Users, 
  TrendingUp, 
  User,
  Settings,
  Bell,
  LogOut,
  Search,
  Filter,
  MoreVertical,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { roomService, Room } from '../services/room.service';

export function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeRooms: 0,
    onlineUsers: 0,
    messagesToday: 0,
    averageRoomLife: '0h',
  });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    console.log('Dashboard mounted, fetching data...');
    console.log('Token in localStorage:', localStorage.getItem('token') ? 'exists' : 'missing');
    console.log('User in localStorage:', localStorage.getItem('user'));
    
    // Debug JWT token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        console.log('=== JWT Token Debug ===');
        console.log('Decoded payload:', decoded);
        console.log('UserID:', decoded?.userId);
        console.log('Username:', decoded?.username);
        console.log('=====================');
      } catch (e) {
        console.error('Failed to decode JWT:', e);
      }
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Starting to fetch rooms and stats...');
      const [roomsData, statsData] = await Promise.all([
        roomService.getRooms(),
        roomService.getStats(),
      ]);
      console.log('Fetched rooms:', roomsData);
      console.log('Fetched stats:', statsData);
      setRooms(roomsData);
      setStats({
        activeRooms: statsData.activeRooms,
        onlineUsers: statsData.onlineUsers,
        messagesToday: statsData.messagesToday,
        averageRoomLife: statsData.averageRoomLife,
      });
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative z-10">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-64 glass-card border-r border-border p-4 flex flex-col">
          <Link to="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold gradient-text">BlueChat</h1>
          </Link>

          <nav className="flex-1 space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              to="/rooms"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <Users className="w-5 h-5" />
              All Rooms
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <User className="w-5 h-5" />
              Profile
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>

          <div className="border-t border-border pt-4 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
              <Bell className="w-5 h-5" />
              Notifications
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 min-h-screen">
          {/* Top Bar */}
          <header className="glass-card border-b border-border sticky top-0 z-40">
            <div className="px-8 py-4 flex items-center justify-between">
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search rooms, threads, messages..."
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  className="p-2 hover:bg-muted rounded-lg transition-colors relative"
                  title="Notifications"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5 text-foreground" />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></div>
                </button>
                
                <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{user.username || 'User'}</p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                </Link>
              </div>
            </div>
          </header>

          <div className="p-8">
            {/* Welcome Section */}
            <div className="mb-8 animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {user.username || 'User'}!
              </h2>
              <p className="text-muted-foreground">Here's what's happening in your chat rooms today</p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : error ? (
              <div className="glass-card rounded-xl p-6 border border-destructive/50 mb-8">
                <p className="text-destructive text-center">{error}</p>
                <button 
                  onClick={fetchData}
                  className="mt-4 mx-auto block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="glass-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <MessageSquare className="w-6 h-6 text-primary" />
                      </div>
                      <MoreVertical className="w-4 h-4 text-muted-foreground cursor-pointer" />
                    </div>
                    <p className="text-2xl font-bold text-foreground mb-1">{stats.activeRooms}</p>
                    <p className="text-sm text-muted-foreground">Active Rooms</p>
                  </div>

                  <div className="glass-card rounded-xl p-6 border border-border hover:border-secondary/50 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-secondary/10 rounded-lg">
                        <Users className="w-6 h-6 text-secondary" />
                      </div>
                      <MoreVertical className="w-4 h-4 text-muted-foreground cursor-pointer" />
                    </div>
                    <p className="text-2xl font-bold text-foreground mb-1">{stats.onlineUsers}</p>
                    <p className="text-sm text-muted-foreground">Online Users</p>
                  </div>

                  <div className="glass-card rounded-xl p-6 border border-border hover:border-accent/50 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-accent" />
                      </div>
                      <MoreVertical className="w-4 h-4 text-muted-foreground cursor-pointer" />
                    </div>
                    <p className="text-2xl font-bold text-foreground mb-1">{stats.messagesToday}</p>
                    <p className="text-sm text-muted-foreground">Messages Today</p>
                  </div>

                  <div className="glass-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <MoreVertical className="w-4 h-4 text-muted-foreground cursor-pointer" />
                    </div>
                    <p className="text-2xl font-bold text-foreground mb-1">{stats.averageRoomLife}</p>
                    <p className="text-sm text-muted-foreground">Avg. Room Life</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Rooms */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">Active Rooms</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="Filter rooms"
                      aria-label="Filter rooms"
                    >
                      <Filter className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <Link 
                      to="/rooms/new"
                      className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      New Room
                    </Link>
                  </div>
                </div>

                <div className="space-y-4">
                  {rooms.length === 0 ? (
                    <div className="glass-card rounded-xl p-8 border border-border text-center">
                      <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">No active rooms yet</p>
                      <Link 
                        to="/rooms/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:shadow-lg transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        Create First Room
                      </Link>
                    </div>
                  ) : (
                    rooms.map((room) => (
                      <Link
                        key={room.id}
                        to={`/chat/${room.id}`}
                        className="glass-card rounded-xl p-5 border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group block"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <MessageSquare className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                {room.name}
                              </h4>
                              {room.description && (
                                <p className="text-sm text-muted-foreground">{room.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                            <span>Active</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{getTimeUntilExpiry(room.expiresAt)}</span>
                          </div>
                          {room._count && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MessageSquare className="w-4 h-4" />
                              <span>{room._count.threads} threads</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-foreground">Recent Activity</h3>
                
                <div className="glass-card rounded-xl p-5 border border-border">
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Activity feed coming soon</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="glass-card rounded-xl p-5 border border-border">
                  <h4 className="font-semibold text-foreground mb-4">Your Stats</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rooms Joined</span>
                      <span className="text-sm font-semibold text-foreground">{rooms.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Threads</span>
                      <span className="text-sm font-semibold text-foreground">
                        {rooms.reduce((sum, room) => sum + (room._count?.threads || 0), 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
          </div>
        </main>
      </div>
    </div>
  );
}
