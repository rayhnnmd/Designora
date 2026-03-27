import { create } from "zustand";
import * as fabric from "fabric";

interface CanvasState {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
}));