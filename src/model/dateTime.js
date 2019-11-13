import React from 'react';

var d = new Date();

export var dateTime = {
    date: d.getDate(),
    day: d.getDay(),
    year: d.getFullYear(),
    hour: d.getHours(),
    milliseconds: d.getMilliseconds(),
    minutes: d.getMinutes(),
    month: d.getMonth(),
    seconds: d.getSeconds(),
    time: d.getTime(),
    now: Date.now()
}
