import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {}
  async use(req: Request, res: Response, next: (error?: any) => void) {
    next();
  }
}
