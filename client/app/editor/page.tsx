"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Canvas from "@/components/editor/Canvas";
import { useCanvasStore } from "@/store/canvasStore";
import * as fabric from "fabric";

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
  const undo = useCallback (async () => {
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
  }, [canvas]);

  // Redo Function
  const redo = useCallback (async () => {
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
  }, [canvas, redoStack]);

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
  // Save Design
  const saveDesign = () => {
    if (!canvas) return;
    const json = { ...canvas.toJSON(), backgroundColor: canvas.backgroundColor };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));

    const link = document.createElement("a");
    link.href = dataStr;
    link.download = "designora-project.json";
    link.click();
  };

  // Load Design
  const loadDesign = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        isRestoring.current = true;
        const json = JSON.parse(event.target?.result as string);

        await canvas.loadFromJSON(json);
        if (json.backgroundColor) {
          canvas.backgroundColor = json.backgroundColor;
        }
        canvas.renderAll();

        const newState = { ...canvas.toJSON(), backgroundColor: canvas.backgroundColor };
        undoStackRef.current = [newState];
        setUndoStack([newState]);
        setRedoStack([]);
      } catch (err) {
        console.error("Error loading design:", err);
        alert("Failed to load design. Invalid JSON file.");
      } finally {
        isRestoring.current = false;
        e.target.value = '';
      }
    };

    reader.readAsText(file);
  };

  // Allignment Tools
  const alignLeft = useCallback(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set("left", 0);
      activeObject.setCoords();
      canvas.renderAll();
      canvas.fire("object:modified" as any);
    }
  }, [canvas]);

  const alignRight = useCallback(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const canvasWidth = canvas.width;
      const objWidth = activeObject.getScaledWidth() || activeObject.width || 0;
      activeObject.set("left", canvasWidth - objWidth);
      activeObject.setCoords();
      canvas.renderAll();
      canvas.fire("object:modified" as any);
    }
  }, [canvas]);

  const alignTop = useCallback(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set("top", 0);
      activeObject.setCoords();
      canvas.renderAll();
      canvas.fire("object:modified" as any);
    }
  }, [canvas]);

  const alignBottom = useCallback(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const canvasHeight = canvas.height || 500;
      const objHeight = activeObject.getScaledHeight() || activeObject.height || 0;
      activeObject.set("top", canvasHeight  - objHeight);
      activeObject.setCoords();
      canvas.renderAll();
      canvas.fire("object:modified" as any);
    }
  }, [canvas]);

  const alignCenter = useCallback(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.centerObject(activeObject);
      activeObject.setCoords();
      canvas.renderAll();
      canvas.fire("object:modified" as any);
    }
  }, [canvas]);

  // ✅ Keyboard Delete
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Delete" && canvas) {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          canvas.remove(activeObject);
          saveState();
        }
      }

      // Keyboard Undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }

      // Keyboard Redo
      if (e.ctrlKey || e.metaKey && e.key === "y") {
        e.preventDefault();
        redo();
      }
      // Alignment Shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          alignLeft();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          alignRight();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          alignTop();
        } else if (e.key === "ArrowDwon" || e.keyCode === 40) {
          e.preventDefault();
          alignBottom();
        } else if (e.shiftKey && (e.key === "c" || e.key === "C")) {
          e.preventDefault();
          alignCenter();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [canvas, alignLeft, alignRight, alignTop, alignBottom, alignCenter, undo, redo, saveState]);
  
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

        {/* Save/Load Design */}
        <button
          onClick={saveDesign}
          className="block mb-4 bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg font-medium w-full text-left">
            💾 Save Design 
          </button>

          <label className="block mb-4">
            <span className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg cursor-pointer inline-block font-medium w-full text-left">
              📂 Load Design
            </span>

            <input
            type="file"
            accept=".json"
            onChange={loadDesign}
            className="hidden"
            />
          </label>

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

        {/* Alignment Tools*/}
        <div className="mb-4">
          <h3 className="font-bold mb-2">Alignment</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={alignLeft}
              className="bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-lg font-medium text-sm"
              title="Ctrl + ArrowLeft"
            >
              Align Left
            </button>
            <button
              onClick={alignRight}
              className="bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-lg font-medium text-sm"
              title="Ctrl + ArrowRight"
            >
              Align Right
            </button>
            <button
              onClick={alignTop}
              className="bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-lg font-medium text-sm"
              title="Ctrl + ArrowUp"
            >
              Align Top
            </button>
            <button
              onClick={alignBottom}
              className="bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-lg font-medium text-sm"
              title="Ctrl + ArrowDown"
            >
              Align Bottom
            </button>
            <button
              onClick={alignCenter}
              className="bg-purple-600 hover:bg-purple-700 px-2 py-2 rounded-lg font-medium text-sm col-span-2"
              title="Ctrl + Shift + C"
            >
              Align Center
            </button>
          </div>
        </div>

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