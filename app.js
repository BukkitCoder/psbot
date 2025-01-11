// функция нужна чтобы легко можно было выбирать случайный элемент из массива
Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Создаем пустой массив для хранения userId
let userIds = []; // для хранения тех, кто использовал команду "димушка крутой"
let userIds2 = []; // для отображения всех доступных команд 1 раз, а не после каждого сообщения
let blacklist = []; // для хранения людей, которые в черном списке бота

let users = {}; // для хранения людей из модуля "коины"
const coinCourse = 500;

function addUser(userId, coins) {
    users[userId] = {
        userId: userId,
        coins: coins
    }
}

function getUser(userId) {
    return users[userId];
}

let availableCmds = [
    "хочу подарок",
    "димушка крутой",
    "магия",
    "рандом",
    "выбери",
    "данет",
    "!очистить список",
    "бот",
    "пинг",
    "кинг",
    "кошка",
    "плюс",
    "бот кик",
    "@",
    "формат",
    "пример",
    "ковш",
    "команды",
];

function generatePrimer() {
    const numbers = [];
    const operations = [];
    const operators = ['+', '-'];
    
    // Генерируем 7 случайных чисел от 0 до 10
    for (let i = 0; i < 7; i++) {
        numbers.push(Math.floor(Math.random() * 11));
    }

    // Генерируем 6 случайных операторов
    for (let i = 0; i < 6; i++) {
        operations.push(operators[Math.floor(Math.random() * operators.length)]);
    }

    // Формируем математическое выражение
    let example = '';
    for (let i = 0; i < 7; i++) {
        example += numbers[i];
        if (i < 6) {
            example += ` ${operations[i]} `;
        }
    }

    // Вычисляем ответ
    let answer = numbers[0];
    for (let i = 0; i < 6; i++) {
        if (operations[i] === '+') {
            answer += numbers[i + 1];
        } else {
            answer -= numbers[i + 1];
        }
    }

    // Возвращаем объект с примером и ответом
    return {
        example,
        answer
    };
}

function replaceLetters(style, input) {
    const alphabet = "абвгдежзийклмнопрстуфхцчшщъыьэюяabcdefghijklmnopqrstuvwxyz";

    const stylesMap = {
        'smallcapital': "ᴀбʙᴦдᴇжзийᴋᴧʍноᴨᴩᴄᴛуɸхцчɯщъыь϶юяᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ",
        'bubble': "абвгдежзийклмнопрстуфхцчшщъыьэюяⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ"
        //'monospace': "𝚊𝚋𝚟𝚐𝚍𝚎𝚣𝚑𝚣𝚒𝚢𝚔𝚕𝚖𝚗𝚘𝚙𝚛𝚜𝚝𝚞𝚏𝚑𝚌𝚌𝚑𝚜𝚑𝚜𝚌𝚑𝚢𝚎𝚢𝚞𝚢𝚊𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚟𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣"
        //'boldgothic': "𝖆𝖇𝖛𝖌𝖉𝖊𝖟𝖍𝖟𝖎𝖞𝖐𝖑𝖒𝖓𝖔𝖕𝖗𝖘𝖙𝖚𝖋𝖍𝖈𝖈𝖍𝖘𝖍𝖘𝖈𝖍𝖞𝖊𝖞𝖚𝖞𝖆𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟",
        //'bolditalic': "𝙖𝙗𝙫𝙜𝙙𝙚𝙯𝙝𝙯𝙞𝙮𝙠𝙡𝙢𝙣𝙤𝙥𝙧𝙨𝙩𝙪𝙛𝙝𝙘𝙘𝙝𝙨𝙝𝙨𝙘𝙝𝙮𝙚𝙢𝙮𝙪𝙮𝙖𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯",
        //'bold': "𝐚𝐛𝐯𝐠𝐝𝐞𝐳𝐡𝐳𝐢𝐲𝐤𝐥𝐦𝐧𝐨𝐩𝐫𝐬𝐭𝐮𝐟𝐡𝐜𝐜𝐡𝐬𝐡𝐬𝐜𝐡𝐲𝐞𝐲𝐮𝐲𝐚𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐗𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐧"
    };

    const lowerCaseStyle = style.toLowerCase();

    if (!stylesMap[lowerCaseStyle]) {
        return 'Используйте: формат (формат) (текст). Существующие форматы: SmallCapital(только русские и англ. буквы), Bubble(только англ. буквы)';
    }

    const selectedStyle = stylesMap[lowerCaseStyle];
    const replacementMap = {};

    for (let i = 0; i < alphabet.length; i++) {
        replacementMap[alphabet[i]] = selectedStyle[i];
    }

    let result = '';
    for (let char of input) {
        result += replacementMap[char] || char; // Заменяем символ или оставляем оригинал
    }

    return result; // Возвращаем итоговую строку
}

// функция возвращает случайное число в диапазоне от min до max, например 10,20 вернёт число от 10 до 20 (включительно)
function randomMinMax(min, max) {
    return Math.round(min + (max - min) * Math.random());
}

// текущее время (timestamp) в секундах (начиная с 1 января 1970 года)
function time() {
    return Math.floor(Date.now() / 1000);
}

const fs = require('fs'); // для работы с файловой системой
const { Bot, log } = require('./bot'); // сам бот
var bot = new Bot();
var adminCmds = {};

// является ли отправитель другом, без добавления в друзья бот не может дарить подарки, отправлять сообщения в любое время
function checkDrug(user) {
    if (bot.botInfo) {
        if (user.id == bot.botInfo.owner || user.botDrug) return true;
    }
    return false;
}

