// ==UserScript==
// @name         learn_js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       loe
// @match        https://sunflower-land.com/play*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// ==/UserScript==

(function() {
    console.log('start！')
    var realtime_pos = new DOMPoint(0, 0)
    var is_draging = false

    // 监听点击
    listen_click()

    // 记录实时鼠标位置
    document.addEventListener("mousemove", function (ev){
        var oev = ev || event
        let clientX = oev.clientX
        let clientY = oev.clientY
        realtime_pos = new DOMPoint(clientX, clientY)
    });

    // 种植农作物
    var interval_crops = setInterval(()=>{
        let search_results = search_crops()
        let crops_ready = search_results[0]
        let crops_preparing = search_results[1]
        let crops_none = search_results[2]

        var available_crops_ready = []
        var available_crops_preparing = []
        var available_crops_none = []

        // 未解锁土地范围
        let locked_area = search_locked_farms_rect()

        // 已成熟作物洞口
        if(crops_ready.length){
            for(var index in crops_ready){
                let element = crops_ready[index]
                let rect =  element.getBoundingClientRect()
                var is_locked = false
                if(locked_area){
                    if((rect.left >= locked_area.left) & (rect.left+rect.width <= locked_area.left+locked_area.width) & (rect.top >= locked_area.top) & (rect.top+rect.height <= locked_area.top+locked_area.height)) {
                        // 该洞口未解锁
                        is_locked = true
                    }
                }
                if(!is_locked) {
                    available_crops_ready.push(element)
                }
            }
        }
        // fake
        console.log('已成熟作物洞口数量：', crops_ready.length, '可用：', available_crops_ready.length)

        // 待成熟作物洞口
        if(crops_preparing.length){
            for(index in crops_preparing){
                let element = crops_preparing[index]
                let rect =  element.getBoundingClientRect()
                is_locked = false
                if(locked_area){
                    if((rect.left >= locked_area.left) & (rect.left+rect.width <= locked_area.left+locked_area.width) & (rect.top >= locked_area.top) & (rect.top+rect.height <= locked_area.top+locked_area.height)) {
                        // 该洞口未解锁
                        is_locked = true
                    }
                }
                if(!is_locked) {
                    available_crops_preparing.push(element)
                }
            }
        }
        // fake
        console.log('待成熟作物洞口数量：', crops_preparing.length, '可用：', available_crops_preparing.length)

        // 未种植洞口
        if(crops_none.length){
            for(index in crops_none){
                let element = crops_none[index]
                let rect =  element.getBoundingClientRect()
                is_locked = false
                if(locked_area){
                    if((rect.left >= locked_area.left) & (rect.left+rect.width <= locked_area.left+locked_area.width) & (rect.top >= locked_area.top) & (rect.top+rect.height <= locked_area.top+locked_area.height)) {
                        // 该洞口未解锁
                        is_locked = true
                    }
                }
                if(!is_locked) {
                    available_crops_none.push(element)
                }
            }
        }
        // fake
        console.log('未种植洞口数量：', crops_none.length, '可用：', available_crops_none.length)

        if (available_crops_ready.length || available_crops_none.length) {
            // 调整农场位置
            let total_crops = available_crops_ready.concat(available_crops_none)
            if(!is_draging) {
                is_draging = true
                let drag_interval = setInterval(function () {
                    var direction_x = 0
                    var direction_y = 0
                    for (var i in total_crops) {
                        let crop = total_crops[i]
                        let crop_rect = crop.getBoundingClientRect()
                        let direction = drag_direction(crop_rect)
                        let dir_x = direction[0]
                        let dir_y = direction[1]
                        if (dir_x != 0) {
                            direction_x = dir_x
                        }
                        if (dir_y != 0) {
                            direction_y = dir_y
                        }
                    }
                    if (direction_x || direction_y) {
                        drag_to_farming(direction_x, direction_y)
                    }else {
                        is_draging = false
                        // fake
                        console.log('stop draging!')
                        clearInterval(drag_interval)
                    }
                }, 1000)
            }
        }
    }, 2000)
})()

// 根据元素坐标获取拖动方向，使元素处于合适的位置
function drag_direction(element_rect) {
    let client_width = document.documentElement.clientWidth        // 浏览器窗口不包含滚动条的宽度
    let client_height = document.documentElement.clientHeight       // 浏览器窗口不包含滚动条的高度

    var direction_x = 0
    var direction_y = 0
    if (element_rect.x <= 20) {
        // 需要向右拖动
        direction_x = 1
    }
    if (element_rect.x+element_rect.width >= client_width-100) {
        // 需要向左拖动
        direction_x = -1
    }
    if (element_rect.y <= 100) {
        // 需要向下拖动
        direction_y = 1
    }
    if (element_rect.y+element_rect.height >= client_height-20) {
        // 需要向上拖动
        direction_y = -1
    }
    return [direction_x, direction_y]
}

// 监听点击事件
function listen_click() {
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
}

