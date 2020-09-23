const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
//https://stackoverflow.com/questions/39092822/how-to-do-confirm-email-address-with-express-node

// answered Aug 26 at 15:45

// Sarthak Singhal
// 49955 silver badges7

// Step 1 Encode the user id in a jwt token with an expiration dat
var date = new Date();
var mail = {
            "id": user.id,
            "created": date.toString()
            }

const token_mail_verification = jwt.sign(mail, config.jwt_secret_mail, { expiresIn: '1d' });

var url = config.baseUrl + "verify?id=" + token_mail_verification;


// Step 2 Send the token to the user email address using nodemailer library
let transporter = nodemailer.createTransport({
    name: "www.domain.com",
    host: "smtp.domain.com",
    port: 323,
    secure: false, // use SSL
    auth: {
        user: "user@domain.com", // username for your mail server
        pass: "Password", // password
    },

});

// send mail with defined transport object
let info = await transporter.sendMail({
    from: '"NAME" <user@domain.com>', // sender address
    to: user.email, // list of receivers seperated by comma
    subject: "Account Verification", // Subject line
    text: "Click on the link below to veriy your account " + url, // plain text body
}, (error, info) => {

    if (error) {
        console.log(error)
        return;
    }
    console.log('Message sent successfully!');
    console.log(info);
    transporter.close();
});

// Step 3 Accept the verification link
app.get('/verify', function(req, res) {
    token = req.query.id;
    if (token) {
        try {
            jwt.verify(token, config.jwt_secret_mail, (e, decoded) => {
                if (e) {
                    console.log(e)
                    return res.sendStatus(403)
                } else {
                    id = decoded.id;

                
//Update your database here with whatever the verification flag you are using 



                }

            });
        } catch (err) {

            console.log(err)
            return res.sendStatus(403)
        }
    } else {
        return res.sendStatus(403)

    }

})