import sequelize, { Sequelize } from 'sequelize';
import Config from '../../config.json';

import UserModel from './Stock/User'

const Seq = new Sequelize(Config.setting.database, Config.setting.username, Config.setting.password, {
    host: Config.connect.host,
    dialect: "mariadb"
});
const freezeTableName = { freezeTableName: true }

const User = Seq.define('User', UserModel, freezeTableName)

export {
    Seq,
    sequelize,
    User,
    Invset
}