// проверка прав админа (владелец бота)
function checkAdmin(user) {
    var adminIds = []; // если нужно выдать права админа, укажите список id игроков через запятую, но будьте осторожны, получив управление - игроки смогут менять ник, инфу о себе, и даже кикнуть бота

    // проверяем id отправителя с id владельца бота (свойство owner в объекте botInfo)
    if (bot.botInfo && user.id == bot.botInfo.owner) return true;

    // если не нашли, проверяем id из списка
    if (adminIds.indexOf(user.id) > -1) return true;

    // если не нашли, значит точно отправитель без прав админа, возвращаем false
    return false;
}

function cmdWord(name, value, props) {
    if (!props) props = {};
    if (name && value) {
        bot.cmd(name, (user, words) => {
            if (words.length == 0) return { ...props, msg: value, type: 'message' };
        });
    }
}

function addAdminCmd(name, method) {
    adminCmds[name] = { type: 'api', v: method };
}

addAdminCmd('ник', 'bot.nickChange');
addAdminCmd('цвет', 'bot.nickColorChange');
addAdminCmd('пол', 'bot.polChange');
addAdminCmd('осебе', 'bot.textInfoChange');
addAdminCmd('друзья', 'bot.friends');

// добавляем команды которые обрабатывают одно слово, например если ввести пинг, бот отправит ПОНГ, третий параметр это свойства, туда можно передать цвет сообщения
var mainProps = { color: ['#FFFFFF'] }; // FFFFFF в hex формате это белый цвет (255 255 255) 

cmdWord('пинг', 'ПОНГ', mainProps);
cmdWord('кинг', 'КОНГ', mainProps);
cmdWord('кошка', 'МЫШКА', { color: ['#f1a0b3', '#FFFF00'] }); // пусть текст МЫШКА будет цветным

// запуск бота
bot.run((info) => {
    setInterval(() => {
        bot.api('bot.friends', {}, (res) => {
            if (res.error) { // Если ошибка, отправляем в консоль и игроку
                console.log(res.error.msg);
                bot.sendMessage(user.id, 'Ошибка: ' + res.error.msg);
            }
        });
    }, 60000); // 60000 миллисекунд = 1 минута


    // когда авторизация прошла успешно, в info будет передан объект бота, и можно уже начинать работать!
    log('бот', info);

    fs.readFile('array.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка при чтении файла:', err);
        } else {
            const retrievedArray = JSON.parse(data);
            blacklist = retrievedArray;
            console.log('Извлеченный массив:', retrievedArray);
        }
    });

    fs.readFile('coindata.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка при чтении файла:', err);
        } else {
            const retrievedArray = JSON.parse(data);
            users = retrievedArray;
            console.log('Извлеченный массив:', retrievedArray);
        }
    });
    // отправляем сообщение владельцу что бот в сети. Владельца мы знаем, в объекте бота есть свойство owner, это и есть id владельца, но можно ввести другой id игрока, если бот в друзьях то сообщение дойдёт!
    bot.sendMessage(info.owner, 'Мой владелец, я в сети*em3*', { color: ['#f1a0b3', '#FFFF00', '#54EFF7'] });
});

// Команды

bot.cmd('бот', (user, words) => {

    if (words.length == 0) { // если только команда бот (и нет больше слов в массиве words)
        return { msg: 'На месте*em1*', color: ['#f1a0b3'] };
    }

    if (checkAdmin(user)) { // если отправитель владелец бота (админ) то разрешаем управление ботом
        if (words && words.length > 0) {
            var cmd = words.shift();
            var val = words.join(' ');
            if (cmd == 'кик' && words.length == 0) { // кикнуть бота, после выполнения соединение с ботом закрывается
                var tm = -1;
                var cbExit = () => {
                    if (tm != -1) clearTimeout(tm);
                    process.exit();
                };
                tm = setTimeout(cbExit, 3000);
                bot.sendMessage(user.id, 'Пока!', { color: '#FFFFFF' }, cbExit);
                return true;
            }

            if (cmd && cmd in adminCmds) {
                var cmdInfo = adminCmds[cmd];
                var methodApi = (cmdInfo.type == 'api') ? cmdInfo.v : null;
                if (methodApi) {
                    // если найдена админ команда, обращаемся к api
                    bot.api(methodApi, { v: val }, (res) => {
                        //console.log('api result',res);
                        var msgTxt = null;
                        if (res && res.error && res.error.msg) { // если произошла ошибка и есть текст ошибки, то выбираем его
                            msgTxt = res.error.msg;
                        }
                        else if (res && res.msg) { // если не ошибка, и есть какой-то текст, выбираем его
                            msgTxt = res.msg;
                        }
                        if (cmd == 'друзья') { // если команда друзья (это список id игроков кто добавил бота в друзья) для удобства массив переводим в строку (текст) через .join
                            if (res && Array.isArray(res)) {
                                if (res.length > 0) msgTxt = 'Всего ' + res.length + ' - ' + res.join(',');
                                else msgTxt = 'Нет друзей';
                            }
                        }
                        if (msgTxt) { // если есть текст (может это ошибка от api, а может информация) отправляем этот текст 
                            bot.sendMessage(user.id, msgTxt, { color: '#FFFFFF' });
                        }
                    });
                }
                return true;
            }
        }
    }
});

