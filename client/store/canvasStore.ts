import { create } from "zustand";
import * as fabric from "fabric";

interface CanvasState {
  canvas: fabric.Canvas | null;
  width: number;
  height: number;
  setCanvas: (canvas: fabric.Canvas) => void;
  setDimensions: (width: number, height: number) => void;
}

export const useCanvasStore = create<CanvasState>()((set) => ({
  canvas: null,
  width: 800,
  height: 500,
  setCanvas: (canvas) => set({ canvas }),
  setDimensions: (width, height) => set({ width, height }),
}));