import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  DocumentData,
  arrayUnion,
  runTransaction,
} from "firebase/firestore";

export interface Message {
  id: string; // Unique ID for each message
  userId: string;
  content: string;
  createdAt: Date;
}

interface MessageBatch {
  id: string;
  messages: Array<{
    id: string;
    userId: string;
    content: string;
    createdAt: Timestamp;
  }>;
  createdAt: Timestamp;
  lastMessageAt: Timestamp;
  messageCount: number;
}

const MESSAGES_PER_BATCH = 50;

export function useMessages(threadId: string, roomId: string, userId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for message batches in a thread
  useEffect(() => {
    if (!threadId || !roomId) {
      setLoading(false);
      return;
    }

    const batchesRef = collection(
      db,
      "rooms",
      roomId,
      "threads",
      threadId,
      "messageBatches"
    );
    
    const q = query(batchesRef, orderBy("createdAt", "asc"));
    
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const allMessages: Message[] = [];
        
        snapshot.docs.forEach((doc) => {
          const data = doc.data() as DocumentData;
          const batchMessages = data.messages || [];
          
          batchMessages.forEach((msg: any) => {
            allMessages.push({
              id: msg.id,
              userId: msg.userId,
              content: msg.content,
              createdAt: msg.createdAt?.toDate?.() || new Date(),
            });
          });
        });
        
        // Sort all messages by createdAt
        allMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        
        setMessages(allMessages);
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to message batches:", err);
        setError(err.message);
        setLoading(false);
      }
    );
    
    return unsub;
  }, [threadId, roomId]);

  // Send a new message
  const sendMessage = async (content: string) => {
    if (!userId) {
      const errorMsg = "You must be logged in to send a message.";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
    
    if (!threadId || !roomId) {
      const errorMsg = "Thread ID and Room ID are required to send a message.";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
    
    setError(null);
    
    try {
      await runTransaction(db, async (transaction) => {
        const batchesRef = collection(
          db,
          "rooms",
          roomId,
          "threads",
          threadId,
          "messageBatches"
        );
        
        // Find or create the current batch
        // We'll use a simple naming convention: batch_001, batch_002, etc.
        const threadRef = doc(db, "rooms", roomId, "threads", threadId);
        const threadDoc = await transaction.get(threadRef);
        
        if (!threadDoc.exists()) {
          throw new Error("Thread not found");
        }
        
        const threadData = threadDoc.data();
        const currentBatchNumber = threadData.currentBatchNumber || 1;
        const currentBatchId = `batch_${String(currentBatchNumber).padStart(3, '0')}`;
        
        const currentBatchRef = doc(batchesRef, currentBatchId);
        const currentBatchDoc = await transaction.get(currentBatchRef);
        
        const newMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          content,
          createdAt: Timestamp.now(),
        };
        
        if (!currentBatchDoc.exists()) {
          // Create new batch
          transaction.set(currentBatchRef, {
            messages: [newMessage],
            createdAt: Timestamp.now(),
            lastMessageAt: Timestamp.now(),
            messageCount: 1,
          });
        } else {
          const batchData = currentBatchDoc.data() as MessageBatch;
          
          if (batchData.messageCount >= MESSAGES_PER_BATCH) {
            // Current batch is full, create a new one
            const newBatchNumber = currentBatchNumber + 1;
            const newBatchId = `batch_${String(newBatchNumber).padStart(3, '0')}`;
            const newBatchRef = doc(batchesRef, newBatchId);
            
            transaction.set(newBatchRef, {
              messages: [newMessage],
              createdAt: Timestamp.now(),
              lastMessageAt: Timestamp.now(),
              messageCount: 1,
            });
            
            // Update thread with new batch number
            transaction.update(threadRef, {
              currentBatchNumber: newBatchNumber,
            });
          } else {
            // Add to current batch
            transaction.update(currentBatchRef, {
              messages: arrayUnion(newMessage),
              lastMessageAt: Timestamp.now(),
              messageCount: batchData.messageCount + 1,
            });
          }
        }
      });
      
      console.log("Message sent successfully");
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setError(err.message);
      throw err;
    }
  };

  return { messages, loading, error, sendMessage };
}
