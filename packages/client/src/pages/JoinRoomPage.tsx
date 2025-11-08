import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const JoinRoomPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid invite link.');
      return;
    }
    const join = async () => {
      try {
        const res = await fetch(`/api/rooms/join/${token}`, {
          method: 'POST',
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage('Joined room successfully! Redirecting...');
          setTimeout(() => {
            navigate(`/rooms/${data.roomId}`);
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to join room.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Failed to join room.');
      }
    };
    join();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="max-w-md w-full glass-card rounded-2xl p-8 shadow-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">Join Room</h2>
        {status === 'pending' && <p>Joining room...</p>}
        {status === 'success' && <p className="text-green-600">{message}</p>}
        {status === 'error' && <>
          <p className="text-red-500 mb-2">{message}</p>
          <Link to="/rooms" className="text-primary hover:underline">Back to Rooms</Link>
        </>}
      </div>
    </div>
  );
};

export default JoinRoomPage;
