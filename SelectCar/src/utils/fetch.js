
const Tool = {};
/**
 * 发送ajax请求和服务器交互
 * @param {object} mySetting 配置ajax的配置
 */
Tool.ajax = function (mySetting) {

    var setting = {
        url: window.location.pathname, //默认ajax请求地址
        async: true, //true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false
        type: 'GET', //请求的方式
        data: {}, //发给服务器的数据
        dataType: 'json',
        success: function (text) { }, //请求成功执行方法
        error: function () { } //请求失败执行方法
    };


    var aData = []; //存储数据
    var sData = ''; //拼接数据
    //属性覆盖
    for (var attr in mySetting) {
        setting[attr] = mySetting[attr];
    }
    for (var attr in setting.data) {
        aData.push(attr + '=' + filter(setting.data[attr]));
    }
    sData = aData.join('&');
    setting.type = setting.type.toUpperCase();

    var xhr = new XMLHttpRequest();
    try {
        if (setting.type == 'GET') { //get方式请求
            sData = setting.url + '?' + sData;
            xhr.open(setting.type, sData + '&' + new Date().getTime(), setting.async);
            xhr.send();
        } else { //post方式请求  application/json:application/x-www-form-urlencoded:Access-Control-Allow-Origin
            xhr.open(setting.type, setting.url, setting.async);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(sData);
        }
    } catch (e) {
        return httpEnd();
    }

    if (setting.async) {
        xhr.addEventListener('readystatechange', httpEnd, false);
    } else {
        httpEnd();
    }

    function httpEnd() {
        if (xhr.readyState == 4) {
            var head = xhr.getAllResponseHeaders();
            var response = xhr.responseText;
            //将服务器返回的数据，转换成json

            if (/application\/json/.test(head) || setting.dataType === 'json' && /^(\{|\[)([\s\S])*?(\]|\})$/.test(response)) {
                response = JSON.parse(response);
            }

            if (xhr.status == 200) {
                setting.success(response, setting, xhr);
            } else {
                setting.error(setting, xhr);
            }
        }
    }
    xhr.end = function () {
        xhr.removeEventListener('readystatechange', httpEnd, false);
    }

    function filter(str) { //特殊字符转义
        str += ''; //隐式转换
        str = str.replace(/%/g, '%25');
        str = str.replace(/\+/g, '%2B');
        str = str.replace(/ /g, '%20');
        str = str.replace(/\//g, '%2F');
        str = str.replace(/\?/g, '%3F');
        str = str.replace(/&/g, '%26');
        str = str.replace(/\=/g, '%3D');
        str = str.replace(/#/g, '%23');
        return str;
    }
    return xhr;
};
/**
 * 封装ajax post请求
 * @param {string} pathname 服务器请求地址
 * @param {object} data     发送给服务器的数据
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */
Tool.post = function (pathname, data, success, error) {
    var setting = {
        url: pathname, //默认ajax请求地址
        type: 'POST', //请求的方式
        data: data, //发给服务器的数据
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Tool.ajax(setting);
};
/**
 * 封装ajax get请求
 * @param {string} pathname 服务器请求地址
 * @param {object} data     发送给服务器的数据
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */
Tool.get = function (pathname, data, success, error) {
    var setting = {
        url: pathname, //默认ajax请求地址
        type: 'GET', //请求的方式
        data: data, //发给服务器的数据
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Tool.ajax(setting);
};

/**
 * 格式化时间
 * 
 * @param {any} t
 * @returns
 */
Tool.formatDate = function (str) {
    var date = new Date(str);
    var time = new Date().getTime() - date.getTime(); //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
    if (time < 0) {
        return '';
    } else if (time / 1000 < 60) {
        return parseInt((time / 1000)) + '秒前';
    } else if ((time / 60000) < 60) {
        return parseInt((time / 60000)) + '分钟前';
    } else if ((time / 3600000) < 24) {
        return parseInt(time / 3600000) + '小时前';
    } else if ((time / 86400000) < 31) {
        return parseInt(time / 86400000) + '天前';
    } else if ((time / 2592000000) < 12) {
        return parseInt(time / 2592000000) + '月前';
    } else {
        return parseInt(time / 31536000000) + '年前';
    }
}

/**
 * 本地数据存储或读取
 * 
 * @param {any} key
 * @param {any} value
 * @returns
 */
Tool.localItem = function (key, value) {
    if (arguments.length == 1) {
        return localStorage.getItem(key);
    } else {
        return localStorage.setItem(key, value);
    }
}

/**
 * 删除本地数据
 * 
 * @param {any} key
 * @returns
 */
Tool.removeLocalItem = function (key) {
    if(key) {
        return localStorage.removeItem(key);
    }
    return localStorage.removeItem();
}


/**
 * base64加密 
 * 
 * @param {any} str
 * @returns
 */ 
Tool.base64 = function(str){
    var base64encodechars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64decodechars = new Array(
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
            52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
            -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
            -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

    function base64encode(str) {
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64encodechars.charAt(c1 >> 2);
                out += base64encodechars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64encodechars.charAt(c1 >> 2);
                out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
                out += base64encodechars.charAt((c2 & 0xf) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64encodechars.charAt(c1 >> 2);
            out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
            out += base64encodechars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
            out += base64encodechars.charAt(c3 & 0x3f);
        }
        return out;
    }

    function base64decode(str) {
        var c1, c2, c3, c4;
        var i, len, out;

        len = str.length;

        i = 0;
        out = "";
        while (i < len) {

            do {
                c1 = base64decodechars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1)
                break;

            do {
                c2 = base64decodechars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1)
                break;

            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)
                    return out;
                c3 = base64decodechars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1)
                break;

            out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2));

            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61)
                    return out;
                c4 = base64decodechars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    }
    return base64encode(str);
}


/**
 * 封装参数
 *
 * @param {any} str
 * @returns
 */
Tool.parameter = function(str,order,brandId,page,more){
    let o = {};

    let TypeVal = Tool.localItem('TypeVal');
    o.subcateId = TypeVal || '';

    let DriveVal = Tool.localItem('DriveVal');
    if(DriveVal){
        o.driveId = JSON.parse(DriveVal).val || '';
    }

    let TonVal = Tool.localItem('TonVal');
    o.weighTotal = TonVal || '';

    let RoadVal = Tool.localItem('RoadVal');
    if(str !== 1){
        o.roadsConId = RoadVal || '';
    }else{
        o.roadsConId = 0;
    }

    let SlopeVal = Tool.localItem('SlopeVal');
    o.averageGradient = SlopeVal || '';

    let speedVal = Tool.localItem('SpeedVal');
    o.maxEncSpeed = speedVal || '';

    //let userRecordId = Tool.localItem('userRecordId');
    //o.userRecordId = userRecordId || '';

    let wx_id = Tool.localItem('wx_id');
    o.wx_id = wx_id || '';

    o.token = Tool.base64('360che_product' + wx_id);

    o.paramTypeId = str || '';

    if(order){
        o.order = order;
    }
    if(brandId){
        o.brandId = brandId;
    }
    if(page){
        o.page = page;
    }
    if(more){
        o.more = 1;
    }


    return o
}
/**
 * 请求列表页面
 *
 * @param {any} ele   从哪一个元素找
 * @param {any} str   以str自定义的属性名称
 * @returns     找到包含str属性的，并且返回str属性值
 */
Tool.parent = function(ele,str){
        if(!ele.getAttribute(str)){
            return Tool.parent(ele.parentElement,str)
        }else{
            return ele.getAttribute(str)
        }
};

/*
* 页面发送ga统计
* */
/*第一页跳转到第二页发送*/
Tool.oneGA = function(){
    ga('set', 'page', '/wxxch/road/');
    ga('send', 'pageview');
};
/*第二页跳转到第三页发送 || 第三页点击但是不跳转的也发送*/
Tool.twoGA = function(){
    ga('set', 'page', '/wxxch/result/');
    ga('send', 'pageview');
}
/*第三页返回第一页的时候发送 || 第二页点击上一页返回*/
Tool.ThreeGA = function(){
    ga('set', 'page', '/wxxch/backhome/');
    ga('send', 'pageview');
}

/**
 * 获取url里的参数
 *
 * @method getQueryString
 * @memberof common
 * @type {Function}
 *
 * @param {string} 获取参数的名
 * @return {string} 成功后会自动获取`data`数据
 */
function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    else {
        return null;
    }
}



