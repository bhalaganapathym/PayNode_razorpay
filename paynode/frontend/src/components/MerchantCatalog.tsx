import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Upload, Trash2, Search, 
  CheckCircle, Download, Boxes, X,
  Layers, ArrowUpRight, Sparkles
} from 'lucide-react';
import { Product } from '../types';

export const MerchantCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price_inr: '',
    category: 'Electronics',
    stock: 10,
    image_url: '',
    sku: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price_inr) return;

    try {
      const pricePaise = Math.round(parseFloat(newProduct.price_inr) * 100);
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: pricePaise,
          category: newProduct.category,
          stock: Number(newProduct.stock),
          image_url: newProduct.image_url,
          sku: newProduct.sku || `SKU-${Date.now().toString().slice(-6)}`
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewProduct({
          name: '',
          description: '',
          price_inr: '',
          category: 'Electronics',
          stock: 10,
          image_url: '',
          sku: ''
        });
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product from the inventory?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadStatus("UPLOADING & INGESTING CSV CATALOG INTO FASTMCP...");
    try {
      const res = await fetch('/api/products/upload-csv', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setUploadStatus(`✅ IMPORTED ${data.count} PRODUCTS DIRECTLY TO LIVE MCP CATALOG!`);
        fetchProducts();
      } else {
        setUploadStatus("❌ FAILED TO PARSE CSV FILE.");
      }
    } catch (err) {
      setUploadStatus("❌ ERROR UPLOADING FILE.");
    }
    setTimeout(() => setUploadStatus(null), 6000);
  };

  const downloadSampleCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "name,description,price,category,stock,image_url,sku\n" +
      "4K Ultra HD Webcam,Auto-focus HDR streaming camera with mic,1299.00,Electronics,20,https://images.unsplash.com/photo-1588508065123-287b28e013da,CAM-4K-HDR\n" +
      "Ergonomic Wrist Rest Pad,Memory foam keyboard wrist support,349.00,Accessories,45,https://images.unsplash.com/photo-1587829741301-dc798b83add3,WST-PAD-BLK\n" +
      "Portable Bluetooth Speaker,IPX7 Waterproof 12W punchy bass,799.00,Audio,15,https://images.unsplash.com/photo-1545454675-3531b543be5d,SPK-BT-12W";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "paynode_catalog_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = ['All', 'Electronics', 'Audio', 'Gaming', 'Accessories'];

  const CATEGORY_COLORS: Record<string, string> = {
    'All': 'bg-[#FFD93D]',
    'Electronics': 'bg-[#38BDF8]',
    'Audio': 'bg-[#FF6B6B] text-white',
    'Gaming': 'bg-[#C4B5FD]',
    'Accessories': 'bg-[#10B981]',
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="neo-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white relative overflow-hidden">
        <div className="max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#C4B5FD] border-3 border-black text-black text-xs font-black uppercase mb-3 shadow-[3px_3px_0px_0px_#000] rotate-[-1deg]">
            <Layers className="w-3.5 h-3.5 stroke-[3px]" />
            <span>INVENTORY & MCP DISCOVERY ENGINE</span>
          </div>
          <h2 className="text-3xl font-black text-black uppercase tracking-tight">
            MERCHANT PRODUCT CATALOG
          </h2>
          <p className="text-xs font-bold text-black/75 mt-1.5 uppercase tracking-wide">
            Live inventory exposed via FastMCP tools (search_products, get_details, negotiate_price).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={downloadSampleCSV}
            className="neo-btn neo-btn-white px-4 py-2.5 text-xs"
          >
            <Download className="w-4 h-4 mr-2 stroke-[3px]" />
            <span>SAMPLE CSV</span>
          </button>

          <label className="cursor-pointer neo-btn neo-btn-secondary px-4 py-2.5 text-xs">
            <Upload className="w-4 h-4 mr-2 stroke-[3px]" />
            <span>IMPORT CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => setShowAddModal(true)}
            className="neo-btn neo-btn-primary px-5 py-2.5 text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[3px]" />
            <span>ADD PRODUCT</span>
          </button>
        </div>
      </div>

      {uploadStatus && (
        <div className="p-4 bg-[#FFD93D] border-4 border-black text-xs font-black text-black flex items-center space-x-2 shadow-[4px_4px_0px_0px_#000] uppercase">
          <Sparkles className="w-4 h-4 stroke-[3px]" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 text-black stroke-[3px] absolute left-4 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH PRODUCTS, SKU, CATEGORY..."
            className="w-full pl-12 pr-4 py-3 neo-input text-xs font-bold uppercase"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 border-3 border-black text-xs font-black uppercase transition-all ${
                selectedCategory === cat
                  ? 'bg-black text-[#FFD93D] shadow-[4px_4px_0px_0px_#FF6B6B] -translate-y-1'
                  : 'bg-white text-black hover:bg-[#FFD93D] shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-white border-4 border-black shadow-neo animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="neo-card p-16 text-center bg-white">
          <Boxes className="w-16 h-16 text-black stroke-[2.5px] mx-auto mb-4" />
          <h3 className="text-xl font-black text-black uppercase">NO PRODUCTS MATCH CRITERIA</h3>
          <p className="text-xs font-bold text-black/60 mt-1 uppercase">Try clearing search filters or import a CSV catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const priceINR = (product.price / 100).toFixed(2);
            const isOverGuardrail = product.price > 100000;
            const catBadgeClass = CATEGORY_COLORS[product.category] || 'bg-white';

            return (
              <div
                key={product.id}
                className="neo-card-interactive p-5 flex flex-col justify-between group relative"
              >
                <div>
                  {/* Image Container with Thick Border */}
                  <div className="relative h-48 border-4 border-black bg-[#FFFDF5] mb-4 overflow-hidden flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Package className="w-16 h-16 text-black/30 stroke-[2px]" />
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2.5 py-0.5 border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_#000] ${catBadgeClass}`}>
                        {product.category}
                      </span>
                    </div>

                    {isOverGuardrail && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2.5 py-0.5 bg-[#FF6B6B] text-white border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_#000]">
                          &gt; ₹1,000 CAP
                        </span>
                      </div>
                    )}
                  </div>

                  {/* SKU & Stock */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-black/60 uppercase">
                      {product.sku || 'SKU-AUTO'}
                    </span>
                    <span className="text-[11px] font-black uppercase px-2 py-0.5 bg-[#10B981]/20 text-black border-2 border-black">
                      {product.stock} IN STOCK
                    </span>
                  </div>

                  <h3 className="font-black text-black text-lg uppercase leading-tight group-hover:text-[#FF6B6B] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs font-bold text-black/70 mt-2 line-clamp-2 leading-relaxed">
                    {product.description || 'No product description provided.'}
                  </p>
                </div>

                {/* Footer Price & Delete Action */}
                <div className="mt-6 pt-4 border-t-3 border-black flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-black/60 block">LISTED PRICE</span>
                    <div className="text-2xl font-black text-black font-mono">
                      ₹{priceINR}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2.5 bg-white border-3 border-black text-black hover:bg-[#FF6B6B] hover:text-white shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4 stroke-[3px]" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
          <div className="border-6 border-black bg-[#FFFDF5] p-6 sm:p-8 w-full max-w-lg shadow-neo-xl relative">
            <div className="flex items-center justify-between pb-4 border-b-4 border-black">
              <h3 className="text-lg font-black uppercase text-black flex items-center space-x-2">
                <Plus className="w-5 h-5 stroke-[3px]" />
                <span>ADD PRODUCT TO CATALOG</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 border-2 border-black bg-white hover:bg-[#FF6B6B] hover:text-white text-black font-black"
              >
                <X className="w-5 h-5 stroke-[3px]" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block text-black font-black uppercase mb-1">PRODUCT NAME *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="E.G. LOGITECH MX MASTER 3S"
                  className="w-full px-4 py-2.5 neo-input font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-black font-black uppercase mb-1">PRICE (₹ INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price_inr}
                    onChange={(e) => setNewProduct({ ...newProduct, price_inr: e.target.value })}
                    placeholder="799.00"
                    className="w-full px-4 py-2.5 neo-input font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-black font-black uppercase mb-1">CATEGORY</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-2.5 neo-input font-black uppercase"
                  >
                    <option value="Electronics">ELECTRONICS</option>
                    <option value="Audio">AUDIO</option>
                    <option value="Gaming">GAMING</option>
                    <option value="Accessories">ACCESSORIES</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-black font-black uppercase mb-1">STOCK UNITS</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 neo-input font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-black font-black uppercase mb-1">SKU CODE</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="AUT-GEN"
                    className="w-full px-4 py-2.5 neo-input font-mono font-bold uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black font-black uppercase mb-1">IMAGE URL</label>
                <input
                  type="url"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 neo-input font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-black font-black uppercase mb-1">DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Product specifications..."
                  className="w-full px-4 py-2.5 neo-input"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="neo-btn neo-btn-white px-5 py-2.5 text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="neo-btn neo-btn-primary px-6 py-2.5 text-xs"
                >
                  SAVE PRODUCT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
