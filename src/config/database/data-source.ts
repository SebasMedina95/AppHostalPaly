import { DataSourceOptions, DataSource } from 'typeorm';
import { config } from 'dotenv';

config();
export const dataSourceOptions: DataSourceOptions = {

    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT_DOCKER),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/config/database/migrations/*.js']

}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;