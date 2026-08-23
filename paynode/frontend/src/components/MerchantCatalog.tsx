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
    if (!window.confirm("Are you sure you want to delete this product?")) return;
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

    setUploadStatus("Uploading & ingesting CSV catalog into FastMCP...");
    try {
      const res = await fetch('/api/products/upload-csv', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setUploadStatus(`✅ Successfully imported ${data.count} products into live MCP catalog!`);
        fetchProducts();
      } else {
        setUploadStatus("❌ Failed to parse CSV file.");
      }
    } catch (err) {
      setUploadStatus("❌ Error uploading file.");
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
    'All': 'from-violet-400 to-violet-600',
    'Electronics': 'from-blue-400 to-blue-600',
    'Audio': 'from-pink-400 to-pink-600',
    'Gaming': 'from-purple-400 to-purple-600',
    'Accessories': 'from-cyan-400 to-cyan-600',
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
      <div className="clay-card p-7 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#7C3AED]/6 rounded-full blur-3xl pointer-events-none clay-blob" />
        
        <div className="max-w-xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-50 text-violet-600 text-xs font-bold mb-3 shadow-clayCard">
            <Layers className="w-3.5 h-3.5 text-pink-500" />
            <span style={{ fontFamily: 'Nunito, sans-serif' }}>Storefront & MCP Inventory Bridge</span>
          </div>
          <h2 className="text-2xl font-black text-clay-foreground tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Merchant Product Catalog
          </h2>
          <p className="text-xs text-clay-muted mt-1.5 leading-relaxed font-medium">
            All items in this inventory are immediately exposed to autonomous AI buyers via FastMCP tools.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={downloadSampleCSV}
            className="px-5 py-3 rounded-[20px] bg-white/80 shadow-clayCard hover:shadow-clayCardHover hover:-translate-y-0.5 text-clay-muted text-xs font-bold flex items-center space-x-2 transition-all active:scale-[0.96] active:shadow-clayPressed"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Sample CSV</span>
          </button>

          <label className="cursor-pointer px-5 py-3 rounded-[20px] bg-violet-50 shadow-clayCard hover:shadow-clayCardHover hover:-translate-y-0.5 text-violet-600 text-xs font-bold flex items-center space-x-2 transition-all active:scale-[0.96] active:shadow-clayPressed"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-[20px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white text-xs font-bold shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-[0.92] active:shadow-clayPressed flex items-center space-x-2 transition-all"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {uploadStatus && (
        <div className="p-5 rounded-[24px] bg-violet-50 shadow-clayCard text-xs font-bold text-violet-600 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3.5 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-clay-muted absolute left-5 top-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, category, SKU..."
            className="w-full pl-12 pr-5 py-3.5 h-14 rounded-[20px] clay-input text-clay-foreground placeholder-clay-muted/60 text-sm font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-[20px] text-xs font-bold transition-all active:scale-[0.95] ${
                selectedCategory === cat
                  ? 'bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton'
                  : 'bg-white/80 text-clay-muted shadow-clayCard hover:shadow-clayCardHover hover:-translate-y-0.5'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
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
            <div key={n} className="h-72 rounded-[32px] bg-white/40 animate-pulse shadow-clayCard" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="clay-card p-16 text-center">
          <Boxes className="w-14 h-14 text-clay-muted/40 mx-auto mb-3" />
          <h3 className="text-lg font-black text-clay-foreground" style={{ fontFamily: 'Nunito, sans-serif' }}>No products match your criteria</h3>
          <p className="text-xs text-clay-muted mt-1 font-medium">Try clearing search filters or import a CSV catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const priceINR = (product.price / 100).toFixed(2);
            const isOverGuardrail = product.price > 100000;
            const catColor = CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Electronics'];

            return (
              <div
                key={product.id}
                className="clay-card-interactive p-6 flex flex-col justify-between relative group overflow-hidden"
              >
                {/* Decorative orb */}
                <div className={`absolute -top-8 -right-8 w-28 h-28 bg-gradient-to-br ${catColor} opacity-[0.06] rounded-full blur-2xl group-hover:opacity-[0.12] transition-all pointer-events-none`} />

                <div className="relative z-10">
                  {/* Image & Badges */}
                  <div className="relative h-44 rounded-[24px] overflow-hidden bg-clay-inputBg shadow-clayPressed mb-4 flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Package className="w-12 h-12 text-clay-muted/30" />
                    )}

                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full bg-gradient-to-br ${catColor} text-white text-[10px] font-black shadow-md`}
                        style={{ fontFamily: 'Nunito, sans-serif' }}>
                        {product.category}
                      </span>
                    </div>

                    {isOverGuardrail && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white text-[10px] font-black shadow-md"
                          style={{ fontFamily: 'Nunito, sans-serif' }}>
                          &gt; ₹1,000 Cap
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-clay-muted">{product.sku || 'SKU-GEN'}</span>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2.5 py-0.5 rounded-full shadow-sm"
                      style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {product.stock} in stock
                    </span>
                  </div>

                  <h3 className="font-black text-clay-foreground text-base line-clamp-1 group-hover:text-clay-accent transition-colors"
                    style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {product.name}
                  </h3>
                  <p className="text-xs text-clay-muted mt-1.5 line-clamp-2 leading-relaxed font-medium">
                    {product.description || 'No description provided.'}
                  </p>
                </div>

                {/* Footer Price & Actions */}
                <div className="mt-5 pt-4 border-t border-violet-100/50 flex items-center justify-between relative z-10">
                  <div>
                    <span className="text-[10px] text-clay-muted font-bold block" style={{ fontFamily: 'Nunito, sans-serif' }}>LISTED PRICE</span>
                    <div className="text-lg font-black text-clay-foreground" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      ₹{priceINR}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2.5 rounded-[16px] bg-rose-50 hover:bg-rose-100 text-rose-500 transition-all shadow-clayCard hover:shadow-clayCardHover active:scale-[0.92] active:shadow-clayPressed"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#332F3A]/40 backdrop-blur-md">
          <div className="rounded-[32px] bg-white/95 backdrop-blur-xl p-7 sm:p-8 w-full max-w-lg relative shadow-clayDeep">
            <div className="flex items-center justify-between pb-4 border-b border-violet-100/50">
              <h3 className="text-base font-black text-clay-foreground flex items-center space-x-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                <Plus className="w-4 h-4 text-clay-accent" />
                <span>Add Product to Catalog</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-[12px] text-clay-muted hover:text-clay-foreground hover:bg-clay-inputBg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block text-clay-foreground font-bold mb-1.5" style={{ fontFamily: 'Nunito, sans-serif' }}>Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Logitech MX Master 3S"
                  className="w-full px-5 py-3 h-12 rounded-[16px] clay-input text-clay-foreground placeholder-clay-muted/60 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-clay-foreground font-bold mb-1.5" style={{ fontFamily: 'Nunito, sans-serif' }}>Price (₹ INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price_inr}
                    onChange={(e) => setNewProduct({ ...newProduct, price_inr: e.target.value })}
                    placeholder="799.00"
                    className="w-full px-5 py-3 h-12 rounded-[16px] clay-input text-clay-foreground placeholder-clay-muted/60 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-clay-foreground font-bold mb-1.5" style={{ fontFamily: 'Nunito, sans-serif' }}>Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-5 py-3 h-12 rounded-[16px] clay-input text-clay-foreground text-sm appearance-none"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Audio">Audio</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-clay-foreground font-bold mb-1.5" style={{ fontFamily: 'Nunito, sans-serif' }}>Stock Level</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-5 py-3 h-12 rounded-[16px] clay-input text-clay-foreground text-sm"
                  />
                </div>

                <div>
                  <label className="block text-clay-foreground font-bold mb-1.5" style={{ fontFamily: 'Nunito, sans-serif' }}>SKU</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="AUT-GEN"
                    className="w-full px-5 py-3 h-12 rounded-[16px] clay-input text-clay-foreground placeholder-clay-muted/60 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-clay-foreground font-bold mb-1.5" style={{ fontFamily: 'Nunito, sans-serif' }}>Image URL</label>
                <input
                  type="url"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-5 py-3 h-12 rounded-[16px] clay-input text-clay-foreground placeholder-clay-muted/60 text-sm"
                />
              </div>

              <div>
                <label className="block text-clay-foreground font-bold mb-1.5" style={{ fontFamily: 'Nunito, sans-serif' }}>Description</label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Product specifications..."
                  className="w-full px-5 py-3 rounded-[16px] clay-input text-clay-foreground placeholder-clay-muted/60 text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 rounded-[20px] bg-white/80 text-clay-muted shadow-clayCard hover:shadow-clayCardHover hover:-translate-y-0.5 font-bold transition-all active:scale-[0.96] active:shadow-clayPressed"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-[20px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white font-bold shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-[0.92] active:shadow-clayPressed transition-all"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
