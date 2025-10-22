import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
  ValidationException,
} from '../exceptions';

export const CallApi = () => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    withCredentials: true,
  });
  axiosInstance.interceptors.request.use(
    (config) => {
      config.withCredentials = true;
      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (err: AxiosError) => {
      console.log(err);

      if (err.response) {
        const { status, data } = err.response;
        const errorMessage =
          (data as { message?: string })?.message || 'خطایی رخ داده است';

        switch (status) {
          case 400:
            throw new BadRequestException(errorMessage);
          case 401:
            throw new UnauthorizedException(errorMessage);
          case 403:
            throw new ForbiddenException(errorMessage);
          case 404:
            throw new NotFoundException(errorMessage);
          case 422:
            throw new ValidationException(errorMessage);
          default:
            throw new InternalServerException(errorMessage);
        }
      }

      throw new InternalServerException('خطا در برقراری ارتباط با سرور');
    },
  );

  return axiosInstance;
};
