import { useState } from 'react';
import { Plus, Trash2, RotateCcw, Package } from 'lucide-react';
import { AppState, Transaction } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Table } from './ui/Table';
import { Select } from './ui/Select';
import { Input } from './ui/Input';
import SalesReturnForm from './SalesReturn';
import { formatDate, formatCurrency } from '@/lib/utils';
import PageTitle from './common/PageTitle';

interface SalesProps {
  state: AppState;
  onNewTransaction: (transaction: Transaction) => void;
  onSalesReturn: (salesReturn: SalesReturn) => void;
}

const Sales = ({ state, onNewTransaction, onSalesReturn }: SalesProps) => {
  const [showForm, setShowForm] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // New sale form state
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState<{
    productId: string;
    quantity: number;
    price: number;
  }[]>([]);
  const [errors, setErrors] = useState<{
    customer?: string;
    items?: string;
    general?: string;
  }>({});

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        productId: '',
        quantity: 1,
        price: 0
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof typeof items[0], value: string | number) => {
    setItems(items.map((item, i) => {
      if (i !== index) return item;

      const updatedItem = { ...item };
      if (field === 'productId') {
        const product = state.products.find(p => p.id === value);
        if (product) {
          updatedItem.price = product.salesPrice;
        }
        updatedItem.productId = value as string;
      } else {
        updatedItem[field] = typeof value === 'string' ? parseFloat(value) : value;
      }
      return updatedItem;
    }));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!customer) {
      newErrors.customer = 'Please select a customer';
    }

    if (items.length === 0) {
      newErrors.items = 'Please add at least one item';
    } else {
      const hasInvalidItems = items.some(
        item => !item.productId || item.quantity <= 0 || item.price <= 0
      );
      if (hasInvalidItems) {
        newErrors.items = 'Please fill all item details correctly';
      }

      // Check stock availability
      const stockError = items.some(item => {
        const product = state.products.find(p => p.id === item.productId);
        return product && item.quantity > product.stock;
      });

      if (stockError) {
        newErrors.items = 'Some items exceed available stock';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      contactId: customer,
      items,
      total: calculateTotal(),
    };

    onNewTransaction(transaction);
    resetForm();
  };

  const resetForm = () => {
    setCustomer('');
    setItems([]);
    setErrors({});
    setShowForm(false);
  };

  const handleReturnClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowReturnModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageTitle title="Sales" />
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowForm(true)}
        >
          New Sale
        </Button>
      </div>

      {showForm && (
        <Card>
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">New Sale</h2>
              <Button variant="secondary" onClick={resetForm}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <Select
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  error={!!errors.customer}
                >
                  <option value="">Select Customer</option>
                  {state.contacts
                    .filter((c) => c.type === 'customer')
                    .map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                </Select>
                {errors.customer && (
                  <p className="mt-1 text-sm text-red-600">{errors.customer}</p>
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
                    className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
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
                        {state.products
                          .filter(p => p.stock > 0)
                          .map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.stock} available)
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
                        Price
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(index, 'price', e.target.value)
                        }
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm text-gray-600 mb-1">
                        Total
                      </label>
                      <div className="p-2 bg-white border rounded-lg">
                        {formatCurrency(item.quantity * item.price)}
                      </div>
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
                  Create Sale
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
          <Table
            data={state.transactions}
            columns={[
              {
                header: 'Date',
                accessor: (transaction) => formatDate(transaction.date)
              },
              {
                header: 'Customer',
                accessor: (transaction) => {
                  const contact = state.contacts.find(c => c.id === transaction.contactId);
                  return contact?.name || 'Unknown';
                }
              },
              {
                header: 'Items',
                accessor: (transaction) => transaction.items.length
              },
              {
                header: 'Total',
                accessor: (transaction) => formatCurrency(transaction.total)
              },
              {
                header: 'Actions',
                accessor: (transaction) => (
                  <Button
                    variant="secondary"
                    onClick={() => handleReturnClick(transaction)}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Return
                  </Button>
                )
              }
            ]}
          />
        </div>
      </Card>

      {showReturnModal && selectedTransaction && (
        <SalesReturnForm
          transaction={selectedTransaction}
          onReturn={onSalesReturn}
          onClose={() => {
            setShowReturnModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}
    </div>
  );
};

export default Sales;