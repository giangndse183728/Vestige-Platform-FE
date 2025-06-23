import { useState, useEffect } from 'react';
import { useAdminProductActions } from '@/features/products/hooks/useAdminProductActions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Trash2, Pencil, Search } from 'lucide-react';
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function ProductManager() {
  const {
    allProducts,
    allProductsLoading,
    allProductsError,
    fetchAllProducts,
    deleteProduct,
    deleteLoading,
    updateProduct,
    updateLoading,
    updateProductImages,
    imagesLoading,
  } = useAdminProductActions();

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const [isImageEditMode, setIsImageEditMode] = useState(false);
  const [imageForm, setImageForm] = useState({
    imageId: '',
    imageUrl: '',
    displayOrder: '',
    isPrimary: false,
    active: true,
  });

  // Filter products based on search query
  const filteredProducts = allProducts?.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.productId.toString().includes(query) ||
      product.title.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    fetchAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewDetail = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseEditModal = () => {
    setIsEditMode(false);
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        fetchAllProducts();
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
      setTimeout(() => setIsEditMode(true), 0);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      const payload = {
        title: editForm.title,
        description: editForm.description,
        price: Number(editForm.price),
        originalPrice: Number(editForm.originalPrice),
        condition: editForm.condition,
        size: editForm.size,
        color: editForm.color,
        status: editForm.status,
        categoryId: Number(editForm.categoryId),
        brandId: Number(editForm.brandId),
        imageUrls: selectedProduct.imageUrls || [],
        adminNotes: selectedProduct.adminNotes || '',
        sellerId: selectedProduct.sellerId ? Number(selectedProduct.sellerId) : undefined,
        forceSoldStatus: selectedProduct.forceSoldStatus || false,
      };
      await updateProduct(selectedProduct.productId, payload);
      toast.success('Product updated successfully!');
      setIsEditMode(false);
      // Fetch all products and update selectedProduct with the latest info
      const data = await fetchAllProducts();
      const updated = data?.content?.find((p: any) => p.productId === selectedProduct.productId);
      if (updated) setSelectedProduct(updated);
    } catch (err: any) {
      alert('Failed to update product: ' + (err.message || 'Unknown error'));
    }
  };

  const handleImageEditOpen = () => {
    if (selectedProduct && selectedProduct.images && selectedProduct.images.length > 0) {
      // Lấy ảnh chính đầu tiên làm mẫu
      const img = selectedProduct.images[0];
      setImageForm({
        imageId: img.imageId || '',
        imageUrl: img.imageUrl || '',
        displayOrder: img.displayOrder?.toString() || '',
        isPrimary: img.isPrimary || false,
        active: img.active ?? true,
      });
    } else {
      setImageForm({ imageId: '', imageUrl: '', displayOrder: '', isPrimary: false, active: true });
    }
    setIsImageEditMode(true);
  };

  const handleImageFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setImageForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setImageForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      await updateProductImages(selectedProduct.productId, {
        imageId: Number(imageForm.imageId),
        imageUrl: imageForm.imageUrl,
        displayOrder: Number(imageForm.displayOrder),
        isPrimary: imageForm.isPrimary,
        active: imageForm.active,
      });
      setIsImageEditMode(false);
      fetchAllProducts();
    } catch (err: any) {
      alert('Failed to update product image: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">Manage all products and their statuses</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search by product ID or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          {allProductsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : allProductsError ? (
            <div className="text-red-600 py-8 text-center">{allProductsError}</div>
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
                {filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
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
                          disabled={deleteLoading}
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
                      <Button type="submit" size="sm" variant="default" disabled={updateLoading}>Save</Button>
                      <Button type="button" size="sm" variant="outline" onClick={handleCloseEditModal}>Cancel</Button>
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
                    <div className="flex flex-row gap-2 self-end mt-4">
                      <Button size="sm" variant="outline" onClick={handleEditOpen}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={handleImageEditOpen}>Update Image</Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Image Update Modal */}
      <UIDialog open={isImageEditMode} onOpenChange={setIsImageEditMode}>
        <UIDialogContent className="max-w-md">
          <UIDialogHeader>
            <UIDialogTitle>Update Product Image</UIDialogTitle>
          </UIDialogHeader>
          <form onSubmit={handleImageUpdate} className="space-y-2">
            <div>
              <label className="font-semibold">Image ID:</label>
              <input name="imageId" value={imageForm.imageId} onChange={handleImageFormChange} className="border rounded px-2 py-1 w-full" required />
            </div>
            <div>
              <label className="font-semibold">Image URL:</label>
              <input name="imageUrl" value={imageForm.imageUrl} onChange={handleImageFormChange} className="border rounded px-2 py-1 w-full" required />
            </div>
            <div>
              <label className="font-semibold">Display Order:</label>
              <input name="displayOrder" type="number" value={imageForm.displayOrder} onChange={handleImageFormChange} className="border rounded px-2 py-1 w-full" required />
            </div>
            <div>
              <label className="font-semibold">Is Primary:</label>
              <input name="isPrimary" type="checkbox" checked={imageForm.isPrimary} onChange={handleImageFormChange} className="ml-2" />
            </div>
            <div>
              <label className="font-semibold">Active:</label>
              <input name="active" type="checkbox" checked={imageForm.active} onChange={handleImageFormChange} className="ml-2" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" variant="default" disabled={imagesLoading}>Save Image</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setIsImageEditMode(false)}>Cancel</Button>
            </div>
          </form>
        </UIDialogContent>
      </UIDialog>
      {/* Edit Product Modal */}
      <UIDialog open={isEditMode} onOpenChange={setIsEditMode}>
        <UIDialogContent style={{ width: '90vw', maxWidth: 900, height: 'auto', maxHeight: '70vh', overflowY: 'auto' }} className="h-auto">
          <UIDialogHeader>
            <UIDialogTitle>Edit Product</UIDialogTitle>
          </UIDialogHeader>
          <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="title">Title:</label>
              <input id="title" name="title" value={editForm.title} onChange={handleEditChange} className="border rounded px-2 py-1" required />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="description">Description:</label>
              <input id="description" name="description" value={editForm.description} onChange={handleEditChange} className="border rounded px-2 py-1" required />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="price">Price:</label>
              <input id="price" name="price" value={editForm.price} onChange={handleEditChange} className="border rounded px-2 py-1" required />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="originalPrice">Original Price:</label>
              <input id="originalPrice" name="originalPrice" value={editForm.originalPrice} onChange={handleEditChange} className="border rounded px-2 py-1" required />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="size">Size:</label>
              <input id="size" name="size" value={editForm.size} onChange={handleEditChange} className="border rounded px-2 py-1" required />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="color">Color:</label>
              <input id="color" name="color" value={editForm.color} onChange={handleEditChange} className="border rounded px-2 py-1" required />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="status">Status:</label>
              <select id="status" name="status" value={editForm.status} onChange={handleEditChange} className="border rounded px-2 py-1" required>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="SOLD">SOLD</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="condition">Condition:</label>
              <select id="condition" name="condition" value={editForm.condition} onChange={handleEditChange} className="border rounded px-2 py-1" required>
                <option value="NEW">NEW</option>
                <option value="USED">USED</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="categoryId">Category ID:</label>
              <input id="categoryId" name="categoryId" value={editForm.categoryId} onChange={handleEditChange} className="border rounded px-2 py-1" required />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="brandId">Brand ID:</label>
              <input id="brandId" name="brandId" value={editForm.brandId} onChange={handleEditChange} className="border rounded px-2 py-1" required />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button type="submit" className="px-4 py-2 bg-black text-white rounded">Save</button>
              <button type="button" className="px-4 py-2 border rounded" onClick={handleCloseEditModal}>Cancel</button>
            </div>
          </form>
        </UIDialogContent>
      </UIDialog>
    </div>
  );
} 