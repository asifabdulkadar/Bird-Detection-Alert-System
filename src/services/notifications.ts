import { db } from './firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uozcfpvkexesggtkfdtg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvemNmcHZrZXhlc2dndGtmZHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjUxMzUsImV4cCI6MjA2MzQwMTEzNX0.zTjvl-Ahpebb_se4oGv4iICa8wEnMKgEKK7FqU3fDwc'
const supabase = createClient(supabaseUrl, supabaseKey)

interface Detection {
  zone: string;
  confidence: number;
  timestamp: string;
  imageUrl: string;
}

export async function logNotification(type: 'email' | 'sms', userId: string, detection: Detection, status: 'success' | 'failed', error?: string) {
  try {
    const notificationRef = collection(db, `${type}_notifications`);
    await addDoc(notificationRef, {
      userId,
      detection,
      status,
      error: error || null,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error logging ${type} notification:`, error);
  }
}

export async function sendEmailAlert(userId: string, detection: Detection) {
  try {
    // Call the Supabase Edge Function
    const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ userId, detection }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    await logNotification('email', userId, detection, 'success');
    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    await logNotification('email', userId, detection, 'failed', errorMessage);
    throw error;
  }
};

export const sendWhatsAppAlert = async (detection: Detection) => {
  try {
    const message = encodeURIComponent(`🌾 *Bird Alert Notification* 🐦
Dear Farmer,
Bird activity has been detected in ${detection.zone} with ${detection.confidence}% confidence. Protect your crops ASAP. The system has triggered deterrents.
Stay alert,
Your AI Bird Alert System ✅`);

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ message, detection }),
    });

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message');
    }

    console.log('WhatsApp alert sent successfully');
  } catch (error) {
    console.error('Error sending WhatsApp alert:', error);
    throw error;
  }
};

export const sendSMSAlert = async (userId: string, detection: Detection) => {
  try {
    // Log to Firebase
    await addDoc(collection(db, 'sms_notifications'), {
      userId,
      detection,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    // Call Supabase Edge Function to send SMS
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: {
        userId,
        detection,
        verifyServiceSid: 'VA02849b6a7e4b59cf3a9fafa05e5eea6f'
      }
    });

    if (error) {
      console.error('Error from Supabase function:', error);
      throw error;
    }

    console.log('SMS alert sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending SMS alert:', error);
    throw error;
  }
};

export const subscribeToAlerts = async (userId: string, preferences: {
  email: boolean;
  push: boolean;
  sound: boolean;
  whatsapp: boolean;
  sms: boolean;
}) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      notificationPreferences: preferences,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};

export const testSMSAlert = async () => {
  const testDetection = {
    zone: 'Test Zone',
    confidence: 95.5,
    timestamp: new Date().toISOString(),
    imageUrl: 'https://example.com/test-image.jpg'
  };

  try {
    const result = await sendSMSAlert('test-user', testDetection);
    console.log('Test SMS sent:', result);
    return result;
  } catch (error) {
    console.error('Test SMS failed:', error);
    throw error;
  }
};