"use client";

import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useCanvasStore } from "@/store/canvasStore";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const setCanvas = useCanvasStore((state) => state.setCanvas);
  const { width, height } = useCanvasStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: width,
      height: height,
      backgroundColor: "#ffffff",
    });

    setCanvas(canvas);

    // Default text
    const text = new fabric.Textbox("Hello Designora 🎨", {
      left: 100,
      top: 100,
      fontSize: 24,
      width: 300,
    });

    canvas.add(text);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    const canvas = useCanvasStore.getState().canvas;
    if (canvas) {
      canvas.setDimensions({ width, height });
      canvas.renderAll();
    }
  }, [width, height]);

  return <canvas ref={canvasRef} />;
}