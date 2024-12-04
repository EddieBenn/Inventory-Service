import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(public reflector: Reflector) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const data = exception.getResponse();

    response.status(status).json({
      success: false,
      message:
        typeof JSON.parse(JSON.stringify(data)) == 'string'
          ? JSON.parse(JSON.stringify(data))
          : JSON.parse(JSON.stringify(data)).message,
      statusCode: status,
      path: request.url,
    });
  }
}
