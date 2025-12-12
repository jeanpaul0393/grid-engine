import type { ReactNode } from "react";

interface IDragPayload {
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  component: ReactNode;
  targetGridId: string;
}

class DragBridgeService {
  private payload: IDragPayload | null = null;

  setPayload(payload: IDragPayload) {
    this.payload = payload;
  }

  getPayload(): IDragPayload | null {
    return this.payload;
  }

  clear() {
    this.payload = null;
  }
}

export const DragBridge = new DragBridgeService();
