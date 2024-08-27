import { registerAs } from '@nestjs/config';

const MailConfig = registerAs('mail', () => ({
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
  port: process.env.MAIL_PORT,
  host: process.env.MAIL_HOST,
  secure: process.env.MAIL_SECURE,
  user_r: process.env.MAIL_USER_R,
  pass_r: process.env.MAIL_PASS_R,
  from: process.env.MAIL_FROM,
  from_name: process.env.MAIL_FROM_NAME,
  queue_name: process.env.MAIL_QUEUE_NAME,
  queue_host: process.env.MAIL_QUEUE_HOST,
  queue_port: Number(process.env.MAIL_QUEUE_PORT),
}));
export default MailConfig;
