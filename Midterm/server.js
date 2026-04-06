let express = require("express");
let app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", function(req, res)
{
    return res.render("home")
});
app.listen(3000, function() {
    console.log("Server started at localhost:3000")
});
console.log("Console from server.js file")