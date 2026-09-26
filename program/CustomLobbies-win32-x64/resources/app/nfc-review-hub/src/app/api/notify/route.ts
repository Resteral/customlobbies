import { NextResponse } from 'next/server';
import { sendOrderPhoneNotification } from '@/lib/notifier';
import { DeliveryOrder, NotificationSettings } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order, settings } = body as { order: DeliveryOrder; settings?: NotificationSettings };

    if (!order) {
      return NextResponse.json({ error: 'Missing order details' }, { status: 400 });
    }

    const mergedSettings: NotificationSettings = {
      phoneNumber: settings?.phoneNumber || process.env.COURIER_DISPATCH_PHONE || '(508) 507-0305',
      enableSms: settings?.enableSms ?? true,
      enableTwilio: settings?.enableTwilio || !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
      twilioAccountSid: settings?.twilioAccountSid || process.env.TWILIO_ACCOUNT_SID,
      twilioAuthToken: settings?.twilioAuthToken || process.env.TWILIO_AUTH_TOKEN,
      twilioPhoneNumber: settings?.twilioPhoneNumber || process.env.TWILIO_PHONE_NUMBER,
      enableWhatsApp: settings?.enableWhatsApp || !!(settings?.whatsappApiKey || process.env.WHATSAPP_API_KEY),
      whatsappPhone: settings?.whatsappPhone || process.env.WHATSAPP_PHONE || settings?.phoneNumber,
      whatsappApiKey: settings?.whatsappApiKey || process.env.WHATSAPP_API_KEY,
      enableTelegram: settings?.enableTelegram || !!(settings?.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN),
      telegramBotToken: settings?.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN,
      telegramChatId: settings?.telegramChatId || process.env.TELEGRAM_CHAT_ID,
      enableDiscord: settings?.enableDiscord || !!(settings?.discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL),
      discordWebhookUrl: settings?.discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL,
      enableSoundChime: settings?.enableSoundChime ?? true,
    };

    const result = await sendOrderPhoneNotification(order, mergedSettings);

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Notification API route error:', error);
    return NextResponse.json({ error: error.message || 'Notification relay failed' }, { status: 500 });
  }
}
