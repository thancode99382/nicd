export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
}

export class ApiResponseBuilder {
  static success<T>(
    message: string,
    data?: T,
    statusCode: number = 200,
  ): ApiResponse<T> {
    return {
      statusCode,
      message,
      ...(data !== undefined && { data }),
    };
  }

  static created<T>(message: string, data?: T): ApiResponse<T> {
    return this.success(message, data, 201);
  }

  static ok<T>(message: string, data?: T): ApiResponse<T> {
    return this.success(message, data, 200);
  }
}
