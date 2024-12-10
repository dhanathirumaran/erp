import { useState } from 'react';
import { Plus, Trash2, RotateCcw, Package } from 'lucide-react';
import { AppState, Purchase } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Table } from './ui/Table';
import { Select } from './ui/Select';
import { Input } from './ui/Input';
import PurchaseReturnForm from './PurchaseReturn';
import { formatDate, formatCurrency } from '@/lib/utils';
import PageTitle from './common/PageTitle';

interface PurchasesProps {
  state: AppState;
  onNewPurchase: (purchase: Purchase) => void;
  onPurchaseReturn: (purchaseReturn: PurchaseReturn) => void;
}

interface PurchaseItem {
  productId: string;
  quantity: number;
  costPrice: number;
  priceUpdates?: {
    mrp?: number;
    salesPrice?: number;
  };
}

const Purchases = ({ state, onNewPurchase, onPurchaseReturn }: PurchasesProps) => {
  const [showForm, setShowForm] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  // New purchase form state
  const [supplier, setSupplier] = useState('');
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [errors, setErrors] = useState<{
    supplier?: string;
    items?: string;
    general?: string;
  }>({});

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        productId: '',
        quantity: 1,
        costPrice: 0,
        priceUpdates: {
          mrp: undefined,
          salesPrice: undefined,
        },
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof PurchaseItem | 'mrp' | 'salesPrice', value: string | number) => {
    setItems(items.map((item, i) => {
      if (i !== index) return item;

      if (field === 'mrp' || field === 'salesPrice') {
        return {
          ...item,
          priceUpdates: {
            ...item.priceUpdates,
            [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
          },
        };
      }

      return {
        ...item,
        [field]: typeof value === 'string' ? 
          (field === 'productId' ? value : parseFloat(value) || 0) : 
          value,
      };
    }));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!supplier) {
      newErrors.supplier = 'Please select a supplier';
    }

    if (items.length === 0) {
      newErrors.items = 'Please add at least one item';
    } else {
      const hasInvalidItems = items.some(
        item => !item.productId || item.quantity <= 0 || item.costPrice <= 0
      );
      if (hasInvalidItems) {
        newErrors.items = 'Please fill all item details correctly';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const purchase: Purchase = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      contactId: supplier,
      items,
      total: calculateTotal(),
    };

    onNewPurchase(purchase);
    resetForm();
  };

  const resetForm = () => {
    setSupplier('');
    setItems([]);
    setErrors({});
    setShowForm(false);
  };

  const handleReturnClick = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setShowReturnModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageTitle title="Purchases" />
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowForm(true)}
        >
          New Purchase
        </Button>
      </div>

      {showForm && (
        <Card>
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">New Purchase</h2>
              <Button variant="secondary" onClick={resetForm}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier
                </label>
                <Select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  error={!!errors.supplier}
                >
                  <option value="">Select Supplier</option>
                  {state.contacts
                    .filter((c) => c.type === 'supplier')
                    .map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                </Select>
                {errors.supplier && (
                  <p className="mt-1 text-sm text-red-600">{errors.supplier}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Items
                  </label>
                  <Button
                    variant="secondary"
                    onClick={handleAddItem}
                    icon={Plus}
                  >
                    Add Item
                  </Button>
                </div>
                {errors.items && (
                  <p className="mb-2 text-sm text-red-600">{errors.items}</p>
                )}
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-6 gap-4 mb-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">
                        Product
                      </label>
                      <Select
                        value={item.productId}
                        onChange={(e) =>
                          handleItemChange(index, 'productId', e.target.value)
                        }
                        icon={Package}
                      >
                        <option value="">Select Product</option>
                        {state.products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Quantity
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, 'quantity', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Cost Price
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.costPrice}
                        onChange={(e) =>
                          handleItemChange(index, 'costPrice', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        New MRP
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.priceUpdates?.mrp || ''}
                        onChange={(e) =>
                          handleItemChange(index, 'mrp', e.target.value)
                        }
                        placeholder="Optional"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm text-gray-600 mb-1">
                        New Sales Price
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.priceUpdates?.salesPrice || ''}
                        onChange={(e) =>
                          handleItemChange(index, 'salesPrice', e.target.value)
                        }
                        placeholder="Optional"
                      />
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="absolute right-0 top-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-xl font-bold">
                Total: {formatCurrency(calculateTotal())}
              </div>
              <div className="space-x-4">
                <Button variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={items.length === 0}
                >
                  Create Purchase
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Purchases</h2>
          <Table
            data={state.purchases}
            columns={[
              {
                header: 'Date',
                accessor: (purchase) => formatDate(purchase.date),
              },
              {
                header: 'Supplier',
                accessor: (purchase) => {
                  const contact = state.contacts.find(
                    (c) => c.id === purchase.contactId
                  );
                  return contact?.name || 'Unknown';
                },
              },
              {
                header: 'Items',
                accessor: (purchase) => purchase.items.length,
              },
              {
                header: 'Total',
                accessor: (purchase) => formatCurrency(purchase.total),
              },
              {
                header: 'Actions',
                accessor: (purchase) => (
                  <Button
                    variant="secondary"
                    onClick={() => handleReturnClick(purchase)}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Return
                  </Button>
                ),
              },
            ]}
          />
        </div>
      </Card>

      {showReturnModal && selectedPurchase && (
        <PurchaseReturnForm
          purchase={selectedPurchase}
          onReturn={onPurchaseReturn}
          onClose={() => {
            setShowReturnModal(false);
            setSelectedPurchase(null);
          }}
        />
      )}
    </div>
  );
};

export default Purchases;