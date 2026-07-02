import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      // 1. THE CENTRAL DATA CHANNELS
      cart: [], // The bare-bones array tracking only [{ id, quantity }]
      isCartSidebarOpen: false, // The visibility toggle shared across screens

      // 2. GLOBAL OVERLAY ACTIONS (VISIBILITY CONTROL)
      toggleCartSidebar: () => set({ isCartSidebarOpen: !get().isCartSidebarOpen }),
      openCartSidebar: () => set({ isCartSidebarOpen: true }),
      closeCartSidebar: () => set({ isCartSidebarOpen: false }),

      // 3. CORE QUANTITY MANIPULATION UTILITIES
      
      // Add Item Action: Used by ProductGrid or ProductDetails buttons
      addItem: (productId, initialQuantity = 1) => {
        const currentCart = get().cart;
        // TYPE-SAFE GUARD: Coerces both side-by-side identifiers into clean string blocks
        const existingItem = currentCart.find((item) => String(item.id) === String(productId));

        if (existingItem) {
          // If product is already in the cart, increment its quantity number safely
          set({
            cart: currentCart.map((item) =>
              String(item.id) === String(productId)
                ? { ...item, quantity: item.quantity + initialQuantity }
                : item
            ),
          });
        } else {
          // If it is a completely new item, append it cleanly to the ledger array
          set({ cart: [...currentCart, { id: productId, quantity: initialQuantity }] });
        }
      },

      // Update Quantity Action: Used by the adjustment steppers inside CartItemCard
      updateQuantity: (productId, targetQuantity) => {
        // Guardrail Rule: If quantity drops to or below zero, evict the item row entirely
        if (targetQuantity <= 0) {
          return get().removeItem(productId);
        }
        
        set({
          cart: get().cart.map((item) =>
            String(item.id) === String(productId) ? { ...item, quantity: targetQuantity } : item
          ),
        });
      },

      // Remove Item Action: Used by the quick-eviction trash icon buttons
      removeItem: (productId) => {
        // Filter out the selected item row cleanly regardless of incoming primitive variations
        set({ cart: get().cart.filter((item) => String(item.id) !== String(productId)) });
      },

      // Clear Cart Action: Used to wipe memory blocks following a successful purchase
      clearCart: () => set({ cart: [] }),
    }),
    {
      // 4. AUTOMATED PERSISTENCE CONTEXT
      name: 'digital-store-cart-vault', // Unique index key used inside browser storage
    }
  )
);
