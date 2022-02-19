import Koa from 'koa';
import jwt from 'jsonwebtoken'
import Config from '../config.json';

export default {
    merchantRequired: async (ctx: Koa.Context, next: Koa.Next) => {
        if (!ctx.request.header.merchant) {
            ctx.status = 400
            ctx.body = {
                message: 'Header \'merchant\' is required.'
            }
            return
        }
        await next()
    },
    verifyToken: async (ctx: Koa.Context, next: Koa.Next) => {
        const token = ctx.request.header['x-access-token']
        if (!token) {
            ctx.body = {
                success: false,
                errorCode: 401,
                message: 'JWT token is require'
            }
            return
        }

        const SECRET = Config.SECRET

        try {
            // 驗證 Token
            const decoded: any = jwt.verify(<string>token, SECRET)
            if (decoded.exp < Date.now() / 1000) {
                ctx.body = {
                    success: false,
                    errorCode: 401,
                    message: 'JWT token is expired'
                }
                return
            }
            await next()
        } catch (error: any) {
            ctx.body = {
                success: false,
                errorCode: 400,
                message: `JWT token ${error.message}`
            }
            return
        }

    }
}