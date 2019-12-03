require('dotenv').config();
const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');
const Boom = require('boom');

const git = fs.readFileSync('./git.txt', 'utf-8');
const knex = fs.readFileSync('./knex.txt', 'utf-8');
const node = fs.readFileSync('./node.txt', 'utf-8');
const nvm = fs.readFileSync('./nvm.txt', 'utf-8');
const sql = fs.readFileSync('./sql.txt', 'utf-8');
const terminal = fs.readFileSync('./terminal.txt', 'utf-8');

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err.output.payload);
    if (!err.isBoom) {
      Boom.boomify(err);
    }

    ctx.status = err.output.statusCode;
    ctx.body = err.output.payload;
  }
});

router.get('/', async ctx => {
    ctx.body = [
        {
            title: 'GIT stuff',
            url: `${ctx.request.origin}/git`,
        },
        {
            title: 'Knex stuff',
            url: `${ctx.request.origin}/knex`,
        },
        {
            title: 'node stuff',
            url: `${ctx.request.origin}/node`,
        },
        {
            title: 'NVM stuff',
            url: `${ctx.request.origin}/nvm`,
        },
        {
            title: 'SQL stuff',
            url: `${ctx.request.origin}/sql`,
        },
        {
            title: 'terminal stuff',
            url: `${ctx.request.origin}/terminal`,
        },
        {
            title: '404',
            url: `${ctx.request.origin}/this_urk_does_not_exists`,
        },
    ];
});

router.get('/git', async ctx => {
    ctx.body = git;
});

router.get('/knex', async ctx => {
    ctx.body = knex;
});

router.get('/node', async ctx => {
    ctx.body = node;
});

router.get('/nvm', async ctx => {
    ctx.body = nvm;
});

router.get('/sql', async ctx => {
    ctx.body = sql;
});

router.get('/terminal', async ctx => {
    ctx.body = terminal;
});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.use(() => {
    throw Boom.notFound();
});


app.listen(process.env.PORT);
console.log(`SERVER STARTED ON PORT ${process.env.PORT}`)