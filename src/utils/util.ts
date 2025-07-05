import dayjs from "dayjs";
import { ethers } from "ethers";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { format } from 'mathjs';
import mongoose from 'mongoose';
import _ from 'lodash'

import { DEFAULT_PAGE_SIZE, OPERATE_RESULT, address0, pricePrecision } from "../constants";
import moment from "moment";

dayjs.extend(utc);
dayjs.extend(timezone);

export function guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

export function getKey(str1, str2) {
  return str1 + "_" + str2;
}

export function filterId(id) {
  return new mongoose.Types.ObjectId(`${id}`);
}

export function getUnixTimestamp() {
  return parseInt(''+Date.now()/1000)
}

export function format2UnixTimestamp(timeString = '') {
  const date = timeString ? new Date(timeString) : new Date();
  return parseInt('' + (date.getTime()/1000));
}

export function formatMoney(num, precision = 1) {
  return +format(num, { notation: 'fixed', precision })
}

export function isSameString(a, b) {
  return a && b && String(a).toLowerCase() === String(b).toLowerCase();
}

export function formatFilter(_filter) {
  const filter = {};
  for (var param in _filter) {
    if (_filter[param] !== undefined && _filter[param] !== '') {
      if (_filter[param] === 'true' || _filter[param] === 'false') {
        filter[param] = _filter[param] === 'true' ? true : false;
      } else {
        filter[param] = _filter[param];
      }
    }
  }

  return filter;
}

export function addressReg(address) {
  return typeof address === 'string' ? new RegExp(address, 'i') : undefined;
}

export function parseUnitsToFe(amount, decimals) {
  if (/e/.test(amount.toString())) {
    return parseInt(String(amount * (10 ** decimals))).toString();
  }
  return ethers.utils.parseUnits(amount ? amount.toFixed(decimals) : '0', decimals).toString();
}

export function formatNumber(num: number, precision = 1) {
    return format(num, { notation: 'fixed', precision });
}

export function createContractWithProvider(
    abi: Array<any>,
    address: string,
    provider
) {
    return new ethers.Contract(address, abi, provider);
}

export function bigNumberFormat(num: number) {
    if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
        if (/e/.test(String(num))) {
            return String(num).replace(/(\.[0-9]{4})[0-9]*e/, "$1e");
        } else {
            return bigNumberFormat(num / 1e12) + "T";
        }
    } else if (num > 1e12) {
        return parseInt(String(num / 1e10)) / 100 + "T";
    } else if (num > 1e9) {
        return parseInt(String(num / 1e7)) / 100 + "G";
    } else if (num > 1e6) {
        return parseInt(String(num / 1e4)) / 100 + "M";
    } else if (num > 1e3) {
        return parseInt(String(num / 1e1)) / 100 + "K";
    } else {
        return num.toFixed(pricePrecision);
    }
}

/**
 * number format：123,456,789
 * @param num
 * fractionDigits fraction length
 * unitNumber 10000 unit format / 1000
 * unit
 */
export function thousandSplitFormat(
    num: number = 0,
    fractionDigits = 0,
    unitNumber = 1,
    unit = ""
): number | string {
    if (num > unitNumber) {
        const cNum = (Number(num) / unitNumber).toFixed(fractionDigits);
        return `${cNum
            .toString()
            .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")}${unit}`;
    }

    return Number(num).toFixed(fractionDigits);
}

export function formatDecimals(num, fractionDigits) {
    return Number(num).toFixed(fractionDigits);
}

export function makeAsyncIterator(len: number) {
    return {
        [Symbol.asyncIterator]() {
            return {
                index: 0,
                next() {
                    if (this.index < len) {
                        return Promise.resolve({
                            value: this.index++,
                            done: false,
                        });
                    }
                    return Promise.resolve({ value: undefined, done: true });
                },
            };
        },
    };
}

export function formatUnitsUtil(num: ethers.BigNumberish, uint: number) {
    const v = typeof num === 'number' ? `${format(num, { notation: 'fixed' })}` : num;
    return ethers.utils.formatUnits(v || 0, uint);
}

