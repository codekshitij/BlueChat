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

export interface Thread {
  id: string;
  roomId: string;
  title: string;
  createdBy: string;
  createdAt: Date;
}

export function useThreads(roomId: string, userId: string | null) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for threads in a room (now as subcollection)
  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }
    
    // Threads are now stored as subcollection: rooms/{roomId}/threads
    const threadsRef = collection(db, "rooms", roomId, "threads");
    const q = query(threadsRef, orderBy("createdAt", "desc"));
    
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const threadsData = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            roomId,
            title: data.title,
            createdBy: data.createdBy,
            createdAt: data.createdAt?.toDate?.() || new Date(),
          };
        });
        setThreads(threadsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching threads:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [roomId]);

  // Create a new thread
  const createThread = async (title: string) => {
    if (!userId) {
      const errorMsg = "You must be logged in to create a thread.";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
    if (!roomId) {
      const errorMsg = "Room ID is required to create a thread.";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
    setError(null);
    try {
      // Create thread as subcollection
      const threadsRef = collection(db, "rooms", roomId, "threads");
      await addDoc(threadsRef, {
        title,
        createdBy: userId,
        createdAt: Timestamp.now(),
      });
      console.log('Thread created successfully');
    } catch (err: any) {
      console.error('Failed to create thread:', err);
      setError(err.message);
      throw err;
    }
  };

  // Delete a thread
  const deleteThread = async (threadId: string) => {
    if (!userId) {
      const errorMsg = "You must be logged in to delete a thread.";
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setError(null);
    try {
      const { deleteDoc, doc: firestoreDoc, getDocs, collection: firestoreCollection } = await import('firebase/firestore');

      // Get the thread to verify permissions
      const threadRef = firestoreDoc(db, "rooms", roomId, "threads", threadId);
      const threadDoc = await getDocs(firestoreCollection(db, "rooms", roomId, "threads"));
      const threadData = threadDoc.docs.find(d => d.id === threadId)?.data();

      if (!threadData) {
        throw new Error("Thread not found");
      }

      // Check if user is thread creator or room admin
      const isThreadCreator = threadData.createdBy === userId;

      // Get room data to check if user is room admin
      const roomDoc = await getDocs(firestoreCollection(db, "rooms"));
      const roomData = roomDoc.docs.find(d => d.id === roomId)?.data();

      if (!roomData) {
        throw new Error("Room not found");
      }

      const isRoomAdmin = roomData.createdBy === userId;

      if (!isThreadCreator && !isRoomAdmin) {
        throw new Error("Only the thread creator or room admin can delete this thread");
      }

      // Delete all message batches in this thread
      const batchesRef = firestoreCollection(db, "rooms", roomId, "threads", threadId, "messageBatches");
      const batchesSnapshot = await getDocs(batchesRef);

      const deleteBatchPromises = batchesSnapshot.docs.map(batchDoc =>
        deleteDoc(batchDoc.ref)
      );
      await Promise.all(deleteBatchPromises);

      // Delete the thread itself
      await deleteDoc(threadRef);

      console.log('Thread and all message batches deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete thread:', err);
      setError(err.message);
      throw err;
    }
  };

  return { threads, loading, error, createThread, deleteThread };
}
