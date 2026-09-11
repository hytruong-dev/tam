export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPING" | "COMPLETED" | "CANCELLED";
export type PaymentMethod = "COD" | "BANK_TRANSFER" | "MOMO" | "VNPAY";

export interface OrderItem {
  productId: string;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory / Fallback Store for Orders
let MEMORY_ORDERS: Order[] = [
  {
    id: "ord-1",
    orderNumber: "TT-20260911-088",
    customerName: "Nguyễn Văn Minh",
    customerPhone: "0908889999",
    customerEmail: "minhnv@gmail.com",
    shippingAddress: "123 Quận 1, TP. Hồ Chí Minh",
    paymentMethod: "BANK_TRANSFER",
    orderStatus: "CONFIRMED",
    totalAmount: 3850000,
    items: [
      {
        productId: "p1",
        productName: "Mô Hình Monkey D. Luffy Gear 5 Sun God",
        imageUrl: "/images/luffy-gear5.png",
        price: 3850000,
        quantity: 1,
      },
    ],
    note: "Đóng gói bọc xốp kỹ giúp em!",
    createdAt: new Date("2026-09-10T10:00:00Z"),
    updatedAt: new Date("2026-09-10T10:00:00Z"),
  },
  {
    id: "ord-2",
    orderNumber: "TT-20260911-089",
    customerName: "Lê Hoàng Nam",
    customerPhone: "0912345678",
    customerEmail: "namlh@gmail.com",
    shippingAddress: "456 Cầu Giấy, Hà Nội",
    paymentMethod: "COD",
    orderStatus: "SHIPPING",
    totalAmount: 8200000,
    items: [
      {
        productId: "p2",
        productName: "Mô Hình Iron Man Mark 85 Diecast Hot Toys",
        imageUrl: "/images/ironman-mark85.png",
        price: 8200000,
        quantity: 1,
      },
    ],
    note: "Hàng Pre-order đợt 1",
    createdAt: new Date("2026-09-11T08:30:00Z"),
    updatedAt: new Date("2026-09-11T08:30:00Z"),
  },
];

export async function findAllOrders(options?: { status?: OrderStatus; search?: string }): Promise<Order[]> {
  let list = [...MEMORY_ORDERS];
  if (options?.status) {
    list = list.filter((o) => o.orderStatus === options.status);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
    );
  }
  return list;
}

export async function findOrderById(id: string): Promise<Order | null> {
  return MEMORY_ORDERS.find((o) => o.id === id || o.orderNumber === id) || null;
}

export async function createOrder(data: {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  note?: string;
}): Promise<Order> {
  const totalAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `TT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
      100 + Math.random() * 900
    )}`,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerEmail: data.customerEmail,
    shippingAddress: data.shippingAddress,
    paymentMethod: data.paymentMethod,
    orderStatus: "PENDING",
    totalAmount,
    items: data.items,
    note: data.note,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  MEMORY_ORDERS.unshift(newOrder);
  return newOrder;
}

export async function updateOrderStatus(id: string, orderStatus: OrderStatus): Promise<Order | null> {
  const order = MEMORY_ORDERS.find((o) => o.id === id);
  if (!order) return null;
  order.orderStatus = orderStatus;
  order.updatedAt = new Date();
  return order;
}
