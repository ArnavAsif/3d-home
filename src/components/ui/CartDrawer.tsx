'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart, cartService } from '@/services/cartService';
import {
  X,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export function CartDrawer() {
  const { items, subtotal, totalItems, isOpen } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      setTimeout(() => {
        cartService.clearCart();
        setOrderComplete(false);
        cartService.closeCart();
      }, 2500);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm select-none animate-in fade-in duration-200"
      onClick={() => cartService.closeCart()}
    >
      <div
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Your Shopping Cart</h3>
              <p className="text-xs text-slate-400">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in showroom cart
              </p>
            </div>
          </div>

          <button
            onClick={() => cartService.closeCart()}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body: Item List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {orderComplete ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
              <h4 className="text-lg font-bold text-white">Order Confirmed!</h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Thank you for purchasing the Handcrafted Motorcycle Helmet Hanger. Your order has been registered in the showroom service.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
              <ShoppingBag className="w-12 h-12 stroke-1" />
              <p className="text-sm">Your showroom cart is empty</p>
              <button
                onClick={() => cartService.closeCart()}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-sky-400 hover:bg-slate-700"
              >
                Explore Room
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.variantId}
                className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 flex gap-3.5 items-center justify-between"
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-700">
                  <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate mb-0.5">
                    {item.title}
                  </h4>
                  <div className="text-[11px] text-sky-400 font-medium mb-1 truncate">
                    {item.variantName}
                  </div>
                  <div className="text-xs font-mono font-black text-slate-200">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => cartService.removeItem(item.variantId)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center border border-slate-700 rounded-lg bg-slate-800">
                    <button
                      onClick={() => cartService.updateQuantity(item.variantId, item.quantity - 1)}
                      className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded-l-lg"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-mono font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => cartService.updateQuantity(item.variantId, item.quantity + 1)}
                      className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded-r-lg"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer: Subtotal & Checkout */}
        {items.length > 0 && !orderComplete && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/40 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-white font-bold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Total</span>
                <span className="font-mono text-sky-400 text-base">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-sky-500/25 transition-all disabled:opacity-50"
            >
              {isCheckingOut ? (
                <span>Processing Checkout...</span>
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Integrated Local Cart Service • Ready for Shopify Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
