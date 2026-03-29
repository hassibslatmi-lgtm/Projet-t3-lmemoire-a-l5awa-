import React, { useState, useEffect, useRef } from 'react';

export default function SetPriceModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.product_name || '');
        setPrice(initialData.price || '');
        setImagePreview(initialData.image || '');
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
    
    const formData = new FormData();
    formData.append('product_name', name);
    // تحويل السعر لرقم لضمان التوافق مع DecimalField في Django
    formData.append('price', parseFloat(price));
    
    // إرسال الصورة فقط إذا تم اختيار ملف جديد
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      formData.append('image', fileInputRef.current.files[0]);
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#000000]/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
             <span className="material-symbols-outlined text-green-700">{initialData ? 'edit' : 'sell'}</span>
             {initialData ? 'Update Official Price' : 'Set New Official Price'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="overflow-y-auto w-full">
          <form className="p-6 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Product Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-600/50 focus:border-green-600 text-sm outline-none" placeholder="e.g. Organic Tomatoes" type="text" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Product Photo</label>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden h-40"
              >
                {imagePreview ? (
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imagePreview})` }}>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-bold text-sm gap-2">
                      <span className="material-symbols-outlined">edit</span> Change Photo
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">add_a_photo</span>
                    <p className="text-sm font-medium text-slate-500">Click to upload product photo</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Official Trading Price (DZD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">DA</span>
                <input required value={price} onChange={e => setPrice(e.target.value)} className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-600/50 focus:border-green-600 text-sm outline-none" placeholder="0.00" type="number" step="0.01" />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 pb-2">
              <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold border border-slate-300 text-slate-600 hover:bg-slate-100 transition-all" type="button">
                Cancel
              </button>
              <button className="px-6 py-2.5 rounded-xl text-sm font-bold bg-green-700 text-white shadow-lg shadow-green-700/20 hover:bg-green-800 transition-all" type="submit">
                {initialData ? 'Save Changes' : 'Set Official Price'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}