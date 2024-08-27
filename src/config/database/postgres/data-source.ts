import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const type: DataSourceOptions['type'] = 'postgres';
const entities: DataSourceOptions['entities'] = [
  __dirname + '/../../../models/**/entities/*.entity.{js,ts}',
];
const factories: SeederOptions['factories'] = [
  __dirname + '/../../../database/factories/**/*.factory.{js,ts}',
];
const seeds: SeederOptions['seeds'] = [
  __dirname + '/../../../database/seeders/**/*.seeder.{js,ts}',
];

const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type,
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_NAME,
  password: process.env.POSTGRES_PASS,
  port: Number(process.env.POSTGRES_PORT),
  host: process.env.POSTGRES_HOST,
  synchronize: true,
  entities,
  factories,
  seeds,
};

export default new DataSource(dataSourceOptions);
