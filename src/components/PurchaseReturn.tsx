import { useState } from 'react';
import { Package, X } from 'lucide-react';
import { Purchase, PurchaseReturn } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Table } from './ui/Table';
import { formatDate } from '@/lib/utils';

interface PurchaseReturnFormProps {
  purchase: Purchase;
  onReturn: (purchaseReturn: PurchaseReturn) => void;
  onClose: () => void;
}

const PurchaseReturnForm = ({ purchase, onReturn, onClose }: PurchaseReturnFormProps) => {
  const [items, setItems] = useState(
    purchase.items.map(item => ({
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

    const purchaseReturn: PurchaseReturn = {
      id: Date.now().toString(),
      type: 'purchase',
      date: new Date().toISOString(),
      originalId: purchase.id,
      contactId: purchase.contactId,
      items: returnItems.map(item => ({
        productId: item.productId,
        quantity: item.returnQuantity,
        price: item.costPrice,
        reason: item.reason
      })),
      total: returnItems.reduce((sum, item) => sum + (item.returnQuantity * item.costPrice), 0)
    };

    onReturn(purchaseReturn);
    onClose();
  };

  const isValid = items.some(item => item.returnQuantity > 0 && item.reason);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Process Purchase Return</h2>
              <p className="text-sm text-gray-500">
                Purchase Date: {formatDate(purchase.date)}
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
                header: 'Cost Price',
                accessor: (item) => `₹${item.costPrice}`
              },
              {
                header: 'Return Amount',
                accessor: (item) => `₹${item.returnQuantity * item.costPrice}`
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
                    <option value="wrong_item">Wrong Item Received</option>
                    <option value="quality_issue">Quality Issue</option>
                    <option value="damaged">Damaged in Transit</option>
                    <option value="other">Other</option>
                  </Select>
                )
              }
            ]}
          />

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-xl font-bold">
              Total Return Amount: ₹
              {items.reduce((sum, item) => sum + (item.returnQuantity * item.costPrice), 0)}
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

export default PurchaseReturnForm;