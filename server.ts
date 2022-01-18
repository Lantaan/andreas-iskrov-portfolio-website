const nodemailer = require("nodemailer");
const path = require("path"),
    express = require("express");
const bodyParser = require("body-parser");
const app = express();

const port = process.env.PORT || 5000;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'andreas.iskrov.server@gmail.com',
      pass: 'uLitka22'
    }
  });


app.use(express.static('build'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("*", (req, res) => {
    req.sendFile(path.resolve(__dirname, "build", "index.html"))
})


app.listen(port, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("running on port " + port);
    }
})


app.post("/sendText", (request, response) => {
    const mailOptions = {
        from: 'andreas.iskrov.server@gmail.com',
        to: 'andreas.iskrov@gmail.com',
        subject: 'E-Mail from website',
        text: JSON.stringify(request.body)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    console.log(request.body);
    response.end();
})