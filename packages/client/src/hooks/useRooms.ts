import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  DocumentData,
} from "firebase/firestore";

export interface Room {
  id: string;
  name: string;
  createdBy: string; // User ID of the room creator (acts as admin with full control)
  invitedUsers: string[]; // Array of user IDs who have been invited and can access this room
  createdAt: Date;
  expiresAt: Date;
}

export function useRooms(userId: string | null) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for rooms - only show rooms user has access to
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "rooms"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        // Filter rooms to only show ones user has access to
        const accessibleRooms = snapshot.docs
          .map((doc) => {
            const data = doc.data() as DocumentData;
            return {
              id: doc.id,
              name: data.name,
              createdBy: data.createdBy,
              invitedUsers: data.invitedUsers || [],
              createdAt: data.createdAt?.toDate?.() || new Date(),
              expiresAt: data.expiresAt?.toDate?.() || new Date(),
            };
          })
          .filter((room) => {
            // User can access if they created it or are in invitedUsers
            return room.createdBy === userId || room.invitedUsers.includes(userId);
          });
        
        setRooms(accessibleRooms);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [userId]);

  // Create a new room
  const createRoom = async (name: string, durationHours: number) => {
    if (!userId) {
      setError("You must be logged in to create a room.");
      return;
    }
    setError(null);
    try {
      await addDoc(collection(db, "rooms"), {
        name,
        createdBy: userId,
        invitedUsers: [], // Start with empty invited users list
        createdAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(
          new Date(Date.now() + durationHours * 60 * 60 * 1000)
        ),
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Invite user to room (only room creator can do this)
  const inviteUserToRoom = async (roomId: string, userEmail: string) => {
    if (!userId) {
      const errorMsg = "You must be logged in to invite users.";
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setError(null);
    try {
      const { doc, getDoc, updateDoc, arrayUnion, collection: firestoreCollection, query: firestoreQuery, where, getDocs } = await import('firebase/firestore');
      
      // Get the room to verify current user is the creator
      const roomRef = doc(db, "rooms", roomId);
      const roomDoc = await getDoc(roomRef);
      
      if (!roomDoc.exists()) {
        throw new Error("Room not found");
      }

      const roomData = roomDoc.data();
      if (roomData.createdBy !== userId) {
        throw new Error("Only the room creator can invite users");
      }

      // Find user by email
      const usersRef = firestoreCollection(db, "users");
      const userQuery = firestoreQuery(usersRef, where("email", "==", userEmail));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        throw new Error("User not found with that email");
      }

      const invitedUserId = userSnapshot.docs[0].id;

      // Check if user is already invited
      if (roomData.invitedUsers?.includes(invitedUserId)) {
        throw new Error("User is already invited to this room");
      }

      // Add user to invitedUsers array
      await updateDoc(roomRef, {
        invitedUsers: arrayUnion(invitedUserId),
      });

      console.log('User invited successfully');
    } catch (err: any) {
      console.error('Failed to invite user:', err);
      setError(err.message);
      throw err;
    }
  };

  // Remove user from room (only room creator can do this)
  const removeUserFromRoom = async (roomId: string, userIdToRemove: string) => {
    if (!userId) {
      const errorMsg = "You must be logged in to remove users.";
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setError(null);
    try {
      const { doc, getDoc, updateDoc, arrayRemove } = await import('firebase/firestore');
      
      // Get the room to verify current user is the creator
      const roomRef = doc(db, "rooms", roomId);
      const roomDoc = await getDoc(roomRef);
      
      if (!roomDoc.exists()) {
        throw new Error("Room not found");
      }

      const roomData = roomDoc.data();
      if (roomData.createdBy !== userId) {
        throw new Error("Only the room creator can remove users");
      }

      // Remove user from invitedUsers array
      await updateDoc(roomRef, {
        invitedUsers: arrayRemove(userIdToRemove),
      });

      console.log('User removed successfully');
    } catch (err: any) {
      console.error('Failed to remove user:', err);
      setError(err.message);
      throw err;
    }
  };

  // Delete a room
  const deleteRoom = async (roomId: string) => {
    if (!userId) {
      const errorMsg = "You must be logged in to delete a room.";
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setError(null);
    try {
      const { deleteDoc, doc, getDocs, collection: firestoreCollection } = await import('firebase/firestore');

      // First verify the user is the room creator
      const roomRef = doc(db, "rooms", roomId);
      const roomDoc = await getDocs(firestoreCollection(db, "rooms"));
      const roomData = roomDoc.docs.find(d => d.id === roomId)?.data();

      if (!roomData) {
        throw new Error("Room not found");
      }

      if (roomData.createdBy !== userId) {
        throw new Error("Only the room creator can delete this room");
      }

      // Delete all threads and their message batches
      const threadsRef = firestoreCollection(db, "rooms", roomId, "threads");
      const threadsSnapshot = await getDocs(threadsRef);

      for (const threadDoc of threadsSnapshot.docs) {
        // Delete all message batches in this thread
        const batchesRef = firestoreCollection(db, "rooms", roomId, "threads", threadDoc.id, "messageBatches");
        const batchesSnapshot = await getDocs(batchesRef);

        const deleteBatchPromises = batchesSnapshot.docs.map(batchDoc =>
          deleteDoc(batchDoc.ref)
        );
        await Promise.all(deleteBatchPromises);

        // Delete the thread
        await deleteDoc(threadDoc.ref);
      }

      // Finally, delete the room itself
      await deleteDoc(roomRef);

      console.log('Room and all related data deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete room:', err);
      setError(err.message);
      throw err;
    }
  };

  return { rooms, loading, error, createRoom, deleteRoom, inviteUserToRoom, removeUserFromRoom };
}