// 随机拖动农场
function drag_to_farming(direction_x, direction_y) {
    let client_width = document.documentElement.clientWidth
    let client_height = document.documentElement.clientHeight
    let start_point = new DOMPoint(Math.random()*client_width, Math.random()*client_height)

    var end_x = 0
    var end_y = 0
    if(direction_x == 1){
        // 向右拖动
        end_x = start_point.x + (client_width - start_point.x)*Math.random()*0.5
    }else if (direction_x == -1) {
        // 向左拖动
        end_x = start_point.x - start_point.x*Math.random()*0.5
    }else {
        // 向左一点点
        end_x = start_point.x - start_point.x*Math.random()*0.1
    }

    if(direction_y == 1){
        // 向下拖动
        end_y = start_point.y + (client_height - start_point.y)*Math.random()*0.5
    }else if (direction_y == -1) {
        // 向上拖动
        end_y = start_point.y - start_point.y*Math.random()*0.5
    }else {
        // 向上一点点
        end_y = start_point.y - start_point.y*Math.random()*0.1
    }
    let end_point = new DOMPoint(end_x, end_y)

    // fake
    console.log('draging', direction_x, direction_y)
    move_mouse(null, true, start_point, end_point)
}

// 移动鼠标，拖动元素可选
function move_mouse(target, drag, from_point, to_point){
    if(!from_point || !to_point){
        return false
    }
    target = target || document.elementFromPoint(from_point.x, from_point.y)
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

// 搜寻待成熟进度条
function search_progress_bar() {
    var target_list = []
    $('.w-10').each(function (index, element) {
        let src = $(element).attr('src')
        if(src){
            let re = RegExp('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAHCAYAAADXhRcnAAAAUklEQVQYlWP8//8/')
            if(src.match(re)){
                // 找到待成熟进度条
                target_list.push(element)
            }
        }
    })
    return target_list
}

// 搜寻已成熟、待成熟、未种植洞口，并返回可点击元素数组
function search_crops() {
    var crops_ready = []
    var crops_preparing = []
    var crops_none = []
    $('.relative.group').each(function (index, element) {
        // 确认可点击元素
        var ele_click = null
        var img_list = $(element).find('img')
        $(img_list).each(function (index_img, ele_image) {
            let style = $(ele_image).attr('style')
            if(style == 'opacity: 0.1;'){
                ele_click = ele_image
                return false
            }
        })

        // 确认是否已成熟
        var confirm = false
        img_list = $(element).find('img')
        $(img_list).each(function (index_img, ele_image) {
            var id = $(ele_image).attr('id')
            if(id){
                if(ele_click) {
                    crops_ready.push(ele_click)
                }
                confirm = true
                return false
            }
        })
        if(confirm){
            return true
        }

        // 确认是否待成熟
        var preparing_list = $(element).find('.relative.w-full.h-full')
        if(preparing_list.length){
            if(ele_click) {
                crops_preparing.push(ele_click)
            }
            confirm = true
        }
        if(confirm){
            return true
        }

        // 确认未种植
        if(ele_click) {
            crops_none.push(ele_click)
        }
    })
    return [crops_ready, crops_preparing, crops_none]
}

// 搜寻农场的南瓜汤
function search_pumpkin_soup() {
    var pumpkin_soups = []
    $('.absolute').each(function (index, element) {
        let src = $(element).attr('src')
        if(src){
            let re = RegExp('iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAABGdBTUEAALGPC')
            if(src.match(re)){
                pumpkin_soups.push(element)
            }
        }
    })
    return pumpkin_soups
}

// 搜寻农场的泡菜
function search_sauerkrauts() {
    var sauerkrauts = []
    $('.absolute').each(function (index, element) {
        let src = $(element).attr('src')
        if(src){
            let re = RegExp('iVBORw0KGgoAAAANSUhEUgAAAAYAAAAKCAMAAACg0N8BAAAABGdBTUEAALGPC')
            if(src.match(re)){
                sauerkrauts.push(element)
            }
        }
    })
    return sauerkrauts
}

// 搜寻农场的烤花菜
function search_roasted_cauliflowers() {
    var roasted_cauliflowers = []
    $('.absolute').each(function (index, element) {
        let src = $(element).attr('src')
        if(src){
            let re = RegExp('iVBORw0KGgoAAAANSUhEUgAAAA4AAAAJBAMAAADwYwBaAAAABGdBTUEAALGPC')
            if(src.match(re)){
                roasted_cauliflowers.push(element)
            }
        }
    })
    return roasted_cauliflowers
}

// 搜寻未解锁土地坐标范围
function search_locked_farms_rect() {
    var locked_area = null
    var locked_rects = []
    $('img').each(function (index, element) {
        let class_name = $(element).attr('class')
        if(class_name){
            let re = RegExp('absolute z-20 hover:img-highlight cursor-pointer')
            if(class_name.match(re)){
                // 找到了
                let rect = element.getBoundingClientRect()
                locked_rects.push(rect)
            }
        }
    })
    // fake
    console.log('\n未解锁土地数量：', locked_rects.length)
    var left = 0
    var right = 0
    var top = 0
    var bottom = 0
    for(var index in locked_rects) {
        let rect = locked_rects[index]
        if(index == 0) {
            left = rect.x
            right = rect.x + rect.width
            top = rect.y
            bottom = rect.y + rect.height
        }else {
            left = Math.min(left, rect.x)
            right = Math.max(right, rect.x + rect.width)
            top = Math.min(top, rect.y)
            bottom = Math.max(bottom, rect.y + rect.height)
        }
    }
    if(locked_rects.length == 1) {
        left -= (right - left)
        top -= (bottom - top)/3.0
    }

    if(left || right || top || bottom){
        locked_area = new DOMRect(left, top, right-left, bottom-top)
    }
    return locked_area
}