import path from 'path';
import ScanRouter from './scanRouter';

const router = new ScanRouter();

router.scan([path.resolve(__dirname, '../src/controller')]);

export default router;