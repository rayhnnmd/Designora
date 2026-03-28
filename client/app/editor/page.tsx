"use client";

import Canvas from "@/components/editor/Canvas";
import { useCanvasStore } from "@/store/canvasStore";
import * as fabric from "fabric";

export default function EditorPage() {
  const canvas = useCanvasStore((state) => state.canvas);

  // ✅ Add Text
  const addText = () => {
    if (!canvas) return;

    const text = new fabric.Textbox("New Text", {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: "black",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
  };

  // ✅ Delete Selected
  const deleteSelected = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
    }
  };

  // ✅ Upload Image
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!canvas) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const img = await fabric.Image.fromURL(reader.result as string);

      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5,
      });

      canvas.add(img);
      canvas.setActiveObject(img);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="h-screen flex bg-gray-800 text-white">
      
      {/* 🔥 Sidebar */}
      <div className="w-64 bg-gray-900 p-4">
        <h2 className="text-xl font-bold mb-4">Tools</h2>

        {/* Add Text */}
        <button
          onClick={addText}
          className="block mb-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium"
        >
          Add Text
        </button>

        {/* Delete */}
        <button
          onClick={deleteSelected}
          className="block mb-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium"
        >
          Delete Selected
        </button>

        {/* Upload Image */}
        <label className="block">
          <span className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg cursor-pointer inline-block font-medium">
            📁 Upload Image
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* 🎨 Canvas */}
      <div className="flex-1 flex items-center justify-center">
        <Canvas />
      </div>

    </div>
  );
}