bot.cmd('данет', (user, words) => {
    if (!blacklist.includes(user.id)) {
        if (words.length > 0) {
            var rnd = Math.random(); // выдаёт случайное число от 0 до 0.99
            var txt = words.join(' ');
            var v = 'да'; // по умолчанию "да"
            if (rnd > 0.5) v = 'нет'; // если число больше 0.5 тогда будет "нет"
            if (rnd > 0.9) v = 'не знаю'; // если число больше 0.9 (оно выпадает не часто) тогда будет "не знаю"
            return '"' + txt + '" (' + v + ')';
        }
    } else {
        bot.sendMessage(user.id, 'Бот на Вас обиделся и не хочет с Вами разговаривать. Владелец -> @id' + bot.botInfo.owner);
    }
});

bot.cmd('выбери', (user, words) => {
    if (!blacklist.includes(user.id)) {
        var txt = words.join(' '); // переводим все слова из массива в строку
        var spl = txt.split(' или '); // разделяем через " или " например апельсин или яблоко, пробелы обязательно, иначе команда будет работать подругому, вместо "или" может быть любое слово, например гав, тогда логика команды поменяется, нужно будет писать выбери апельсин гав яблоко
        if (spl.length > 1) { // если в массиве после разделения больше одного слова, тогда можно отправлять результат
            return 'Я выбираю: ' + spl.random();
        }
    } else {
        bot.sendMessage(user.id, 'Бот на Вас обиделся и не хочет с Вами разговаривать. Владелец -> @id' + bot.botInfo.owner);
    }
});

//bot.cmd('скажи',(user,words)=>{
//var txt=words.join(' '); // переводим все слова из массива в строку
//if(txt){
//var colorsArr=[ ['#f1a0b3', '#FFFF00'], ['#FFFFFF', '#54EFF7'] ]; // массив, в котором хранятся цвета тоже в виде массива
//var color=colorsArr.random(); // выбираем случайный массив
// и отправляем этот же текст, только уже делаем его цветным
//return {color:color, msg:txt};
//}
//});

bot.cmd('рандом', (user, words) => {
    if (!blacklist.includes(user.id)) {
        var n1 = 0;
        var n2 = 0;
        if (words.length > 0) {
            if (words.length > 1) { // если передано больше 1 числа (от-до)
                n1 = parseInt(words[0]) || 0;
                n2 = parseInt(words[1]) || 0;
            } else { // если только одно число
                n2 = parseInt(words[0]) || 0;
            }
            if (n1 != n2 && n2 > n1) { // если число n1 не равно n2 И ЕСЛИ (&&) второе число больше первого, тогда генерируем случайное число от n1 до n2
                return randomMinMax(n1, n2);
            }
        }
    } else {
        bot.sendMessage(user.id, 'Бот на Вас обиделся и не хочет с Вами разговаривать. Владелец -> @id' + bot.botInfo.owner);
    }
});

// маленький калькулятор, просто складывает два числа, например "плюс 1 3" = 4
bot.cmd('плюс', (user, words) => {
    if (!blacklist.includes(user.id)) {
        var a = parseInt(words[0]) || 0;
        var b = parseInt(words[1]) || 0;
        var result = a + b;
        return 'ответ: ' + result;
    } else {
        bot.sendMessage(user.id, 'Бот на Вас обиделся и не хочет с Вами разговаривать. Владелец -> @id' + bot.botInfo.owner);
    }
});

bot.cmd('магия', (user, words) => {
    if (!blacklist.includes(user.id)) {
        if (words.length == 0) {
            var polStr = 'женский';
            if (user.pol == 'м') polStr = 'мужской';
            else if (user.pol == 'н') polStr = 'нло';

            var rolesObj = { ml_mod: 'младший мч', ml_modmaps: 'младший мк', mod: 'старший мч', modmaps: 'старший мк', admin: 'админ' };

            var rolesArr = []; // список ролей (должности)
            if (user.roles) {
                for (var i = 0; i < user.roles.length; i++) {
                    var role = user.roles[i];
                    if (role && role in rolesObj) {
                        var roleName = rolesObj[role]; // если должность найдена, добавляем в список
                        rolesArr.push(roleName);
                    }
                }
            }

            var arr = [
                'твой id: ' + user.id,
                'ник: ' + user.nick,
                'пол: ' + polStr,
                'опыт: ' + user.opyt,
                'уровень: ' + user.level,
                'уровень популярности: ' + user.popularLevel
            ];

            if (rolesArr.length > 0) { // если есть хоть одна должность
                arr.push('есть должности: ' + rolesArr.join(', '));
            }

            var msg = 'Вижу вижу... ' + arr.join(', ') + '.';

            if (user.botDrug) { // если отправитель в друзьях, добавляем ещё такой текст
                msg += ' А ещё ты мой друг!';
            }

            return { msg: msg, color: ['#ffdf52', '#FD92FE', '#54EFF7', '#68ff5d'] };
        }
    } else {
        bot.sendMessage(user.id, 'Бот на Вас обиделся и не хочет с Вами разговаривать. Владелец -> @id' + bot.botInfo.owner);
    }
});

var giftsQueryUsers = {}; // здесь храним запросы (от каждого игрока) на получение подарков, нам достаточно только хранить время, чтобы не смогли взять много раз подарок

