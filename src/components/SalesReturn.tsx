import { useState } from 'react';
import { Package, X } from 'lucide-react';
import { Transaction, SalesReturn } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Table } from './ui/Table';
import { formatDate } from '@/lib/utils';

interface SalesReturnFormProps {
  transaction: Transaction;
  onReturn: (salesReturn: SalesReturn) => void;
  onClose: () => void;
}

const SalesReturnForm = ({ transaction, onReturn, onClose }: SalesReturnFormProps) => {
  const [items, setItems] = useState(
    transaction.items.map(item => ({
      ...item,
      returnQuantity: 0,
      reason: ''
    }))
  );

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity < 0 || quantity > items[index].quantity) return;
    
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, returnQuantity: quantity } : item
    ));
  };

  const handleReasonChange = (index: number, reason: string) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, reason } : item
    ));
  };

  const handleSubmit = () => {
    const returnItems = items.filter(item => item.returnQuantity > 0);
    if (returnItems.length === 0) return;

    const salesReturn: SalesReturn = {
      id: Date.now().toString(),
      type: 'sales',
      date: new Date().toISOString(),
      originalId: transaction.id,
      contactId: transaction.contactId,
      items: returnItems.map(item => ({
        productId: item.productId,
        quantity: item.returnQuantity,
        price: item.price,
        reason: item.reason
      })),
      total: returnItems.reduce((sum, item) => sum + (item.returnQuantity * item.price), 0)
    };

    onReturn(salesReturn);
    onClose();
  };

  const isValid = items.some(item => item.returnQuantity > 0 && item.reason);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Process Sales Return</h2>
              <p className="text-sm text-gray-500">
                Transaction Date: {formatDate(transaction.date)}
              </p>
            </div>
            <Button variant="secondary" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <Table
            data={items}
            columns={[
              {
                header: 'Product',
                accessor: (item) => (
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>{item.productId}</span>
                  </div>
                )
              },
              {
                header: 'Original Qty',
                accessor: 'quantity'
              },
              {
                header: 'Return Qty',
                accessor: (item) => (
                  <Input
                    type="number"
                    min={0}
                    max={item.quantity}
                    value={item.returnQuantity}
                    onChange={(e) => handleQuantityChange(
                      items.indexOf(item),
                      parseInt(e.target.value)
                    )}
                  />
                )
              },
              {
                header: 'Price',
                accessor: (item) => `₹${item.price}`
              },
              {
                header: 'Return Amount',
                accessor: (item) => `₹${item.returnQuantity * item.price}`
              },
              {
                header: 'Reason',
                accessor: (item) => (
                  <Select
                    value={item.reason}
                    onChange={(e) => handleReasonChange(
                      items.indexOf(item),
                      e.target.value
                    )}
                  >
                    <option value="">Select reason</option>
                    <option value="defective">Defective Product</option>
                    <option value="wrong_item">Wrong Item</option>
                    <option value="size_issue">Size/Fit Issue</option>
                    <option value="quality_issue">Quality Issue</option>
                    <option value="other">Other</option>
                  </Select>
                )
              }
            ]}
          />

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-xl font-bold">
              Total Return Amount: ₹
              {items.reduce((sum, item) => sum + (item.returnQuantity * item.price), 0)}
            </div>
            <div className="space-x-4">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={!isValid}
                onClick={handleSubmit}
              >
                Process Return
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SalesReturnForm;