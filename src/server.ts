import App from '@/app';
import HealthRoute from '@/routes/health.route';
import validateEnv from '@utils/validateEnv';
import AuthRoute from '@routes/auth.route';
import WalletRoute from './routes/wallet.route';
import serverless from 'serverless-http';

validateEnv();

const app = new App([new HealthRoute(), new AuthRoute(), new WalletRoute()]);

export const handler = serverless(app.listen());