//添加滑动事件
var NavTouch = {};

NavTouch.init = function(){
    var Sidebar = document.getElementById('sidebar');
        Sidebar.setAttribute('class','sidebar visible brand');
        
    [].forEach.call(document.querySelectorAll('#sidebar'), function (el) {  
      el.addEventListener('touchend', function(e) {
        var x = e.changedTouches[0].pageX;
        if( x < 68 ){
            this.setAttribute('class','sidebar brand');

            //隐藏侧边栏索引导航
            let index_nav = document.querySelector('#index_nav');
            index_nav.removeAttribute('class','visible');
        }
      }, false);
    });
    //向LI添加点击事件
    [].forEach.call(document.querySelectorAll('#index_nav li'), function (el) {  
      el.addEventListener('click', function() {
            NavTouch.showScale(this.innerHTML);
      }, false);
    });
    //touchstart
    //[].forEach.call(document.querySelectorAll('#index_nav'), function (el) {
    //  el.addEventListener('touchstart', function(e) {
    //      console.log('1')
    //    this.setAttribute('class','nav');
    //  }, false);
    //});
    //touchmove
    [].forEach.call(document.querySelectorAll('#index_nav'), function (el) {  
      el.addEventListener('touchmove', function(e) {
            e.preventDefault();
            var y = e.changedTouches[0].pageY - this.getBoundingClientRect().top;
            var Nums = this.querySelectorAll('li').length;
            var ContHeight = this.getBoundingClientRect().height;
            var itemHt = ContHeight/Nums;
            var target;
            if(y > 0 && y < ContHeight){
                for(var i=0; i < Nums; i++){
                    var hts = itemHt * (i+1);
                    var oldhts = hts - itemHt;
                    if(i == 0 && y < itemHt){
                       target = this.children[0];
                    }else if(oldhts == itemHt && y < hts){
                        target = this.children[1];
                    }else if(y > oldhts && y < hts){
                        target = this.children[i];
                    }
                }
                //console.log(oldhts,y,target);
            }else{
                target = this.children[Nums-1];
            }
            NavTouch.showScale(target.innerHTML);
      }, false);
    });
    //touchend
    //[].forEach.call(document.querySelectorAll('#index_nav'), function (el) {
    //  el.addEventListener('touchend', function(e) {
    //    this.removeAttribute('class');
    //  }, false);
    //});

    //侧边栏滚动渲染索引导航
    let index_nav = document.querySelector('#index_nav');
    let index_selected = document.querySelector('#index_selected');
    if(index_nav){
        document.body.appendChild(index_selected);
        document.body.appendChild(index_nav);
    }
};

NavTouch.showScale = function(val){
    var toastTimer;
    toastTimer && clearTimeout(toastTimer);
    NavTouch.UlScroll(val);
    var Scale = document.getElementById('index_selected');
        Scale.innerHTML = val;
        setTimeout(function(){
            Scale.setAttribute('style','display:block;opacity:1');
        },10);
        toastTimer = setTimeout(function(){
            Scale.removeAttribute('style');
        },500);
}

NavTouch.UlScroll = function(el){
    var goUl = document.getElementById(el);
    var Uls = document.querySelector('.sidebar-container');
    var ulHeight = goUl.parentNode.offsetTop;
    Uls.scrollTop = ulHeight - 44;
}


//弹窗提示的封装
var Alert = {};
Alert.to = function(val) {
        let t
        t && clearTimeout(t)
        let AlertCont = document.getElementById("AlertCont");
        let AlertTxt = document.getElementById("AlertTxt");
        AlertTxt.innerHTML = val;
        AlertCont.setAttribute('class','notification notification-in');
        t = setTimeout(() => Alert.out(),4000)
}
Alert.out = function(){
    let AlertCont = document.getElementById("AlertCont");
    AlertCont.setAttribute('class','notification');
}

export { Tool , getQueryString ,NavTouch,Alert}



