// Townraise Push Notification & Audio Chime Service
export interface AppNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
  soundType?: 'order' | 'tap' | 'feedback' | 'sms' | 'bounty' | 'alert';
}

// 1. Check Notification Support
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

// 2. Get Current Permission Status
export function getNotificationPermissionStatus(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

// 3. Request Notification Permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported on this device/browser.');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      playChimeSound('order');
      triggerVibration([100, 50, 100]);
    }
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

// 4. Web Audio Synthesized Chime Sounds
export function playChimeSound(type: 'order' | 'tap' | 'feedback' | 'sms' | 'bounty' | 'alert' = 'order') {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    if (type === 'order') {
      // Energetic high-priority order bell (Two-tone ascending)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      osc2.frequency.setValueAtTime(880, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.7);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.7);
    } else if (type === 'tap') {
      // NFC Tap Crystal Ping
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.50, now); // C6
      osc.frequency.exponentialRampToValueAtTime(1567.98, now + 0.1); // G6
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'bounty') {
      // Victory Fanfare Triad
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.2, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.35);
      });
    } else if (type === 'sms') {
      // Quick message double-tick
      [750, 950].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.12);
      });
    } else {
      // Standard warm notification
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {
    console.warn('Audio chime failed:', e);
  }
}

// 5. Tactile Vibration
export function triggerVibration(pattern: number[] = [150, 75, 150]) {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignored if vibration is disabled or unsupported
    }
  }
}

// 6. Send Native App / Push Notification
export async function sendAppNotification({
  title,
  body,
  icon = '/icon-192.png',
  badge = '/icon-192.png',
  url = '/',
  tag = 'townraise-notification',
  soundType = 'order',
}: AppNotificationPayload) {
  // Always trigger sound & haptic vibration
  playChimeSound(soundType);
  triggerVibration([200, 100, 200]);

  // Dispatch custom in-app broadcast event for UI toasts
  if (typeof window !== 'undefined') {
    const customEvent = new CustomEvent('townraise_in_app_notification', {
      detail: { title, body, icon, url, tag, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(customEvent);
  }

  // Check if native Notifications are supported & granted
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  // 1. Try Service Worker ShowNotification (PWA / Mobile Safari / Android Chrome standard)
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration && 'showNotification' in registration) {
        await registration.showNotification(title, {
          body,
          icon,
          badge,
          tag,
          vibrate: [200, 100, 200, 100, 300],
          data: { url },
          actions: [
            { action: 'open', title: 'Open in Townraise' },
          ]
        } as NotificationOptions);
        return;
      }
    } catch (swErr) {
      console.warn('ServiceWorker notification failed, trying fallback:', swErr);
    }
  }

  // 2. Direct Window Notification Fallback
  try {
    const notification = new Notification(title, {
      body,
      icon,
      badge,
      tag,
      data: { url },
    });

    notification.onclick = (e) => {
      e.preventDefault();
      window.focus();
      if (url && typeof window !== 'undefined') {
        window.location.href = url;
      }
      notification.close();
    };
  } catch (err) {
    console.warn('Standard window notification failed:', err);
  }
}
