import React, { useState, useRef, useEffect } from 'react';

const mockNotifications = {
  admin: [
    { id: 1, title: 'New User Registration', description: 'Farmland Corp requested account validation.', time: '10m ago', unread: true },
    { id: 2, title: 'Market Alert', description: 'Significant supply drop detected for Onions.', time: '1h ago', unread: true },
    { id: 3, title: 'Support Ticket', description: 'Transporter Ahmed reported a route issue.', time: '2h ago', unread: false },
  ],
  farmer: [
    { id: 1, title: 'New Order Received', description: 'Order #MS-8495 placed for 50kg of Potatoes.', time: '5m ago', unread: true },
    { id: 2, title: 'Transporter Assigned', description: 'Ahmed Transporter accepted order #MS-8492.', time: '30m ago', unread: true },
    { id: 3, title: 'Product Review Added', description: 'A buyer rated your Organic Tomatoes 5 stars!', time: '1d ago', unread: false },
  ],
  buyer: [
    { id: 1, title: 'Order Shipped', description: 'Your order #MS-8493 is on the way.', time: 'Just now', unread: true },
    { id: 2, title: 'Payment Successful', description: 'Chargily payment of 3200 DZD was confirmed.', time: '2h ago', unread: false },
    { id: 3, title: 'Official Price Drop', description: 'The official price for Tomatoes has been updated.', time: '1d ago', unread: false },
  ],
  transporter: [
    { id: 1, title: 'New Delivery Available', description: 'New request available from Green Valley Farm.', time: '2m ago', unread: true },
    { id: 2, title: 'Weather Alert', description: 'Rain expected on your current delivery route.', time: '15m ago', unread: false },
    { id: 3, title: 'Delivery Confirmed', description: 'Order #MS-422 successfully marked as Delivered.', time: '2h ago', unread: false },
  ]
};

export default function NotificationDropdown({ role = 'buyer' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifications = mockNotifications[role] || mockNotifications['buyer'];
  const [localNotifications, setLocalNotifications] = useState(notifications);

  const unreadCount = localNotifications.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setLocalNotifications(localNotifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors relative cursor-pointer"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-surface"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-outline-variant/30 z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
            <h3 className="font-black text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-bold text-white bg-primary px-2.5 py-1 rounded-full shadow-sm">
                {unreadCount} new
              </span>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto w-full">
            {localNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 w-full">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_paused</span>
                <p className="text-sm">You have no notifications.</p>
              </div>
            ) : (
              <div className="flex flex-col w-full">
                {localNotifications.map(note => (
                  <div key={note.id} className={`p-4 w-full border-b border-outline-variant/10 hover:bg-slate-50 transition-colors cursor-pointer ${note.unread ? 'bg-primary/5' : 'bg-white'}`}>
                    <div className="flex gap-3">
                      <div className={`mt-1.5 size-2.5 rounded-full shrink-0 ${note.unread ? 'bg-primary' : 'bg-transparent'}`}></div>
                      <div className="flex-1 min-w-0 pr-2">
                        <p className={`text-sm truncate ${note.unread ? 'font-black text-slate-800' : 'font-bold text-slate-600'}`}>
                          {note.title}
                        </p>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-snug">
                          {note.description}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-2">
                          {note.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div 
            onClick={markAllRead}
            className="p-3 border-t border-outline-variant/20 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex justify-center items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm text-primary">done_all</span>
            <span className="text-xs font-bold text-primary uppercase tracking-wide">Mark all as read</span>
          </div>
        </div>
      )}
    </div>
  );
}
