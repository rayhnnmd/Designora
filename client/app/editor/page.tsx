"use client";

import { useEffect } from "react";
import Canvas from "@/components/editor/Canvas";
import { useCanvasStore } from "@/store/canvasStore";
import * as fabric from "fabric";
import { useState } from "react";

export default function EditorPage() {
  const canvas = useCanvasStore((state) => state.canvas);

  const [fontSize, setFontSize] = useState(24);

  // ✅ Add Text
  const addText = () => {
    if (!canvas) return;

    const text = new fabric.Textbox("New Text", {
      left: 100,
      top: 100,
      fontSize: fontSize,
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

  // ✅ Color Picker
  const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    if ("set" in activeObject) {
      activeObject.set("fill", e.target.value);
      canvas.renderAll();
    }
  };

  // ✅ Font Size
  const changeFontSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value);
    setFontSize(size);

    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    if ("set" in activeObject && "fontSize" in activeObject) {
      activeObject.set("fontSize", size);
      canvas.renderAll();
    }
  };

  // ✅ Font Family
  const changeFontFamily = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    if ("set" in activeObject && "fontFamily" in activeObject) {
      activeObject.set("fontFamily", e.target.value);
      canvas.renderAll();
    }
  };

  // ✅ Export Image
  const exportImage = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "designora.png";
    link.click();
  };

  // ✅ Keyboard Delete
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Delete" && canvas) {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          canvas.remove(activeObject);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [canvas]);

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

        {/* Export */}
        <button
          onClick={exportImage}
          className="block mb-4 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-medium"
        >
          Export Image
        </button>

        {/* Upload Image */}
        <label className="block mb-4">
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

        {/* Color Picker */}
        <div className="mt-4">
          <p className="mb-2 font-medium">Text Color</p>
          <input
            type="color"
            onChange={changeColor}
            className="w-full h-10 cursor-pointer"
          />
        </div>

        {/* Font Size */}
        <div className="mt-4">
          <p className="mb-2 font-medium">Font Size</p>
          <input
            type="range"
            min="10"
            max="100"
            value={fontSize}
            onChange={changeFontSize}
            className="w-full"
          />
          <p className="text-sm mt-1 text-gray-300">
            Size: {fontSize}px
          </p>
        </div>

        {/* Font Family */}
        <div className="mt-4">
          <p className="mb-2 font-medium">Font Family</p>
          <select
            onChange={changeFontFamily}
            className="w-full p-2 bg-gray-700 rounded-lg"
          >
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>
      </div>

      {/* 🎨 Canvas */}
      <div className="flex-1 flex items-center justify-center">
        <Canvas />
      </div>

    </div>
  );
}