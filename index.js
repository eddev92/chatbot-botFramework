const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const builder = require('botbuilder');
const fs = require('fs');
const util = require('util');
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
        builder.Prompts.text(session, 'Soy Herbie 🚗, el bot de inspecciones vehiculares.');
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
bot.dialog('hiUser', [

]);
const yes = 'Sí! Comencemos';

bot.dialog('positiveOption', [
    (session, results) => {

        const noo = 'No, hagámoslo luego'
        const msg = 'Antes de comenzar asegúrate de tener buena conexión a internet y mínimo 50% de bateria 😊. ';
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
        builder.Prompts.text(session, 'dime la hora y el dia que desees que te recuerde para continuar con tu inspeccion vehicular');
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
        const msg2 = ' - Llévalo a una zona iluminada y de facil acceso para tomar fotos de buena calidad.';
        session.send(msg1);
        session.send(msg2);
    },
    (session, results) => {
        builder.Prompts.text(session, 'Ahora si podemos comenzar con tu Kia Sportage de placa AWG-508 🚗💪');
        var msg = new builder.Message(session)
        .text('¿Qué uso le das a tu auto?')
        .suggestedActions(
            builder.SuggestedActions.create(
                    session, [
                        builder.CardAction.imBack(session, "Particular", "Particular"),
                        builder.CardAction.imBack(session, "Taxi", "Taxi"),
                        builder.CardAction.imBack(session, "Público", "Público"),
                        builder.CardAction.imBack(session, "Otro", "Otro")
                    ]
                ));
        session.send(msg);
    },
    (session, results) => {
        console.log(results, 'results KIA tipo')
        builder.Prompts.text(session, '¿Qué consume tu auto como fuente energia? ⚡️');
            var msg12 = new builder.Message(session)
                .text(null)
                .suggestedActions(
                    builder.SuggestedActions.create(
                            session, [
                                builder.CardAction.imBack(session, "Gasolina", "Gasolina"),
                                builder.CardAction.imBack(session, "Diesel", "Diesel"),
                                builder.CardAction.imBack(session, "Gas", "Gas"),
                                builder.CardAction.imBack(session, "Gas y gasolina", "Gas y gasolina"),
                                builder.CardAction.imBack(session, "Eléctrico", "Eléctrico")
                            ]
                        ));
                        if (results.response === 'Particular') {
                            console.log('es un vehiculo particular')
                        } else if (results.response === 'Taxi') {
                            console.log('es un vehiculo de Taxi')
                        } else if (results.response === 'Público') {
                            console.log('es un vehiculo Público')
                        } else {
                            console.log('otro tipo de vehiculo')
                        }
                session.send(msg12);

    },
    (session, results) => {
        if (results.response === 'Gasolina') {
            console.log('es un vehiculo que funciona con gasolina')
        } else if (results.response === 'Diesel') {
            console.log('es un vehiculo q funciona con Diesel')
        } else if (results.response === 'Gas y gasolina') {
            console.log('es un vehiculo con Gas y gasolina')
        } else {
            console.log('es un vehiculo Eléctrico')
        }
        builder.Prompts.text(session, '¿Tiene aire acondicionado? ❄️');
            var msg = new builder.Message(session)
            .text(null)
            .suggestedActions(
                builder.SuggestedActions.create(
                    session, [
                        builder.CardAction.imBack(session, "Sí", "Sí"),
                        builder.CardAction.imBack(session, "Sí, pero no funciona", "Sí, pero no funciona"),
                        builder.CardAction.imBack(session, "No", "No"),
                    ]
                )
            )
            session.send(msg)
    },
    (session, results) => {
        console.log(results.response)
        fs.readFile('./images/tarjeta_propiedad.jpg', function (err, data) {
            var contentType = 'image/jpg';
            var base64 = Buffer.from(data).toString('base64');
            var title = 'Perfecto, ahora comenzemos con las fotos 📸';
            var msg = new builder.Message(session)
                .addAttachment({
                    contentUrl: util.format('data:%s;base64,%s', contentType, base64),
                    contentType: contentType,
                    name: 'tarjeta_propiedad_example.png'
                });
            session.send(title);
            session.send(msg);
            builder.Prompts.text(session, 'Envíame una foto de la cara de la tarjeta de propiedad del auto, luce así ☝️')
        });
    },
    (session, results) => {
        console.log(results, 'carga de foto')
        // builder.Prompts.text(session, 'Y también de la parte posterior, por favor 😊');
        var msg = session.message;
        if (msg.attachments.length) {
            var attachment = msg.attachments[0];
            var fileDownload = checkRequiresToken(msg)
                ? requestWithToken(attachment.contentUrl)
                : request(attachment.contentUrl);

            fileDownload.then(
                function (response) {
                    var reply = new builder.Message(session)
                        .text('Attachment of %s type and size of %s bytes received.', attachment.contentType, response.length);
                    session.send(reply);

                }).catch(function (err) {
                    console.log('Error downloading attachment:', { statusCode: err.statusCode, message: err.response.statusMessage });
                });
            }
        },
        (session, results) => {
            console.log(results)
        }
]);