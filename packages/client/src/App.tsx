import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'
import { MessageSquare, Clock, Calendar, Archive, Sparkles } from 'lucide-react'

function App() {
  const [serverStatus, setServerStatus] = useState<string>('Checking...')

  useEffect(() => {
    // Check if server is running
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setServerStatus(data.message)
      })
      .catch(() => {
        setServerStatus('Server offline - Start the server!')
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <ThemeToggle />
      
      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="max-w-4xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg animate-glow animate-float">
                <MessageSquare className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-6xl font-bold gradient-text animate-scale-in">
                BlueChat
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Ephemeral Time-Boxed Chat Rooms with Multi-Threading
            </p>
            <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Where conversations have a lifetime, and every message matters
            </p>
          </div>

          {/* Main Card */}
          <div className="glass-card rounded-2xl shadow-2xl p-8 mb-6 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            {/* Features Grid */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-card-foreground">
                  Unique Features
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="group glass rounded-xl p-5 transition-all duration-300 border border-border hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 group-hover:scale-110">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">Ephemeral Rooms</h3>
                      <p className="text-sm text-muted-foreground">Auto-delete after 1hr, 4hr, 8hr, or 24hr</p>
                    </div>
                  </div>
                </div>

                <div className="group glass rounded-xl p-5 transition-all duration-300 border border-border hover:border-secondary/50 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg group-hover:from-secondary/30 group-hover:to-secondary/20 transition-all duration-300 group-hover:scale-110">
                      <MessageSquare className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground mb-1 group-hover:text-secondary transition-colors">Multi-Threading</h3>
                      <p className="text-sm text-muted-foreground">Click any message to start a focused thread</p>
                    </div>
                  </div>
                </div>

                <div className="group glass rounded-xl p-5 transition-all duration-300 border border-border hover:border-accent/50 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-300 group-hover:scale-110">
                      <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground mb-1 group-hover:text-accent transition-colors">Scheduled Rooms</h3>
                      <p className="text-sm text-muted-foreground">Create rooms that start in the future</p>
                    </div>
                  </div>
                </div>

                <div className="group glass rounded-xl p-5 transition-all duration-300 border border-border hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 group-hover:scale-110">
                      <Archive className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">Archive Mode</h3>
                      <p className="text-sm text-muted-foreground">Save highlights before expiration</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Server Status */}
            <div className="glass rounded-xl p-4 mb-6 border border-border overflow-hidden relative group">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${serverStatus.includes('offline') ? 'bg-destructive' : 'bg-primary'} animate-pulse`}></div>
                  <p className="font-medium text-card-foreground">Server Status</p>
                </div>
                <p className="text-sm text-muted-foreground">{serverStatus}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Link
                to="/login"
                className="flex-1 bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-2xl hover:shadow-primary/50 text-primary-foreground font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden group text-center"
              >
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Sign In
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/signup"
                className="flex-1 glass border-2 border-primary hover:bg-primary/10 text-foreground font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 text-center"
              >
                Sign Up
              </Link>
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              Building in progress... Check back soon! 🎉
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with React, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
