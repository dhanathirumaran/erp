import { useState } from 'react';
import { Plus, History, Pencil, Trash2, X, Search } from 'lucide-react';
import { Product } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Table } from './ui/Table';
import { FormField } from './ui/Form';
import ProductHistory from './ProductHistory';
import { formatCurrency } from '@/lib/utils';
import PageTitle from './common/PageTitle';

interface ProductsProps {
  products: Product[];
  onUpdate: (products: Product[]) => void;
}

const Products = ({ products, onUpdate }: ProductsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByStock, setFilterByStock] = useState<'all' | 'low'>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    brand: '',
    name: '',
    art: '',
    design: '',
    colour: '',
    uom: '',
    hsnCode: '',
    mrp: 0,
    salesPrice: 0,
    purchasePrice: 0,
    stock: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateProduct = (product: Omit<Product, 'id'>): boolean => {
    const newErrors: Record<string, string> = {};
    if (!product.brand) newErrors.brand = 'Brand is required';
    if (!product.name) newErrors.name = 'Name is required';
    if (!product.art) newErrors.art = 'Art is required';
    if (!product.design) newErrors.design = 'Design is required';
    if (!product.colour) newErrors.colour = 'Colour is required';
    if (!product.uom) newErrors.uom = 'UOM is required';
    if (!product.hsnCode) newErrors.hsnCode = 'HSN Code is required';
    if (product.mrp <= 0) newErrors.mrp = 'MRP must be greater than 0';
    if (product.salesPrice <= 0) newErrors.salesPrice = 'Sales Price must be greater than 0';
    if (product.purchasePrice <= 0) newErrors.purchasePrice = 'Purchase Price must be greater than 0';
    if (product.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (product.salesPrice > product.mrp) {
      newErrors.salesPrice = 'Sales Price cannot exceed MRP';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    const productToValidate = editingProduct || newProduct;
    if (!validateProduct(productToValidate)) return;

    if (editingProduct) {
      onUpdate(
        products.map(p => 
          p.id === editingProduct.id ? { ...editingProduct } : p
        )
      );
    } else {
      onUpdate([
        ...products,
        {
          ...newProduct,
          id: Date.now().toString()
        }
      ]);
    }

    setShowForm(false);
    setEditingProduct(null);
    setNewProduct({
      brand: '',
      name: '',
      art: '',
      design: '',
      colour: '',
      uom: '',
      hsnCode: '',
      mrp: 0,
      salesPrice: 0,
      purchasePrice: 0,
      stock: 0
    });
    setErrors({});
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onUpdate(products.filter(p => p.id !== productId));
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.art.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.design.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStock = filterByStock === 'all' ? true : product.stock < 5;

    return matchesSearch && matchesStock;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageTitle title="Products" />
        <Button
          variant="primary"
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <div className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filterByStock}
              onChange={(e) => setFilterByStock(e.target.value as 'all' | 'low')}
            >
              <option value="all">All Stock</option>
              <option value="low">Low Stock</option>
            </Select>
          </div>

          <Table
            data={filteredProducts}
            columns={[
              { header: 'Name', accessor: 'name' },
              { header: 'Brand', accessor: 'brand' },
              { header: 'Art', accessor: 'art' },
              { header: 'Design', accessor: 'design' },
              { header: 'Colour', accessor: 'colour' },
              { 
                header: 'Stock', 
                accessor: (product) => (
                  <span className={`${product.stock < 5 ? 'text-red-600' : ''}`}>
                    {product.stock} {product.uom}
                  </span>
                )
              },
              { 
                header: 'MRP', 
                accessor: (product) => formatCurrency(product.mrp)
              },
              { 
                header: 'Sales Price', 
                accessor: (product) => formatCurrency(product.salesPrice)
              },
              {
                header: 'Actions',
                accessor: (product) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowHistory(true);
                      }}
                      className="text-blue-600 hover:text-blue-700"
                      title="View History"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-700"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
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
          <Card className="w-full max-w-4xl">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    setErrors({});
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField label="Brand" error={errors.brand}>
                  <Input
                    value={editingProduct?.brand || newProduct.brand}
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({ ...editingProduct, brand: e.target.value });
                      } else {
                        setNewProduct({ ...newProduct, brand: e.target.value });
                      }
                    }}
                    error={!!errors.brand}
                  />
                </FormField>

                <FormField label="Name" error={errors.name}>
                  <Input
                    value={editingProduct?.name || newProduct.name}
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({ ...editingProduct, name: e.target.value });
                      } else {
                        setNewProduct({ ...newProduct, name: e.target.value });
                      }
                    }}
                    error={!!errors.name}
                  />
                </FormField>

                <FormField label="Art" error={errors.art}>
                  <Input
                    value={editingProduct?.art || newProduct.art}
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({ ...editingProduct, art: e.target.value });
                      } else {
                        setNewProduct({ ...newProduct, art: e.target.value });
                      }
                    }}
                    error={!!errors.art}
                  />
                </FormField>

                <FormField label="Design" error={errors.design}>
                  <Input
                    value={editingProduct?.design || newProduct.design}
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({ ...editingProduct, design: e.target.value });
                      } else {
                        setNewProduct({ ...newProduct, design: e.target.value });
                      }
                    }}
                    error={!!errors.design}
                  />
                </FormField>

                <FormField label="Colour" error={errors.colour}>
                  <Input
                    value={editingProduct?.colour || newProduct.colour}
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({ ...editingProduct, colour: e.target.value });
                      } else {
                        setNewProduct({ ...newProduct, colour: e.target.value });
                      }
                    }}
                    error={!!errors.colour}
                  />
                </FormField>

                <FormField label="Unit of Measure (UOM)" error={errors.uom}>
                  <Select
                    value={editingProduct?.uom || newProduct.uom}
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({ ...editingProduct, uom: e.target.value });
                      } else {
                        setNewProduct({ ...newProduct, uom: e.target.value });
                      }
                    }}
                    error={!!errors.uom}
                  >
                    <option value="">Select UOM</option>
                    <option value="PCS">Pieces (PCS)</option>
                    <option value="MTR">Meters (MTR)</option>
                    <option value="KG">Kilograms (KG)</option>
                    <option value="DOZ">Dozen (DOZ)</option>
                  </Select>
                </FormField>

                <FormField label="HSN Code" error={errors.hsnCode}>
                  <Input
                    value={editingProduct?.hsnCode || newProduct.hsnCode}
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({ ...editingProduct, hsnCode: e.target.value });
                      } else {
                        setNewProduct({ ...newProduct, hsnCode: e.target.value });
                      }
                    }}
                    error={!!errors.hsnCode}
                  />
                </FormField>

                <FormField label="MRP" error={errors.mrp}>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingProduct?.mrp || newProduct.mrp}
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({ ...editingProduct, mrp: parseFloat(e.target.value) });
                      } else {
                        setNewProduct({ ...newProduct, mrp: parseFloat(e.target.value) });
                      }
                    }}
                    error={!!errors.mrp}
                  />
                </FormField>

                <FormField label="Sales Price" error={errors.salesPrice}>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingProduct?.salesPrice || newProduct.salesPrice}
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({ ...editingProduct, salesPrice: parseFloat(e.target.value) });
                      } else {
                        setNewProduct({ ...newProduct, salesPrice: parseFloat(e.target.value) });
                      }
                    }}
                    error={!!errors.salesPrice}
                  />
                </FormField>

                <FormField label="Purchase Price" error={errors.purchasePrice}>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingProduct?.purchasePrice || newProduct.purchasePrice}
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({ ...editingProduct, purchasePrice: parseFloat(e.target.value) });
                      } else {
                        setNewProduct({ ...newProduct, purchasePrice: parseFloat(e.target.value) });
                      }
                    }}
                    error={!!errors.purchasePrice}
                  />
                </FormField>

                <FormField label="Stock" error={errors.stock}>
                  <Input
                    type="number"
                    min="0"
                    value={editingProduct?.stock || newProduct.stock}
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) });
                      } else {
                        setNewProduct({ ...newProduct, stock: parseInt(e.target.value) });
                      }
                    }}
                    error={!!errors.stock}
                  />
                </FormField>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    setErrors({});
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showHistory && selectedProduct && (
        <ProductHistory
          product={selectedProduct}
          onClose={() => {
            setShowHistory(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Products;