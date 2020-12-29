
var admin = require("firebase-admin");

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

serviceAccount["private_key"] = process.env.FIREBAE_PRIVATE_KEY

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mail-opened-default-rtdb.firebaseio.com"
});


exports.handler = async (event) => {
    const response = {
        
        statusCode: 200,
        body: JSON.stringify(await admin.database().ref("users").once("value")),
        
    };
    return response;
};

