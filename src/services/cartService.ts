'use client';

import { useState, useEffect } from 'react';
import { ProductData, ProductVariant } from '@/config/productData';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  variantName: string;
  woodFinish: string;
  badge: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
  shopifyVariantId?: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  isOpen: boolean;
  lastAddedItem: CartItem | null;
}

const STORAGE_KEY = 'helmet_hanger_cart_v1';

let cartState: CartState = {
  items: [],
  subtotal: 0,
  totalItems: 0,
  isOpen: false,
  lastAddedItem: null
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

function calculateTotals(items: CartItem[]): { subtotal: number; totalItems: number } {
  let subtotal = 0;
  let totalItems = 0;
  for (const item of items) {
    subtotal += item.price * item.quantity;
    totalItems += item.quantity;
  }
  return { subtotal, totalItems };
}

function persistCart() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartState.items));
    } catch {
      // localStorage error fallback
    }
  }
}

export const cartService = {
  init: () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const items = JSON.parse(saved);
          const totals = calculateTotals(items);
          cartState = {
            ...cartState,
            items,
            ...totals
          };
          notify();
        }
      } catch {
        // Parse error fallback
      }
    }
  },

  getState: () => cartState,

  openCart: () => {
    cartState = { ...cartState, isOpen: true };
    notify();
  },

  closeCart: () => {
    cartState = { ...cartState, isOpen: false };
    notify();
  },

  toggleCart: () => {
    cartState = { ...cartState, isOpen: !cartState.isOpen };
    notify();
  },

  addItem: (product: ProductData, variant: ProductVariant, quantity: number = 1): CartItem => {
    const existingIndex = cartState.items.findIndex(
      item => item.productId === product.id && item.variantId === variant.id
    );

    let updatedItems: CartItem[];
    let addedItem: CartItem;

    if (existingIndex > -1) {
      updatedItems = cartState.items.map((item, idx) => {
        if (idx === existingIndex) {
          return {
            ...item,
            quantity: item.quantity + quantity
          };
        }
        return item;
      });
      addedItem = updatedItems[existingIndex];
    } else {
      addedItem = {
        id: `${product.id}_${variant.id}_${Date.now()}`,
        productId: product.id,
        variantId: variant.id,
        title: product.title,
        variantName: variant.name,
        woodFinish: variant.woodFinish,
        badge: variant.badge,
        price: variant.price,
        quantity,
        image: product.images[0],
        sku: variant.sku,
        shopifyVariantId: variant.shopifyVariantId
      };
      updatedItems = [...cartState.items, addedItem];
    }

    const totals = calculateTotals(updatedItems);
    cartState = {
      ...cartState,
      items: updatedItems,
      ...totals,
      isOpen: true, // Automatically open cart drawer to confirm addition
      lastAddedItem: addedItem
    };

    persistCart();
    notify();
    return addedItem;
  },

  updateQuantity: (variantId: string, quantity: number) => {
    let updatedItems: CartItem[];
    if (quantity <= 0) {
      updatedItems = cartState.items.filter(item => item.variantId !== variantId);
    } else {
      updatedItems = cartState.items.map(item =>
        item.variantId === variantId ? { ...item, quantity } : item
      );
    }

    const totals = calculateTotals(updatedItems);
    cartState = {
      ...cartState,
      items: updatedItems,
      ...totals
    };

    persistCart();
    notify();
  },

  removeItem: (variantId: string) => {
    const updatedItems = cartState.items.filter(item => item.variantId !== variantId);
    const totals = calculateTotals(updatedItems);
    cartState = {
      ...cartState,
      items: updatedItems,
      ...totals
    };

    persistCart();
    notify();
  },

  clearCart: () => {
    cartState = {
      ...cartState,
      items: [],
      subtotal: 0,
      totalItems: 0,
      lastAddedItem: null
    };

    persistCart();
    notify();
  }
};

export function useCart(): CartState {
  const [state, setState] = useState<CartState>(cartService.getState());

  useEffect(() => {
    cartService.init();
    const listener = () => setState(cartService.getState());
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return state;
}
