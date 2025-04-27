import { jest } from '@jest/globals';
import type { AxiosResponse, AxiosStatic } from 'axios';

// Helper function to create mock responses
const mockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as AxiosResponse['config'],
});

// Create mock instance with proper types
const mockAxios = {
  get: jest.fn().mockImplementation(() => Promise.resolve(mockAxiosResponse({}))),
  post: jest.fn().mockImplementation(() => Promise.resolve(mockAxiosResponse({}))),
  put: jest.fn().mockImplementation(() => Promise.resolve(mockAxiosResponse({}))),
  delete: jest.fn().mockImplementation(() => Promise.resolve(mockAxiosResponse({}))),
  patch: jest.fn().mockImplementation(() => Promise.resolve(mockAxiosResponse({}))),
  create: jest.fn().mockReturnThis(),
  defaults: {
    headers: {
      common: {},
      delete: {},
      get: {},
      head: {},
      post: {},
      put: {},
      patch: {},
    },
    baseURL: '',
  },
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
      clear: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
      clear: jest.fn(),
    },
  },
} as unknown as jest.Mocked<AxiosStatic>;

beforeEach(() => {
  mockAxios.get.mockClear();
  mockAxios.post.mockClear();
  mockAxios.put.mockClear();
  mockAxios.delete.mockClear();
  mockAxios.patch.mockClear();
});

export { mockAxios };
export default mockAxios;