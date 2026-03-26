import React, { useState, useEffect, useRef } from 'react';

export default function AddCategoryModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setDescription(initialData.desc || '');
        setImagePreview(initialData.img || '');
      } else {
        setName('');
        setDescription('');
        setImagePreview('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ 
      id: initialData ? initialData.id : Date.now(), 
      name, 
      desc: description, 
      img: imagePreview || 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=100&q=80',
      count: initialData ? initialData.count : 0,
      date: initialData ? initialData.date : new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: initialData ? initialData.status : 'Active'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#000000]/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>
      {/* Modal Container */}
      <div className="relative bg-surface w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/30 animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-primary/5">
          <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
             <span className="material-symbols-outlined text-primary">{initialData ? 'edit' : 'category'}</span>
             {initialData ? 'Edit Category' : 'Add New Category'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body / Form */}
        <div className="overflow-y-auto w-full">
          <form className="p-6 space-y-5" onSubmit={handleSubmit}>
            
            {/* Category Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-on-surface">Category Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all" placeholder="e.g. Tropical Fruits" type="text" />
            </div>

            {/* Category Image Upload */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-on-surface">Category Image</label>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
              
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-outline-variant/50 rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container-lowest/50 hover:bg-surface-container transition-colors cursor-pointer relative overflow-hidden h-40"
              >
                {imagePreview ? (
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imagePreview})` }}>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-bold text-sm gap-2">
                      <span className="material-symbols-outlined">edit</span> Change Image
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-3xl text-primary/50 mb-2">cloud_upload</span>
                    <p className="text-sm font-medium text-on-surface-variant">Click to upload image</p>
                    <p className="text-xs text-on-surface-variant/70 mt-1">PNG, JPG or WebP (max. 2MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-on-surface">Description</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all resize-none" placeholder="Describe the category..." rows="3"></textarea>
            </div>

            {/* Modal Footer / Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 pb-2">
              <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer" type="button">
                Cancel
              </button>
              <button className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer" type="submit">
                {initialData ? 'Save Changes' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
