import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import qs from 'qs'
import { signIn, getSession } from 'next-auth/react'

const baseURL = process.env.REACT_APP_API_URL

axios.defaults.paramsSerializer = function (params) {
  return qs.stringify(params, { arrayFormat: 'repeat' })
}

const ApiClient = () => {
  const defaultOptions = {
    baseURL,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  }

  const instance = axios.create(defaultOptions)

  instance.interceptors.request.use(async (request) => {
    const session = await getSession()

    if (session) {
      request.headers.Authorization = `Bearer ${session.accessToken}`
    }
    return request
  })

  return instance
}

type TAPIConfig = {
  isLoginCallback?: boolean;
  isErrorCallback?: boolean;
}

type TAPIRequest = AxiosRequestConfig & {
  config?: TAPIConfig;
  isLoading?: boolean;
}

type TResponse<T> = {
  success: boolean;
  data?: T;
  error?: any;
  headers?: any;
}

export class API {
  instance: AxiosInstance = null
  errorCallback = undefined
  setisLoading = undefined
  constructor () {
    this.instance = axios.create({
      baseURL: process.env.API_URL,
      timeout: 100000,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }

  setErrorCallback (errorCallback) {
    this.errorCallback = errorCallback
  }

  setLoading (setisLoading) {
    this.setisLoading = setisLoading
  }

  async request<T> ({ method, url, params, data, config = {}, isLoading = false }: TAPIRequest): Promise<TResponse<T>> {
    const session = await getSession()

    try {
      if (session) {
        this.instance.defaults.headers.common.Authorization = `Bearer ${session.accessToken}`
      }
      if (isLoading) this.setisLoading(true)
      const response = await this.instance({ method, url, data, params })
      if (isLoading) this.setisLoading(false)
      return { data: response.data, success: true, headers: response.headers }
    } catch (error) {
      if (isLoading) this.setisLoading(false)
      if (!error.response) {
        if (this.errorCallback) this.errorCallback({})
        return { success: false, error: {} }
      }
      if (!config.isLoginCallback && error.response.status === 401) {
        if (session && session.refreshToken) {
          await signIn()
          return await this.request({ method, url, params, data, config })
        }
        window.location.href = `/auth/login?page=${encodeURIComponent(window.location.pathname + window.location.search)}`
        return { success: false, error: {} }
      } else if (!config.isErrorCallback) {
        if (this.errorCallback) this.errorCallback(error.response)
      }
      return { success: false, error: error.response }
    }
  }
}

export default ApiClient()
