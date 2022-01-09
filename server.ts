const path = require("path"),
    express = require("express");
const app = express();


const port = process.env.PORT || 5000;


app.use(express.static('build'));
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