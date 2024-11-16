// 可以直接在主题入口导入 Vue 文件
// VitePress 已预先配置 @vitejs/plugin-vue

import {onMounted, watch, nextTick, h} from 'vue'
import {useRoute} from 'vitepress'
import mediumZoom from 'medium-zoom'
import DefaultTheme from 'vitepress/theme'
import './css/custom.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Iframe from './components/Iframe.vue'
import MNavLink from './components/MNavLink.vue';
import MNavLinks from './components/MNavLinks.vue';
import MyLayout from './components/MyLayout.vue'
import Linkcard from "./components/Linkcard.vue"
import xgplayer from "./components/xgplayer.vue";
import PlayList from "./components/PlayList.vue";
import Tags from "./components/Tags.vue";
import XmindViewer from './components/XmindViewer.vue'


export default {
    //
    ...DefaultTheme,

    //
    enhanceApp({app, router, siteData}) {
        app.use(ElementPlus);
        // 注册全局组件
        app.component('Iframe', Iframe);
        app.component('MNavLink', MNavLink);
        app.component('MNavLinks', MNavLinks);
        app.component('MNavLinks', MNavLinks);
        app.component('Linkcard', Linkcard);
        app.component('xgplayer', xgplayer);
        app.component('PlayList', PlayList);
        app.component('Tags', Tags);
        app.component('XmindViewer', XmindViewer);
    },

    //
    setup() {
        const route = useRoute()
        const initZoom = () => {
            // 获取当前路由路径
            const currentPath = route.path;

            // 检查当前路径是否以'/nav'开头
            const isNavPath = currentPath.startsWith('/nav');

            if (!isNavPath) {
                // 如果不是/nav路径，则为.main img启用mediumZoom功能

                // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
                // mediumZoom('.main img', {background: 'rgba(246, 246, 247, 1)'})
                mediumZoom('.main img', {background: 'var(--vp-c-bg)'})
            }
        }

        //
        onMounted(() => {
            initZoom()
        })

        //
        watch(
            () => route.path,
            () =>
                nextTick(() => {
                    initZoom()
                })
        )
    },

    //
    Layout() {
        return h(MyLayout);
    }
}