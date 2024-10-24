import {scanDir} from "./util.mjs";

export default {
    '/vitepress/': scanDir('./vitepress'),
}