// -----------------------------------------------------------------------------
// Types for the Admin Panel – matches the Go backend models.
// -----------------------------------------------------------------------------

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export interface Address {
  id: number;
  user_id: number;
  street: string;
  city: string;
  state: string;
  zip: string;
  is_default: boolean;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  user_id: number;
  address_id: number;
  total_price: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  created_at: string;
  order_items?: OrderItem[];
  user?: User; // populated when fetching detailed order
  address?: Address;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
}