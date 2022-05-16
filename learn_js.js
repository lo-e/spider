// ==UserScript==
// @name         learn_js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       loe
// @match        https://melos.studio/login/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// ==/UserScript==

(function() {
    console.log('start！')
    //监听click
    document.addEventListener("click", function (ev){
        var oev = ev || event
        let clientX = oev.clientX
        let clientY = oev.clientY

        console.log('\n')
        console.log('click!')
        console.log(ev.srcElement)
        console.log('横坐标：'+clientX)
        console.log('纵坐标：'+clientY)

        var w = document.documentElement.clientWidth || document.body.clientWidth
        var h = document.documentElement.clientHeight || document.body.clientHeight
        console.log('windowX：'+w, 'windowY：'+h)

        console.log('\n')
    })

    let interval = setInterval(function (){
        $('input').each(function (index, element) {
            let id = $(element).attr('id')
            let name = $(element).attr('name')
            if(id=='inp-query' & name=='search_text'){
                clearInterval(interval)
                console.log(element)
                let rect =  element.getBoundingClientRect()
                let x = rect.x
                let y = rect.y
                console.log('坐标：',x, y)
            }
        })
    }, 2000)

    console.log('end!')
})()

//寻找滑块
function  find_slider() {
    let interval = setInterval(()=>{
        var container_list = $('.sliderIcon')
        if(container_list.length){
            var container = container_list[0]
            var slider_list = $(container).find('img')
            if(slider_list.length){
                var slider = slider_list[0]
                let rect = slider.getBoundingClientRect()
                let x = rect.x
                let y = rect.y
                let width = rect.width
                let height = rect.height
                if(width){
                    // 找到滑块，停止循环
                    clearInterval(interval)
                    let log_text = '滑块参数\n'+'x:'+x+' '+'y:'+y+' '+'widhth:'+width+' '+'height:'+height+'\n'
                    console.log(log_text)

                    // 滑动滑块
                    let from_point = new DOMPoint(rect.x + rect.width*Math.random(), rect.y + rect.height*Math.random())
                    let to_point = new DOMPoint(x+200, y+5);
                    move_mouse(slider, true, from_point, to_point)
                }
            }
        }
    }, 2000)
}

// 移动鼠标，拖动元素可选
function move_mouse(target, drag, from_point, to_point){
    if(!from_point || !to_point){
        return false
    }
    target = target || document.elementFromPoint(0, 0)
    var from_x = from_point.x
    var from_y = from_point.y
    // 移动到初始位置
    var mousemove = document.createEvent("MouseEvents");
    mousemove.initMouseEvent("mousemove",true,true,document.defaultView,0,
            from_x, from_y, from_x, from_y,false,false,false,false,0,null);
    target.dispatchEvent(mousemove);

    if(drag){
        // 按下鼠标
        var mousedown = document.createEvent("MouseEvents");
        // document.defaultView 可替换成 screen.defaultView
        mousedown.initMouseEvent("mousedown",true,true,document.defaultView,0,
                from_x, from_y, from_x, from_y,false,false,false,false,0,null);
        target.dispatchEvent(mousedown);
    }

    var to_x = from_x
    var to_y = from_y
    let x_distance = Math.abs(from_x-to_point.x)
    let y_distance = Math.abs(from_y-to_point.y)
    var x_direction = 0
    var y_direction = 0
    if(to_point.x >= from_x){
        // 向右移动
        x_direction = 1
    }else{
        // 向左移动
        x_direction = -1
    }
    if(to_point.y >= from_y){
        // 向下移动
        y_direction = 1
    }else{
        // 向上移动
        y_direction = -1
    }
    // 移动速度控制【0 < speed < 1】
    let speed = 0.2
    var interval = setInterval(function(){
        if(x_direction > 0){
            // 向右移动
            to_x += Math.ceil(Math.random() * x_distance * speed)
            if(to_x >= to_point.x){
                // 到达指定位置
                to_x = to_point.x
            }
        }else if(x_direction < 0){
            // 向左移动
            to_x -= Math.ceil(Math.random() * x_distance * speed)
            if(to_x <= to_point.x){
                // 到达指定位置
                to_x = to_point.x
            }
        }

        if(y_direction > 0){
            // 向下移动
            to_y += Math.ceil(Math.random() * y_distance * speed)
            if(to_y >= to_point.y){
                // 到达指定位置
                to_y = to_point.y
            }
        }else if(y_direction < 0){
            // 向上移动
            to_y -= Math.ceil(Math.random() * y_distance * speed)
            if(to_y <= to_point.y){
                // 到达指定位置
                to_y = to_point.y
            }
        }

        // 移动鼠标
        var mousemove = document.createEvent("MouseEvents");
        mousemove.initMouseEvent("mousemove",true,true,document.defaultView,0,
                to_x, to_y, to_x, to_y,false,false,false,false,0,null);
        target.dispatchEvent(mousemove);

        if(to_x == to_point.x & to_y == to_point.y){
            clearInterval(interval);
            if(drag){
                // 放开鼠标
                var mouseup = document.createEvent("MouseEvents");
                mouseup.initMouseEvent("mouseup",true,true,document.defaultView,0,
                to_x, to_y, to_x, to_y,false,false,false,false,0,null);
                target.dispatchEvent(mouseup);
            }
        }
    }, 30);
}

