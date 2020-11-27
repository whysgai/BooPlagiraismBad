import App from './App';
import {AppConfig} from './AppConfig';

//Instantiate and run app
const app = new App(AppConfig.dbConnectionString(),AppConfig.port());
app.run();