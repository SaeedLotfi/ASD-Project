import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import api from '../api/client';
import { authTokenState } from '../state/auth';
import { itemsState, Item } from '../state/items';
import { getSocket } from '../sockets/io';
import CanvasBoard from '../components/CanvasBoard';

export default function CanvasPage() {
  const token = useRecoilValue(authTokenState);
  const [items, setItems] = useRecoilState(itemsState);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const { data } = await api.get('/items');
      const byId: Record<string, Item> = {};
      for (const it of data) byId[it.id] = it;
      setItems(byId);
    })();

    const socket = getSocket(token);
    if (!socket) return;

    socket.on('connect', () => console.log('ws connected'));
    socket.on('item.updated', (updated: Item) => {
      console.log('Received item.updated', updated);
      setItems(prev => ({ ...prev, [updated.id]: updated }));
    });

    return () => { socket.off('item.updated'); };
  }, [token, setItems]);

  if (!token) return <div>Please <a href="/login">login</a>.</div>;
  return <div data-testid="canvas-page"><CanvasBoard items={Object.values(items)} /></div>;
}
