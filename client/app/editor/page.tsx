import Canvas from "@/components/editor/Canvas";

export default function EditorPage() {
  return (
    <div className="h-screen flex bg-gray-800 text-white">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-4">
        <h2 className="text-xl font-bold mb-4">Tools</h2>
        <button className="block mb-2">Add Text</button>
        <button className="block mb-2">Add Image</button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center">
        <Canvas />
      </div>

    </div>
  );
}