bot.cmd('хочу подарок', (user, words) => {
    if (!blacklist.includes(user.id)) {
        if (checkDrug(user)) {
            var userid = user.id;
            var ts = time(); // текущее время (в секундах)
            var timeMinutes = [3, 4, 5]; // сколько минут будет ждать игрок до следующего подарка
            var waitTime = 60 * timeMinutes.random(); // в минуте 60 секунд, поэтому 60 умножаем на количество минут
            var endTime = giftsQueryUsers[userid] || 0; // проверяем, было обращение от такого игрока (или нет) если да значит получим время когда можно брать следующий подарок, иначе 0 (если 0 тогда тоже разрешит брать подарок, так как текущее время будет больше 0)
            if (ts > endTime) { // можно брать подарок
                giftsQueryUsers[userid] = ts + waitTime; // берём текущее время и прибавляем время ожидания (сколько будет ждать игрок до следующего подарка)

                var itemid = getRandomNumber(1, 254); // берём случайный id подарка

                // отправляем подарок!
                bot.sendGift(userid, itemid, (res) => {
                    if (res.error) {
                        if (res.error.msg) { // если произошла ошибка и есть текст ошибки (например недостаточно валюты) то отправляем этот текст
                            bot.sendMessage(userid, res.error.msg, {});
                        }
                    } else if (res.ok) { // если всё хорошо
                        bot.sendMessage(userid, 'Держи!', { color: '#FFFFFF' });
                    }
                });
            } else { // если ещё не пришло время получения подарка
                var seconds = endTime - ts; // берём время окончания и текущее время, и получаем уже секунды
                var minuts = Math.floor(seconds / 60); // получаем минуты, секунды делим на 60 (в минуте 60 секунд)
                seconds -= minuts * 60; // отнимаем кол-во минут, чтобы было корректное значение для секунд

                var arr = [];
                if (minuts > 0) arr.push(minuts + ' мин.');
                if (seconds > 0) arr.push(seconds + ' сек.');

                var msgsArr = ['Я тоже хочу!', 'Хотеть не вредно.'];
                var msg = msgsArr.random(); // берём случайный текст из массива
                msg += ' Нужно ещё подождать ';
                msg += arr.join(' ');
                return { msg: msg, color: ['#FFFFFF'] };
            }
        } else {
            // если бот не в друзьях у получателя
            bot.sendMessage(user.id, 'Я не могу дать подарок, добавь меня в друзья!', { color: ['#f1a0b3', '#FFFF00'] });
        }
    } else {
        bot.sendMessage(user.id, 'Бот на Вас обиделся и не хочет с Вами разговаривать. Владелец -> @id' + bot.botInfo.owner);
    }
});

bot.cmd('димушка крутой', (user, words) => {
    if (!blacklist.includes(user.id)) {
        if (checkDrug(user)) {
            var userid = user.id;

            if (!userIds.includes(userid)) { // можно брать подарок
                var itemid = getRandomNumber(90, 184);

                // отправляем подарок!
                bot.sendGift(userid, itemid, (res) => {
                    if (res.error) {
                        if (res.error.msg) { // если произошла ошибка и есть текст ошибки (например недостаточно валюты) то отправляем этот текст
                            bot.sendMessage(userid, res.error.msg, {});
                        }
                    } else if (res.ok) { // если всё хорошо
                        bot.sendMessage(userid, 'Спасибо! Держи!', { color: '#FFFFFF' });
                        userIds.push(userid); // добавляем id игрока в массив, чтобы он не мог больше раз получить подарок
                    }
                });
            } else {
                bot.sendMessage(user.id, 'Промокод уже использован!');
            }
        } else {
            bot.sendMessage(user.id, 'Добавь меня в друзья, чтоб я мог отправлять подарки!');
        }
    } else {
        bot.sendMessage(user.id, 'Бот на Вас обиделся и не хочет с Вами разговаривать. Владелец -> @id' + bot.botInfo.owner);
    }
});

bot.cmd('@', (user, words) => {
    if (checkAdmin(user)) {
        // Проверяем, что переданы хотя бы два аргумента
        if (words.length < 2) {
            return { msg: 'Используйте: !написать друзьям [id друга] [сообщение]', color: ['#FFFFFF'] };
        }
        
        // Первый аргумент - ID друга, остальные - сообщение
        const friendId = parseInt(words[0])
        const message = words.slice(1).join(' '); // Объединяем все остальные слова в строку

        bot.api('bot.friends', {}, (res) => {
            if (res.error) { // Если ошибка, отправляем в консоль и игроку
                console.log(res.error.msg);
                bot.sendMessage(user.id, 'Ошибка: ' + res.error.msg);
            }

            if (Array.isArray(res)) {
                if (res.length > 0) {
                    // Проверяем, есть ли друг с указанным ID
                    if(res.includes(friendId)) {
                        // Отправляем сообщение другу
                        bot.sendMessage(friendId, message);

                        // Отправляем сообщение себе:
                        console.log('Бот -> ' + friendId, ': ' + message); // В консоль
                        bot.sendMessage(user.id, 'Бот -> @id' + friendId + ': ' + message); // В приват
                    } else {
                        bot.sendMessage(user.id, 'Друг не найден');
                    }
                } else {
                    bot.sendMessage(user.id, 'Нет друзей');
                }
            }
        });
    }
});

bot.cmd('формат', (user, words) => {
    if(!blacklist.includes(user.id)) {
        if (words.length >= 2) {
            var style = words[0];
            var message = words.slice(1).join(' ');

            bot.sendMessage(user.id, replaceLetters(style, message));
        } else {
            bot.sendMessage(user.id, 'Используйте: формат (формат) (текст). Существующие форматы: SmallCapital, Bubble');
        }
    } else {
        bot.sendMessage(user.id, 'Бот на Вас обиделся и не хочет с Вами разговаривать. Владелец -> @id' + bot.botInfo.owner);
    }
});