// 百度文库自动选择
// @match        https://tiku.baidu.com/tikupc/paperdetail/*
function baidu_wenku(){
    $('.question-box-inner').each(function (index_que, element_que) {
        console.log('题'+ index_que + '：')
        let sel = $(element_que).find('.que-options .opt-item .ext_text-align_left .prefix')

        let offsetX = $(sel).offsetX
        let offsetY = sel.offsetY
        console.log('offsetX:'+offsetX)
        console.log('offsetY:'+offsetY)

        $(sel).each(function (index_sel, element_sel) {
            let sel_text =  $(element_sel).text()
            console.log(sel_text+' ')
            // $(element_sel).click()
        })

        return false
    })

    let interval = setInterval(()=>{
        $('.exam-answer').each(function (index_answer, element_answer) {
            clearInterval(interval)

            let answer_text = $(element_answer).find('.answer-item span').text()
            console.log('答案：'+answer_text)
        })

    }, 1000)
}

// 监听鼠标的点击并获取横纵坐标
// 方案一
document.onclick = function (ev) {
        var oev = ev || event
        let clientX = oev.clientX
        let clientY = oev.clientY
        console.log('窗口横坐标：'+clientX)
        console.log('窗口纵坐标：'+clientY)

        let screenX = oev.screenX
        let screenY = oev.screenY
        console.log('显示器横坐标：'+screenX)
        console.log('显示器纵坐标：'+screenY)

        let pageX = oev.pageX
        let pageY = oev.pageY
        console.log('页面（根元素）横坐标：'+pageX)
        console.log('页面（根元素）纵坐标：'+pageY)

        let offsetX = oev.offsetX
        let offsetY = oev.offsetY
        console.log('目标元素横坐标：'+offsetX)
        console.log('目标元素纵坐标：'+offsetY)

        console.log('\n')
}
// 方案二
document.addEventListener("click", function (ev){
            var oev = ev || event
            let clientX = oev.clientX
            let clientY = oev.clientY

            console.log('\n')
            console.log('click!')
            console.log(ev.srcElement)
            console.log('横坐标：'+clientX)
            console.log('纵坐标：'+clientY)
            console.log('\n')
        })
document.addEventListener("mousedown", function (ev){
    var oev = ev || event
    let clientX = oev.clientX
    let clientY = oev.clientY

    console.log('\n')
    console.log('mousedown!')
    console.log(ev.srcElement)
    console.log('横坐标：'+clientX)
    console.log('纵坐标：'+clientY)
    console.log('\n')
});
document.addEventListener("mousemove", function (ev){
    var oev = ev || event
    let clientX = oev.clientX
    let clientY = oev.clientY

    console.log('\n')
    console.log('mousemove!')
    console.log(ev.srcElement)
    console.log('横坐标：'+clientX)
    console.log('纵坐标：'+clientY)
    console.log('\n')
});
document.addEventListener("mouseup", function (ev){
            var oev = ev || event
            let clientX = oev.clientX
            let clientY = oev.clientY

            console.log('\n')
            console.log('mouseup!')
            console.log(ev.srcElement)
            console.log('横坐标：'+clientX)
            console.log('纵坐标：'+clientY)
            console.log('\n')
        });

// 点击指定坐标点
// 方案一
document.elementFromPoint(236, 251).click()
// 方案二【推荐】
var mousedown = document.createEvent("MouseEvents");
mousedown.initMouseEvent("click",true,true,document.defaultView,0,
            x, y, x, y,false,false,false,false,0,null);
to_click.dispatchEvent(mousedown);

// 获取窗口大小
document.documentElement.clientWidth        // 不包含滚动条的宽度
document.documentElement.clientHeight       // 不包含滚动条的高度

document.body.clientWidth                   // 不包含滚动条的完整页面宽度
document.body.clientHeight                  // 不包含滚动条的完整页面高度

// 获取元素坐标
let rect =  sel.getBoundingClientRect()
let x = rect.x
let y = rect.y
let left = rect.left
let right = rect.right
let width = rect.width
let height = rect.height
let top = rect.top
let bottom = rect.bottom

// 获取指定坐标的元素
document.elementFromPoint(0, 0)

// 浏览器窗口的大小
console.log(window.innerWidth)
console.log(window.innerHeight)

// 正则表达式搜索字符串
let text = 'abcxyz'
let re = RegExp('abc')
if(text.match(re)){
    // 找到了
    console.log(text)
}

// 数学相关
// 随机生成0-1的浮点型
Math.random()

// 一个窗口就是一个window对象，以下可以理解成是window子对象，也可以看成属性
document                // 文档对象用于操作页面元素
location                // 地址对象用于操作URL地址
navigator               // 浏览器对象用于获取浏览器版本信息
history                 // 历史对象用于操作浏览器历史
screen                  // 屏幕对象用于操作屏幕的高度和宽度

// window常用方法，可以省略window前缀
alert()                 // 提示一个对话框
confirm()               // 判断对话框
prompt()                // 输入对话框
open()                  // 打开窗口
close()                 // 关闭窗口
setTimeout()            // 打开一次性定时器
clearTimeout()          // 关闭一次性定时器
setInterval()           // 开启重复性定时器
clearInterval()         // 关闭重复性定时器

window.confirm = function(confirm) {
    if (confirm == 'yes or no') {
        console.log(confirm)
    }
    return true
}

// 判断类型
typeof obj
obj instanceof Object

// 创建区域位置
new DOMRect(0, 0, -100, 100)
new DOMPoint(0, 0);