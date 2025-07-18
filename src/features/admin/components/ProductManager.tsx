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
import { toast } from 'sonner';
import { getMyProductDetail } from '@/features/products/services';
import Pagination from '@/components/ui/pagination';

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
  const [activeTab, setActiveTab] = useState<'pending' | 'inactive' | 'active' | 'sold' | 'all'>('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(20);

  // Filter products based on search query
  const filteredProducts = allProducts?.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.productId.toString().includes(query) ||
      product.title.toLowerCase().includes(query)
    );
  });

  // Các status cho từng tab (chuẩn backend)
  const statusTabs = [
    { key: 'pending', label: 'Pending Approval', statuses: ['DRAFT'] },
    { key: 'inactive', label: 'Inactive', statuses: ['INACTIVE'] },
    { key: 'active', label: 'Active', statuses: ['ACTIVE'] },
    { key: 'sold', label: 'Sold', statuses: ['SOLD'] },
    { key: 'all', label: 'All Products', statuses: [] },
  ];

  // Lọc sản phẩm theo tab
  const displayedProducts = activeTab === 'all'
    ? filteredProducts
    : filteredProducts?.filter((product) => {
        const tab = statusTabs.find(t => t.key === activeTab);
        return tab && tab.statuses.includes(product.status);
      });

  // Tính số lượng sản phẩm cho từng tab
  const getTabCount = (tabKey: string) => {
    if (tabKey === 'all') return filteredProducts?.length || 0;
    const tab = statusTabs.find(t => t.key === tabKey);
    return filteredProducts?.filter(product => tab && tab.statuses.includes(product.status)).length || 0;
  };

  const getTabStatuses = (tabKey: string) => {
    const tab = statusTabs.find(t => t.key === tabKey);
    return tab && tab.statuses.length > 0 ? tab.statuses : [];
  };

  // useEffect fetch đúng status và page
  useEffect(() => {
    const statuses = getTabStatuses(activeTab);
    const statusParam = statuses.length > 0 ? statuses[0] : undefined; // chỉ lấy 1 status cho đúng backend
    fetchAllProducts({
      page: String(currentPage), // page=0 là trang đầu
      size: String(pageSize),
      status: statusParam
    }).then(res => {
      setTotalPages(res.pagination?.totalPages || 1);
      if (currentPage + 1 > (res.pagination?.totalPages || 1)) {
        setCurrentPage(0);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, activeTab]);

  // Khi đổi tab, reset về trang đầu
  const handleTabChange = (tabKey: typeof activeTab) => {
    setActiveTab(tabKey);
    setCurrentPage(0);
  };

  const handleViewDetail = async (product: any) => {
    const detail = await getMyProductDetail(product.productId);
    setSelectedProduct(detail);
    setIsModalOpen(true);
    setSelectedImageIndex(0);
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
      {/* Tabs filter */}
      <div className="flex gap-2 mb-2">
        {statusTabs.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-t font-semibold border-b-2 ${activeTab === tab.key ? 'border-black text-black bg-white' : 'border-transparent text-gray-500 bg-gray-50'}`}
            onClick={() => handleTabChange(tab.key as typeof activeTab)}
          >
            {tab.label}
          </button>
        ))}
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
            <>
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
                  {displayedProducts && displayedProducts.length > 0 ? (
                    displayedProducts.map((product) => (
                      <tr key={product.productId} className="hover:bg-gray-50">
                        <td className="py-4 px-6 text-sm text-gray-900">{product.productId}</td>
                        <td className="py-4 px-6 text-sm text-gray-900">{product.title}</td>
                        <td className="py-4 px-6">
                          <Badge variant={product.status === 'ACTIVE' ? 'default' : 'secondary'}>{product.status}</Badge>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">{product.brandName || '-'}</td>
                        <td className="py-4 px-6 text-sm text-gray-900">{product.categoryName || '-'}</td>
                        <td className="py-4 px-6 text-sm text-gray-900">{product.price} VND</td>
                        <td className="py-4 px-6 text-right">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetail(product)}>
                            View Detail
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
              {totalPages > 1 && (
                <div className="py-4 flex justify-center">
                  <Pagination
                    currentPage={currentPage + 1}
                    totalPages={totalPages}
                    onPageChange={page => setCurrentPage(page - 1)}
                  />
                </div>
              )}
            </>
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
              {/* Images */}
              <div className="flex-shrink-0 flex flex-col items-center w-full sm:w-[400px]">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <>
                    <img
                      src={selectedProduct.images[selectedImageIndex].imageUrl}
                      alt={selectedProduct.title}
                      className="w-[350px] h-[350px] object-cover rounded border mb-4"
                    />
                    <div className="flex gap-2 mt-2 flex-wrap justify-center">
                      {selectedProduct.images.map((img: { imageId?: string; imageUrl: string }, idx: number) => (
                        <img
                          key={img.imageId || idx}
                          src={img.imageUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          className={`w-14 h-14 object-cover rounded border cursor-pointer ${selectedImageIndex === idx ? 'ring-2 ring-black' : ''}`}
                          onClick={() => setSelectedImageIndex(idx)}
                        />
                      ))}
                    </div>
                  </>
                ) : selectedProduct.imageUrls && selectedProduct.imageUrls.length > 0 ? (
                  <>
                    <img
                      src={selectedProduct.imageUrls[selectedImageIndex]}
                      alt={selectedProduct.title}
                      className="w-[350px] h-[350px] object-cover rounded border mb-4"
                    />
                    <div className="flex gap-2 mt-2 flex-wrap justify-center">
                      {selectedProduct.imageUrls.map((url: string, idx: number) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Thumbnail ${idx + 1}`}
                          className={`w-14 h-14 object-cover rounded border cursor-pointer ${selectedImageIndex === idx ? 'ring-2 ring-black' : ''}`}
                          onClick={() => setSelectedImageIndex(idx)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="w-[350px] h-[350px] flex items-center justify-center bg-gray-100 rounded border text-gray-400 mb-4">No Image</div>
                )}
              </div>
              {/* Details */}
              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{selectedProduct.title}</h3>
                  <p className="text-gray-700 text-base mb-2 whitespace-pre-line">{selectedProduct.description}</p>
                </div>
                <div className="border-t pt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
                  <div><span className="font-semibold">Status:</span> <Badge variant={selectedProduct.status === 'ACTIVE' ? 'default' : 'secondary'}>{selectedProduct.status}</Badge></div>
                  <div><span className="font-semibold">Condition:</span> {selectedProduct.condition}</div>
                  <div><span className="font-semibold">Size:</span> {selectedProduct.size}</div>
                  <div><span className="font-semibold">Color:</span> {selectedProduct.color}</div>
                </div>
                <div className="border-t pt-3 grid grid-cols-2 gap-x-8 gap-y-2 items-center">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">Price:</span>
                    <span className="text-2xl font-bold text-black">{selectedProduct.price} VND</span>
                  </div>
                  {selectedProduct.hasDiscount && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">Original Price:</span>
                      <span className="line-through text-gray-400 text-base">{selectedProduct.originalPrice} VND</span>
                      <span className="flex items-center gap-1 ml-2">
                        <span className="font-semibold text-xs">Discount:</span>
                        <span className="font-bold text-red-600 text-base">-{selectedProduct.discountPercentage}%</span>
                      </span>
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
                  {activeTab === 'pending' && ['PENDING_PAYMENT', 'DRAFT'].includes(selectedProduct.status) && (
                    <div className="flex gap-2">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-red-600 text-red-700 font-bold shadow flex items-center gap-2 transition-colors duration-150 hover:bg-red-100 hover:border-red-700 hover:text-red-800"
                        onClick={async () => {
                          await updateProduct(selectedProduct.productId, { status: 'INACTIVE' });
                          toast.success('Product rejected!');
                          fetchAllProducts();
                          setSelectedProduct({ ...selectedProduct, status: 'INACTIVE' });
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        Reject
                      </Button>
                      <Button
                        size="lg"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold border-2 border-green-700 hover:border-green-800 shadow-lg flex items-center gap-2 transition-colors duration-150"
                        onClick={async () => {
                          await updateProduct(selectedProduct.productId, { status: 'ACTIVE' });
                          toast.success('Product approved!');
                          fetchAllProducts();
                          setSelectedProduct({ ...selectedProduct, status: 'ACTIVE' });
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 