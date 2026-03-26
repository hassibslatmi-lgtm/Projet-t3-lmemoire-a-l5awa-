import React, { useState } from 'react';
import AddCategoryModal from './AddCategoryModal';

const INITIAL_MOCK_CATEGORIES = [
  { id: 1, name: 'Fruits', desc: 'Fresh seasonal orchard produce', count: 142, date: 'Oct 12, 2023', status: 'Active', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=100&q=80' },
  { id: 2, name: 'Vegetables', desc: 'Organic farm-to-table greens', count: 89, date: 'Oct 14, 2023', status: 'Active', img: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=100&q=80' },
  { id: 3, name: 'Grains', desc: 'Essential cereals and legumes', count: 56, date: 'Nov 02, 2023', status: 'Active', img: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=100&q=80' },
  { id: 4, name: 'Dairy', desc: 'Milk, cheese, and farm dairy', count: 34, date: 'Nov 15, 2023', status: 'Inactive', img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=100&q=80' },
  { id: 5, name: 'Organic', desc: 'Certified pesticide-free goods', count: 120, date: 'Dec 01, 2023', status: 'Active', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80' }
];

export default function AdminManageCategories() {
  const [categories, setCategories] = useState(INITIAL_MOCK_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      // Update existing
      setCategories(categories.map(cat => cat.id === categoryData.id ? categoryData : cat));
    } else {
      // Create new
      setCategories([categoryData, ...categories]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface-container-lowest">
      
      {/* Page Title & CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <div className="flex items-center gap-4">
          <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">category</span>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-on-surface">Manage Categories</h2>
            <p className="text-on-surface-variant text-sm mt-1">Organize and structure your agricultural product catalog.</p>
          </div>
        </div>
        <button onClick={handleAdd} className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
          <span className="material-symbols-outlined">add_circle</span>
          Add New Category
        </button>
      </div>

      {/* Category Table */}
      <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant/30">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Product Count</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Created Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="size-12 rounded-lg bg-surface-container-high flex-shrink-0 bg-cover bg-center overflow-hidden border border-outline-variant/30 shadow-sm"
                        style={{ backgroundImage: `url('${cat.img}')` }}
                      ></div>
                      <div>
                        <p className="font-bold text-on-surface">{cat.name}</p>
                        <p className="text-xs text-on-surface-variant">{cat.desc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold px-2.5 py-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface">
                        {cat.count} <span className="text-xs font-normal text-on-surface-variant">items</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{cat.date}</td>
                  <td className="px-6 py-4">
                    {cat.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100/50 text-green-800 border border-green-200">
                        <span className="size-1.5 rounded-full bg-green-600"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        <span className="size-1.5 rounded-full bg-slate-400"></span>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(cat)} className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-primary/5" title="Edit">
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-2 text-on-surface-variant hover:text-red-500 transition-colors cursor-pointer rounded-full hover:bg-red-50" title="Delete">
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {categories.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-on-surface-variant">
                    No categories found. Click 'Add New Category' to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */ }
        <div className="bg-surface-container-lowest px-6 py-4 border-t border-outline-variant/30 flex items-center justify-between">
          <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Showing {categories.length > 0 ? 1 : 0} to {categories.length} of {categories.length} results</p>
          <div className="flex gap-1">
            <button className="size-8 flex items-center justify-center rounded-lg border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="size-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-xs shadow-sm">1</button>
            <button className="size-8 flex items-center justify-center rounded-lg border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <AddCategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveCategory}
        initialData={editingCategory}
      />
    </div>
  );
}