bot.cmd('символы', (user, words) => {
    if(!blacklist.includes(user.id)) {
        if(words.length >= 1) {
            arg = words.slice(0).join(' ').toLowerCase();

            if(arg === 'украшения') {
                bot.sendMessage(user.id, '꧁ ๖ۣۣۜ  ꧂☃ ☄ ❄ ❧ ❖ ☯ ❡ ❢ ❣ ❤ ❥ ❦ ✾ ✿ ❀ ❅ ≬');
            } else if(arg === 'звёзды' || arg === 'звёздочки' || arg === 'звезды' || arg === 'звездочки') {
                bot.sendMessage(user.id, '✦ ✧ ★ ☆ ✮ ✯ ✪ ✫ ✬ ✭ ✰ ✺ ⋆ ⋇');
            } else if(arg === 'стрелки' || arg === 'стрелочки') {
                bot.sendMessage(user.id, '▲ △ ▴ ▵ ▶ ▷ ▸ ▹ ► ▻ ▼ ▽ ▾ ▿ ◀ ◁ ◂ ◃ ◄ ◅');
            } else if(arg === 'цифры' || arg === 'циферки' || arg === 'математика' || arg === 'цифры 1' || arg === 'циферки 1' || arg === 'математика 1') {
                bot.sendMessage(user.id, '⁰ ⁱ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ⁺ ⁻ ⁼ ⁽ ⁾ ⁿ ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉ ₊ ₋ ₌ ₍₎ ₐ ₑ ₒ ₓ ₔ');
            } else if(arg === 'цифры 2' || arg === 'циферки 2' || arg === 'математика 2') {
                bot.sendMessage(user.id, '⅕ ⅖ ⅗ ⅘ ⅙ ⅚ ⅛ ⅜ ⅝ ⅞ ⅟ Ⅰ Ⅱ Ⅲ Ⅳ Ⅴ Ⅵ Ⅶ Ⅷ Ⅸ Ⅹ Ⅺ Ⅻ Ⅼ ⅅ ⅆ ⅇ ⅈ ⅉ ⅍ Ⅽ Ⅾ Ⅿ');
            } else if(arg === 'цифры 3' || arg === 'циферки 3' || arg === 'математика 3') {
                bot.sendMessage(user.id, 'ⅰ ⅱ ⅲ ⅳ ⅴ ⅵ ⅶ ⅷ ⅸ ⅹ ⅺ ⅻ ⅼ ⅽ ⅾ ⅿ');
            } else if(arg === 'точки' || arg === 'точечки') {
                bot.sendMessage(user.id, '∴ ∵ ∶ ∷ ∸');
            } else if(arg === 'ноты' || arg === 'музыка') {
                bot.sendMessage(user.id, '∫ ∬ ∭ ∮ ∯ ∰ ∱ ∲ ∳');
            } else if(arg === 'геометрия') {
                bot.sendMessage(user.id, '∗ ∘ ∙ √ ∛ ∜ ∝ ∞ ∟ ∠ ∡ ∢');
            } else if(arg === 'другое') {
                bot.sendMessage(user.id, '║ ╒ ╓ ╔ ╕ ╖ ╗ ╘ ╙ ╚ ╛ ╜ ╝ ╞ ╟ ╠ ╡ ╢ ╣ ╤ ╥ ╦ ╧ ╨ ╩ ╪ ╫ ╬ ╭ ╮ ╯ ╰ ╱ ╲ ╳ ▪ ▫ ▬ ▭ ▮ ▯ ▰ ▱');
            } else {
                bot.sendMessage(user.id, 'Пишите: символы (категория). Доступные категории: звезды, украшения, стрелки, цифры, цифры 2, цифры 3, точки, ноты, геометрия, другое');
            }
        } else {
            bot.sendMessage(user.id, 'Пишите: символы (категория). Доступные категории: звезды, украшения, стрелки, цифры, цифры 2, цифры 3, точки, ноты, геометрия, другое');
        }
    } else {
        bot.sendMessage(user.id, 'Бот на Вас обиделся и не хочет с Вами разговаривать. Владелец -> @id' + bot.botInfo.owner);
    }
});

bot.cmd('+чс', (user, words) => {
    if(checkAdmin(user)) {
        if(words.length == 1) {
            if(isFinite(parseFloat(words[0]))) {;
                let arg = parseFloat(words[0]);

                if(!blacklist.includes(arg)) {
                    blacklist.push(arg);
                    bot.sendMessage(user.id, 'Игрок @id' + words[0] + ' добавлен в чёрный список!');

                    const jsonString = JSON.stringify(blacklist);
                    fs.writeFile('array.json', jsonString, (err) => {
                        if (err) {
                            console.error('Ошибка при записи файла:', err);
                        } else {
                            console.log('Массив успешно сохранен в файл!');
                        }
                    });

                } else {
                    bot.sendMessage(user.id, 'Игрок уже в чёрном списке!');
                }
            } else {
                bot.sendMessage(user.id, 'Используйте: +чс (айди игрока)');
            }
        } else {
            bot.sendMessage(user.id, 'Используйте: +чс (айди игрока)');
        }
    }
});

const userExamples = {}; // тут храним примеры игроков
var primerQueryUsers = {}; // здесь храним запросы на получение подарков

