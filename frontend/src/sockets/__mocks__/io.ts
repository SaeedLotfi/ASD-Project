import { vi } from 'vitest';

const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
};

export const getSocket = vi.fn().mockImplementation(() => mockSocket);