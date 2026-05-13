require('dotenv').config();
const { Telegraf } = require('telegraf');
const Groq = require('groq-sdk');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Команда /start
bot.start((ctx) => {
    ctx.reply('Привіт! Я твій AI-асистент. Напиши мені будь-яке питання!');
});

// Обробка повідомлень
bot.on('text', async (ctx) => {
    try {
        await ctx.sendChatAction('typing');
        
        // Запит до штучного інтелекту Groq
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: ctx.message.text }],
            model: 'llama3-8b-8192', // модель ШІ
        });

        const aiResponse = chatCompletion.choices[0].message.content;
        await ctx.reply(aiResponse);
        
    } catch (error) {
        console.error('Помилка:', error);
        ctx.reply('Ой, щось пішло не так...');
    }
});

bot.launch();
console.log('Бот запущений!');
