export class BaseException extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundException extends BaseException {
  constructor(message: string = 'منبع مورد نظر یافت نشد') {
    super(message, 404);
  }
}

export class BadRequestException extends BaseException {
  constructor(message: string = 'درخواست نامعتبر است') {
    super(message, 400);
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message: string = 'دسترسی غیرمجاز') {
    super(message, 401);
  }
}

export class ForbiddenException extends BaseException {
  constructor(message: string = 'شما مجوز دسترسی به این منبع را ندارید') {
    super(message, 403);
  }
}

export class ValidationException extends BaseException {
  constructor(message: string = 'داده‌های ورودی نامعتبر هستند') {
    super(message, 422);
  }
}

export class InternalServerException extends BaseException {
  constructor(message: string = 'خطای داخلی سرور') {
    super(message, 500, false);
  }
}