import { LayoutDashboard, Package, ShoppingCart, TrendingUp, Users, FileText } from 'lucide-react';

export const APP_NAME = "SimplERP";

export const NAVIGATION = {
  links: [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/products", icon: Package, label: "Products" },
    { to: "/sales", icon: ShoppingCart, label: "Sales" },
    { to: "/purchases", icon: TrendingUp, label: "Purchases" },
    { to: "/quotations", icon: FileText, label: "Quotations" },
    { to: "/contacts", icon: Users, label: "Contacts" },
  ],
  sidebar: {
    width: 'w-64',
    bgColor: 'bg-white',
    borderColor: 'border-gray-200'
  }
} as const;

export const STATUS_STYLES = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
} as const;