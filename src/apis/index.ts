import { request } from "src/utils/request";
import _ from 'lodash'

export const sign = (data) => request('/sign', 'post', data);
export const ethSign = (data) => request('/ethsign', 'post', data);
