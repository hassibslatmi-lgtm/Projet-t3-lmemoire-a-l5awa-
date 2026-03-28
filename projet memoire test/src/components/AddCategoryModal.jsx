import React, { useState, useEffect, useRef } from 'react';

export default function AddCategoryModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [rawFile, setRawFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setDescription(initialData?.desc || '');
      // عرض الصورة الحالية إذا كنا في وضع التعديل
      setImagePreview(initialData?.img || ''); 
      setRawFile(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRawFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // نمرر البيانات بوضوح للدالة المستضيفة
    onSave({ 
      name, 
      desc: description, 
      imageFile: rawFile 
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-200 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">{initialData ? 'Edit' : 'New'} Category</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">close</span></button>
        </div>
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Name</label>
            <input required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-600 text-sm" placeholder="Category Name" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Image</label>
            <div onClick={() => fileInputRef.current.click()} className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center bg-gray-50 cursor-pointer overflow-hidden relative">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="preview" />
              ) : (
                <span className="material-symbols-outlined text-gray-300 text-4xl">add_a_photo</span>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-600 text-sm resize-none" rows="3"></textarea>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
            <button type="submit" className="flex-1 py-2 font-bold text-white bg-green-700 rounded-xl hover:bg-green-800 shadow-md transition-all">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}