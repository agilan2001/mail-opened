
var admin = require("firebase-admin");
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'agilanvlr2001@gmail.com',
        pass: process.env.GOOGLE_APP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});
//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var serviceAccount = {
    "type": "service_account",
    "project_id": "mail-opened",
    "private_key_id": "5e5adfa07bf85b9ec99cc5283c6f56428e6b70f2",
    "client_email": "firebase-adminsdk-15jle@mail-opened.iam.gserviceaccount.com",
    "client_id": "114193818409636386384",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-15jle%40mail-opened.iam.gserviceaccount.com"
};

serviceAccount["private_key"] = process.env.FIREBAE_PRIVATE_KEY.replace(/\\n/g, '\n');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mail-opened-default-rtdb.firebaseio.com"
});


var db = admin.database();

exports.handler = async (event) => {
    var { key, uid } = event.queryStringParameters;
    //var { sourceIp, userAgent } = event.requestContext.identity;
    var conf = (await db.ref(`users/${uid}/links/${key}/conf`).once("value")).val();

    if (conf.active) {
        await Promise.all([
            db.ref(`users/${uid}/links/${key}/logs`).push({
                dt: Date.now()
            }),

            ((conf.s_no) ?
                admin.messaging().sendToDevice((await db.ref(`users/${uid}/info/fcm`).once("value")).val(),
                    {
                        "data": {
                            "notification": JSON.stringify({
                                "body": conf.track,
                            })
                        }
                    }) : 0),



            ((conf.s_ma) ?
                transporter.sendMail({
                    from: 'agilanvlr2001@gmail.com',
                    to: (await db.ref(`users/${uid}/info/mail`).once("value")).val(),
                    subject: 'Mail-OPENED ALERT',
                    html: `<center><h1 style = "color:blue">Mail-OPENED ALERT</h1>
          <img style="height:100px" src= "https://mail-opened.web.app/res/icon.png">
          <h3 style="text-decoration:underline">ALERT</h3>
          <h2 style="font-style:italic">${conf.track} : Your Mail is being opened</h2>
          <h3><a href = "https://mail-opened.web.app/">https://mail-opened.web.app/</a></h3>
          </center>`
                }) : 0)


        ]);
    }
    const response = {
        headers: {
            'Content-Type': 'image/png',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Cache-Control': 'post-check=0, pre-check=0',
            'Pragma': 'no-cache'

        },
        statusCode: 200,
        body: conf.active ? 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' : 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8AARIQB46hC+ioEAGX8E/cKr6qsAAAAAElFTkSuQmCC',
        isBase64Encoded: true
    };
    return response;
};