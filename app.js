var cookieParser = require("cookie-parser");
var createError = require("http-errors");
var compress = require("compression");
var express = require("express");
var logger = require("morgan");
var _ = require("underscore");
var path = require("path");
var page = require("./util/page");
var Router = require("./routes/router");
var app = express();
let routeList = require("./routes/route")["routes"];
app.use(compress());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"), { maxAge: "2592000" });
app.set("view engine", "pug");
app.set("view cache", !0);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: !1 }));
app.use(cookieParser());
_.each(routeList, function (_router, route, obj) {
    app.use(route, Router(_router));
});
app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render(
        "404",
        page({ title: "Page not Found", css: ["./css/404.css"], footbar: !1 })
    );
});
module.exports = app;
