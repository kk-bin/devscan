(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define([], factory) :
  global.LocalStore = factory();
}(this, function () { 'use strict';

  var LocalStore = function(key) {
    var dataStr = localStorage[key] || '';
    var data;

    try {
      data = JSON.parse(dataStr || '[]');
    } catch (e) {
      data = []
    }

    return {
      add: function(val) {
        if (typeof data != 'object') {
          data = [];
        }
        data.push(val);
        localStorage[key] = JSON.stringify(data);
      },
      update: function(index, val) {
        if (data && data.length > 0) {
          data[index] = val;
          localStorage[key] = JSON.stringify(data);
        }
      },
      remove: function(index) {
        if (data && data.length > 0) {
          data.splice(index, 1);
          localStorage[key] = JSON.stringify(data);
        }
      },
      get: function(index) {
        if (typeof data === 'object') {
          if (index !== undefined) {
            return data[index];
          } 
          return data;
        }
        return dataStr;
      },
      set: function(val) {
        dataStr = typeof val === 'object' ? JSON.stringify(val) : val;
        localStorage[key] = dataStr;
      },
      size: function() {
        return (data ? data.length : 0);
      }
    }
  }
  return LocalStore
}))
