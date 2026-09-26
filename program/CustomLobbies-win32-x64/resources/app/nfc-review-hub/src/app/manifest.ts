import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Townraise | Sovereign Local Network & Courier HUD',
    short_name: 'Townraise',
    description: 'Sovereign local commerce network, programmable NFC hardware, real-time courier dispatch, and interactive scavenger hunts across Carroll County & Western Maine.',
    start_url: '/',
    id: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#070709',
    theme_color: '#070709',
    orientation: 'portrait-primary',
    categories: ['business', 'shopping', 'lifestyle', 'productivity', 'food'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    shortcuts: [
      {
        name: '🚚 Courier Driver HUD',
        short_name: 'Driver Console',
        description: 'Open in-vehicle delivery driver HUD and live shift telemetry',
        url: '/driver',
      },
      {
        name: '🥪 Local Eats & Menus',
        short_name: 'Local Eats',
        description: 'Browse local restaurant specials and order food delivery',
        url: '/eats',
      },
      {
        name: '👑 Vanguard Admin Studio',
        short_name: 'Admin',
        description: 'Master automation suite and platform command center',
        url: '/dashboard/admin',
      },
      {
        name: '⚡ NFC Hardware Lab',
        short_name: 'NFC Lab',
        description: 'Manage NFC cards, review funnels, and contactless beacons',
        url: '/dashboard',
      },
      {
        name: '🧭 Tourist Hunts & Passports',
        short_name: 'Scavenger Hunt',
        description: 'Explore Carroll County trail checkpoints and stamp your passport',
        url: '/tourist-hunts',
      },
    ],
  };
}
