// ==UserScript==
// @name         0x
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

    setTimeout(function () {
        let result = confirm('yes or no')
        console.log('result:', result)
    }, 1000)

    window.confirm = function() {
        return true
    }
})()