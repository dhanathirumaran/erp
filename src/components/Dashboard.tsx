import { AppState } from '../types';
import { Users, Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  state: AppState;
}

const Dashboard = ({ state }: DashboardProps) => {
  const totalProducts = state.products.length;
  const totalSales = state.transactions.reduce((sum, t) => sum + t.total, 0);
  const totalPurchases = state.purchases.reduce((sum, p) => sum + p.total, 0);
  const lowStock = state.products.filter(p => p.stock < 5).length;
  const totalContacts = state.contacts.length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalProducts}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
            <ShoppingCart className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalSales.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Total Purchases</h3>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalPurchases.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Low Stock Items</h3>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">{lowStock}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Total Contacts</h3>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalContacts}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;