const Koa = require("koa");

const bodyParser = require("koa-bodyparser");

const controller = require("./middleware/controller");

const rest = require("./middleware/rest");

const app = new Koa();

const isProduction = process.env.NODE_ENV === "production";

// log request URL:
app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  var start = new Date().getTime(),
    execTime;
  await next();
  execTime = new Date().getTime() - start;
  ctx.response.set("X-Response-Time", `${execTime}ms`);
});

// static file support:
let staticFiles = require("./middleware/static-files");
app.use(staticFiles("/static/", __dirname + "/static"));

// parse request body:
app.use(bodyParser());

// bind .rest() for ctx:
app.use(rest.restify());

// add controllers:
app.use(controller());

// redirect to /static/htmlToImg/index.html
app.use(async (ctx, next) => {
  ctx.response.redirect("/static/htmlToImg/index.html");
});

app.listen(3030);
console.log("app started at port 3030...");
