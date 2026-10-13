'use client';

import React, { useState } from 'react';
import { useStore, store, FURNITURE_TEMPLATES } from '@/state/useStore';
import {
  Move,
  RotateCw,
  Maximize2,
  Plus,
  Trash2,
  X,
  Palette,
  Check,
  UploadCloud,
  Layers
} from 'lucide-react';
import { TransformMode } from '@/types';

export function FurnitureToolbar() {
  const {
    appMode,
    transformMode,
    selectedFurnitureId,
    furnitureList
  } = useStore();

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [customGlbUrl, setCustomGlbUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (appMode !== 'edit') return null;

  const selectedItem = furnitureList.find(f => f.id === selectedFurnitureId);
  const currentTemplate = selectedItem
    ? FURNITURE_TEMPLATES.find(t => t.type === selectedItem.templateType)
    : null;

  const categories = ['all', 'chair', 'table', 'lighting', 'decor', 'storage', 'electronics'];

  const filteredTemplates = FURNITURE_TEMPLATES.filter(
    t => selectedCategory === 'all' || t.category === selectedCategory
  );

  const handleAddCustomModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGlbUrl.trim()) return;

    const customId = `custom_${Date.now()}`;
    const customItem = {
      id: customId,
      templateType: 'custom_glb',
      name: 'Custom 3D Model',
      category: 'decor' as any,
      position: [1.5, 0.0, 0.0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: [1, 1, 1] as [number, number, number],
      color: '#ffffff',
      colliderSize: [0.6, 0.8, 0.6] as [number, number, number],
      modelUrl: customGlbUrl.trim()
    };

    store.updateFurniture(customId, customItem);
    store.addFurniture('shoji_lantern'); // fallback
    setCustomGlbUrl('');
    setIsCatalogOpen(false);
  };

  return (
    <>
      {/* Top Center Transform Toolbar */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-2xl select-none">
        <button
          onClick={() => store.setTransformMode('translate')}
          title="Move Object (Translate)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            transformMode === 'translate'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Move className="w-3.5 h-3.5" />
          <span>Move</span>
        </button>

        <button
          onClick={() => store.setTransformMode('rotate')}
          title="Rotate Object"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            transformMode === 'rotate'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Rotate</span>
        </button>

        <button
          onClick={() => store.setTransformMode('scale')}
          title="Scale Object"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            transformMode === 'scale'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Scale</span>
        </button>

        <div className="w-[1px] h-5 bg-slate-700/60 mx-1" />

        <button
          onClick={() => setIsCatalogOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Bottom Floating Inspector for Selected Item */}
      {selectedItem && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-lg w-full mx-4 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-2xl select-none">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-sky-400 font-semibold uppercase tracking-wider">
                {selectedItem.category}
              </div>
              <h3 className="text-sm font-bold text-slate-100">
                {selectedItem.name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => store.deleteFurniture(selectedItem.id)}
                title="Delete Object"
                className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => store.selectFurniture(null)}
                title="Deselect"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Color Customizer */}
          {currentTemplate?.colorOptions && currentTemplate.colorOptions.length > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" /> Color:
              </span>
              <div className="flex items-center gap-1.5">
                {currentTemplate.colorOptions.map((hex) => (
                  <button
                    key={hex}
                    onClick={() => store.updateFurniture(selectedItem.id, { color: hex })}
                    className="w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-110 flex items-center justify-center"
                    style={{ backgroundColor: hex }}
                  >
                    {selectedItem.color === hex && (
                      <Check className="w-3 h-3 text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Pos: [{selectedItem.position.map(v => v.toFixed(2)).join(', ')}]</span>
            <span className="text-emerald-400 font-medium">✓ Snapped to Floor</span>
          </div>
        </div>
      )}

      {/* Add Furniture Catalog Modal */}
      {isCatalogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 select-none">
          <div className="max-w-2xl w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Furniture & Decor Catalog</h2>
                  <p className="text-xs text-slate-400">Add 3D objects to arrange inside the room</p>
                </div>
              </div>

              <button
                onClick={() => setIsCatalogOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 py-3 overflow-x-auto text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl capitalize font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid of Furniture Templates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1 py-2">
              {filteredTemplates.map((tmpl) => (
                <div
                  key={tmpl.type}
                  className="p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                        {tmpl.category}
                      </span>
                      {tmpl.defaultColor && (
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: tmpl.defaultColor }}
                        />
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100 mb-1">
                      {tmpl.name}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {tmpl.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      store.addFurniture(tmpl.type);
                      setIsCatalogOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Place in Room</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Custom GLB URL section */}
            <div className="pt-4 border-t border-slate-800">
              <form onSubmit={handleAddCustomModel} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste direct GLB or GLTF model URL..."
                  value={customGlbUrl}
                  onChange={(e) => setCustomGlbUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!customGlbUrl.trim()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-semibold text-sky-400 flex items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Load GLB</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
