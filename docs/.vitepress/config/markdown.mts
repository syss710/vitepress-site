import markdownItTextualUml from "markdown-it-textual-uml"

const markdown = {
    config: (md) => {
        // 使用更多的 Markdown-it 插件！

        // 添加Markdown扩展插件markdown-it-textual-uml，使其支持plantuml
        md.use(markdownItTextualUml);
    },
    image: {
        // 默认禁用图片懒加载
        lazyLoading: true
    },
}
export default markdown
