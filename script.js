const TelegramApi = require('node-telegram-bot-api');

const token = '5343000147:AAFJps63EQSrGMvks9yuBly4ogh31VvmM54';

const bot = new TelegramApi(token, {polling: true});

const chats = {};


const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}, ],
            [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}, ],
            [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}, ],
            [{text: '0', callback_data: '0'} ]
        ]
    })
}

const gameRepeat = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Играть еще раз', callback_data: '/again'}]
        ]
    })
}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю число от 0 до 9, попробуйте его отгадать.`);
    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/2b7/ff8/2b7ff812-f294-4447-9145-95fd518167ca/2.webp');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадывайте`, gameOptions);
}


const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Greeting'},
        {command: '/info', description: 'Get info'},
        {command: '/game', description: 'Get game'},
        {command: '/brofist', description: 'Come here bro'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        console.log(msg);

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/2b7/ff8/2b7ff812-f294-4447-9145-95fd518167ca/8.webp');
            return bot.sendMessage(chatId, `Привет, ${msg.from.first_name}. Я проводник в мир доступных подписок и да, я полностью к вашим услугам🙂`);

        }

        if (text === '/info') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/2b7/ff8/2b7ff812-f294-4447-9145-95fd518167ca/4.webp');
            return bot.sendMessage(chatId, `Первым делом, я скину Вам данные, по которым Вы сможете авторизоваться. От вас потребуется убедиться, что все работает как надо. Впоследствии, если вас все устроит, можете произвести оплату. Она у нас фиксированная и составляет 200 рублей за 30 дней. Оплатить можно с любой карты без комиссии. В свое распоряжение Вы получите профиль, который не придётся ни с кем делить, для его безопасности будет сгенерирован ПИН. Стоит отметить, что я располагаю только максимальными тарифами подписки, поэтому профиль может быть авторизован на всех ваших устройствах😌`)
        }
        if (text === '/game') {
            return startGame(chatId);
        }

        if (text === '/brofist') {
            await  bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/2b7/ff8/2b7ff812-f294-4447-9145-95fd518167ca/6.webp');
            return bot.sendMessage(chatId, 'Иди сюда братишка');
        }

        return bot.sendMessage(chatId, 'Извините, я Вас не понял, поменяйте запрос.');
    })



    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        console.log(msg);

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data === chats[chatId].toString()){
            return bot.sendMessage(chatId,`Поздравляю, Вы отгадали цифру! ${chats[chatId]}`, gameRepeat);
        } else {
            return bot.sendMessage(chatId,`Промазали, я загадал цифру ${chats[chatId]}`, gameRepeat);
        }
    })
}

start();