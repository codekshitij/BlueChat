import { Link } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'
import { MessageSquare, Clock, Zap, Shield, ArrowRight, Sparkles, Users, TrendingUp } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
      {/* Modern Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/3 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <ThemeToggle />
      
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              BlueChat
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Login</Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center pt-20 pb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 animate-scale-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Ephemeral conversations made simple</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight animate-slide-up">
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                Chat that
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
                disappears
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up-delayed">
              Time-boxed rooms with multi-threaded conversations. 
              <span className="text-foreground font-medium"> Connect, chat, and let go.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delayed-2">
              <Link
                to="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-primary via-accent to-secondary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-background/50 backdrop-blur-sm border-2 border-border hover:border-primary/50 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Why BlueChat?
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built for meaningful conversations that don't need to last forever
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="group glass-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Ephemeral Rooms</h3>
                <p className="text-muted-foreground">Time-boxed conversations that auto-delete after 1hr, 4hr, 8hr, or 24hr</p>
              </div>

              <div className="group glass-card rounded-2xl p-8 border border-border hover:border-secondary/30 transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Multi-Threading</h3>
                <p className="text-muted-foreground">Keep discussions organized with threaded conversations</p>
              </div>

              <div className="group glass-card rounded-2xl p-8 border border-border hover:border-accent/30 transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Real-time Updates</h3>
                <p className="text-muted-foreground">Instant message delivery with live presence indicators</p>
              </div>

              <div className="group glass-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Privacy First</h3>
                <p className="text-muted-foreground">Your messages disappear automatically - no permanent traces</p>
              </div>
            </div>

            {/* How It Works */}
            <div id="how-it-works" className="glass-card rounded-3xl p-12 border border-border mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    How It Works
                  </span>
                </h2>
                <p className="text-muted-foreground">Get started in three simple steps</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Create a Room</h3>
                  <p className="text-muted-foreground">Choose your room duration and invite others</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Start Chatting</h3>
                  <p className="text-muted-foreground">Engage in threaded conversations with your group</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Let Go</h3>
                  <p className="text-muted-foreground">Messages auto-delete when the time expires</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="glass-card rounded-2xl p-8 border border-border text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-4xl font-bold text-foreground mb-2">1K+</div>
                <p className="text-muted-foreground">Active Users</p>
              </div>
              <div className="glass-card rounded-2xl p-8 border border-border text-center">
                <MessageSquare className="w-8 h-8 text-accent mx-auto mb-3" />
                <div className="text-4xl font-bold text-foreground mb-2">10K+</div>
                <p className="text-muted-foreground">Messages Sent</p>
              </div>
              <div className="glass-card rounded-2xl p-8 border border-border text-center">
                <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-3" />
                <div className="text-4xl font-bold text-foreground mb-2">500+</div>
                <p className="text-muted-foreground">Rooms Created</p>
              </div>
            </div>

            {/* Final CTA */}
            <div className="glass-card rounded-3xl p-12 border border-primary/20 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Ready to Start?
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users having meaningful conversations
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="group px-10 py-4 bg-gradient-to-r from-primary via-accent to-secondary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="px-10 py-4 glass-card border-2 border-border hover:border-primary/50 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="py-12 border-t border-border/50 mt-20">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  BlueChat
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Ephemeral conversations that matter
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                <span>•</span>
                <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
                <span>•</span>
                <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
              </div>
              <p className="text-xs text-muted-foreground mt-8">
                © 2025 BlueChat. Built with React, Firebase, and Tailwind CSS.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App
