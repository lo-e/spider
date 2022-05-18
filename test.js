// ==UserScript==
// @name         test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       loe
// @match        https://www.baidu.com*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// ==/UserScript==

(function () {
    console.log('start')

    console.log(utc_zone_time(19))

    console.log('end')
})()

function utc_zone_time(utc) {
    let time = new Date(Date.now())
    let year = time.getUTCFullYear()
    let month = time.getUTCMonth() + 1
    let day = time.getUTCDate()
    let hour = time.getUTCHours() + utc
    if (hour >= 24) {
        hour -= 24
    }
    let minute = time.getUTCMinutes()
    let second = time.getUTCSeconds()
    let time_str = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    return {'time_str':time_str,
            'year':year,
            'month':month,
            'day':day,
            'hour':hour,
            'minute':minute,
            'second':second}
}