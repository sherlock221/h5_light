h5_light 轻量级的css框架 适用于微信 wap页面开发
==
### 使用方式
> 导入 dist/h5_light.min.css


### 模块介绍   
1. rest模块 
> 大名鼎鼎 normalize.css 

### 网格布局

目前网格布局支持box 和 float两种


##### 采用box代码

    <div class="row m20" >
        <div class="col-40" style="background: saddlebrown;">
            40%
        </div>
        <div class="fx-col-1" style="background: saddlebrown;">
            flex 1 (auto)
        </div>
    
    </div>
    
    
    <div class="row m20" >
        <div class="col-60" style="background: saddlebrown;">
            40%
        </div>
        <div class="fx-col-1" style="background: saddlebrown;">
            flex 1 (auto)
        </div>
    
    </div>
    
    
    <div class="row m20" >
        <div class="col-25" style="background: saddlebrown;">25%</div>
        <div class="col-25" style="background: saddlebrown;">25%</div>
        <div class="col-25" style="background: saddlebrown;">25%</div>
        <div class="col-25" style="background: saddlebrown;">25%</div>
    </div>
    
    
    
    <div class="row m20" >
    
        <div class="col-33" style="background: saddlebrown;">33%</div>
        <div class="col-33" style="background: saddlebrown;">33%</div>
        <div class="col-33" style="background: saddlebrown;">33%</div>
    
    </div>
    
    <div class="row m20" >
        <div class="col-40" style="background: saddlebrown;">40%</div>
        <div class="col-60" style="background: saddlebrown;">60%</div>
    </div>
    
    
    <div class="row m20 " >
        <div class="col-75" style="background: saddlebrown;">75%</div>
        <div class="col-25" style="background: saddlebrown;">25%</div>
    </div>
    
    <div class="row m20 " >
        <div class="col-80" style="background: saddlebrown;">80%</div>
        <div class="col-20" style="background: saddlebrown;">20%</div>
    </div>
    
    <div class="row m20 " >
        <div class="col-33" style="background: saddlebrown;">33%</div>
        <div class="col-66" style="background: saddlebrown;">66%</div>
    </div>
    
    
    <div class="row m20 " >
        <div class="col-50" style="background: saddlebrown;">50%</div>
        <div class="col-50" style="background: saddlebrown;">50%</div>
    
    </div>

##### 采用float
只需将row 后添加一个class float

    <div class="row float" >



2. 布局模块 
   
    "flexbox/flex"; flexbox布局

     "table"; table 布局
    
   "float"; 浮动布局
    
    "inline-block"; inline-block布局
    
    "position"; 定位相关属性
    
     "gird";   百分比网格布局
    

    mobile推荐使用 flexbox ＋ gird
    
    ps :  在 flex 和 -webkit-box 布局下 会造成 两个子元素切割容器比例 不同
          flexbox布局子元素 切割容器 推荐采用网格gird, 其余使用flexbox相关
    

3. 文本模块
@import "text/text";

相关文字换行,单行文字 多行文字


4. 常用数值
@import "value/value";

5. 属性
@import "property/property";

6. 可选部分
@import "ps/ps";


### 构建

安装依赖
<pre><code>cd xxx && npm install</code></pre>

构建
<pre><code>grunt h5_light</code><pre>
