"use client";

import Canvas from "@/components/editor/Canvas";
import { useCanvasStore } from "@/store/canvasStore";
import * as fabric from "fabric";

export default function EditorPage() {
  const canvas = useCanvasStore((state) => state.canvas);

  const addText = () => {
    if (!canvas) return;

    const text = new fabric.Textbox("New Text", {
      left: 100,
      top: 100,
      fontSize: 24,  
    });

    canvas.add(text);
    canvas.setActiveObject(text);
  };

  return (
    <div className="h-screen flex bg-gray-800 text-white">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-4">
        <h2 className="text-xl font-bold mb-4">Tools</h2>

        <button 
          onClick={addText}
          className="block mb-2 bg-blue-500 px-3 py-1 rounded"
        >
          Add Text
        </button>

      </div>

      {/* Canvas*/}
      <div className="flex-1 flex items-center justify-center">
        <Canvas />
      </div>

    </div>
  );
}