bot.cmd('пример', (user, words) => {
    if(!blacklist.includes(user.id)) {

        var userid = user.id;
        var ts = time(); // текущее время (в секундах)
        var timeMinutes = [3, 4, 5]; // сколько минут будет ждать игрок до следующего подарка
        var waitTime = 60 * timeMinutes[Math.floor(Math.random() * timeMinutes.length)]; // случайное время ожидания
        var endTime = primerQueryUsers[userid] || 0; // проверяем, было обращение от такого игрока

        if (ts > endTime) { // можно брать подарок
            primerQueryUsers[userid] = ts + waitTime; // устанавливаем время ожидания

            const { example, answer } = generatePrimer(); // Исправлено на answer
    
            // Сохраняем пример и результат в хранилище пользователя
            userExamples[user.id] = { example, result: answer }; // Исправлено на result: answer

            // Отправляем сообщение пользователю
            bot.sendMessage(user.id, 'Решите пример, чтобы получить подарок! Написать ответ можно с помощью команды: ответ (ответ)');
            bot.sendMessage(user.id, example, { color: ['#FFD300'] });
        } else {
            var seconds = endTime - ts; // оставшееся время
            var minuts = Math.floor(seconds / 60);
            seconds -= minuts * 60;

            var arr = [];
            if (minuts > 0) arr.push(minuts + ' мин.');
            if (seconds > 0) arr.push(seconds + ' сек.');

            var msgsArr = ['Пример ещё недоступен!'];
            var msg = msgsArr[Math.floor(Math.random() * msgsArr.length)]; // берем случайный текст
            msg += ' Нужно ещё подождать ';
            msg += arr.join(' ');
            return { msg: msg, color: ['#FFFFFF'] };
        }
    } else {
        bot.sendMessage(user.id, 'Бот на Вас обиделся и не хочет с Вами разговаривать. Владелец -> @id' + bot.botInfo.owner);
    }
});

bot.cmd('ответ', (user, words) => {
    if(!blacklist.includes(user.id)) {
    // Проверяем, есть ли у пользователя сгенерированный пример
        if (!userExamples[user.id]) {
            return bot.sendMessage(user.id, 'Сначала получите пример с помощью команды "пример".');
        } else {
            // Проверяем, передан ли ответ
            if (!words[0]) {
                return bot.sendMessage(user.id, 'Пожалуйста, введите числовой ответ после команды "ответ". Например: "ответ 5".');
            }

            // Парсим ответ от пользователя
            const userAnswer = parseFloat(words[0].trim()); // Удаляем лишние пробелы

            // Проверяем, является ли ответ числом
            if (isNaN(userAnswer)) {
                return bot.sendMessage(user.id, 'Пожалуйста, введите числовой ответ.');
            }
        
            // Сравниваем ответ пользователя с сохранённым результатом
            if (Number(userAnswer) === Number(userExamples[user.id].result)) {
            // Если ответ правильный
                var itemid = getRandomNumber(1, 254); // берём случайный id подарка

                bot.sendGift(user.id, itemid, (res) => {
                    if (res.error) {
                        if (res.error.msg) { // если произошла ошибка и есть текст ошибки
                            bot.sendMessage(user.id, res.error.msg, {});
                        }
                    } else if (res.ok) { // если всё хорошо
                        bot.sendMessage(user.id, 'Поздравляем! Вы получили подарок!', { color: ['#FFD300'] });
                    }
                });
            } else {
                // Если ответ неправильный
                bot.sendMessage(user.id, 'К сожалению, ответ неверный. Попробуйте ещё раз!', { color: ['#FFFFFF'] });
            }
        }
    } else {
        bot.sendMessage(user.id, 'Бот на Вас обиделся и не хочет с Вами разговаривать. Владелец -> @id' + bot.botInfo.owner);
    }
});


bot.cmd('-чс', (user, words) => {
    if (checkAdmin(user)) {
        if (words.length == 1) {
            if (isFinite(parseFloat(words[0]))) {
                let arg = parseFloat(words[0]);

                if (blacklist.includes(arg)) {
                    blacklist.splice(blacklist.indexOf(arg), 1);
                    bot.sendMessage(user.id, 'Игрок @id' + words[0] + ' удалён из чёрного списка!');

                    const jsonString = JSON.stringify(blacklist);
                    fs.writeFile('array.json', jsonString, (err) => {
                        if (err) {
                            console.error('Ошибка при записи файла:', err);
                        } else {
                            console.log('Массив успешно сохранен в файл!');
                        }
                    });
                } else {
                    bot.sendMessage(user.id, 'Игрок не в чёрном списке!');
                }
            } else {
                bot.sendMessage(user.id, 'Используйте: -чс (айди игрока)');
            }
        } else {
            bot.sendMessage(user.id, 'Используйте: -чс (айди игрока)');
        }
    }
});

bot.cmd('ковш', (user, words) => {
    const imagePath = 'ковш.jpg';
    let buffer;

    // Чтение файла в буфер
    fs.readFile(imagePath, (err, data) => {
        if (err) {
            console.error('Ошибка при чтении файла:', err);
            return;
        }

        buffer = data;
        bot.sendFile(user.id, {name:'ковш.jpg'}, buffer);
    });
});

bot.cmd('команды', (user, words) => {
    const imagePath = 'команды.png';
    let buffer;

    // Чтение файла в буфер
    fs.readFile(imagePath, (err, data) => {
        if (err) {
            console.error('Ошибка при чтении файла:', err);
            return;
        }

        buffer = data;
        bot.sendFile(user.id, {name:'команды.png'}, buffer);
    });
});

