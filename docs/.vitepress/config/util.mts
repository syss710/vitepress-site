import fs from 'fs'
import path from 'path'

const {resolve} = path

export const scanDir = pathName => {
    const path = resolve(__dirname, `../../${pathName}`)
    return getMsg(path)
}

export const getMsg = path => {
    // 过滤掉.DS_Store、index.md以及名为code的文件夹
    let res = fs.readdirSync(path).filter(item => {
        return !(
            String(item) === '.DS_Store' ||
            String(item) === 'index.md' ||
            String(item) === 'code'
        );
    });

    // 使用res.length > 0来检查数组是否为空更加语义化
    if (res.length > 0) {
        let arr = res.map(item => {
            if (String(item).endsWith('.md')) {
                let reName = item.split('.')[0];
                reName = reName.replace(/\.md$/, '');
                reName = reName.replace(/[0-9]*-/, '');
                return {
                    text: reName,
                    link: resolve(path, item),
                };
            } else {
                // 这里可以添加一个检查，如果是文件夹则继续递归，否则跳过
                const fullPath = resolve(path, item);
                if (fs.statSync(fullPath).isDirectory()) {
                    return {
                        text: item, // 如果需要文件名而不是去掉扩展名的名称
                        items: getMsg(fullPath),
                        collapsible: true,
                    };
                } else {
                    // 如果不是文件夹也不是.md文件，则可以选择跳过或做其他处理
                    return null; // 例如，这里返回null来表示跳过该文件
                }
            }
        });

        // 过滤掉null值，即跳过的文件
        arr = arr.filter(item => item !== null);

        arr = arr.map(item => {
            if (item.link) {
                item.link = translateDir(item.link);
            }
            return item;
        });

        return arr;
    } else {
        console.warn('无文章');
    }
};

/**
 *
 * @param {string} path
 * @returns
 */
function translateDir(path) {
    return path.replace(/\\/g, '/').split('docs')[1].split('.')[0]
}

// console.log("aaa", getMsg()[0]);
// module.exports = getMsg;