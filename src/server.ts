import App from '@/app';
import HealthRoute from '@/routes/health.route';
import validateEnv from '@utils/validateEnv';
import AuthRoute from '@routes/auth.route';
import WalletRoute from './routes/wallet.route';

validateEnv();

const app = new App([new HealthRoute(), new AuthRoute(), new WalletRoute()]);

app.listen();
