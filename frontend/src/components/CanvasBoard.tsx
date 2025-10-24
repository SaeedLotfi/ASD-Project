import { useEffect, useRef } from 'react';
import { getSocket } from '../sockets/io';
import { useRecoilValue } from 'recoil';
import { authTokenState } from '../state/auth';
import type { Item } from '../state/items';

type Props = { items: Item[] };

export default function CanvasBoard({ items }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const latestItemsRef = useRef<Item[]>(items);
  const token = useRecoilValue(authTokenState);

  useEffect(() => { latestItemsRef.current = items; }, [items]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const DPR = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width * DPR);
      canvas.height = Math.max(1, rect.height * DPR);
      ctx.setTransform(1,0,0,1,0,0);
      ctx.scale(DPR, DPR);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const draw = () => {
      const itms = latestItemsRef.current;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#4ade80';
      for (const it of itms) {
        ctx.beginPath();
        ctx.arc(it.x, it.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e5e7eb';
        ctx.fillText(it.name, it.x + 18, it.y + 4);
        ctx.fillStyle = '#4ade80';
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const socket = getSocket(token!);
    if (!socket) return;

    const getHit = (x: number, y: number) => {
      for (const it of latestItemsRef.current) {
        if (it.shape === 'RECT') {
          const left = it.x - it.width/2;
          const top = it.y - it.height/2;
          if (x >= left && x <= left + it.width && y >= top && y <= top + it.height) return it;
        } else {
          const dx = x - it.x, dy = y - it.y;
          if (dx*dx + dy*dy <= 14*14) return it;
        }
      }
      return null;
    };

    let draggingId: string | null = null;

    const onDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const hit = getHit(x, y);
      if (hit) {
        draggingId = hit.id;
        dragRef.current = { id: hit.id, offsetX: x - hit.x, offsetY: y - hit.y };
        canvas.setPointerCapture(e.pointerId);
      }
    };

    const onMove = (() => {
      let last = 0;
      return (e: PointerEvent) => {
        if (!draggingId) return;
        const now = performance.now();
        if (now - last < 16) return;
        last = now;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - (dragRef.current?.offsetX ?? 0);
        const y = e.clientY - rect.top  - (dragRef.current?.offsetY ?? 0);
        const list = latestItemsRef.current.map(it => it.id === draggingId ? { ...it, x, y } : it);
        latestItemsRef.current = list;
        socket.emit('item.move', { id: draggingId, x, y });
      };
    })();

    const onUp = (e: PointerEvent) => {
      draggingId = null;
      dragRef.current = null;
      canvas.releasePointerCapture?.(e.pointerId);
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    };
  }, [token]);

  return (
    <div style={{ width:'100%', height:'100vh', background:'#0b0b0b' }}>
      <canvas ref={canvasRef} style={{ width:'100%', height:'100%' }} />
    </div>
  );
}
