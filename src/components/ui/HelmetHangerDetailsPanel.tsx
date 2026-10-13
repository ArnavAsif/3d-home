'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore, store } from '@/state/useStore';
import { HELMET_HANGER_PRODUCT, ProductVariant } from '@/config/productData';
import { cartService } from '@/services/cartService';
import {
  X,
  Star,
  Check,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Minus,
  Plus,
  Flame,
  Award
} from 'lucide-react';

export function HelmetHangerDetailsPanel() {
  const { isProductPanelOpen, selectedVariantId, selectedQuantity } = useStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  if (!isProductPanelOpen) return null;

  const currentVariant: ProductVariant =
    HELMET_HANGER_PRODUCT.variants.find(v => v.id === selectedVariantId) ||
    HELMET_HANGER_PRODUCT.variants[0];

  const handleClose = () => {
    store.closeProductPanel();
  };

  const handleAddToCart = () => {
    cartService.addItem(
      HELMET_HANGER_PRODUCT,
      currentVariant,
      selectedQuantity
    );
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 select-none animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative max-w-4xl w-full bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Close (ESC)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Product Image Gallery */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-slate-950/50 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-800/80">
          <div className="w-full flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Featured Showroom Product
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-semibold">
              <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Popular
            </span>
          </div>

          {/* Main Product Image Container */}
          <div className="relative w-full aspect-[3/4] max-h-[380px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center group shadow-xl">
            <Image
              src={HELMET_HANGER_PRODUCT.images[activeImageIndex] || '/images/helmet-hanger.jpg'}
              alt={HELMET_HANGER_PRODUCT.title}
              fill
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>

          {/* Thumbnail preview list */}
          <div className="w-full flex items-center justify-center gap-2 mt-4">
            {HELMET_HANGER_PRODUCT.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`relative w-12 h-14 rounded-lg overflow-hidden border transition-all ${
                  activeImageIndex === i
                    ? 'border-sky-400 ring-2 ring-sky-400/30'
                    : 'border-slate-800 hover:border-slate-700 opacity-70'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>

          <div className="w-full mt-4 flex items-center justify-around text-[11px] text-slate-400 border-t border-slate-800/60 pt-3">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-sky-400" /> Free Global Shipping
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Lifetime Warranty
            </span>
          </div>
        </div>

        {/* Right Column: Product Information & Purchase Controls */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-300">
                {HELMET_HANGER_PRODUCT.rating}
              </span>
              <span className="text-xs text-slate-500">
                ({HELMET_HANGER_PRODUCT.reviewCount} customer reviews)
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mb-2">
              {HELMET_HANGER_PRODUCT.title}
            </h2>

            {/* Price Badge */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-black text-sky-400 font-mono">
                ${currentVariant.price.toFixed(2)}
              </span>
              {currentVariant.compareAtPrice && (
                <span className="text-sm text-slate-500 line-through font-mono">
                  ${currentVariant.compareAtPrice.toFixed(2)}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                Save ${(currentVariant.compareAtPrice - currentVariant.price).toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              {HELMET_HANGER_PRODUCT.description}
            </p>

            {/* Variant / Finish Options */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Selected Style & Emblem:</span>
                <span className="text-sky-400">{currentVariant.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {HELMET_HANGER_PRODUCT.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => store.setSelectedVariant(variant.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      variant.id === currentVariant.id
                        ? 'bg-sky-500/15 border-sky-400 text-white shadow-sm'
                        : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold leading-tight">
                        {variant.badge}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {variant.woodFinish}
                      </div>
                    </div>
                    {variant.id === currentVariant.id && (
                      <Check className="w-4 h-4 text-sky-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Stock Status */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">Quantity:</span>
                <div className="flex items-center border border-slate-700 rounded-xl bg-slate-800/80">
                  <button
                    onClick={() => store.setSelectedQuantity(selectedQuantity - 1)}
                    disabled={selectedQuantity <= 1}
                    className="p-1.5 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-l-xl"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold text-white">
                    {selectedQuantity}
                  </span>
                  <button
                    onClick={() => store.setSelectedQuantity(selectedQuantity + 1)}
                    className="p-1.5 hover:bg-slate-700 text-slate-300 rounded-r-xl"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>In Stock — Ready to ship</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl ${
                isAddedFeedback
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isAddedFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    Add to Cart • ${(currentVariant.price * selectedQuantity).toFixed(2)}
                  </span>
                </>
              )}
            </button>

            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
            >
              Continue Exploring Showroom
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
