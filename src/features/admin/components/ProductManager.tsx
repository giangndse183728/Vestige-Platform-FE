import { useState, useEffect } from 'react';
import { getAllProductStatuses, deleteProductByAdmin, updateProductByAdmin } from '@/features/products/services';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Trash2, Pencil } from 'lucide-react';

export default function ProductManager() {
  const [products, setProducts] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    size: '',
    color: '',
    status: '',
    condition: '',
    categoryId: '',
    brandId: '',
  });

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllProductStatuses();
        setProducts(data.content || []);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleViewDetail = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductByAdmin(productId);
        setProducts((prev) => prev ? prev.filter(p => p.productId !== productId) : prev);
      } catch (err: any) {
        alert('Failed to delete product: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleEditOpen = () => {
    if (selectedProduct) {
      setEditForm({
        title: selectedProduct.title || '',
        description: selectedProduct.description || '',
        price: selectedProduct.price || '',
        originalPrice: selectedProduct.originalPrice || '',
        size: selectedProduct.size || '',
        color: selectedProduct.color || '',
        status: selectedProduct.status || '',
        condition: selectedProduct.condition || '',
        categoryId: selectedProduct.categoryId ? String(selectedProduct.categoryId) : '',
        brandId: selectedProduct.brandId ? String(selectedProduct.brandId) : '',
      });
      setIsEditMode(true);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      await updateProductByAdmin(selectedProduct.productId, {
        ...selectedProduct,
        ...editForm,
        price: Number(editForm.price),
        originalPrice: Number(editForm.originalPrice),
        categoryId: Number(editForm.categoryId),
        brandId: Number(editForm.brandId),
      });
      setIsEditMode(false);
      setIsModalOpen(false);
      // Refresh products
      const data = await getAllProductStatuses();
      setProducts(data.content || []);
    } catch (err: any) {
      alert('Failed to update product: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">Manage all products and their statuses</p>
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 py-8 text-center">{error}</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.productId} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm text-gray-900">{product.productId}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{product.title}</td>
                      <td className="py-4 px-6">
                        <Badge variant={product.status === 'ACTIVE' ? 'default' : 'secondary'}>{product.status}</Badge>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">{product.brandName || '-'}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{product.categoryName || '-'}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">${product.price}</td>
                      <td className="py-4 px-6 text-right">
                        <Button size="sm" variant="outline" onClick={() => handleViewDetail(product)}>
                          View Detail
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.productId)}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[1100px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Detail</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="flex flex-col sm:flex-row gap-12">
              {/* Image */}
              <div className="flex-shrink-0 flex justify-center items-start w-full sm:w-[400px]">
                <img
                  src={selectedProduct.primaryImageUrl}
                  alt={selectedProduct.title}
                  className="w-[350px] h-[350px] object-cover rounded border"
                />
              </div>
              {/* Details */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Title & Description */}
                {!isEditMode && (
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{selectedProduct.title}</h3>
                    <p className="text-gray-700 text-base mb-2 whitespace-pre-line">{selectedProduct.description}</p>
                  </div>
                )}
                {/* Edit form or Detail view (not both) */}
                {isEditMode ? (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <label className="font-semibold">Title:</label>
                      <input
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold">Description:</label>
                      <input
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="font-semibold">Price:</label>
                        <input
                          name="price"
                          type="number"
                          value={editForm.price}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label className="font-semibold">Original Price:</label>
                        <input
                          name="originalPrice"
                          type="number"
                          value={editForm.originalPrice}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="font-semibold">Size:</label>
                        <input
                          name="size"
                          value={editForm.size}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="font-semibold">Color:</label>
                        <input
                          name="color"
                          value={editForm.color}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="font-semibold">Status:</label>
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                          <option value="SOLD">SOLD</option>
                          <option value="DELETED">DELETED</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="font-semibold">Condition:</label>
                        <select
                          name="condition"
                          value={editForm.condition}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full"
                        >
                          <option value="NEW">NEW</option>
                          <option value="USED">USED</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="font-semibold">Category ID:</label>
                        <input
                          name="categoryId"
                          type="number"
                          value={editForm.categoryId}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="font-semibold">Brand ID:</label>
                        <input
                          name="brandId"
                          type="number"
                          value={editForm.brandId}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" variant="default">Save</Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setIsEditMode(false)}>Cancel</Button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Detail view here (all the detail layout you already have) */}
                    <div className="border-t pt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
                      <div><span className="font-semibold">Status:</span> <Badge variant={selectedProduct.status === 'ACTIVE' ? 'default' : 'secondary'}>{selectedProduct.status}</Badge></div>
                      <div><span className="font-semibold">Condition:</span> {selectedProduct.condition}</div>
                      <div><span className="font-semibold">Size:</span> {selectedProduct.size}</div>
                      <div><span className="font-semibold">Color:</span> {selectedProduct.color}</div>
                    </div>
                    <div className="border-t pt-3 grid grid-cols-2 gap-x-8 gap-y-2 items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Price:</span>
                        <span className="text-2xl font-bold text-black">${selectedProduct.price}</span>
                      </div>
                      {selectedProduct.hasDiscount && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Original Price:</span>
                          <span className="line-through text-gray-400 text-lg">${selectedProduct.originalPrice}</span>
                          <span className="font-semibold ml-4">Discount:</span>
                          <span className="font-bold text-red-600">-{selectedProduct.discountPercentage}%</span>
                        </div>
                      )}
                    </div>
                    <div className="border-t pt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <div><span className="font-semibold">Brand:</span> {selectedProduct.brandName}</div>
                      <div><span className="font-semibold">Category:</span> {selectedProduct.categoryName}</div>
                    </div>
                    <div className="border-t pt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <div><span className="font-semibold">Views:</span> {selectedProduct.viewsCount}</div>
                      <div><span className="font-semibold">Likes:</span> {selectedProduct.likesCount}</div>
                    </div>
                    <div className="border-t pt-3 text-xs text-gray-500">
                      <span className="font-semibold">Created:</span> {selectedProduct.createdAt}
                    </div>
                    <Button size="sm" variant="outline" className="self-end mt-4" onClick={handleEditOpen}>Edit</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 