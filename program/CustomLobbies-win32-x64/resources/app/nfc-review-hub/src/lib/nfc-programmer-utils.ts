import { NfcCardConfig, NfcCardProfileType } from './types';

export interface NfcToolsFormattedPayload {
  title: string;
  recordType: 'URL' | 'vCard' | 'Wi-Fi' | 'Text' | 'Custom';
  payload: string;
  estimatedBytes: number;
  recommendedChip: 'NTAG213' | 'NTAG215' | 'NTAG216';
  instructions: string;
}

/**
 * Builds the effective target URL for a given card configuration
 */
export function buildCardTargetUrl(card: NfcCardConfig, origin?: string): string {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://townraise.org');

  switch (card.profileType) {
    case 'digital_biz_card':
      if (card.contactWebsite) return card.contactWebsite;
      return `${base}/tap/${card.id}`;

    case 'menu_tap_to_order':
      if (card.storefrontSlug) {
        const tableParam = card.tableNumber ? `?table=${encodeURIComponent(card.tableNumber)}` : '';
        return `${base}/site/${card.storefrontSlug}${tableParam}`;
      }
      return `${base}/tap/${card.id}`;

    case 'google_review_booster':
      if (card.mode === 'direct_google' && card.googleReviewUrl) {
        return card.googleReviewUrl;
      }
      return `${base}/tap/${card.id}`;

    case 'loyalty_rewards':
      return `${base}/rewards?wallet=${encodeURIComponent(card.loyaltyWalletId || card.id)}`;

    case 'event_vip_pass':
      return `${base}/events?pass=${encodeURIComponent(card.ticketId || card.id)}`;

    case 'airbnb_wifi_plaque':
      if (card.cabinHouseGuideUrl) return card.cabinHouseGuideUrl;
      return `${base}/tap/${card.id}`;

    case 'scavenger_hunt_beacon':
      return `${base}/store-hunting?beacon=${encodeURIComponent(card.huntBeaconId || card.id)}`;

    case 'admin_management_pass':
      const magicParam = card.adminMagicToken ? `?magicToken=${encodeURIComponent(card.adminMagicToken)}` : '';
      return `${base}/tap/${card.id}${magicParam}`;

    case 'custom_url':
      return card.directTargetUrl || card.googleReviewUrl || `${base}/tap/${card.id}`;

    default:
      return `${base}/tap/${card.id}`;
  }
}

/**
 * Generates standard vCard 3.0 text content for digital business cards
 */
