import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3333';

interface QueueUpdate {
  type: 'TICKET_CALLED' | 'TICKET_UPDATED' | 'QUEUE_UPDATED' | 'DISPLAY_UPDATE';
  data: any;
}

export function useQueueSocket(queueId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<QueueUpdate | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io(WS_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('ticketCalled', (data) => {
      setLastUpdate({ type: 'TICKET_CALLED', data });
    });

    socket.on('queueUpdated', (data) => {
      setLastUpdate({ type: 'QUEUE_UPDATED', data });
    });

    socket.on('displayUpdate', (data) => {
      setLastUpdate({ type: 'DISPLAY_UPDATE', data });
    });

    socketRef.current = socket;
  }, []);

  const joinQueue = useCallback((id: string) => {
    socketRef.current?.emit('joinQueue', { queueId: id });
  }, []);

  const leaveQueue = useCallback((id: string) => {
    socketRef.current?.emit('leaveQueue', { queueId: id });
  }, []);

  useEffect(() => {
    connect();

    if (queueId && socketRef.current) {
      joinQueue(queueId);
    }

    return () => {
      if (queueId) leaveQueue(queueId);
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [queueId, connect, joinQueue, leaveQueue]);

  return { connected, lastUpdate, joinQueue, leaveQueue };
}
