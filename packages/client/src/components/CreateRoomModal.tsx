import { useState } from 'react';
import { X } from 'lucide-react';
import { roomService } from '../services/room.service';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: () => void;
}

export function CreateRoomModal({ isOpen, onClose, onRoomCreated }: CreateRoomModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isEphemeral, setIsEphemeral] = useState(true);
  const [expiresInHours, setExpiresInHours] = useState(24);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Room name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const expiresAt = isEphemeral 
        ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
        : undefined;

      await roomService.createRoom({
        name: name.trim(),
        description: description.trim() || undefined,
        isEphemeral,
        expiresAt,
      });

      // Reset form
      setName('');
      setDescription('');
      setIsEphemeral(true);
      setExpiresInHours(24);
      
      onRoomCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-6 border border-border max-w-md w-full animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Create New Room</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Close"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="roomName" className="block text-sm font-medium text-foreground mb-2">
              Room Name *
            </label>
            <input
              id="roomName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Tech Discussion"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="roomDescription" className="block text-sm font-medium text-foreground mb-2">
              Description (optional)
            </label>
            <textarea
              id="roomDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this room about?"
              rows={3}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isEphemeral"
              type="checkbox"
              checked={isEphemeral}
              onChange={(e) => setIsEphemeral(e.target.checked)}
              className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary rounded"
              disabled={loading}
            />
            <label htmlFor="isEphemeral" className="text-sm text-foreground">
              Make this an ephemeral (time-limited) room
            </label>
          </div>

          {isEphemeral && (
            <div>
              <label htmlFor="expiresIn" className="block text-sm font-medium text-foreground mb-2">
                Expires in (hours)
              </label>
              <input
                id="expiresIn"
                type="number"
                min="1"
                max="168"
                value={expiresInHours}
                onChange={(e) => setExpiresInHours(Number(e.target.value))}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Room will automatically close after this time
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-muted hover:bg-accent text-foreground rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
