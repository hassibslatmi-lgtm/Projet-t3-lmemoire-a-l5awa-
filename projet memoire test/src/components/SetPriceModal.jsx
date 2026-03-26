import React, { useState, useEffect, useRef } from 'react';

export default function SetPriceModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setPrice(initialData.price || '');
        setImagePreview(initialData.img || '');
      } else {
        setName('');
        setPrice('');
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
      price: parseFloat(price).toFixed(2), 
      img: imagePreview || 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=100&q=80',
      dateSet: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
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
             <span className="material-symbols-outlined text-primary">{initialData ? 'edit' : 'sell'}</span>
             {initialData ? 'Update Official Price' : 'Set New Official Price'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body / Form */}
        <div className="overflow-y-auto w-full">
          <form className="p-6 space-y-5" onSubmit={handleSubmit}>
            
            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-on-surface">Product Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all" placeholder="e.g. Organic Tomatoes" type="text" />
            </div>

            {/* Product Image Upload */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-on-surface">Product Photo</label>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
              
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-outline-variant/50 rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container-lowest/50 hover:bg-surface-container transition-colors cursor-pointer relative overflow-hidden h-40"
              >
                {imagePreview ? (
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imagePreview})` }}>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-bold text-sm gap-2">
                      <span className="material-symbols-outlined">edit</span> Change Photo
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-3xl text-primary/50 mb-2">add_a_photo</span>
                    <p className="text-sm font-medium text-on-surface-variant">Click to upload product photo</p>
                    <p className="text-xs text-on-surface-variant/70 mt-1">PNG, JPG or WebP (max. 2MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-on-surface">Official Trading Price (DZD or USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
                <input required value={price} onChange={e => setPrice(e.target.value)} className="w-full pl-8 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all" placeholder="0.00" type="number" step="0.01" min="0" />
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 pb-2">
              <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer" type="button">
                Cancel
              </button>
              <button className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer" type="submit">
                {initialData ? 'Save Changes' : 'Set Official Price'}

              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
