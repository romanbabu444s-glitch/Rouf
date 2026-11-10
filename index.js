require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = '9028315483:AAGhg-_BCnIL3QSSRMivj1x28BYY6l7c56M';
const ADMIN_CHAT_ID = 1329606881;

const bot = new TelegramBot(token, { polling: true });

// /start কমান্ড হ্যান্ডেল করা
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || 'গ্রাহক';

    bot.sendMessage(chatId, `হ্যালো ${userName}! 👋\n\nপেমেন্ট করতে নিচের **"📷 Get bKash QR"** বাটনে ক্লিক করুন।`, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '📷 Get bKash QR Code', callback_data: 'get_qr' }]
            ]
        }
    });
});

// বাটন ক্লিক হ্যান্ডেল করা
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;

    if (query.data === 'get_qr') {
        // এখানে আপনার আপলোড করা QR কোডের Direct Link দিন
        const qrImageUrl = 'https://g40y242fTg.flowdrivecdn.com/K53U4mZNpmhcdXdML9SVq'; 

        const captionText = `📌 **bKash Payment Instructions:**\n\n` +
            `1. উপরের QR কোডটি স্ক্যান করুন অথবা 01921202882 নম্বরে Send Money / Cash In করুন।\n` +
            `2. পেমেন্ট শেষে প্রাপ্ত **TrxID (Transaction ID)** টি লিখে এই চ্যাটে পাঠান।`;

        bot.sendPhoto(chatId, qrImageUrl, {
            caption: captionText,
            parse_mode: 'Markdown'
        });
    }

    bot.answerCallbackQuery(query.id);
});

// ইউজারের TrxID মেসেজ রিসিভ করা ও অ্যাডমিনকে পাঠানো
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const userName = msg.from.first_name || 'ইউজার';
    const userHandle = msg.from.username ? `@${msg.from.username}` : 'নাই';

    if (text && !text.startsWith('/')) {
        const trxId = text.trim();

        // ইউজারকে রিপ্লাই
        bot.sendMessage(chatId, `✅ আপনার TrxID: **${trxId}** পাওয়া গেছে। যাচাই করে খুব দ্রুত জানানো হবে।`, {
            parse_mode: 'Markdown'
        });

        // অ্যাডমিনকে নোটিফিকেশন পাঠানো
        if (ADMIN_CHAT_ID) {
            const adminMsg = `🚨 **নতুন পেমেন্ট সাবমিশন!**\n\n` +
                `👤 ইউজার: ${userName} (${userHandle})\n` +
                `🆔 Chat ID: \`${chatId}\` \n` +
                `🧾 TrxID: \`${trxId}\``;

            bot.sendMessage(ADMIN_CHAT_ID, adminMsg, { parse_mode: 'Markdown' });
        }
    }
});

console.log('Bot run হচ্ছে...');
