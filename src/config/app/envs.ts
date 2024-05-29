import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

    //*** PUERTO DE LA APLICACIÓN ***//
    PORT: get('PORT').required().asPortNumber(),
    STAGE: get('STAGE').required().asString(),

    //*** CONFIGURACIÓN BASE DE DATOS ***//
    DB_PASSWORD: get('DB_PASSWORD').required().asString(),
    DB_NAME: get('DB_NAME').required().asString(),
    DB_PORT_POSTGRES: get('DB_PORT_POSTGRES').required().asPortNumber(),
    DB_PORT_DOCKER: get('DB_PORT_DOCKER').required().asPortNumber(),
    DB_HOST: get('DB_HOST').required().asString(),
    DB_USER: get('DB_USER').required().asString(),
    DB_TYPE: get('DB_TYPE').required().asString(),

    //*** URL GENERAL ***//
    WEB_SERVICE_URL: get('WEB_SERVICE_URL').required().asString(),
    WEB_APOLLO_SERVICE_URL: get('WEB_APOLLO_SERVICE_URL').required().asString(),

}