bot.cmd('вероятность', (user, words) => {
    if (words.length > 0) {
        let arg = words.join(' ');
        bot.sendMessage(user.id, 'Вероятность на то, что "' + arg + '" - ' + (Math.floor(Math.random() * 100) + 1) + '%');
    } else {
        bot.sendMessage(user.id, 'Используйте: вероятность (текст)');
    }
});

// Модуль "коины"
let coinsQuery = {};

bot.cmd('коины', (user, words) => {
    if (!blacklist.includes(user.id)) {
        let botuser = getUser (user.id);
        if (botuser) {
            if (words.length > 0) {
                let arg = words[0];

                if (arg === 'фарм') {
                    let ts = time(); 
                    let waitTime = 60 * 20; // кд 20 минут
                    let endTime = coinsQuery[user.id] || 0; 
                    if (ts > endTime) {
                        coinsQuery[user.id] = ts + waitTime;

                        let amount = Math.floor(Math.random() * 10) + 1;
                        botuser.coins += amount;

                        const jsonString = JSON.stringify(users);
                        fs.writeFile('coindata.json', jsonString, (err) => {
                            if (err) {
                                console.error('Ошибка при записи файла:', err);
                            } else {
                                console.log('Массив успешно сохранен в файл!');
                            }
                        });

                        bot.sendMessage(user.id, '*em94* Вы получили ' + amount + ' коинов! Текущий баланс: ' + botuser.coins);
                    } else {
                        let seconds = endTime - ts;
                        let minuts = Math.floor(seconds / 60);
                        seconds -= minuts * 60;

                        let arr = [];
                        if (minuts > 0) arr.push(minuts + ' мин.');
                        if (seconds > 0) arr.push(seconds + ' сек.');

                        let msg = 'Нужно подождать ещё ';
                        msg += arr.join(' ');

                        bot.sendMessage(user.id, msg);
                    }
                } else if (arg === 'баланс') {
                    if(words.length == 2) {
                        let parsedId = parseFloat(words[1]);

                        if(!isNaN(parsedId)) {
                            bot.sendMessage(user.id, 'Баланс игрока @id' + parsedId + ' -> ' + getUser(parsedId).coins);
                        } else {
                            bot.sendMessage(user.id, 'Используйте: баланс (id игрока)');
                        }
                    } else {
                        bot.sendMessage(user.id, '*em43* На вашем аккаунте ' + botuser.coins + ' коина(-ов)');
                    }
                } else if (arg === 'помощь') {
                    bot.sendMessage(user.id, 'Команды раздела "коины":');
                    fs.readFile('коины-помощь.png', (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            bot.sendFile(user.id, { name: 'коины-помощь.png' }, data);
                        }
                    });
                } else if (arg === 'магазин') {
                    if (words.length === 1) {
                        bot.sendMessage(user.id, 'Магазин подарков за коины:');
                        fs.readFile('коины-магазин.png', (err, data) => {
                            if (err) {
                                console.log(err);
                            } else {
                                bot.sendFile(user.id, { name: 'коины-магазин.png' }, data);
                            }
                        });
                        bot.sendMessage(user.id, 'Чтобы купить какой-то подарок, введите команду \"коины магазин купить (номер подарка из первой колонки) без скобок\"');
                    } 

                    if (words.length > 1 && words[1] === 'купить') {
                        if (words.length === 3) {
                            let balance = botuser.coins;
                            let itemCosts = [60, 50, 40, 20]; // Стоимость предметов
                            let itemIds = [181, 138, 132, 91]; // ID предметов

                            let itemIndex = parseInt(words[2]) - 1; // Преобразуем номер предмета в индекс массива
                            if (itemIndex >= 0 && itemIndex < itemCosts.length) {
                                let cost = itemCosts[itemIndex];
                                if (balance >= cost) {
                                    bot.sendGift(user.id, itemIds[itemIndex], (res) => {
                                        if (res.error) {
                                            if (res.error.msg) {
                                                bot.sendMessage(user.id, res.error.msg, {});
                                            }
                                        } else if (res.ok) {
                                            bot.sendMessage(user.id, `Куплен подарок "${words[2]}" за ${cost} коинов`);
                                            botuser.coins -= cost;

                                            fs.readFile('коины-помощь.png', (err, data) => {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    bot.sendFile(user.id, { name: 'коины-помощь.png' }, data);
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    bot.sendMessage(user.id, 'Недостаточно коинов! Баланс: ' + botuser.coins);
                                }
                            } else {
                                bot.sendMessage(user.id, 'Используйте: коины магазин купить (номер предмета)');
                                bot.sendMessage(user.id, 'Все номера предметов:');
                                fs.readFile('коины-магазин.png', (err, data) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        bot.sendFile(user.id, { name: 'коины-магазин.png' }, data);
                                    }
                                });
                            }
                        } else {
                            bot.sendMessage(user.id, 'Используйте: коины магазин купить (номер предмета)');
                            bot.sendMessage(user.id, 'Все номера предметов:');
                            fs.readFile('коины-магазин.png', (err, data) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    bot.sendFile(user.id, { name: 'коины-магазин.png' }, data);
                                }
                            });
                        }
                    }
                } else if (arg === 'курс') {
                    bot.sendMessage(user.id, '*em43* Курс: 1 коин ≈ ' + coinCourse + ' лапок');
                } else if (arg === 'выдать') {
                    if (checkAdmin(user)) {
                        if (words.length === 3) {
                            let parsedId = parseInt(words[1]);
                            let parsedCount = parseInt(words[2]); // Добавлено: парсинг количества коинов
                            if (!isNaN(parsedId) && !isNaN(parsedCount)) {
                                let target = getUser (parsedId);
                                if (target) {
                                    target.coins += parsedCount;
                                    bot.sendMessage(user.id, 'Выдано ' + parsedCount + ' коинов игроку @id' + parsedId);

                                    const jsonString = JSON.stringify(users);
                                    fs.writeFile('coindata.json', jsonString, (err) => {
                                        if (err) {
                                            console.error('Ошибка при записи файла:', err);
                                        } else {
                                            console.log('Массив успешно сохранен в файл!');
                                        }
                                    });
                                } else {
                                    bot.sendMessage(user.id, 'Аккаунт ID ' + parsedId + ' не найден');
                                }
                            } else {
                                bot.sendMessage(user.id, 'Используйте: коины выдать (id игрока) (кол-во)');
                            }
                        } else {
                            bot.sendMessage(user.id, 'Используйте: коины выдать (id игрока) (кол-во)');
                        }
                    }
                } else if(arg === 'снять') {
                    if(checkAdmin(user)) {
                        if(words.length === 3) {
                            let parsedId = parseFloat(words[1]);
                            let parsedCount = parseFloat(words[2]);

                            if(!isNaN(parsedId) && !isNaN(parsedCount)) {
                                let target = getUser(parsedId);

                                if(target.coins >= parsedCount) {
                                    target.coins -= parsedCount;
                                    bot.sendMessage(user.id, 'Успешно снято ' + parsedCount + ' коинов у @id' + parsedId);

                                    const jsonString = JSON.stringify(users);
                                    fs.writeFile('coindata.json', jsonString, (err) => {
                                        if (err) {
                                            console.error('Ошибка при записи файла:', err);
                                        } else {
                                            console.log('Массив успешно сохранен в файл!');
                                        }
                                    });
                                } else {
                                    bot.sendMessage(user.id, 'У пользователя недостаточно валюты. Его баланс: ' + target.coins)
                                }
                            } else {
                                bot.sendMessage(user.id, 'Используйте: коины снять (id игрока) (кол-во)');
                            }
                        }
                    }
                } else {
                    bot.sendMessage(user.id, 'Команда не найдена. Все команды раздела "коины":');
                    fs.readFile('коины-помощь.png', (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            bot.sendFile(user.id, { name: 'коины-помощь.png' }, data);
                        }
                    });
                }
            } else {
                bot.sendMessage(user.id, '*em43* На вашем аккаунте ' + botuser.coins + ' коина(-ов)');
            }
        } else {
            addUser (user.id, 0);
            bot.sendMessage(user.id, 'Ваш аккаунт создан! Теперь вы можете использовать модуль "коины". Команды модуля доступны по команде "коины помощь"');

            const jsonString = JSON.stringify(users);
            fs.writeFile('coindata.json', jsonString, (err) => {
                if (err) {
                    console.error('Ошибка при записи файла:', err);
                } else {
                    console.log('Массив успешно сохранен в файл!');
                }
            });
        }
    } else {
        bot.sendMessage(user.id, 'Бот на Вас обиделся и не хочет с Вами разговаривать. Владелец -> @id' + bot.botInfo.owner);
    }
});

