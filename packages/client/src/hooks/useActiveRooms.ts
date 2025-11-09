import { useEffect, useState } from "react";
import { Room, useRooms } from "./useRooms";

export function useActiveRooms(userId: string | null) {
  const { rooms, loading, error, createRoom } = useRooms(userId);
  const [activeRooms, setActiveRooms] = useState<Room[]>([]);

  useEffect(() => {
    const now = new Date();
    setActiveRooms(
      rooms.filter((room) => room.expiresAt > now)
    );
  }, [rooms]);

  return { activeRooms, loading, error, createRoom };
}
