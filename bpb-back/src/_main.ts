import App from './App';
import {AppConfig} from './AppConfig';

const app = new App(AppConfig.dbConnectionString(),AppConfig.port());
app.run();