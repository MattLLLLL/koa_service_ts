import Koa from 'koa';
import { Controller, Post } from '../../common/decorator/Controller';
import Bcrypt from 'bcrypt-nodejs'
import { Seq, sequelize, User } from '../../models'

@Controller('register')
export default class RegisterController {

    @Post()
    static async createUser(ctx: Koa.Context) {
        const { account, password } = ctx.request.body

        if (!account) return ctx.body = {
            success: false,
            message: `Please enter account information.`,
        }

        if (!password) return ctx.body = {
            success: false,
            message: `Please enter password information.`,
        }

        const SQL = `SELECT A.account
                     FROM User A
                     WHERE A.account = :account`

        const $where = {
            account: account
        }

        const user = await Seq.query(SQL, { replacements: $where, type: sequelize.QueryTypes.SELECT })

        if (user.length > 0) {
            ctx.body = {
                success: false,
                message: `${account} duplicate name appears.`,
            }
            return
        }

        const salt = Bcrypt.genSaltSync(10)

        Bcrypt.hash(password, salt, null, function (err, hash) {
            User.create({
                account: account,
                password: hash
            })
        });

        ctx.body = {
            success: true,
            message: `Registration successful.`,
        }
    }

}