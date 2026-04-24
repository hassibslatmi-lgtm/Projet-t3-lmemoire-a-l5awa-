import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

export default function NotificationDropdown({ role = 'buyer' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [localNotifications, setLocalNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = localNotifications.filter(n => !n.is_read).length;

  const fetchNotifications = async () => {
    const token = localStorage.getItem('agrigov_token');
    if (!token) return;

    try {
      const response = await axios.get(`${BASE_URL}/api/notifications/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setLocalNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Real-time polling every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(interval);
    };
  }, []);

  const handleNotificationClick = async (id, isRead) => {
    if (isRead) return;

    const token = localStorage.getItem('agrigov_token');
    try {
      // Immediate UI update
      setLocalNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      
      // Backend update
      await axios.patch(`${BASE_URL}/api/notifications/${id}/read/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Rollback on error if necessary, but usually better to stay responsive
    }
  };

  const markAllRead = async () => {
    const token = localStorage.getItem('agrigov_token');
    const unreadIds = localNotifications.filter(n => !n.is_read).map(n => n.id);
    
    if (unreadIds.length === 0) return;

    try {
      // Immediate UI update
      setLocalNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

      // Call individual read for each (since no bulk endpoint exists)
      await Promise.all(unreadIds.map(id => 
        axios.patch(`${BASE_URL}/api/notifications/${id}/read/`, {}, {
          headers: { Authorization: `Token ${token}` }
        })
      ));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
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
                <p className="text-sm">{loading ? 'Checking...' : 'You have no notifications.'}</p>
              </div>
            ) : (
              <div className="flex flex-col w-full">
                {localNotifications.map(note => (
                  <div 
                    key={note.id} 
                    onClick={() => handleNotificationClick(note.id, note.is_read)}
                    className={`p-4 w-full border-b border-outline-variant/10 hover:bg-slate-50 transition-colors cursor-pointer ${!note.is_read ? 'bg-primary/5' : 'bg-white'}`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1.5 size-2.5 rounded-full shrink-0 ${!note.is_read ? 'bg-primary' : 'bg-transparent'}`}></div>
                      <div className="flex-1 min-w-0 pr-2">
                        <p className={`text-sm truncate ${!note.is_read ? 'font-black text-slate-800' : 'font-bold text-slate-600'}`}>
                          {note.verb}
                        </p>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-snug">
                          {note.order_id ? `Order #${note.order_id} update.` : 'System notification.'}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-2">
                          {note.time_ago}
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
