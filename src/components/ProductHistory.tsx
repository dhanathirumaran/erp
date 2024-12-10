import { X } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { Product } from '../types';
import { formatDate } from '../utils/dateFormatter';

interface ProductHistoryProps {
  product: Product;
  onClose: () => void;
}

const ProductHistory = ({ product, onClose }: ProductHistoryProps) => {
  const { state } = useAppState();

  // Get all purchases related to this product
  const productPurchases = state.purchases
    .filter(purchase => 
      purchase.items.some(item => item.productId === product.id)
    )
    .map(purchase => ({
      ...purchase,
      contact: state.contacts.find(c => c.id === purchase.contactId),
      item: purchase.items.find(item => item.productId === product.id)!
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatPrice = (price: number | undefined) => 
    price !== undefined ? `₹${price}` : 'No change';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Purchase History: {product.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Product Details</h3>
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Brand</p>
                <p className="font-medium">{product.brand}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Art</p>
                <p className="font-medium">{product.art}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Design</p>
                <p className="font-medium">{product.design}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Stock</p>
                <p className="font-medium">{product.stock} {product.uom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Purchase Price</p>
                <p className="font-medium">₹{product.purchasePrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Sales Price</p>
                <p className="font-medium">₹{product.salesPrice}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Purchase History</h3>
            {productPurchases.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MRP</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {productPurchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatDate(purchase.date)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {purchase.contact?.name || 'Unknown Supplier'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {purchase.item.quantity} {product.uom}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          ₹{purchase.item.costPrice}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatPrice(purchase.item.priceUpdates?.mrp)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatPrice(purchase.item.priceUpdates?.salesPrice)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          ₹{(purchase.item.quantity * purchase.item.costPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No purchase history found for this product.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHistory;