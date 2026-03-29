import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  clearAuth, 
  getFarmerProducts, 
  addFarmerProduct, 
  updateFarmerProduct, 
  deleteFarmerProduct, 
  getCategories, 
  getFarmerProfile 
} from '../services/api';

export default function FarmerManageProducts() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // --- States ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userProfile, setUserProfile] = useState({ 
    full_name: '', 
    username: '',
    profile_picture: '',
    email: '' 
  });
  const [view, setView] = useState('list'); 
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    name: '',
    category: '', 
    description: '',
    quantity: '',
    image: null,
    imageFile: null 
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- Helper: Get Full Image URL ---
  const getFullImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/150';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `http://localhost:8000${path}`;
  };

  // --- Logic: Get Price from Category (For Add Form real-time preview) ---
  const getPriceFromCategory = (categoryId) => {
    const category = categories.find(c => c.id === parseInt(categoryId));
    return category ? category.official_price : '0.00';
  };

  // --- Fetch Initial Data ---
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [prodRes, catRes, profileRes] = await Promise.all([
        getFarmerProducts(),
        getCategories(),
        getFarmerProfile() 
      ]);
      setProducts(prodRes || []);
      setCategories(catRes || []);
      
      setUserProfile({
        full_name: profileRes.full_name || `${profileRes.first_name} ${profileRes.last_name}`,
        username: profileRes.username,
        email: profileRes.email,
        profile_picture: profileRes.profile_photo_url || profileRes.profile_picture
      });

      if (catRes?.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: catRes[0].id }));
      }
    } catch (err) {
      if (err.status === 401) handleLogout();
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ 
        ...prev, 
        image: URL.createObjectURL(file), 
        imageFile: file 
      }));
    }
  };

  // --- CRUD Actions ---
  const handleAddNewClick = () => {
    setFormData({ ...initialFormState, category: categories[0]?.id || '' });
    setView('add');
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || '',
      quantity: product.quantity,
      image: product.image,
      imageFile: null
    });
  };

  const handleSaveOrUpdate = async () => {
    if (!formData.name || !formData.quantity) {
      alert("Please fill name and quantity.");
      return;
    }
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('quantity', formData.quantity);
    if (formData.imageFile) {
      data.append('image', formData.imageFile);
    }

    try {
      if (editingProduct) {
        await updateFarmerProduct(editingProduct.id, data);
      } else {
        await addFarmerProduct(data);
      }
      await fetchInitialData();
      setView('list');
      setEditingProduct(null);
      setFormData(initialFormState);
    } catch (err) {
      alert(err.data?.error || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteFarmerProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  // --- Render Functions ---
  const renderList = () => (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface font-headline tracking-tight">Manage Products</h1>
          <p className="text-on-surface-variant mt-1 text-sm">Hello {userProfile.full_name}, manage your farm's harvest listings here.</p>
        </div>
        <button onClick={handleAddNewClick} className="px-6 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          Add New Product
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden auto-cols-auto mt-6">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-surface-container-lowest text-on-surface-variant uppercase text-xs font-bold tracking-wider border-b border-outline-variant/30">
              <tr>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Market Price</th> 
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="size-12 min-w-12 rounded-lg bg-surface-container overflow-hidden border border-outline-variant/50 flex-shrink-0">
                      {product.image ? (
                        <img src={getFullImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                          <span className="material-symbols-outlined text-on-surface-variant">image</span>
                        </div>
                      )}
                    </div>
                    <p className="font-bold text-on-surface truncate max-w-[200px]">{product.name}</p>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant font-medium">{product.category_name}</td>
                  
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-black text-sm">
                      {/* نستخدم الحقل official_price القادم من الـ SerializerMethodField مباشرة */}
                      {product.official_price && product.official_price !== "N/A" 
                        ? `${product.official_price} DZD` 
                        : 'Price Pending'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-on-surface font-bold">{product.quantity} KG</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEditClick(product)} className="p-2 text-on-surface-variant hover:text-primary transition-colors bg-surface-container-lowest hover:bg-surface-container-high rounded-lg">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button onClick={() => handleDeleteClick(product.id)} className="p-2 text-on-surface-variant hover:text-red-500 transition-colors bg-surface-container-lowest hover:bg-red-50 rounded-lg">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-16 text-on-surface-variant font-bold">No products found. Start by clicking "Add New Product".</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderAddForm = () => (
    <div className="max-w-5xl mx-auto w-full animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-8 pb-4 border-b border-outline-variant/30">
        <button onClick={() => setView('list')} className="flex items-center gap-2 p-2 text-on-surface-variant hover:bg-surface-container-lowest rounded-xl font-bold transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h2 className="text-2xl font-black text-on-surface tracking-tight">Add New Product</h2>
          <p className="text-sm text-on-surface-variant font-medium">List your fresh harvest on the marketplace</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-outline-variant/30">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-sm">info</span> Product Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="e.g. Organic Red Tomatoes" className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none font-medium text-on-surface" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Category</label>
                  <select name="category" value={formData.category} onChange={handleFormChange} className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none font-medium text-on-surface appearance-none">
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                  {/* عرض السعر التقريبي للفئة قبل الحفظ */}
                  <p className="mt-2 text-xs font-bold text-green-600">
                    Category Base Price: {getPriceFromCategory(formData.category)} DZD/KG
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Stock Quantity (KG)</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleFormChange} placeholder="50" className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none font-medium text-on-surface" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Describe product taste, origin, and freshness..." className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary p-4 outline-none resize-none font-medium min-h-[120px] text-on-surface"></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-outline-variant/30">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary">add_a_photo</span> Product Image
            </h3>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-outline-variant/50 rounded-xl flex flex-col items-center justify-center bg-surface-container-lowest hover:bg-surface-container transition-colors cursor-pointer group aspect-square relative overflow-hidden text-center p-4">
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">upload_file</span>
                  <p className="font-bold text-on-surface text-sm">Click to upload photo</p>
                </>
              )}
            </div>
          </div>
          <button onClick={handleSaveOrUpdate} disabled={loading} className="w-full px-6 py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
            {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <span className="material-symbols-outlined">save</span>}
            Publish Product
          </button>
        </div>
      </div>
    </div>
  );

  const renderEditModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl flex flex-col border border-outline-variant/20">
        <div className="px-8 py-5 border-b border-outline-variant/30 flex items-center justify-between sticky top-0 bg-surface/95 backdrop-blur z-20 rounded-t-[2rem]">
          <h2 className="text-xl font-black text-on-surface">Modify Product</h2>
          <button onClick={() => setEditingProduct(null)} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <div className="p-8 space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest h-12 px-4 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Category</label>
                <select name="category" value={formData.category} onChange={handleFormChange} className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest h-12 px-4 outline-none font-medium">
                   {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <p className="mt-2 text-xs font-bold text-green-600">Base Price: {getPriceFromCategory(formData.category)} DZD</p>
              </div>
          </div>
          <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleFormChange} className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-4 outline-none resize-none font-medium min-h-[90px]"></textarea>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Stock KG</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleFormChange} className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest h-12 px-4 outline-none font-medium" />
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="w-full px-4 py-4 border-2 border-dashed border-outline-variant/50 rounded-xl text-primary font-bold hover:bg-surface-container transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">upload_file</span> Change Product Image
          </button>
        </div>
        <div className="px-8 py-5 border-t border-outline-variant/30 flex justify-end gap-3 bg-surface-container-lowest rounded-b-[2rem]">
          <button onClick={() => setEditingProduct(null)} className="px-6 py-2.5 rounded-xl border border-outline-variant/50 font-bold hover:bg-surface-container-high transition-colors text-on-surface-variant">Cancel</button>
          <button onClick={handleSaveOrUpdate} disabled={loading} className="px-8 py-2.5 bg-primary text-on-primary font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>} Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased font-sans min-h-screen">
      <div className="flex min-h-screen relative">
        {/* --- Sidebar --- */}
        <aside className="hidden md:flex w-64 bg-surface border-r border-outline-variant/30 flex-col fixed h-full z-50">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            </div>
            <h2 className="text-primary text-xl font-bold tracking-tight">AgriGov</h2>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            <div onClick={() => navigate('/farmer/dashboard')} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer font-medium">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </div>
            <div onClick={() => navigate('/farmer/profile')} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer font-medium">
              <span className="material-symbols-outlined">person</span>
              <span>My Profile</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-on-primary shadow-md shadow-primary/20 cursor-pointer font-medium">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
              <span>My Products</span>
            </div>
          </nav>
          
          <div className="p-4 border-t border-outline-variant/30">
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl border border-outline-variant/20 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-center bg-cover border-2 border-primary/20 shadow-inner shrink-0 overflow-hidden">
                <img 
                  src={getFullImageUrl(userProfile.profile_picture)} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} 
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black truncate text-on-surface leading-tight">
                    {userProfile.full_name || 'Agri User'}
                </p>
                <p className="text-[11px] text-on-surface-variant truncate opacity-80">
                    {userProfile.email}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* --- Main Content --- */}
        <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
          <header className="h-16 bg-surface border-b border-outline-variant/30 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
                <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="Search products, orders..." type="text" />
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors relative cursor-pointer">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-surface"></span>
              </button>
              <div className="h-8 w-px bg-outline-variant/30 mx-2 hidden sm:block"></div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-bold cursor-pointer">
                <span className="material-symbols-outlined text-lg">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          <div className="p-4 md:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
            {view === 'list' && renderList()}
            {view === 'add' && renderAddForm()}
          </div>
          
          <footer className="p-8 border-t border-outline-variant/30 text-center bg-surface mt-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
              <span className="text-primary font-bold">AgriGov</span>
            </div>
            <p className="text-on-surface-variant text-sm">© 2026 AgriGov Management System. All rights reserved.</p>
          </footer>

          {editingProduct && renderEditModal()}
          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
        </main>
      </div>
    </div>
  );
}