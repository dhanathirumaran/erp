import { useState } from 'react';
import { Plus, AlertCircle, Pencil, Trash2, X, Check, Search } from 'lucide-react';
import { Contact } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Table } from './ui/Table';
import { FormField } from './ui/Form';
import { formatDate } from '@/lib/utils';
import PageTitle from './common/PageTitle';

interface ContactsProps {
  contacts: Contact[];
  onUpdate: (contacts: Contact[]) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  gstn?: string;
}

const Contacts = ({ contacts, onUpdate }: ContactsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'customer' | 'supplier' | 'employee'>('all');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const [newContact, setNewContact] = useState({
    name: '',
    type: 'customer' as const,
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    gstn: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!newContact.name.trim()) newErrors.name = 'Name is required';
    if (!newContact.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newContact.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!newContact.phone.trim()) newErrors.phone = 'Phone is required';
    if (!newContact.address.trim()) newErrors.address = 'Address is required';
    if (!newContact.city.trim()) newErrors.city = 'City is required';
    if (!newContact.state.trim()) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingContact) {
      onUpdate(
        contacts.map(c => 
          c.id === editingContact.id 
            ? { ...editingContact, ...newContact } 
            : c
        )
      );
    } else {
      const contact: Contact = {
        id: Date.now().toString(),
        ...newContact,
        dateAdded: new Date().toISOString()
      };
      onUpdate([...contacts, contact]);
    }

    resetForm();
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setNewContact({
      name: contact.name,
      type: contact.type,
      email: contact.email,
      phone: contact.phone,
      address: contact.address,
      city: contact.city,
      state: contact.state,
      gstn: contact.gstn || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      onUpdate(contacts.filter(c => c.id !== id));
    }
  };

  const resetForm = () => {
    setNewContact({
      name: '',
      type: 'customer',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      gstn: ''
    });
    setErrors({});
    setShowForm(false);
    setEditingContact(null);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesType = filter === 'all' ? true : contact.type === filter;
    
    if (!matchesType) return false;
    
    if (!searchQuery) return true;
    
    const search = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      contact.phone.toLowerCase().includes(search) ||
      contact.address.toLowerCase().includes(search) ||
      contact.city.toLowerCase().includes(search) ||
      contact.state.toLowerCase().includes(search) ||
      (contact.gstn || '').toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageTitle title="Contacts" />
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </Button>
      </div>

      <Card>
        <div className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">All Contacts</option>
              <option value="customer">Customers</option>
              <option value="supplier">Suppliers</option>
              <option value="employee">Employees</option>
            </Select>
          </div>

          <Table
            data={filteredContacts}
            columns={[
              { header: 'Name', accessor: 'name' },
              { 
                header: 'Type', 
                accessor: (contact) => contact.type.charAt(0).toUpperCase() + contact.type.slice(1)
              },
              { header: 'Email', accessor: 'email' },
              { header: 'Phone', accessor: 'phone' },
              { header: 'Address', accessor: 'address' },
              { header: 'City', accessor: 'city' },
              { header: 'State', accessor: 'state' },
              { header: 'GSTN', accessor: (contact) => contact.gstn || '-' },
              { 
                header: 'Date Added', 
                accessor: (contact) => formatDate(contact.dateAdded)
              },
              {
                header: 'Actions',
                accessor: (contact) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="text-blue-600 hover:text-blue-700"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              }
            ]}
          />
        </div>
      </Card>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {editingContact ? 'Edit Contact' : 'Add New Contact'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Name" error={errors.name}>
                  <Input
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    error={!!errors.name}
                  />
                </FormField>

                <FormField label="Type">
                  <Select
                    value={newContact.type}
                    onChange={(e) => setNewContact({ ...newContact, type: e.target.value as any })}
                  >
                    <option value="customer">Customer</option>
                    <option value="supplier">Supplier</option>
                    <option value="employee">Employee</option>
                  </Select>
                </FormField>

                <FormField label="Email" error={errors.email}>
                  <Input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    error={!!errors.email}
                  />
                </FormField>

                <FormField label="Phone" error={errors.phone}>
                  <Input
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    error={!!errors.phone}
                  />
                </FormField>

                <FormField label="Address" error={errors.address}>
                  <Input
                    value={newContact.address}
                    onChange={(e) => setNewContact({ ...newContact, address: e.target.value })}
                    error={!!errors.address}
                  />
                </FormField>

                <FormField label="City" error={errors.city}>
                  <Input
                    value={newContact.city}
                    onChange={(e) => setNewContact({ ...newContact, city: e.target.value })}
                    error={!!errors.city}
                  />
                </FormField>

                <FormField label="State" error={errors.state}>
                  <Input
                    value={newContact.state}
                    onChange={(e) => setNewContact({ ...newContact, state: e.target.value })}
                    error={!!errors.state}
                  />
                </FormField>

                <FormField label="GSTN" error={errors.gstn}>
                  <Input
                    value={newContact.gstn}
                    onChange={(e) => setNewContact({ ...newContact, gstn: e.target.value })}
                    error={!!errors.gstn}
                    placeholder="Optional"
                  />
                </FormField>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Contacts;