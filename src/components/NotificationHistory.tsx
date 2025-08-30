import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

interface NotificationLog {
  id: string;
  userId: string;
  detection: {
    zone: string;
    confidence: number;
    timestamp: string;
    imageUrl: string;
  };
  status: 'success' | 'failed';
  error?: string;
  createdAt: Date;
}

export function NotificationHistory() {
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);

  useEffect(() => {
    // Subscribe to email notifications
    const emailQuery = query(
      collection(db, 'email_notifications'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(emailQuery, (snapshot) => {
      const notificationLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as NotificationLog[];
      
      setNotifications(notificationLogs);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${
              notification.status === 'success'
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  Bird Detection in {notification.detection.zone}
                </h3>
                <p className="text-sm text-gray-600">
                  Confidence: {notification.detection.confidence}%
                </p>
                <p className="text-sm text-gray-600">
                  Time: {new Date(notification.detection.timestamp).toLocaleString()}
                </p>
                {notification.error && (
                  <p className="text-sm text-red-600 mt-2">
                    Error: {notification.error}
                  </p>
                )}
              </div>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  notification.status === 'success'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                }`}
              >
                {notification.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