// Обработка событий

// бот может принимать файлы, обработать получение можно в событии file, в этом примере полученный файл сохраняем в папке где и запущен бот, только немного меняем название файла (вместе с файлом приходит объект отправителя где можно узнать id игрока) этот id и берём, так мы будем знать от кого пришёл файл

bot.event('file',(o,data)=>{
var userid=o.user.id;
var nm='user_'+userid+'_'+o.name;
var rr=/[\/\?<>\\:\*\|"]/g; // запрещённые символы убираем из имени файла (в windows, и не только) иначе файл не сохранится
nm=nm.replace(rr,'');
try{
fs.writeFileSync(nm, data); // сохраняем файл
}catch(e){
// если произошла ошибка
}
});

// если нужно сделать историю сообщений (все сообщения которые пишут боту можно получить в событии message) уберите /* */ ниже, и как только появится сообщение, оно будет добавлено в файл messages.txt (файл будет в папке откуда вы запустили бота)


bot.event('message',(user,text)=>{
try{
    fs.appendFileSync('messages.txt', 'id '+user.id+' ('+user.nick+') -> '+text+'\r\n');
}catch(e){
    //
}

if(!userIds2.includes(user.id)) {
    arg = text.toLowerCase()
    if(!availableCmds.includes(arg.toLowerCase()) && !arg.includes("бот") && !arg.includes("@") && !arg.includes("формат") && !arg.includes("символы") && !arg.includes("чс") && !arg.includes("ответ") && !arg.includes("вероятность") && !arg.includes("коины")) {
        userIds2.push(user.id);
        bot.sendMessage(user.id, 'Привет! В этом файле находятся все уникальные команды бота:');

        const imagePath = 'команды.png';
        let buffer;

        // Чтение файла в буфер
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                console.error('Ошибка при чтении файла:', err);
                return;
            }

            buffer = data;
            bot.sendFile(user.id, {name:'команды.png'}, buffer);
        });
    }
}

if(user.id != bot.botInfo.owner && !blacklist.includes(user.id)) {
    bot.sendMessage(bot.botInfo.owner, '@id' + user.id + ' -> Бот: ' + text);
}
});

// Сделать топ по коинам; игру на коины