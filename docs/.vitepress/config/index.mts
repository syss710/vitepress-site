import {defineConfig} from 'vitepress'

import sidebar from './sidebar.mts'
import nav from "./nav.mjs";
import markdown from './markdown.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    lang: 'zh-CN',
    title: "vitepress-site",
    description: "学习 记录 分享",

    // markdown配置
    markdown,

    //fav图标
    head: [
        ['link', { rel: 'icon', href: '/logo/logo.png' }],
    ],

    // 主题配置
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config

        // 左上角logo
        logo: '/logo/logo.png',

        // 导航栏
        nav,
        // nav: [
        //     {text: 'Home', link: '/'},
        //     {text: 'Examples', link: '/vitepress/examples/markdown-examples'}
        // ],

        // 侧边栏
        sidebar,
        //sidebar{
        //         '/vitepress/': [
        //             {text: '快速上手', link: '/vitepress/01-快速上手'},
        //             {text: '基础配置', link: '/vitepress/02-基础配置'},
        //             {text: 'Markdown语法及拓展', link: '/vitepress/03-Markdown语法及拓展'},
        //             {text: '内容展示优化', link: '/vitepress/04-内容展示优化'},
        //             {text: '自定义页面', link: '/vitepress/05-自定义页面'},
        //             {text: '自动生成侧边栏', link: '/vitepress/06-自动生成侧边栏'},
        //             {text: '部署', link: '/vitepress/07-部署'},
        //             {
        //                 text: 'Examples',
        //                 items: [
        //                     {text: 'Markdown Examples', link: '/vitepress/examples/markdown-examples'},
        //                     {text: 'Runtime API Examples', link: '/vitepress/examples/api-examples'}
        //                 ]
        //             },
        //         ]
        //     }
        // ,

        // 本地搜索
        search: {
            provider: 'local'
        },

        // 社交链接
        socialLinks: [
            {icon: 'github', link: 'https://github.com/syss710/vitepress-site'}
        ],

        // 更新时间
        lastUpdated: {
            text: '上次更新',
            formatOptions: {
                dateStyle: 'medium',
                timeStyle: 'medium'
            }
        },

        // 编辑链接
        editLink: {
            pattern: 'https://github.com/syss710/vitepress-site/edit/master/docs/:path',
            text: '在GitHub上编辑此页',
        },

        // 页脚信息
        footer: {
            message: '所有人的生活都有其明确的形态，但其实都是由各种各样的习惯构成的。',
            copyright: '2024 syss | <a href="//beian.miit.gov.cn/" target="_blank" style="text-decoration: none;">陕ICP备xxxxxxxxxx号</a>&nbsp;&nbsp;<a href="https://beian.mps.gov.cn/#/query/webSearch?code=" rel="noreferrer" target="_blank" style="text-decoration: none;"><img src="/logo/备案图标.png" style="text-decoration: none; width: 18px; display: inline-block;">&nbsp;陕公网安备xxxxxxxxxxxxxx</a>',
        },

        // 修改手机端深浅模式文字
        darkModeSwitchLabel: '深浅模式',

        // 侧边栏文字更改(移动端)
        sidebarMenuLabel:'目录',

        // 返回顶部文字修改(移动端)
        returnToTopLabel:'返回顶部',

        // 显示当前页大纲
        outline: {
            level: [2,4], // 显示2-4级标题
            // level: 'deep', // 显示2-6级标题
            label: '当前页大纲' // 文字显示
        },

        //自定义上下页名
        docFooter: {
            prev: '上一页',
            next: '下一页',
        },
    },

    // vite配置
    vite:{
        css:{
          preprocessorOptions: {
              scss: { api: 'modern-compiler' },
          },
        },
    }
})
