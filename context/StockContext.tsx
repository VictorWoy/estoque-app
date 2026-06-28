import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Product, Movement, MovementType } from '../types';
import { StorageService } from '../services/storage';
import { NotificationService } from '../services/notifications';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

interface StockContextValue {
  products: Product[];
  movements: Movement[];
  loading: boolean;
  addProduct: (name: string, quantity: number, minStock: number | null) => Promise<void>;
  updateProduct: (id: string, name: string, quantity: number, minStock: number | null) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  registerMovement: (productId: string, type: MovementType, quantity: number) => Promise<{ success: boolean; error?: string }>;
  getProductMovements: (productId: string) => Movement[];
  lowStockProducts: Product[];
  reload: () => Promise<void>;
}

const StockContext = createContext<StockContextValue | null>(null);

export function StockProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [p, m] = await Promise.all([
      StorageService.getProducts(),
      StorageService.getMovements(),
    ]);
    setProducts(p);
    setMovements(m);
    setLoading(false);
  }, []);

  useEffect(() => {
    NotificationService.requestPermissions();
    load();
  }, [load]);

  const addProduct = useCallback(async (
    name: string,
    quantity: number,
    minStock: number | null,
  ) => {
    const product: Product = {
      id: generateId(),
      name: name.trim(),
      quantity,
      minStock,
      createdAt: new Date().toISOString(),
    };

    const updated = [product, ...products];
    setProducts(updated);
    await StorageService.saveProducts(updated);

    if (quantity > 0) {
      const movement: Movement = {
        id: generateId(),
        productId: product.id,
        productName: product.name,
        type: 'in',
        quantity,
        balanceAfter: quantity,
        createdAt: new Date().toISOString(),
      };
      const updatedMovements = [movement, ...movements];
      setMovements(updatedMovements);
      await StorageService.saveMovements(updatedMovements);
    }

    await NotificationService.checkAndNotify(product);
  }, [products, movements]);

  const updateProduct = useCallback(async (
    id: string,
    name: string,
    quantity: number,
    minStock: number | null,
  ) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, name: name.trim(), quantity, minStock } : p
    );
    setProducts(updated);
    await StorageService.saveProducts(updated);

    const product = updated.find(p => p.id === id);
    if (product) await NotificationService.checkAndNotify(product);
  }, [products]);

  const deleteProduct = useCallback(async (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    await StorageService.saveProducts(updated);
  }, [products]);

  const registerMovement = useCallback(async (
    productId: string,
    type: MovementType,
    quantity: number,
  ): Promise<{ success: boolean; error?: string }> => {
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, error: 'Produto não encontrado.' };

    if (type === 'out' && quantity > product.quantity) {
      return {
        success: false,
        error: `Quantidade insuficiente. Saldo atual: ${product.quantity} un.`,
      };
    }

    const newQty = type === 'in'
      ? product.quantity + quantity
      : product.quantity - quantity;

    const updatedProduct = { ...product, quantity: newQty };

    const updatedProducts = products.map(p =>
      p.id === productId ? updatedProduct : p
    );
    setProducts(updatedProducts);
    await StorageService.saveProducts(updatedProducts);

    const movement: Movement = {
      id: generateId(),
      productId,
      productName: product.name,
      type,
      quantity,
      balanceAfter: newQty,
      createdAt: new Date().toISOString(),
    };

    const updatedMovements = [movement, ...movements];
    setMovements(updatedMovements);
    await StorageService.saveMovements(updatedMovements);

    await NotificationService.checkAndNotify(updatedProduct);

    return { success: true };
  }, [products, movements]);

  const getProductMovements = useCallback((productId: string) =>
    movements.filter(m => m.productId === productId),
  [movements]);

  const lowStockProducts = products.filter(
    p => p.minStock !== null && p.quantity <= p.minStock
  );

  return (
    <StockContext.Provider value={{
      products,
      movements,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      registerMovement,
      getProductMovements,
      lowStockProducts,
      reload: load,
    }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStock(): StockContextValue {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error('useStock must be used inside StockProvider');
  return ctx;
}
