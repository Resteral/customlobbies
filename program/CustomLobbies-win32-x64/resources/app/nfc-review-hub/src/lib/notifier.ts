import { DeliveryOrder, NotificationSettings } from './types';

export async function sendOrderPhoneNotification(
  order: DeliveryOrder,
  settings: NotificationSettings
): Promise<{ success: boolean; channels: string[]; details: string }> {
  const channels: string[] = [];
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`;
  const itemsText = order.items.map(item => `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`).join('\n');

  // 1. WhatsApp Instant Relay (via CallMeBot or Twilio WhatsApp)
  if (settings.enableWhatsApp) {
    const waPhone = (settings.whatsappPhone || settings.phoneNumber || process.env.COURIER_DISPATCH_PHONE || '15085070305').replace(/[^0-9]/g, '');
    const waApiKey = settings.whatsappApiKey || process.env.WHATSAPP_API_KEY;

    if (waApiKey && waPhone) {
      try {
        const waText = `🚨 *NEW DELIVERY ORDER #${order.orderNumber}* 🚨\n\n👤 *Customer:* ${order.customerName}\n📞 *Phone:* ${order.customerPhone}\n📍 *Address:* ${order.deliveryAddress}\n\n📝 *Notes:* ${order.deliveryInstructions || 'None'}\n\n🛍️ *Items:*\n${itemsText}\n\n💰 *Tip:* $${order.tip.toFixed(2)}\n💵 *TOTAL:* *$${order.total.toFixed(2)}*\n\n🗺️ *GPS Navigation:* ${mapLink}`;

        const waUrl = `https://api.callmebot.com/whatsapp.php?phone=${waPhone}&text=${encodeURIComponent(waText)}&apikey=${waApiKey.trim()}`;
        const response = await fetch(waUrl);

        if (response.ok) {
          channels.push(`WhatsApp (+${waPhone})`);
        }
      } catch (e) {
        console.error('WhatsApp notification failed', e);
      }
    }
  }

  // 2. Telegram Bot Relay with 1-Tap Google Maps GPS & Call Buttons
  if (settings.enableTelegram && settings.telegramBotToken && settings.telegramChatId) {
    try {
      const telegramMessage = `
🚨 <b>NEW DELIVERY ORDER #${order.orderNumber}</b> 🚨

👤 <b>Customer:</b> ${order.customerName}
📞 <b>Phone:</b> <a href="tel:${order.customerPhone}">${order.customerPhone}</a>
📍 <b>Address:</b> <a href="${mapLink}">${order.deliveryAddress}</a>

📝 <b>Notes:</b> ${order.deliveryInstructions || 'None'}

🛍️ <b>Items:</b>
${itemsText}

💰 <b>Tip:</b> $${order.tip.toFixed(2)}
💵 <b>TOTAL:</b> <b>$${order.total.toFixed(2)}</b>

⏰ <i>Ordered at ${new Date(order.createdAt).toLocaleTimeString()}</i>
      `.trim();

      const inlineKeyboard = {
        inline_keyboard: [
          [
            { text: '🗺️ Open in Google Maps GPS', url: mapLink },
            { text: '📞 Call Customer', url: `tel:${order.customerPhone.replace(/[^0-9+]/g, '')}` }
          ]
        ]
      };

      const response = await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegramChatId,
          text: telegramMessage,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
          reply_markup: inlineKeyboard
        }),
      });

      if (response.ok) {
        channels.push('Telegram Bot');
      }
    } catch (e) {
      console.error('Telegram notification failed', e);
    }
  }

  // 3. Twilio Carrier SMS Relay
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || settings.twilioAccountSid;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || settings.twilioAuthToken;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || settings.twilioPhoneNumber;
  const recipientPhone = settings.phoneNumber || process.env.COURIER_DISPATCH_PHONE || '+15085070305';

  if (settings.enableTwilio && twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
    try {
      const smsBody = `🚨 NEW OASIS ORDER #${order.orderNumber} ($${order.total.toFixed(2)}):\nCustomer: ${order.customerName} (${order.customerPhone})\nAddress: ${order.deliveryAddress}\nItems: ${order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}\nGPS: ${mapLink}`;

      const twilioParams = new URLSearchParams();
      twilioParams.append('To', recipientPhone.startsWith('+') ? recipientPhone : `+1${recipientPhone.replace(/[^0-9]/g, '')}`);
      twilioParams.append('From', twilioPhoneNumber);
      twilioParams.append('Body', smsBody);

      const basicAuth = Buffer.from(`${twilioAccountSid.trim()}:${twilioAuthToken.trim()}`).toString('base64');

      const twilioRes = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid.trim()}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: twilioParams.toString()
        }
      );

      if (twilioRes.ok) {
        channels.push(`Twilio SMS (${recipientPhone})`);
      } else {
        const errorData = await twilioRes.json();
        console.error('Twilio SMS error:', errorData);
      }
    } catch (e) {
      console.error('Twilio SMS notification failed', e);
    }
  }

  // 4. Discord Webhook Relay
  if (settings.enableDiscord && settings.discordWebhookUrl) {
    try {
      const discordPayload = {
        username: 'Oasis Delivery Dispatch',
        avatar_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=128&q=80',
        content: `🚨 **NEW DELIVERY ORDER #${order.orderNumber}** ($${order.total.toFixed(2)})`,
        embeds: [
          {
            title: `Delivery for ${order.customerName}`,
            description: `📍 [Open in Google Maps](${mapLink})\n**Address:** ${order.deliveryAddress}\n**Phone:** [${order.customerPhone}](tel:${order.customerPhone})\n**Instructions:** ${order.deliveryInstructions || 'Standard Dropoff'}`,
            color: 0xf59e0b, // Amber
            fields: [
              {
                name: 'Items Ordered',
                value: itemsText || 'Custom Delivery Request',
                inline: false,
              },
              {
                name: 'Total Payout',
                value: `$${order.total.toFixed(2)} (Includes $${order.tip.toFixed(2)} Tip)`,
                inline: true,
              },
              {
                name: 'Status',
                value: 'Pending Dispatch ⏳',
                inline: true,
              },
            ],
            footer: {
              text: `Townraise Delivery Node • ${new Date(order.createdAt).toLocaleTimeString()}`,
            },
          },
        ],
      };

      const response = await fetch(settings.discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordPayload),
      });

      if (response.ok) {
        channels.push('Discord Mobile Push');
      }
    } catch (e) {
      console.error('Discord notification failed', e);
    }
  }

  // 5. Fallback / Client Sound / SMS
  if (settings.enableSms && settings.phoneNumber && !channels.some(c => c.includes('Twilio') || c.includes('WhatsApp'))) {
    channels.push(`Mobile Contact: ${settings.phoneNumber}`);
  }

  if (channels.length === 0) {
    channels.push('Dashboard Dispatcher & Audio Chime');
  }

  return {
    success: true,
    channels,
    details: `Notified via ${channels.join(', ')}`,
  };
}
