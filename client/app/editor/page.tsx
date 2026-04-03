"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Canvas from "@/components/editor/Canvas";
import { useCanvasStore } from "@/store/canvasStore";
import * as fabric from "fabric";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableLayer({
  obj,
  index,
  canvas,
  getLayerName,
  selectLayer,
  moveLayerUp,
  moveLayerDown,
  deleteLayer,
  toggleLock
}: {
  obj: any;
  index: number;
  canvas: any;
  getLayerName: (obj: any) => string;
  selectLayer: (obj: any) => void;
  moveLayerUp: (obj: any, e: React.MouseEvent) => void;
  moveLayerDown: (obj: any, e: React.MouseEvent) => void;
  deleteLayer: (obj: any, e: React.MouseEvent) => void;
  toggleLock: (obj: any, e: React.MouseEvent) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: obj.id || obj.toString(),
    disabled: obj.locked
  }); 

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const isActive = canvas?.getActiveObjects().includes(obj);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => selectLayer(obj)}
      className={`flex items-center justify-between p-3 rounded-lg cursor-grab transition-colors active:cursor-grabbing ${isActive ? "bg-indigo-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300"
        }`}
    >
      <span className="text-sm font-medium truncate flex-1 mr-2 pointer-events-none flex items-center gap-2">
        {obj.locked && <span title="Locked">🔒</span>}
        {getLayerName(obj)}
      </span>

      <div className="flex gap-1">
        <button
          onClick={(e) => toggleLock(obj, e)}
          className={`p-1.5 rounded-md transition-colors pointer-events-auto ${
            obj.locked ? "bg-amber-500 text-white" : "hover:bg-gray-600 text-gray-400 hover:text-white"
          }`}
          title={obj.locked ? "Unlock" : "Lock"}
        >
          {obj.locked ? "🔓" : "🔒"}
        </button>
        <button
          onClick={(e) => moveLayerUp(obj, e)}
          className={`p-1.5 hover:bg-gray-600 rounded-md text-gray-400 hover:text-white pointer-events-auto ${obj.locked ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Move Up"
          disabled={obj.locked}
        >
          ↑
        </button>
        <button
          onClick={(e) => moveLayerDown(obj, e)}
          className={`p-1.5 hover:bg-gray-600 rounded-md text-gray-400 hover:text-white pointer-events-auto ${obj.locked ? 'opacity-30 cursor-not-allowed' : ''}`}
          title="Move Down"
          disabled={obj.locked}
        >
          ↓
        </button>
        <button
          onClick={(e) => deleteLayer(obj, e)}
          className="p-1.5 hover:bg-red-500 hover:text-white rounded-md text-gray-400 pointer-events-auto"
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function EditorPage() {
  const canvas = useCanvasStore((state) => state.canvas);
  const width = useCanvasStore((state) => state.width);
  const height = useCanvasStore((state) => state.height);
  const setDimensions = useCanvasStore((state) => state.setDimensions);

  const [fontSize, setFontSize] = useState(24);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const isRestoring = useRef(false);
  const undoStackRef = useRef<any[]>([]);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const GRID_SIZE = 20;
  const [canvasObjects, setCanvasObjects] = useState<any[]>([]);

  // Export Settings
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg">("png");
  const [highQuality, setHighQuality] = useState(true);
  const [transparentBg, setTransparentBg] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateLayers = useCallback(() => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    objects.forEach((obj: any) => {
      if (!obj.id) {
        obj.set('id', Math.random().toString(36).substring(2, 9));
      }
    });
    setCanvasObjects([...objects]);
  }, [canvas]);

  useEffect(() => {
    if (canvas) {
      updateLayers();
    }
  }, [canvas, updateLayers]);

  // Add Text
  const addText = () => {
    if (!canvas) return;

    const text = new fabric.Textbox("New Text", {
      left: 100,
      top: 100,
      fontSize: fontSize,
      fill: "black",
      id: Math.random().toString(36).substring(2, 9),
    } as any);


    canvas.add(text);
    canvas.setActiveObject(text);
  };

  // Delete Selected
  const deleteSelected = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
    }
  };

  // Upload Image
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
        id: Math.random().toString(36).substring(2, 9),
      } as any);  

      canvas.add(img);
      canvas.setActiveObject(img);
    };

    reader.readAsDataURL(file);
  };

  // Save History
  const saveState = () => {
    if (!canvas || isRestoring.current) return;

    const json = { ...(canvas as any).toJSON(['locked', 'id']), backgroundColor: canvas.backgroundColor };

    const newStack = [...undoStackRef.current, json];
    undoStackRef.current = newStack;
    setUndoStack(newStack);

    setRedoStack([]);
  };

  // Color Picker
  const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    if ("set" in activeObject) {
      activeObject.set("fill", e.target.value);
      canvas.renderAll();
    }
  };

  // Font Size
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

  // Font Family
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
      id: Math.random().toString(36).substring(2, 9),
    } as any);

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
      id: Math.random().toString(36).substring(2, 9),
    } as any);

    canvas.add(circle);
    canvas.setActiveObject(circle);
  };

  // Undo Function
  const undo = useCallback(async () => {
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
      updateLayers();
    } finally {
      isRestoring.current = false;
    }
  }, [canvas, updateLayers]);

  // Redo Function
  const redo = useCallback(async () => {
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
      updateLayers();
    } finally {
      isRestoring.current = false;
    }
  }, [canvas, redoStack, updateLayers]);

  // Export Image
  const exportImage = () => {
    if (!canvas) return;
    const originalBg = canvas.backgroundColor;

    if (transparentBg && exportFormat === "png") {
      canvas.backgroundColor = "rgba(0,0,0,0)";
    } else if (exportFormat === "jpeg" && (originalBg === null || (originalBg as any)?.source !== undefined)) {
      canvas.backgroundColor = "#ffffff";
    }

    canvas.renderAll();

    const multiplier = highQuality ? 2 : 1;

    const qualityStr = exportFormat === "jpeg" ? (highQuality ? 1.0 : 0.6) : 1;

    const dataURL = canvas.toDataURL({
      format: exportFormat,
      quality: qualityStr as any,
      multiplier: multiplier,
    });

    canvas.backgroundColor = originalBg;
    canvas.renderAll();

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `designora.${exportFormat}`;
    link.click();
  };

  // Save Design
  const saveDesign = () => {
    if (!canvas) return;

    const json = { ...(canvas as any).toJSON(['locked', 'id']), backgroundColor: canvas.backgroundColor };
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
        updateLayers();

        // Reset undo/redo stacks to reflect the newly loaded state
        const newState = { ...canvas.toJSON(), backgroundColor: canvas.backgroundColor };
        undoStackRef.current = [newState];
        setUndoStack([newState]);
        setRedoStack([]);
      } catch (err) {
        console.error("Error loading design:", err);
        alert("Failed to load design. Invalid JSON file.");
      } finally {
        isRestoring.current = false;
        // Clear input so same file can be loaded again if needed
        e.target.value = '';
      }
    };

    reader.readAsText(file);
  };

  // Alignment Tools
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
      const canvasWidth = canvas.getWidth() || width;
      const objWidth = activeObject.getScaledWidth() || 0;
      activeObject.set("left", canvasWidth - objWidth);
      activeObject.setCoords();
      canvas.renderAll();
      canvas.fire("object:modified" as any);
    }
  }, [canvas, width]);

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
      const canvasHeight = canvas.getHeight() || height;
      const objHeight = activeObject.getScaledHeight() || 0;
      activeObject.set("top", canvasHeight - objHeight);
      activeObject.setCoords();
      canvas.renderAll();
      canvas.fire("object:modified" as any);
    }
  }, [canvas, height]);

  const alignCenter = useCallback(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const canvasWidth = canvas.getWidth() || width;
      const objWidth = activeObject.getScaledWidth() || 0;
      activeObject.set("left", (canvasWidth - objWidth) / 2);
      activeObject.setCoords();
      canvas.renderAll();
      canvas.fire("object:modified" as any);
    }
  }, [canvas, width]);

  const alignMiddle = useCallback(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const canvasHeight = canvas.getHeight() || height;
      const objHeight = activeObject.getScaledHeight() || 0;
      activeObject.set("top", (canvasHeight - objHeight) / 2);
      activeObject.setCoords();
      canvas.renderAll();
      canvas.fire("object:modified" as any);
    }
  }, [canvas, height]);

  const selectLayer = (obj: any) => {
    if (!canvas) return;
    canvas.discardActiveObject();
    canvas.setActiveObject(obj);
    canvas.renderAll();
  };

  const moveLayerUp = (obj: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvas) return;
    canvas.bringObjectForward(obj);
    canvas.renderAll();
    canvas.fire("object:modified" as any);
    updateLayers();
  };

  const moveLayerDown = (obj: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvas) return;
    canvas.sendObjectBackwards(obj);
    canvas.renderAll();
    canvas.fire("object:modified" as any);
    updateLayers();
  };

  const deleteLayer = (obj: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvas) return;
    canvas.remove(obj);
    canvas.renderAll();
    canvas.fire("object:modified" as any);
  };

  const toggleLock = (obj: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvas) return;

    const isLocked = !obj.locked;
    obj.set({
      locked: isLocked,
      selectable: !isLocked,
      evented: !isLocked,
      lockMovementX: isLocked,
      lockMovementY: isLocked,
      lockScalingX: isLocked,
      lockScalingY: isLocked,
      lockRotation: isLocked,
      hasControls: !isLocked, // Hide controls when locked
      editable: !isLocked,    // Disable text editing if applicable
    });

    if (isLocked) {
      canvas.discardActiveObject();
    }

    canvas.renderAll();
    canvas.fire("object:modified" as any);
    updateLayers();
  };

  const getLayerName = (obj: any) => {
    if (obj.type === 'textbox' || obj.type === 'text') return `Text: ${obj.text?.substring(0, 10) || 'Text'}`;
    if (obj.type === 'image') return 'Image';
    if (obj.type === 'rect') return 'Rectangle';
    if (obj.type === 'circle') return 'Circle';
    return obj.type || 'Object';
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = canvasObjects.findIndex(obj => (obj.id || obj.toString()) === active.id);
      const newIndex = canvasObjects.findIndex(obj => (obj.id || obj.toString()) === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && canvas) {
        const objects = canvas.getObjects();
        const obj = objects[oldIndex];

        // fabricjs reordering is a bit tricky
        // we'll need to move it in the actual fabric objects array
        canvas.moveObjectTo(obj, newIndex);
        canvas.renderAll();
        canvas.fire("object:modified" as any);
        updateLayers();
      }
    }
  };

  // Layering Tools
  const bringToFront = useCallback(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.bringObjectToFront(activeObject);
      canvas.renderAll();
      canvas.fire("object:modified" as any);
      updateLayers();
    }
  }, [canvas, updateLayers]);

  const sendToBack = useCallback(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.sendObjectToBack(activeObject);
      canvas.renderAll();
      canvas.fire("object:modified" as any);
      updateLayers();
    }
  }, [canvas, updateLayers]);

  // Keyboard Delete
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Keyboard Delete
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
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }

      // Alignment & Layering Shortcuts
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
        } else if (e.key === "ArrowDown" || e.keyCode === 40) {
          e.preventDefault();
          alignBottom();
        } else if (e.key === "[") {
          e.preventDefault();
          sendToBack();
        } else if (e.key === "]") {
          e.preventDefault();
          bringToFront();
        } else if (e.shiftKey && (e.key === "c" || e.key === "C")) {
          e.preventDefault();
          alignCenter();
        } else if (e.shiftKey && (e.key === "m" || e.key === "M")) {
          e.preventDefault();
          alignMiddle();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [canvas, alignLeft, alignRight, alignTop, alignBottom, alignCenter, alignMiddle, bringToFront, sendToBack, undo, redo, saveState]);

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
    const handler = () => {
      saveState();
      updateLayers();
    };

    canvas.on("object:added", handler);
    canvas.on("object:modified", handler);
    canvas.on("object:removed", handler);

    const selectionHandler = () => {
      updateLayers(); // Force re-render to update active layer highlighted state
    };
    canvas.on("selection:created", selectionHandler);
    canvas.on("selection:updated", selectionHandler);
    canvas.on("selection:cleared", selectionHandler);

    // Snap to Grid Logic
    const handleMoving = (options: any) => {
      if (snapToGrid && options.target) {
        options.target.set({
          left: Math.round(options.target.left / GRID_SIZE) * GRID_SIZE,
          top: Math.round(options.target.top / GRID_SIZE) * GRID_SIZE,
        });
      }
    };

    canvas.on("object:moving", handleMoving);

    return () => {
      canvas.off("object:added", handler);
      canvas.off("object:modified", handler);
      canvas.off("object:removed", handler);
      canvas.off("selection:created", selectionHandler);
      canvas.off("selection:updated", selectionHandler);
      canvas.off("selection:cleared", selectionHandler);
      canvas.off("object:moving", handleMoving);
    };
  }, [canvas, saveState, snapToGrid]);

  // Visual Grid Pattern
  useEffect(() => {
    if (!canvas) return;

    if (snapToGrid) {
      const gridCanvas = document.createElement("canvas");
      gridCanvas.width = GRID_SIZE;
      gridCanvas.height = GRID_SIZE;
      const ctx = gridCanvas.getContext("2d");

      if (ctx) {
        // Maintain white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, GRID_SIZE, GRID_SIZE);

        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(GRID_SIZE, 0);
        ctx.lineTo(GRID_SIZE, GRID_SIZE);
        ctx.moveTo(0, GRID_SIZE);
        ctx.lineTo(GRID_SIZE, GRID_SIZE);
        ctx.stroke();
      }

      const pattern = new fabric.Pattern({
        source: gridCanvas,
        repeat: "repeat",
      });

      canvas.backgroundColor = pattern;
      canvas.renderAll();
    } else {
      canvas.backgroundColor = "#ffffff";
      canvas.renderAll();
    }
  }, [canvas, snapToGrid]);

  return (
    <div className="h-screen flex bg-gray-800 text-white">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-4 overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold mb-4">Tools</h2>

        {/* Canvas Size Control */}
        <div className="mb-6 p-3 bg-gray-800 rounded-xl border border-gray-700">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            📏 Canvas Size
          </h3>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => setDimensions(1080, 1080)}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${width === 1080 && height === 1080 ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Instagram
              <span className="block text-[10px] opacity-60">1080 x 1080</span>
            </button>
            <button
              onClick={() => setDimensions(794, 1123)}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${width === 794 && height === 1123 ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              A4 Poster
              <span className="block text-[10px] opacity-60">794 x 1123</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Width</label>
                <input 
                  type="number"
                  value={width}
                  onChange={(e) => setDimensions(parseInt(e.target.value) || 0, height)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-md p-1.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Height</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setDimensions(width, parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-md p-1.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>
            </div>
          </div>
        </div>

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
        <div className="mb-4 p-3 bg-gray-800 rounded-xl border border-gray-700">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
            Export Options
          </h3>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => setExportFormat("png")}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${exportFormat === "png" ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              PNG
            </button>
            <button
              onClick={() => setExportFormat("jpeg")}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${exportFormat === "jpeg" ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              JPEG
            </button>
          </div>

          <label className="inline-flex items-center cursor-pointer mb-3 mt-2">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={highQuality}
              onChange={() => setHighQuality(!highQuality)}
            />
              <div className="relative w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after;bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              <span className="ml-3 text-xs font-medium text-gray-300">
              High Quality (2x)
            </span>
          </label>

          <label className={`inline-flex items-center cursor-pointer mb-5 ${exportFormat === "jpeg" ? "opacity-50 cursor-not-allowed" : ""}`} title={exportFormat === "jpeg" ? "Transparency not supported in JPG" : ""}>
            <input
              type="checkbox"
              className="sr-only peer"
              checked={transparentBg}
              onChange={() => setTransparentBg(!transparentBg)}
              disabled={exportFormat === "jpeg"}
            />
            <div className={`relative w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${transparentBg && exportFormat === "png" ? 'peer-checked:bg-yellow-500' : ''}`}></div>
            <span className="ml-3 text-xs font-medium text-gray-300">
              Transparent BG
            </span>
          </label>
          <button
            onClick={exportImage}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-bold transition-colors"
          >
            Export as {exportFormat.toUpperCase()}
          </button>
        </div>

        {/* Save / Load Design */}
        <button
          onClick={saveDesign}
          className="block mb-4 bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg font-medium w-full text-left"
        >
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

        {/* Snap to Grid Toggle */}
        <div className="mb-4 mt-2">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={snapToGrid}
              onChange={() => setSnapToGrid(!snapToGrid)}
            />
            <div className="relative w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            <span className="ml-3 font-medium text-gray-200">
              Snap to Grid
            </span>
          </label>
        </div>

        {/* Alignment Tools */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">Alignment & Layers</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={alignLeft}
              className="bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-lg font-medium text-xs"
              title="Ctrl + ArrowLeft"
            >
              Left
            </button>
            <button
              onClick={alignRight}
              className="bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-lg font-medium text-xs"
              title="Ctrl + ArrowRight"
            >
              Right
            </button>
            <button
              onClick={alignTop}
              className="bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-lg font-medium text-xs"
              title="Ctrl + ArrowUp"
            >
              Top
            </button>
            <button
              onClick={alignBottom}
              className="bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-lg font-medium text-xs"
              title="Ctrl + ArrowDown"
            >
              Bottom
            </button>
            <button
              onClick={alignCenter}
              className="bg-purple-600 hover:bg-purple-700 px-2 py-2 rounded-lg font-medium text-xs"
              title="Ctrl + Shift + C"
            >
              Center
            </button>
            <button
              onClick={alignMiddle}
              className="bg-purple-600 hover:bg-purple-700 px-2 py-2 rounded-lg font-medium text-xs"
              title="Ctrl + Shift + M"
            >
              Middle
            </button>
            <button
              onClick={bringToFront}
              className="bg-emerald-600 hover:bg-emerald-700 px-2 py-2 rounded-lg font-medium text-xs"
              title="Ctrl + ]"
            >
              Forward
            </button>
            <button
              onClick={sendToBack}
              className="bg-emerald-600 hover:bg-emerald-700 px-2 py-2 rounded-lg font-medium text-xs"
              title="Ctrl + ["
            >
              Backward
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

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center relative">
        <Canvas />
      </div>

      {/* Layer Panel */}
      <div className="w-64 bg-gray-900 p-4 border-l border-gray-700 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Layers</h2>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {canvasObjects.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No layers yet.</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={canvasObjects.map(obj => (obj.id || obj.toString()))}
                strategy={verticalListSortingStrategy}
              >
                {canvasObjects.slice().reverse().map((obj, index) => (
                  <SortableLayer
                    key={obj.id || obj.toString()}
                    obj={obj}
                    index={index}
                    canvas={canvas}
                    getLayerName={getLayerName}
                    selectLayer={selectLayer}
                    moveLayerUp={moveLayerUp}
                    moveLayerDown={moveLayerDown}
                    deleteLayer={deleteLayer}
                    toggleLock={toggleLock}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

    </div>
  );
}