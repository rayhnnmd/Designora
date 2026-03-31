"use client";

import { useEffect } from "react";
import Canvas from "@/components/editor/Canvas";
import { useCanvasStore } from "@/store/canvasStore";
import * as fabric from "fabric";
import { useState } from "react";
import { useRef } from "react";

export default function EditorPage() {
  const canvas = useCanvasStore((state) => state.canvas);
  const [fontSize, setFontSize] = useState(24);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const isRestoring = useRef(false);
  const undoStackRef = useRef<any[]>([]);

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

  // Save History
  const saveState = () => {
    if (!canvas || isRestoring.current) return;

    const json = { ...canvas.toJSON(), backgroundColor: canvas.backgroundColor };

    const newStack = [...undoStackRef.current, json];
    undoStackRef.current = newStack;
    setUndoStack(newStack);

    setRedoStack([]);
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

  // Rectangle
  const addRectangle = () => {
    if (!canvas) return;

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: "blue",
      width: 100,
      height: 100,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  // Circle
  const addCircle = () => {
    if (!canvas) return;
    const circle = new fabric.Circle({
      left: 150,
      top: 150,
      fill: "red",
      radius: 50,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
  };

  // Undo Function
  const undo = async () => {
    if (!canvas || undoStackRef.current.length < 2) return;

    isRestoring.current = true;

    const newUndo = [...undoStackRef.current];
    const current = newUndo.pop();
    const prevState = newUndo[newUndo.length - 1];

    undoStackRef.current = newUndo;
    setUndoStack(newUndo);
    setRedoStack((prev) => [...prev, current]);

    try {
      await canvas.loadFromJSON(prevState);
      if (prevState.backgroundColor) {
        canvas.backgroundColor = prevState.backgroundColor;
      }
      canvas.renderAll();
    } finally {
      // Must use a slight delay or wait for next tick sometimes, but try/finally is safest.
      isRestoring.current = false;
    }
  };

  // Redo Function
  const redo = async () => {
    if (!canvas || redoStack.length === 0) return;
    
    isRestoring.current = true;

    const next = redoStack[redoStack.length - 1];
    
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, next]);
    
    try {
      await canvas.loadFromJSON(next);
      if (next.backgroundColor) {
        canvas.backgroundColor = next.backgroundColor;
      }
      canvas.renderAll();
    } finally {
      isRestoring.current = false;
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

      // Keyboard Undo
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
      }

      // Keyboard Redo
      if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [canvas, undoStack, redoStack]);
  
  // Initial State
  useEffect(() => {
    if (!canvas) return;

    const initialState = { ...canvas.toJSON(), backgroundColor: canvas.backgroundColor };
    undoStackRef.current = [initialState];
    setUndoStack([initialState]);
  }, [canvas]);

  // Undo Redo Function
  useEffect(() => {
    if (!canvas) return;

    // Use a stable reference so the handler always calls the latest saveState
    const handler = () => saveState();

    canvas.on("object:added", handler);
    canvas.on("object:modified", handler);
    canvas.on("object:removed", handler);

    return () => {
      canvas.off("object:added", handler);
      canvas.off("object:modified", handler);
      canvas.off("object:removed", handler);
    };
  }, [canvas, saveState]);

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

        
        {/* Shapes as Rectangle and Circle */}
        <button 
          onClick={addRectangle}
          className="block mb-4 bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg font-medium"
        >
          ▭ Add Rectangle
        </button>

        <button
          onClick={addCircle}
          className="block mb-4 bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-lg font-medium"
        >
          ⚪ Add Circle
        </button>


        {/* Export */}
        <button
          onClick={exportImage}
          className="block mb-4 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-medium"
        >
          Export Image
        </button>

        {/* Undo Redo Buttons*/}
        <button
          onClick={undo}
          className="block mb-4 bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg"
        >
          Undo
        </button>

        <button
          onClick={redo}
          className="block mb-4 bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg"
        >
          Redo
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