import { DataTypes, INTEGER } from 'sequelize'

const Invset = {
    name: {
        type: DataTypes.STRING
    },
    amount: {
        type: DataTypes.DOUBLE
    },
    amount_twd: {
        type: DataTypes.INTEGER
    },
    usd_rate: {
        type: DataTypes.DOUBLE
    },
    date: {
        type: DataTypes.STRING
    },
    action: {
        type: DataTypes.ENUM('OUT', 'IN')
    }
}


export default Invset