# mpVue 使用文档

*   [gitHub](https://github.com/Meituan-Dianping/mpvue)
*   [官方介绍](http://mpvue.com/)
*   [快速上手](http://mpvue.com/mpvue/quickstart/)
*   [使用手册](http://mpvue.com/mpvue/)
*   [awesome-mpvue](https://github.com/mpvue/awesome-mpvue)
## 运行项目

1. npm install 安装依赖
2. npm run dev 运行项目
3. 在小程序的开发工具新建项目,选择该项目生成的dist为目录. appid 填写自己项目的appid  
4. 这时就可以看到运行起来的项目 helloWord

## 开发使用

####1. 添加页面
例如: 添加 food 页面 
- 拷贝log文件夹修改名称为food
- food 文件夹里 main.json 为该页面的配置, 比如导航条颜色, 文字, 名称等,具体参考小程序文档
- 添加页面路径到 app.json 里面的 pages 下面

####2. 页面跳转 和 传参
例如:
```javascript
// 跳转传参
import {
    encodeUrlParam,
    decodeUrlParam
} from '@/utils/urlTool'

this.searchName = e.keyWords || ''
let params = {
    name: this.searchName
}
let url = encodeUrlParam('/pages/pack2/searchCook/main', params)
this.searchName = ''
wx.navigateTo({ url })

//说明 encodeUrlParam 是封装的方法在页面引入
// 接受参数 onLoad 里 

this.routerParams = decodeUrlParam(this.$root.$mp.query) // 页面的参数
```

 
其他语法同vue相同.差异下面有举例.上面的官网文档也有说明

下面是一些小的注意事项

## 支持 scss

第一：分别安装：

```shell
cnpm install sass-loader --save-dev

cnpm install node-sass --save-dev
```

第二： 改造 style 标签，增加属性 lang="scss": 这样就可以愉快的在 style 内写 sass 了，webpack 会自动编译输出

第三： 页面单位 
可以 px 自动转 rpx 1px = 2rpx
也可以直接用 rpx 做单位

```html
<style lang="scss">
.page {
　　background: $nav-color;
    .test{
      color:red;
    }
}
</style>
```

## 小程序无法运行，提示找到不 app.json 文件

`npm run dev`后,将小程序的入口映射成./dist 目录,运行后提示找不到 app.json 文件

解决方法:

1.  将 project.config.json 文件拷贝到./dist 目录下
2.  删除 project.config.json 文件中的`"miniprogramRoot": "./dist/",`
3.  用 npm 重新安装依赖

```shell
npm set registry https://registry.npm.taobao.org/
npm install
```

## 页面跳转时传递参数

**传递参数**

*   [native](https://developers.weixin.qq.com/miniprogram/dev/api/ui-navigate.html)
*   [mpvue](http://mpvue.com/mpvue/#_18)

传递参数时在 url 后面加上即可

例子如下:

```javascript
let queryParam = {
    code: this.routerParams.code
};
let url = "";
if (this.paramsStr && this.paramsStr.length > 0) {
    queryParam.params = this.paramsStr;
    url = `../topic/main?code=${this.routerParams.code}&params=${
        this.paramsStr
    }`;
} else {
    url = `../topic/main?code=${this.routerParams.code}`;
}
wx.navigateTo({ url });
```

**获取参数**

使用`this.$root.$mp.query`获取参数

例子如下:

```javascript
mounted() {
    this.routerParams = this.$root.$mp.query
    console.log('this.routerParams', this.routerParams);
}
```

> 必须在 mounted()方法中调用,在 created()方法中会出错。

## 将数据渲染到视图上时,需去掉 this,否则无法渲染出数据

例如:

```html
<div class="question" v-if="this.paging.curPage % 2 === 0">
    <single-topic v-for="(questionItem,index) in this.surveyQuestionList" :key="index" :questionItem="questionItem"></single-topic>
</div>
```

> 如`this.paging.curPage`是获取不到值的，去掉 this 即可

正确写法如下:

```html
<div class="question" v-if="paging.curPage % 2 === 0">
    <single-topic v-for="(questionItem,index) in surveyQuestionList" :key="index" :questionItem="questionItem"></single-topic>
</div>
```

## 页面跳转时传递参数有特殊字符串时，需要手动编码和解码

例如:

```javascript
let url = `../topic/main?code=1&*&23.0129`;
wx.navigateTo({ url });
```

> `&`是特殊字符会被分割，从而导致出错

**编码和解码工具函数**

编码:

```javascript
/**
 * [encodeUrlParam 编码参数]
 * @param  {[type]} url      [页面对应的url] 如 '../report/main'
 * @param  {[type]} paramObj [参数对象] 如 {code:100}
 * @return {[type]}          [description]
 */
function encodeUrlParam(url, paramObj = {}) {
    let params = "";
    if (paramObj) {
        let keys = Object.keys(paramObj);
        for (let key of keys) {
            let val = paramObj[key];
            if (val) {
                // console.log('key', val, typeof val)
                if (typeof val === "object") {
                    val = JSON.stringify(val);
                }
                val = encodeURIComponent(val);
            }
            params += `${key}=${val}&`;
        }
    }
    if (params) {
        params = params.substr(0, params.length - 1);
    }
    if (params) {
        return `${url}?${params}`;
    }
    return url;
}
```

解码:

```javascript
/**
 * [decodeUrlParam 解码参数]
 * @param  {[type]} paramObj [参数对象]
 * @return {[type]}          [description]
 */
function decodeUrlParam(paramObj = {}) {
    if (paramObj && typeof paramObj === "object") {
        let keys = Object.keys(paramObj);
        for (let key of keys) {
            let val = paramObj[key];
            if (val) {
                // console.log('key', val, typeof val)
                let strVal = decodeURIComponent(val);
                try {
                    paramObj[key] = JSON.parse(strVal);
                } catch (ex) {
                    paramObj[key] = strVal;
                }
            }
        }
    }
    return paramObj;
}
```
## 不支持{{method(param)}}语法

如下:

```html
<template>
    <div class="contain">
      {{getTitle()}}
    </div>
</template>
```

```javascript
export default {
    data() {
        return {
            report: {
                title: "睡眠报告"
            }
        };
    },
    method: {
        getTitle() {
            return this.report.title + new Date();
        }
    }
};
```

> 以上代码在微信小程序上无法显示

解决方法，使用计算属性代替，如下:

```html
<template>
    <div class="contain">
      {{getTitle}}
    </div>
</template>
```

```javascript
export default {
    data() {
        return {
            report: {
                title: "睡眠报告"
            }
        };
    },
    computed: {
        getTitle() {
            return this.report.title + new Date();
        }
    }
};
```

## mpvue 的生命周期

例如：有 A、B 两个页面，先进入 A 页面再由 A 跳转到界面，生命周期方法如下：

```text
加载A页面时（A页面是入口页面）
先执行 A.created() => B.created() => A.onLoad() => A.onShow() => A.onReady() => A.mounted()

从A页面跳转到B页面
A.onHide() => B.onLoad() => B.onShow() => B.onReady() => B.mounted()

从B页面返回到A页面(调用小程序返回键功能,wx.navigateBack({ delta: 1 }))
B.onUnload() => A.onShow()

从B页面返回到A页面(路由跳转,wx.navigateTo({ url: '../cover/main?code=3' })
B.onHide() => A.onLoad() => A.onShow() => A.onReady() => A.mounted()

switchTab 的切换
如果页面已经加载过一次 那么 只走 onShow() 生命周期

组件的生命周期
非tab页面内的组件： 第一次加载 不走onshow(),走created(),onload(),mounted()；之后加载，走onload(),onshow()
tab页面内的组件： 第一次加载 不走onshow(),走created(),onload(),mounted()；之后加载，onshow()

关于调用 小程序扫码 触发的生命周期
1、扫码结束后 会自动调用 当前页面的 onshow
安卓手机和苹果手机的区别
 - 安卓手机 扫码成功后。先调用 onshow 再返回结果
 - 苹果手机 扫码成功后。先返回结果 再调用 onshow

 如果是在switchTab页面 等 必须在 onshow里面处理的 要防止重复调用
 解决方法

 onshow(){
    if(flag){
        flag=false;
        return
    }
    ....
 }

 onscan(){
    flag=false;
    wx.scanCode({
      success (res) {
          console.log(res)
        }
    })
 }
```

> `wx.navigateBack({ delta: 1 })`:将当前页面出栈

> `wx.navigateTo({ url: '../cover/main?code=3' })`:路由跳转
## 引入外部 css 文件

*   因为小程序需要把 css 转换层 wxss 文件所以不能把 css 文件放到 static 文件夹中
*   在 src 里面建个文件夹 例如 style 文件 里面有 common.css
*   要在 main.js 里面 import '../style/common.css' 不需要定义变量。直接引入

## 变量使用需要手动重置

*   因为小程序对页面优化。在很短的时间内无论怎么进入该页面，页面的变量保留上次的数值。不会用 data 里面的初始值。
*   比如

```javascript
data() {
  sex:'girl',
  height:'50',
  name:'hlj'
}
```

再短时间内进入页面需要初始化数据
Object.assign(this.$data, this.$options.data())
在 mounted 里面调用

## 在 swiper 里面做单选自动切换

问题：单选后自动切换下一屏会出现数据选择。视图没有选中的现象 手动在选中事件里面对数据进行遍历赋值选中，然后自动切换数据视图选中了。但是又出现闪烁解决：在选中事件里面进行选中值得赋值。在 radio 里面设置 checked 如下

```javascript
<radio :id="optionItem.optionId" class = "option-radio" type="radio" :name="questionItem.itemId" :value="optionItem.optionId" :checked="optionItem.optionId==questionItem.singelCheckId?true:false" />
<label :for="optionItem.optionId" class="radio option-label">{{optionItem.optionContent}}</label>
```

## 小程序的图表插件

*   [wx-charts](https://github.com/xiaolin3303/wx-charts)
    优点 : 1.体积小。 2.使用小程序原生的 canvas 实现 直接引入就可以使用缺点： 1.可配置项比较少。简单的需求可采用

*   [echarts-for-weixin](https://github.com/ecomfe/echarts-for-weixin)
    优点 : 1.可配置项比较多。
    2.echarts 提供的小程序组件。和微信小程序团队打通。效果比较强大缺点： 1.体积大 几百 k 但是可以按需定制减小体积
    [自由定制连接](http://echarts.baidu.com/builder.html) 2.组件是以小程序原生的组件存在需要引入小程序原生组件 在 mpvue 里面需要其它工具辅助打包到 dist
    工具： -[mport-weapp-component](https://github.com/JJJYY/import-weapp-component)

## mpvue 引入小程序的原生组件方法

[引入小程序原生组件的例子](https://github.com/JJJYY/mpvue-iview)
[引入小程序原生组件的辅助工具](https://github.com/JJJYY/import-weapp-component)
