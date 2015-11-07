h5_light 轻量级的css框架 适用于微信 wap页面开发
==
### 使用方式
> 导入 dist/h5_light.min.css


### 模块介绍   
1. rest模块 

> 大名鼎鼎 normalize.css 


2. layout模块

> 布局模块 支持 flexbox flot inline－block table gird 多种布局 

3. text模块

> 文本模块 支持文本溢出处理 文本换行 文本对齐等

4. property模块

> 属性模块 将常用css属性 类名化 在html中很方便使用类名获得它们

5. value 模块

> 常用值封装  如mt20  = margin-top:20px;  等

6. sass函数

> fun 一些常用sass函数 动画兼容处理 rem方案 等



### 网格布局

目前网格布局支持box 和 float两种

![](http://upload-images.jianshu.io/upload_images/326507-53216ec0a696c08d.png)


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



 ``mobile推荐使用 flexbox ＋ gird``
    
   ps :  在 flex 和 -webkit-box 布局下 会造成 两个子元素切割容器比例 不同
          flexbox布局子元素 切割容器 推荐采用网格gird, 其余使用flexbox相关



### 构建

安装依赖

            cd xxx && npm install

构建

            grunt h5_light
