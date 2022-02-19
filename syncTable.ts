import { Seq } from './src/models'

const startSync = async () => {
    try {
        await Seq.authenticate();
        console.log('\x1b[33m%s\x1b[0m', '＊＊＊＊＊＊＊＊＊連結資料庫成功＊＊＊＊＊＊＊＊＊');
    } catch (error: any) {
        console.error('連接資料庫失敗:', error);
    }

    try {
        await Seq.sync({ alter: true });
        console.log('\x1b[33m%s\x1b[0m', '＊＊＊＊＊＊＊＊＊同步資料表完成＊＊＊＊＊＊＊＊＊')
    } catch (error: any) {
        console.error('同步資料表失敗:', error)
    }
}

startSync()