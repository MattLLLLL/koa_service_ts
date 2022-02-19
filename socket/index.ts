import { createServer } from 'http';
import { Server } from 'socket.io';
import Koa from 'koa';

export default (app: Koa<Koa.DefaultState, Koa.DefaultContext>) => {
    const httpServer = createServer(app.callback());
    httpServer.listen(3000)
}