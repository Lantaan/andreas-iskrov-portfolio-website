const path = require("path"),
    express = require("express");
const bodyParser = require("body-parser");
const app = express();

const port = process.env.PORT || 5000;


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
    console.log(request.body);
    response.end();
})