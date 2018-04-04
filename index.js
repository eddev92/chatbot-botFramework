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
const bot = new builder.UniversalBot(connector,[
(session) => {
    session.send('hola');
    session.beginDialog('startDialog');

}]);

bot.dialog('startDialog', [
    (session, args, next) => {
        builder.Prompts.text(session, 'Cual es tu nombre?');
    },
    (session, arg, next) => {
        builder.Prompts.text(session, 'estas libre para continuar?');
        console.log(next)
    },
    (session, arg, next) => {
        builder.Prompts.text(session, 'deseas conocer informacion de tu vehiculo?');
    },
    (session, results) => {
        var selectedCardName = results.response.entity;
        var card = new builder.HeroCard(session)
        .title('card info vehiculo')
        .subtitle('descripcion ')
        .text('contenido chatbot Edward')
        .images([
            builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Get Started')
        ]);

        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        session.replaceDialog('second');
}
])

bot.dialog('second', [
    (session, arg, next) => {
        builder.Prompts.text(session, 'Cual es tu edad?');
       // session.endDialog('Chau')
    }
])