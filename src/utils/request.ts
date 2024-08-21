import axios from 'axios';

import { notification } from 'antd';

function redirectLogin(res) {}
function systemRepair(res) {
  // window.location.href = '/system/repair';
}
function popError(err) {}

function createReq(baseURL) {
    const request = axios.create({
      baseURL,
      timeout: 15 * 1000
    });
    
    // cors with cookies
    // request.defaults.withCredentials = true;
    request.interceptors.request.use((config) => {
      // if (token) {
      //   config.headers = {
      //     ...config.headers,
      //     token: `${token}`
      //   };
      // }

      return config;
    }, (error) => {
      return Promise.reject(error);
    });
    
    request.interceptors.response.use(
      response => {
        // response.status = 200
        const res = response.data || {};
        if (res.code == 401) {
          return redirectLogin(res);
        } else if (res.code == 502) {
          // return systemRepair(res);
          return;
        } else {
          if (res.code && res.code != 200) {
            // popError(res.msg);
            notification.error({
              message: res.message
            });
          }
          return res;
        }
      },
      error => {
        if (error.response) {
          const res = error.response.data || {};
          switch (error.response.status) {
            case 400:
              if (res.code == 2003 || res.code == 2002) {
                return redirectLogin(res);
              }
              break;
            case 401:
              return redirectLogin(res);
            case 502:
            case 504:
              return systemRepair(res);
            default:
              ;
          }
          // popError(res && res.message || 'Server error');
          return Promise.reject(res); //
        }
        // popError('Unknow error');
        return Promise.reject(error);
      });

  return request;
}

const req = createReq('');

interface ResponseEntity {
  code: number,
  message: string,
  data: any
}

const formatResponse = (res: any) => {
  return res as ResponseEntity;
};

const apiReq = createReq("/api");
const request = (api, type, data?, config?) => {
    return new Promise<{ ok: boolean; message:string, data: any }>((reslove, reject) => {
      apiReq[type](api, data, config)
            .then((res: any) => {
                const { code, message, data } = res || {};
                reslove({
                    ok: code == "200" ? true : false,
                    message: message,
                    data: data || {},
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export { createReq, req, formatResponse, request };