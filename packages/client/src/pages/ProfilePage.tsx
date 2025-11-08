import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Mail,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { useState } from 'react';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    bio: 'Love chatting about tech and design!',
  });

  const handleSave = () => {
    // TODO: API call to update profile
    setUser({ ...user, ...formData });
    setIsEditing(false);
  };

  const stats = [
    { label: 'Messages Sent', value: '1,234' },
    { label: 'Threads Created', value: '45' },
    { label: 'Rooms Joined', value: '12' },
    { label: 'Member Since', value: 'Jan 2025' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative z-10 min-h-screen p-8">
        {/* Back Button */}
        <Link 
          to="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="glass-card rounded-2xl p-8 mb-6 border border-border animate-scale-in">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-primary-foreground">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button 
                  className="absolute bottom-2 right-2 p-2 bg-background rounded-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Change avatar"
                  aria-label="Change avatar"
                >
                  <Camera className="w-4 h-4 text-foreground" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="text-3xl font-bold bg-background border border-border rounded-lg px-3 py-2 mb-2"
                        placeholder="Username"
                        aria-label="Username"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-foreground mb-2">{user.username}</h1>
                    )}
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="text-muted-foreground bg-background border border-border rounded-lg px-3 py-1"
                        placeholder="Email"
                        aria-label="Email address"
                      />
                    ) : (
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </p>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:shadow-lg transition-all"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Cancel editing"
                        aria-label="Cancel editing"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-accent text-foreground rounded-lg transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 resize-none"
                    rows={3}
                    placeholder="Tell us about yourself"
                    aria-label="Bio"
                  />
                ) : (
                  <p className="text-muted-foreground mb-4">{formData.bio}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined January 2025</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="glass-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Settings Card */}
            <div className="glass-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Privacy & Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <button className="px-4 py-2 text-sm bg-muted hover:bg-accent rounded-lg transition-colors">
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Change Password</p>
                    <p className="text-xs text-muted-foreground">Update your password regularly</p>
                  </div>
                  <button className="px-4 py-2 text-sm bg-muted hover:bg-accent rounded-lg transition-colors">
                    Change
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Active Sessions</p>
                    <p className="text-xs text-muted-foreground">Manage your devices</p>
                  </div>
                  <button className="px-4 py-2 text-sm bg-muted hover:bg-accent rounded-lg transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications Card */}
            <div className="glass-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Message Notifications</p>
                    <p className="text-xs text-muted-foreground">Get notified of new messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      defaultChecked
                      aria-label="Enable message notifications"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Room Invites</p>
                    <p className="text-xs text-muted-foreground">Receive room invitations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      defaultChecked
                      aria-label="Enable room invites"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive email updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      aria-label="Enable email notifications"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Recent Rooms */}
            <div className="glass-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Recent Rooms
              </h3>
              <div className="space-y-3">
                {['General Chat', 'Tech Talk', 'Random'].map((room, index) => (
                  <Link
                    key={index}
                    to={`/room/${index + 1}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{room}</p>
                      <p className="text-xs text-muted-foreground">Last visited 2h ago</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card rounded-xl p-6 border border-destructive/50">
              <h3 className="text-lg font-bold text-destructive mb-4 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Delete Account</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="w-full px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
