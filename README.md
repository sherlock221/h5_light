h5_light 轻量级的css框架 适用于微信 wap页面开发
==
### 使用方式
> 导入 dist/h5_light.min.css


### 模块介绍   
1. rest模块 
@import "reset/reset";

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

4. 常用数值
@import "value/value";

5. 属性
@import "property/property";

6. 可选部分
@import "ps/ps";

