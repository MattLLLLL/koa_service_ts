import Koa from 'koa';
import { Controller, Post } from '../../common/decorator/Controller';
import Bcrypt from 'bcrypt-nodejs'
import { Seq, sequelize } from '../../models'
import jwt from 'jsonwebtoken'
import Config from '../../../config.json';

@Controller('login')
export default class LoginController {

    @Post()
    static async getLogin(ctx: Koa.Context) {
        const { account, password } = ctx.request.body

        if (!account) return ctx.body = {
            success: false,
            message: `Please enter account information.`,
        }

        if (!password) return ctx.body = {
            success: false,
            message: `Please enter password information.`,
        }

        const SQL = `SELECT A.password
                     FROM User A
                     WHERE A.account = :account`

        const $where = {
            account: account
        }

        const user = await Seq.query(SQL, { replacements: $where, type: sequelize.QueryTypes.SELECT })

        if (user.length === 0) {
            ctx.body = {
                success: false,
                message: `No such account.`,
            }
            return
        }

        const hash = Object.assign(user[0]).password
        const result = Bcrypt.compareSync(password, hash)

        if (!result) {
            ctx.body = {
                success: false,
                message: `Password input error.`
            }
            return
        }

        // 設定密鑰
        const SECRET = Config.SECRET

        // 建立 Token
        const token = jwt.sign({
            account: account,
            exp: Math.floor(Date.now() / 1000) + (1440 * 60), //1h
        }, SECRET)

        ctx.body = {
            success: true,
            message: `Login successful.`,
            token: token
        }

    }

}