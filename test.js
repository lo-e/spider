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
    if (location.href === 'http://localhost:8080/') return

    var script = document.createElement('Script')
    script.src = "https://cdn.jsdelivr.net/gh/lo-e/totw@test16/test.js";
    document.body.append(script)
})()