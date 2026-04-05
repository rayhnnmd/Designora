import { create } from "zustand";
import * as fabric from "fabric";

interface CanvasState {
  canvas: fabric.Canvas | null;
  zoom: number;
  width: number;
  height: number;
  setCanvas: (canvas: fabric.Canvas) => void;
  setDimensions: (width: number, height: number) => void;
  setZoom: (zoom: number) => void;
}

export const useCanvasStore = create<CanvasState>()((set) => ({
  canvas: null,
  zoom: 1,
  width: 800,
  height: 500,
  setCanvas: (canvas) => set({ canvas }),
  setDimensions: (width, height) => set({ width, height }),
  setZoom: (zoom) => set({ zoom }),
}));