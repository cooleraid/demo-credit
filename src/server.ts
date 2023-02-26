import App from '@/app';
import HealthRoute from '@/routes/health.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new HealthRoute()]);

app.listen();