export function generateVCard30(card: NfcCardConfig): string {
  const name = card.contactFullName || card.businessName || 'Contact';
  const nameParts = name.split(' ');
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  const firstName = nameParts[0] || '';

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${name}`,
  ];

  if (card.contactCompany || card.businessName) {
    lines.push(`ORG:${card.contactCompany || card.businessName}`);
  }
  if (card.contactTitle) {
    lines.push(`TITLE:${card.contactTitle}`);
  }
  if (card.contactPhone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${card.contactPhone}`);
  }
  if (card.contactEmail) {
    lines.push(`EMAIL;TYPE=PREF,INTERNET:${card.contactEmail}`);
  }
  if (card.contactWebsite) {
    lines.push(`URL:${card.contactWebsite}`);
  }
  if (card.contactAddress) {
    lines.push(`ADR;TYPE=WORK:;;${card.contactAddress};;;;`);
  }
  if (card.contactBio || card.notes) {
    lines.push(`NOTE:${card.contactBio || card.notes}`);
  }
  if (card.contactLinkedIn) {
    lines.push(`X-SOCIALPROFILE;type=linkedin:${card.contactLinkedIn}`);
  }
  if (card.contactInstagram) {
    lines.push(`X-SOCIALPROFILE;type=instagram:${card.contactInstagram}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/**
 * Generates Wi-Fi NDEF string configuration (standard format understood by iOS and Android)
 */
export function generateWifiNdefString(card: NfcCardConfig): string {
  const ssid = card.wifiSsid || 'Guest-WiFi';
  const type = card.wifiAuthType || 'WPA';
  const pass = card.wifiPassword || '';
  return `WIFI:T:${type};S:${ssid};P:${pass};;`;
}

/**
 * Formats a ready-to-use payload for the standalone NFC Tools App or Desktop Hardware Writers
 */
export function formatPayloadForNfcTools(card: NfcCardConfig, origin?: string): NfcToolsFormattedPayload {
  const targetUrl = buildCardTargetUrl(card, origin);

  if (card.profileType === 'airbnb_wifi_plaque' && card.wifiSsid) {
    const wifiPayload = generateWifiNdefString(card);
    const bytes = new Blob([wifiPayload]).size;
    return {
      title: `${card.businessName} - Wi-Fi NDEF Network Tag`,
      recordType: 'Wi-Fi',
      payload: wifiPayload,
      estimatedBytes: bytes,
      recommendedChip: bytes > 130 ? 'NTAG215' : 'NTAG213',
      instructions: 'Open NFC Tools > Write > Add a record > Wi-Fi Network. Paste SSID and password or write raw Wi-Fi string.'
    };
  }

  if (card.profileType === 'digital_biz_card' && card.contactFullName) {
    const vcard = generateVCard30(card);
    const bytes = new Blob([vcard]).size;
    return {
      title: `${card.contactFullName} - Digital vCard 3.0 Profile`,
      recordType: 'vCard',
      payload: vcard,
      estimatedBytes: bytes,
      recommendedChip: bytes > 450 ? 'NTAG216' : (bytes > 130 ? 'NTAG215' : 'NTAG213'),
      instructions: 'Open NFC Tools > Write > Add a record > Contact (vCard). Paste the generated vCard payload directly.'
    };
  }

  // URL Payload (Smart Funnel, Menu, Google Reviews, Scavenger Hunt, Custom)
  const bytes = new Blob([targetUrl]).size;
  return {
    title: `${card.businessName} - ${card.cardName}`,
    recordType: 'URL',
    payload: targetUrl,
    estimatedBytes: bytes,
    recommendedChip: 'NTAG213',
    instructions: 'Open NFC Tools > Write > Add a record > Custom URL / URI. Paste the live link and tap blank tag to encode.'
  };
}

/**
 * Triggers a client-side file download
 */
export function triggerFileDownload(filename: string, content: string, mimeType: string) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports all stored cards as a CSV manifest for batch factory printing & laser encoders
 */
export function exportCardsAsCsv(cards: NfcCardConfig[], origin?: string): string {
  const headers = [
    'ID',
    'Card Name',
    'Business Name',
    'Profile Type',
    'Chip Type',
    'Chip UID',
    'Hardware Form Factor',
    'Town',
    'Target Live URL',
    'Active Status',
    'Total Taps',
    'Google Conversions',
    'Assigned Staff',
    'Assigned Location',
    'Notes',
    'Created At'
  ];

  const rows = cards.map(c => [
    `"${c.id}"`,
    `"${(c.cardName || '').replace(/"/g, '""')}"`,
    `"${(c.businessName || '').replace(/"/g, '""')}"`,
    `"${c.profileType || 'google_review_booster'}"`,
    `"${c.chipType || 'NTAG215'}"`,
    `"${c.chipUid || ''}"`,
    `"${c.hardwareFormFactor || 'pvc_card'}"`,
    `"${(c.town || 'Effingham, NH').replace(/"/g, '""')}"`,
    `"${buildCardTargetUrl(c, origin)}"`,
    `"${c.active ? 'Active' : 'Inactive'}"`,
    c.totalTaps || 0,
    c.googleConversions || 0,
    `"${(c.assignedStaff || '').replace(/"/g, '""')}"`,
    `"${(c.assignedLocation || '').replace(/"/g, '""')}"`,
    `"${(c.notes || '').replace(/"/g, '""')}"`,
    `"${c.createdAt || ''}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
}

/**
 * Web NFC Browser Writing Engine (NDEFReader API)
 */
export async function writeNfcWithWebNfc(
  payload: string, 
  recordType: 'url' | 'text' | 'mime' = 'url',
  mimeType: string = 'text/vcard'
): Promise<{ success: boolean; serialNumber?: string; error?: string }> {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Web NFC is only available in a browser environment.' };
  }

  // Check if NDEFReader is supported in current browser
  if (!('NDEFReader' in window)) {
    return {
      success: false,
      error: 'Web NFC is not supported on this browser. Web NFC requires Chrome for Android or a Web NFC-enabled browser. Use our 1-click NFC Tools exporter or QR companion below!'
    };
  }

  try {
    // @ts-ignore
    const ndef = new window.NDEFReader();
    
    let record: any;
    if (recordType === 'url') {
      record = { recordType: 'url', data: payload };
    } else if (recordType === 'mime') {
      const encoder = new TextEncoder();
      record = { recordType: 'mime', mediaType: mimeType, data: encoder.encode(payload) };
    } else {
      record = { recordType: 'text', data: payload };
    }

    await ndef.write({ records: [record] });
    return { success: true };
  } catch (err: any) {
    if (err.name === 'NotAllowedError') {
      return { success: false, error: 'NFC permission was denied by the user.' };
    }
    return { success: false, error: err.message || 'Failed to write NFC chip. Please hold tag firmly against device.' };
  }
}

/**
 * Web NFC Browser Reading / Scanner Engine
 */
export async function scanNfcWithWebNfc(): Promise<{ success: boolean; serialNumber?: string; records?: string[]; error?: string }> {
  if (typeof window === 'undefined' || !('NDEFReader' in window)) {
    return {
      success: false,
      error: 'Web NFC scanning requires Chrome on Android or compatible Web NFC hardware.'
    };
  }

  try {
    // @ts-ignore
    const ndef = new window.NDEFReader();
    await ndef.scan();

    return new Promise((resolve) => {
      ndef.addEventListener('reading', ({ message, serialNumber }: any) => {
        const decodedRecords: string[] = [];
        for (const record of message.records) {
          const textDecoder = new TextDecoder(record.encoding || 'utf-8');
          decodedRecords.push(textDecoder.decode(record.data));
        }
        resolve({
          success: true,
          serialNumber: serialNumber || '04:A1:B2:C3:D4:E5:F6',
          records: decodedRecords
        });
      }, { once: true });

      ndef.addEventListener('readingerror', () => {
        resolve({ success: false, error: 'Could not read data from NFC tag. Tag may be damaged or unsupported.' });
      }, { once: true });
    });
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to start Web NFC scanner.' };
  }
}
