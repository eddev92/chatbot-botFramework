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
function createHeroCard(session) {
       return new builder.HeroCard(session)
        .title('card info vehiculo')
        .subtitle('descripcion ')
        .text('contenido chatbot Edward')
        .images([
            builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Get Started')
        ]);
}
function createThumbnailCard(session) {
    return new builder.ThumbnailCard(session)
        .title('BotFramework Thumbnail Card')
        .subtitle('Your bots — wherever your users are talking')
        .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
        .images([
            builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Get Started')
        ]);
}
function CreateCard(selectedCardName, session) {
    let card;
    console.log(selectedCardName, 'selectedCardName')
    switch (selectedCardName) {
        case 'Hero':
            card = createHeroCard(session);
            break;
        case 'Thumbnail':
            card = createThumbnailCard(session);
            break;
        default:
            card = createHeroCard(session);
            break;
    }
    return card
}
const bot = new builder.UniversalBot(connector,[
(session) => {
    session.send('Hola Edward! ');
    session.beginDialog('startDialog');

}]);
function CreateSuggestions(session) {
    return
}
bot.dialog('startDialog', [
    (session) => {
        builder.Prompts.text(session, 'Soy Herbie (carrito), el bot de inspecciones vehiculares.');
    },
    (session, results) => {
        if (results) {
            session.replaceDialog('positiveOption');
        }
    }
    // (session, results) => {
    //     if (results.response) {
    //         results.entity = 'Hero';
    //         console.log(results.entity)
    //         var selectedCardName = results.entity;
    //         var card = CreateCard(results.entity, session);
    //         var msg = new builder.Message(session).addAttachment(card);
    //         session.send(msg);
    //         builder.Prompts.text(session, 'esta es tu informacion??');
    //     }
    // },
    // (session, results) => {
    //     if (results.response) {
    //         console.log(results)
    //         results.entity = 'Thumbnail';
    //         var selectedCardName = results.entity;
    //         var card = CreateCard(results.entity, session);
    //         var msg = new builder.Message(session).addAttachment(card);
    //         session.send(msg);
    //         builder.Prompts.text(session, 'esta es tu informacion personal??');
    //     }
    // },
    // (session, results) => {
    //     builder.Prompts.text(session, 'estas libre para continuar?');
    //     var msg = new builder.Message(session)
    //     .suggestedActions(
    //         builder.SuggestedActions.create(
    //                 session, [
    //                     builder.CardAction.imBack(session, "Sí", "Sí"),
    //                     builder.CardAction.imBack(session, "No", "No"),
    //                     builder.CardAction.imBack(session, "Más tarde", "Más tarde")
    //                 ]
    //             ));
    //     session.send(msg);
    //     console.log(results)
    // },

    // (session, results) => {
    //     console.log(results)
    //     console.log(results.response)
    //     if (results && results.response === 'Sí') {
    //         session.replaceDialog('positiveOption')
    //     } else if (results && results.response === 'No') {
    //         session.replaceDialog('negativeOption')
    //     } else {
    //         session.replaceDialog('afterOption')
    //     }
    // }
]);
const yes = 'Sí! Comencemos'
bot.dialog('positiveOption', [
    (session, results) => {

        const noo = 'No, hagámoslo luego'
        const msg = 'Antes de comenzar asegúrate de tener buena conexión a internet y mínimo 50% de bateria :D. ';
        session.send(msg);
        builder.Prompts.choice(session,
        '¿Tienes 20 min para realizar la inspección?',
        [yes, noo],
        { listStyle: builder.ListStyle.button })
    },
    (session, results) => {
        console.log(results.response)
        if (results.response && results.response.entity === yes) {
            session.replaceDialog('userReady')
        } else {
            session.replaceDialog('noReady')
        }
    },
]);
bot.dialog('noReady', [
    (session, arg, next) => {
        builder.Prompts.text(session, 'Por favor, es necesario que te ubiques cerca a tu vehículo. Este proceso de inspeccion requiere fotos de ciertas partes del vehículo.');
    // session.endDialog('Chau')
    }
])
const okUserReady = 'Si!';
const noUserReady = 'No estoy de acuerdo';
bot.dialog('userReady', [
    (session) => {
        builder.Prompts.text(session, '¿Tienes código de inspección?');
    // session.endDialog('Chau')
    },
    (session, results) => {
        builder.Prompts.text(session, '¿Cuál es tu código?')
    },
    (session, results) => {
        const msg = 'Genial! Ahora necesito que apruebes los terminos y condiciones 👉 link aquí';

        session.send(msg);
        builder.Prompts.choice(session,
        '¿Estas de acuerdo?',
        [okUserReady, noUserReady],
        { listStyle: builder.ListStyle.button });
    },
    (session, results) => {
        console.log(results.response)
        if (results.response && results.response.entity === okUserReady) {
            session.replaceDialog('acceptTermsAndConditions')
        } else {
            session.replaceDialog('noReady')
        }
    },
]);

bot.dialog('acceptTermsAndConditions', [
    (session, arg, next) => {
        builder.Prompts.text(session, 'Excelente! ¿Eres el titular del seguro?');
       // session.endDialog('Chau')
    },
    (session, results) => {
        builder.Prompts.text(session, 'Perfecto! Validemos tus datos 😊¿Cuál es tu número de DNI?');
    },
    (session, results) => {
        builder.Prompts.text(session, 'Genial! ¿Puedes acercarte a tu auto? Ojo con estas recomendaciones 👀');
        const msg1 = ' - Si tu auto está en un sótano sácalo a tierra para que tengas señal para hablarme.';
        const msg2 = ' - Llévalo a una zona iluminada y de facil acceso a tomarle fotos.';
        session.send(msg1);
        session.send(msg2);
    }
])
// bot.dialog('afterOption', [
//     (session, arg, next) => {
//         builder.Prompts.text(session, 'okey, indicame la hora');
//        // session.endDialog('Chau')
//     }
// ])