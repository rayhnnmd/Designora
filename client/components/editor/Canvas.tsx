"use client";

import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useCanvasStore } from "@/store/canvasStore";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const setCanvas = useCanvasStore((state) => state.setCanvas);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: "#ffffff",
    });

    setCanvas(canvas);

    // Default text
    const text = new fabric.Text("Hello Designora 🎨", {
      left: 100,
      top: 100,
      fontSize: 24,
    });

    canvas.add(text);

    return () => {
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}