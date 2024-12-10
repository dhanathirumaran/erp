import { LayoutDashboard, Package, ShoppingCart, TrendingUp, Users, FileText, CalendarCheck } from 'lucide-react';

export const NAVIGATION_LINKS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/products", icon: Package, label: "Products" },
  { to: "/sales", icon: ShoppingCart, label: "Sales" },
  { to: "/purchases", icon: TrendingUp, label: "Purchases" },
  { to: "/quotations", icon: FileText, label: "Quotations" },
  { to: "/contacts", icon: Users, label: "Contacts" },
  { to: "/attendance", icon: CalendarCheck, label: "Attendance" },
];

export const APP_NAME = "SimplERP";