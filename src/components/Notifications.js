import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit, where } from 'firebase/firestore';
import { Bell } from 'lucide-react';

const Notifications = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  
  // Create a user-specific key for localStorage
  const NOTIF_LAST_OPENED_KEY = `notif_last_opened_${user.uid}`;

  // Initialize lastOpenTime from localStorage to persist "read" status
  const [lastOpenTime, setLastOpenTime] = useState(() => {
    return Number(localStorage.getItem(NOTIF_LAST_OPENED_KEY)) || Date.now();
  });
  
  const notificationRef = useRef(null);
  
  // This ref holds the timestamp from *before* the dropdown was opened.
  // This allows us to show dots for items that were just marked as read.
  const prevLastOpenTime = useRef(lastOpenTime);

  useEffect(() => {
    if (!user) return;

    // Corrected Firestore query: Filtered out the current user and then ordered by creation date.
    const q = query(
      collection(db, 'notifications'),
      where('sentBy', '!=', user.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
    }, (error) => {
      console.error("Error fetching notifications:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const unreadCount = notifications.filter(
    n => (n.createdAt?.toMillis() || 0) > lastOpenTime
  ).length;

  const handleToggle = () => {
    const nextIsOpen = !isOpen;
    if (nextIsOpen) {
      // If we are opening the panel, store the current time.
      // This marks existing notifications as "read" for the next time.
      prevLastOpenTime.current = lastOpenTime;
      const now = Date.now();
      setLastOpenTime(now);
      localStorage.setItem(NOTIF_LAST_OPENED_KEY, now);
    }
    setIsOpen(nextIsOpen);
  };

  // An item is considered "new" or "unread" if its timestamp is greater
  // than the time the dropdown was *previously* opened.
  const isUnread = (notification) => {
      return (notification.createdAt?.toMillis() || 0) > prevLastOpenTime.current;
  };

  if (!user) return null;

  return (
    <div className="relative" ref={notificationRef}>
      <button onClick={handleToggle} className="relative text-gray-800 hover:text-green-600">
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-20">
          <div className="py-2 px-4 bg-gray-100 font-bold text-gray-800">Notifications</div>
          <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <li key={notif.id} className="p-4 hover:bg-gray-50 flex items-center gap-3">
                  {/* Green dot for unread items */}
                  <div className="w-2.5 h-2.5 flex-shrink-0">
                    {isUnread(notif) && (
                      <div className="w-full h-full bg-green-500 rounded-full" title="New notification"></div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-gray-800">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notif.createdAt?.toDate().toLocaleString()}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-sm text-gray-500">No new notifications.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;

