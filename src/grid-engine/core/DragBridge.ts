import type { ReactNode } from "react";

interface IDragPayload {
  w: number;
  h: number;
  component: ReactNode;
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
