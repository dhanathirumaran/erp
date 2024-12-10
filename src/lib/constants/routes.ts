import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  FileText, 
  CalendarCheck 
} from 'lucide-react';

export const ROUTES = {
  dashboard: {
    path: '/',
    icon: LayoutDashboard,
    label: 'Dashboard'
  },
  products: {
    path: '/products',
    icon: Package,
    label: 'Products'
  },
  sales: {
    path: '/sales',
    icon: ShoppingCart,
    label: 'Sales'
  },
  purchases: {
    path: '/purchases',
    icon: TrendingUp,
    label: 'Purchases'
  },
  quotations: {
    path: '/quotations',
    icon: FileText,
    label: 'Quotations'
  },
  contacts: {
    path: '/contacts',
    icon: Users,
    label: 'Contacts'
  },
  attendance: {
    path: '/attendance',
    icon: CalendarCheck,
    label: 'Attendance'
  }
} as const;