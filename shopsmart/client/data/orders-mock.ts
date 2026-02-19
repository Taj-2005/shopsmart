export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress?: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-001",
    userId: "1",
    status: "delivered",
    items: [
      { productId: "1", name: "Wireless Over-Ear Headphones", quantity: 1, price: 4999, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" },
    ],
    subtotal: 4999,
    discount: 500,
    shipping: 99,
    total: 4598,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-20T14:00:00Z",
    shippingAddress: "123 Main St, City, PIN 110001",
  },
  {
    id: "ORD-002",
    userId: "1",
    status: "shipped",
    items: [
      { productId: "2", name: "Minimalist Running Shoes", quantity: 2, price: 6499, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop" },
    ],
    subtotal: 12998,
    discount: 0,
    shipping: 0,
    total: 12998,
    createdAt: "2025-01-22T09:00:00Z",
    updatedAt: "2025-01-24T11:00:00Z",
    shippingAddress: "123 Main St, City, PIN 110001",
  },
  {
    id: "ORD-003",
    userId: "1",
    status: "pending",
    items: [
      { productId: "3", name: "Ceramic Table Lamp", quantity: 1, price: 2299, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&h=100&fit=crop" },
    ],
    subtotal: 2299,
    discount: 0,
    shipping: 99,
    total: 2398,
    createdAt: "2025-01-28T08:00:00Z",
    updatedAt: "2025-01-28T08:00:00Z",
  },
];

export function getOrdersByUserId(userId: string): Order[] {
  return MOCK_ORDERS.filter((o) => o.userId === userId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrderById(orderId: string): Order | undefined {
  return MOCK_ORDERS.find((o) => o.id === orderId);
}
