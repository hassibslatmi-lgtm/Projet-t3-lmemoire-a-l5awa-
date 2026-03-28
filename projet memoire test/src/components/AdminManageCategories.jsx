import React, { useState, useEffect } from 'react';
import AddCategoryModal from './AddCategoryModal';
import { getCategories, deleteCategory, addCategory, updateCategory } from '../services/api';

export default function AdminManageCategories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error fetching categories", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cat) => {
    setEditingCategory({
      id: cat.id,
      name: cat.name,
      desc: cat.description,
      img: cat.image,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        setCategories(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const handleSaveCategory = async (categoryData) => {
    const formData = new FormData();
    formData.append('name', categoryData.name);
    formData.append('description', categoryData.desc);
    
    // التعديل: ربط الملف بـ 'image' ليتوافق مع Backend
    if (categoryData.imageFile) {
      formData.append('image', categoryData.imageFile);
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      fetchCategories();
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving data. Check if category name exists.");
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">category</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
            <p className="text-gray-500 text-sm">Manage product catalog structure.</p>
          </div>
        </div>
        <button onClick={handleAdd} className="bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-green-800 transition-all cursor-pointer">
          <span className="material-symbols-outlined">add</span> Add New
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase font-bold">
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories?.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-lg bg-gray-200 bg-cover bg-center border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden" 
                        style={{ backgroundImage: cat.image ? `url('${cat.image}')` : 'none' }}
                      >
                        {!cat.image && <span className="text-[10px] text-gray-400">No Img</span>}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{cat.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{cat.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {cat.created_at ? new Date(cat.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(cat)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all cursor-pointer">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && categories.length === 0 && <div className="p-20 text-center text-gray-400">No categories found.</div>}
          {loading && <div className="p-10 text-center text-green-700 animate-pulse">Loading...</div>}
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