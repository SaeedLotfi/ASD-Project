import { atom, selector } from 'recoil';

export type Item = { id: string; name: string; x: number; y: number; shape: 'RECT' | 'CIRCLE'; width: number; height: number };

export const itemsState = atom<Record<string, Item>>({
  key: 'items',
  default: {},
});

export const itemsListState = selector<Item[]>({
  key: 'itemsList',
  get: ({ get }) => Object.values(get(itemsState)),
});