export function parseUnitsUtil(num: any, uint: number) {
    const v = `${format(+num, { notation: 'fixed' })}`;
    return ethers.utils.parseUnits(v || "0", uint);
}

export function safeValue(val) {
    return ethers.BigNumber.isBigNumber(val) ? val.toString() : val;
}

export function formatDays(period) {
    return period ? (seconds2Days(period) + " days") : "-";
}

export function seconds2Days(seconds: number) {
    return +(seconds / 3600 / 24).toFixed(3);
}

export function formatUTCTime(timestamp: number) {
    // return dayjs.utc(timestamp * 1000).format("YYYY-MM-DD HH:mm:ss") + "(UTC)";
    return timestamp >= 0 ? new Date(timestamp * 1000).toLocaleString() : '-';
}

export function topic2Short(topic = '') {
    return topic.substring(0, 10);
}

export function formatWallet(wallet, len = 6) {
    if (!wallet) return '-';
    return wallet.substring(0, len) + '...' + wallet.substring(wallet.length - 4, wallet.length);
}

export const showWallet = formatWallet;

export const showToolId = (toolId) => {
    const toolIdStr = String(toolId) || '';
    if (toolIdStr.length > 12) {
        return toolIdStr.slice(0,6) + '...' + toolIdStr.slice(toolIdStr.length - 6, toolIdStr.length);
    } else {
        return toolIdStr;
    }
}

export const dateFormat = (fmt, date) => {
    if (typeof date === "string" || typeof date === "number") {
        date = new Date(date);
    }

    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),
        "m+": (date.getMonth() + 1).toString(),
        "d+": date.getDate().toString(),
        "H+": date.getHours().toString(),
        "M+": date.getMinutes().toString(),
        "S+": date.getSeconds().toString(),
        // add other format char, need transform to string
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(
                ret[1],
                ret[1].length === 1
                    ? opt[k]
                    : opt[k].padStart(ret[1].length, "0")
            );
        }
    }
    return fmt;
};

export const formatQueryParams = function(params) {
    const data: any = { params: {} }
    Object.keys(params).map(key => {
        switch (key) {
            case "page":
                data.page = params.page || 0;
                break;
            case "size":
                data.size = params.size || DEFAULT_PAGE_SIZE;
                break;
            default:
                if (params[key]) {
                    data.params[key] = params[key]
                }
                break;
        }
    })

    return data;
}

export const operateError = function(code: OPERATE_RESULT, e?: any, data?: any) {
    const message = e ? (
        typeof e === 'string' ? e : (
            e.reason ? e.reason : e.data ? e.data.message : e.message
        )
    ) : "";
    return { code, message, data }
}

export const testValidAddress = function(address?: string) {
    return address && address !== address0;
}

export const isSameAddress = function(addr1, addr2) {
    return String(addr1).toLowerCase() === String(addr2).toLowerCase();
}



export const parseChainId = function(anyIdx) {
    return anyIdx.split("_").reverse()[0];
}

export const sleep = async (second = 2) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(second);
        }, second * 1000)
    })
}

export function hexString(chainId) {
    return '0x' + (chainId).toString(16);
}

export function fromTime(time?) {
    return time ? moment.unix(time) : moment().add(30, 'days');
}

export function toTime(time) {
    return time && time.unix();
}

export function fromTimeRange(tge?) {
    if (tge && tge.length) {
        return [fromTime(tge[0]), fromTime(tge[1])];
    } else {
        return [moment(), moment().add(12, 'days')];
    }
}

export function timeMiddle(timeRange) {
    const duration = toTimeRange(timeRange);
    return duration[0] + Math.ceil((duration[1] - duration[0])/2);
}

export function toTimeRange(tge) {
    return [toTime(tge[0]), toTime(tge[1])];
}

export function timeColor(start, end?) {
    const now = Date.now() / 1000;
    if (end) {
      if (now < start) return { color: 'grey' };
      else if (now < end) return { color: 'green' };
      return { color: 'red' };
    } else {
      if (now < start) return { color: 'green' };
      return { color: 'red' };
    }
    
}

export function calcPercent(part, all, unit = '%') {
    if (isNaN(part) || isNaN(all) || all == 0) return '-';
    return (part/all*100).toFixed(2) + unit;
}