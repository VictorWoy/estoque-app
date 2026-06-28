export type MovementType = 'in' | 'out';

export interface Product {
  id: string;
  name: string;
  quantity: number;
  minStock: number | null;
  createdAt: string;
}

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  balanceAfter: number;
  createdAt: string;
}
