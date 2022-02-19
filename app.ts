import 'reflect-metadata'
import Koa from 'koa';
import Socket from './socket'
import bodyParser from 'koa-bodyparser';
import router from './router';

const app = new Koa();

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())

Socket(app)