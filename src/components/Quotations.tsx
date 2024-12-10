import { useState } from 'react';
import { Plus, Trash2, FileText, Send, Check, X, Pencil } from 'lucide-react';
import { AppState, Quotation } from '../types';
import { formatDate } from '../utils/dateFormatter';
import Card from './common/Card';
import PageTitle from './common/PageTitle';

interface QuotationsProps {
  state: AppState;
  onNewQuotation: (quotation: Quotation) => void;
  onUpdateQuotation: (quotationId: string, updates: Partial<Quotation>) => void;
}

const Quotations = ({ state, onNewQuotation, onUpdateQuotation }: QuotationsProps) => {
  const [items, setItems] = useState<{
    productId: string;
    quantity: number;
    price: number;
  }[]>([]);
  const [contactId, setContactId] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);

  const handleAddItem = (productId: string) => {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    setItems([
      ...items,
      {
        productId,
        quantity: 1,
        price: product.price
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity < 1) return;

    setItems(items.map((item, i) => 
      i === index ? {...item, quantity} : item
    ));
  };

  const handlePriceChange = (index: number, price: number) => {
    if (price < 0) return;

    setItems(items.map((item, i) => 
      i === index ? {...item, price} : item
    ));
  };

  const handleEdit = (quotation: Quotation) => {
    setEditingQuotation(quotation);
    setItems(quotation.items);
    setContactId(quotation.contactId);
    setValidUntil(quotation.validUntil);
    setNotes(quotation.notes || '');
    setShowForm(true);
  };

  const handleSave = (status: 'draft' | 'sent') => {
    if (items.length === 0 || !contactId || !validUntil) return;

    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    if (editingQuotation) {
      onUpdateQuotation(editingQuotation.id, {
        contactId,
        validUntil,
        status,
        items,
        total,
        notes: notes.trim() || undefined
      });
    } else {
      const quotation: Quotation = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        contactId,
        validUntil,
        status,
        items,
        total,
        notes: notes.trim() || undefined
      };
      onNewQuotation(quotation);
    }
    resetForm();
  };

  const resetForm = () => {
    setItems([]);
    setContactId('');
    setValidUntil('');
    setNotes('');
    setShowForm(false);
    setEditingQuotation(null);
  };

  const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const getStatusBadgeClass = (status: Quotation['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageTitle title="Quotations" />
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Quotation
        </button>
      </div>

      {showForm && (
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Customer</label>
              <select
                className="w-full rounded-lg border p-2"
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
              >
                <option value="">Select Customer</option>
                {state.contacts
                  .filter(c => c.type === 'customer')
                  .map(contact => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name}
                    </option>
                  ))
                }
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Valid Until</label>
              <input
                type="date"
                className="w-full rounded-lg border p-2"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Products</label>
            <select
              className="w-full rounded-lg border p-2"
              onChange={(e) => handleAddItem(e.target.value)}
              value=""
            >
              <option value="">Add Product</option>
              {state.products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} (₹{product.price})
                </option>
              ))}
            </select>
          </div>

          {items.length > 0 && (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Quantity</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Total</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item, index) => {
                  const product = state.products.find(p => p.id === item.productId)!;
                  return (
                    <tr key={index}>
                      <td className="p-4">{product.name}</td>
                      <td className="p-4">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                          className="w-20 rounded-lg border p-2"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handlePriceChange(index, parseFloat(e.target.value))}
                          className="w-24 rounded-lg border p-2"
                        />
                      </td>
                      <td className="p-4">₹{(item.quantity * item.price).toFixed(2)}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div>
            <label className="block text-sm text-gray-600 mb-1">Notes</label>
            <textarea
              className="w-full rounded-lg border p-2"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or terms..."
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-xl font-bold">
              Total: ₹{total.toFixed(2)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave('draft')}
                disabled={items.length === 0 || !contactId || !validUntil}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <FileText className="w-4 h-4" />
                Save as Draft
              </button>
              <button
                onClick={() => handleSave('sent')}
                disabled={items.length === 0 || !contactId || !validUntil}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {editingQuotation ? 'Update and Send' : 'Create and Send'}
              </button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Valid Until</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {state.quotations.map((quotation) => {
                const contact = state.contacts.find(c => c.id === quotation.contactId);
                return (
                  <tr key={quotation.id} className="hover:bg-gray-50">
                    <td className="p-4">{formatDate(quotation.date)}</td>
                    <td className="p-4">{contact?.name}</td>
                    <td className="p-4">{new Date(quotation.validUntil).toLocaleDateString()}</td>
                    <td className="p-4">₹{quotation.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(quotation.status)}`}>
                        {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(quotation)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {quotation.status === 'draft' && (
                          <button
                            onClick={() => onUpdateQuotation(quotation.id, { status: 'sent' })}
                            className="text-green-600 hover:text-green-700"
                            title="Send"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {state.quotations.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No quotations found. Create your first quotation using the button above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Quotations;