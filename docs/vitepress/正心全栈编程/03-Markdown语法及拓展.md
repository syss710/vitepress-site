---
layout: doc
title: Markdown语法及拓展
navbar: true
sidebar: true
aside: ture
outline: [2,4]
lastUpdated: true
editLink: false
---



# Markdown语法及拓展

markdown 语法其实已经足够好用了，但是某些时候还是不够灵活。例如 markdown 的语法只有基本的标签，比较难实现在其中布局、写样式；调试 markdown 中的代码，需要保持文件与代码同步；markdown 文件不支持相互引用嵌入。这些问题在 Markdown Extensions 中都可以解决。

参考：https://vitepress.dev/guide/markdown



## frontmatter

markdown文档在其实部分会有一个frontmatter用来存储文档的元数据信息，这个frontmatter内的信息我们可以进行自定义。其中各项配置如下

```shell
---
layout: doc
title: markdown文档模板
navbar: true
sidebar: true
aside: ture
outline: [2,4]
lastUpdated: true
editLink: false
footer: true
---
```

::: details 配置详解

```shell
---
# frontmatter配置参考
# https://vitepress.dev/zh/reference/frontmatter-config

# 页面布局
layout: doc

# 页面标题
title: markdown文档模板

# 是否显示导航栏
navbar: true

# 是否显示侧边栏
sidebar: true

# 是否显示右侧大纲栏
aside: ture

# 显示的大纲级别
outline: [2,4]

# 最后更新时间，需要全局配置中启用才能生效
lastUpdated: true

# 是否在页脚显示编辑链接
editLink: false

# 是否显示页脚
footer: true
---
```

:::



## 使用HTML语法控制文本格式



### 改变文字颜色

效果：<font color="red">示例文字</font>

语法：

```html
<font color="red"></font>
```

解释：

- `color` 属性的值可以使用英文单词 
  - 应该可以使用十六进制RGB颜色或者使用rgb进行指定，如 `rgb(200,200,200)` `rgba(200,200,200, 0.75)` 【暂未验证】



### 加粗、下划线

效果： 

- <b>示例文字</b>
- <u>示例文字</u>

语法：

```html
<b></b>
<u></u>
```



### 高亮

效果： <span style="background-color: rgb(255,253,39);">示例文字</span>

语法：

```html
<span style="background-color: rgb(255,253,39);">示例文字</span>
```



### 点击显示隐藏的内容

效果：

> 如下对象取值的方式哪个正确?
>
> ```js
> let obj = {
>  name: '小张'
> }
> ```
>
> - A: obj.a
> - B: obj()a
>
> <details>
>     <summary>答案</summary>
>     <ul style="background-color: #F5F5F6; border-radius: 10px;">
>         <div><b>A</b></div>
>     </ul>
> </details>
>
> 

语法：

```html
<details>
    <summary>答案</summary>
    <ul style="background-color: #F5F5F6; border-radius: 10px;">
        <!--- <li><b>首先</b>：。。。</li> --->
        <div><b>首先</b>：。。。</div>
    </ul>
</details>
```