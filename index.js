const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const builder = require('botbuilder');
const app = express();
app.use(bodyParser.json());

var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

app.post('/api/messages', connector.listen());

app.listen(process.env.PORT, () => {
    console.log(`app its works in port ${process.env.PORT}!!!!`)
});
const bot = new builder.UniversalBot(connector, (session) => {
    session.send('habla barrio');
    session.beginDialog('startDialog');
})

bot.dialog('startDialog', [
    (session, args, next) => {
        builder.Prompts.text(session, "como te shamas?");
    }
])
