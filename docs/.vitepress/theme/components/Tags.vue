<template>
  <el-config-provider :locale="zhCn">
  <div class="tags-page">
    <!-- 展示标签数据 -->
    <div class="tags-container">
      <el-badge :value="tag[Object.keys(tag)[0]].length" class="tag-item"
                v-for="(tag, index) in tags" :key="index" :offset="[-6, 5]" :color="getTagColor(tag[Object.keys(tag)[0]].length)">
        <el-button class="tag-item-btn" :type="Object.keys(tag)[0] === '未添加标签' ? 'danger' : 'primary'"  text :bg="selectTag == Object.keys(tag)[0]" @click="toggleTag(Object.keys(tag)[0])">{{ Object.keys(tag)[0] }}</el-button>
      </el-badge>
    </div>

    <!-- 展示文章数据 -->
    <div class="article-container" ref="articleContainer">
      <div class="article-item" v-if="selectTag">
        <!--文章列表-->
        <div style="min-height: 350px;">
        <el-collapse accordion v-model="activeNames" v-for="(article, index) in curPosts" :key="article.url" >
          <el-collapse-item  :name="index">
            <template #title><div class="article-item-title">{{article.title}}</div></template>
            <a :href="article.url" class="article-item-desc">
            <div class="post-date">{{ article.date.string }}</div>

            <div v-if="article.excerpt" v-html="article.excerpt"></div>
            </a>
          </el-collapse-item>
        </el-collapse>
        </div>

      </div>
      <div class="article-no-slelect" v-else>
        <el-empty :image-size="200" description="点击上方标签，查看标签下的所有文章"/>
      </div>
    </div>

    <div class="article-page">
      <!--分页-->
      <el-pagination
          v-model:current-page="current"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next"
          :total="total"
      />
    </div>
  </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import {ref, computed, nextTick } from "vue";
import {inBrowser} from 'vitepress'
// ElConfigProvider 组件
import { ElConfigProvider } from 'element-plus';
// 引入中文包
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// 更改分页文字
zhCn.el.pagination.total = `共 {total} 条`;
zhCn.el.pagination.goto = '跳至';
zhCn.el.pagination.pagesize = '条/页';
zhCn.el.pagination.pageClassifier = '页';



import {data as posts} from "../posts.data.mts";

const current = ref(+1);
const pageSize = ref(5);
const total = ref(0);
// 计算 total 的值
const computedTotal = computed(() => {
  return selectedValue.value.length;
});

const activeNames = ref([0]);

const tags: Array<{ [key: string]: any[] }> = [];

function initTags(articleData): Array<{ [key: string]: any[] }> {
  for (let i = 0; i < articleData.length; i++) {
    const article = articleData[i];
    const articleTags = article.tags;

    // 如果 article.tags 不存在或者为空数组
    if (!articleTags || !Array.isArray(articleTags) || articleTags.length === 0) {
      let untaggedArticles = tags.find(obj => Object.keys(obj).includes('未添加标签'));
      if (!untaggedArticles) {
        tags.push({'未添加标签': [article]});
      } else {
        untaggedArticles['未添加标签'].push(article);
      }
    } else {
      articleTags.forEach((articleTag) => {
        // 查找并可能更新数组元素
        const element = tags.find(obj => Object.keys(obj).includes(articleTag));
        if (element) {
          // 如果找到了元素，更新它的数组
          element[articleTag].push(article);
        } else {
          // 如果没有找到元素，添加一个新元素到数组中
          tags.push({[articleTag]: [article]});
        }
      });
    }
  }
  return tags;
}

// 初始化tags数据
initTags(posts);

// 对tags中的数据排序
tags.sort((a, b) => {
  const keyA = Object.keys(a)[0];
  const keyB = Object.keys(b)[0];
  // 根据键的字符串值进行排序
  return keyA.localeCompare(keyB);
});

// 将'未添加标签'的元素移动到数组首位
const untaggedElement = tags.find(tag => Object.keys(tag)[0] === '未添加标签');
if (untaggedElement) {
  const index = tags.indexOf(untaggedElement);
  if (index > -1) {
    tags.splice(index, 1);
    tags.unshift(untaggedElement);
  }
}

// 添加一个方法来根据value值返回对应的颜色
function getTagColor(value: number): string {
  if (value <= 3) {
    return '#909399';
  } else if (value > 3 && value <= 6) {
    return '#67C23A';
  } else if (value > 6 && value <= 9) {
    return '#E6A23C';
  } else {
    return '#F56C6C';
  }
}


// 点击指定Tag后进行选中
let selectTag = ref('');
const articleContainer = ref(null); // 创建一个对应 article-container 的 ref
const toggleTag = (tagTitle: string) => {
  if (selectTag.value && selectTag.value == tagTitle) {
    selectTag.value = null;
    setSelectedValue(null);
    total.value = 0;
  } else {
    selectTag.value = tagTitle;
    activeNames.value = [0];
    setSelectedValue(tagTitle);
    total.value = computedTotal.value;

    // 使用 nextTick 来确保 DOM 更新后再滚动
    nextTick(() => {
      if (articleContainer.value) {
        // 确保 ref 已经关联到了 DOM 元素
        articleContainer.value.scrollIntoView({ behavior: 'smooth' }); // 滚动到元素位置
      }
    });
  }
  current.value = 1;
}

// 拥有被选中的Tag下的文章
// 初始化一个变量来存储找到的值（如果找到的话）
// 使用 ref 创建一个响应式引用
let selectedValue = ref<any[] | undefined>(undefined);
// 设置selectedValue的值
function setSelectedValue(selectTag: string) {
  selectedValue.value = undefined;
  // 遍历 tags 列表来查找匹配的键名
  for (const tag of tags) {
    console.log("selectTag:", selectTag, " tag:", tag)
    // 检查当前对象的键是否与 selectTag 相匹配
    for (const key in tag) {
      if (key === selectTag) {
        // 如果找到匹配的键名，则获取其值
        selectedValue.value = tag[key];
        console.log(tag[key])
        // 由于我们假设每个对象只有一个键值对，找到后我们可以立即退出内层循环
        break;
      }
    }
    /*
    // 如果已经找到匹配的值，我们可以选择退出外层循环（取决于你的需求）
    if (selectedValue !== undefined) {
      break;
    }
    */
  }
console.log(selectedValue.value)
}


const curPosts = computed(() => {
  // return posts.slice(
  return selectedValue.value.slice(
      (current.value - 1) * pageSize.value,
      current.value * pageSize.value
  );
});

</script>

<style scoped>
.tags-container{
  text-align: center;
}

.tags-page {
  min-width: 320px;
  max-width: 1024px;
  margin: 0 auto;
  padding: 20px;
}

.tag-item{
  margin-bottom: 10px;
}

.tag-item-btn{
  margin-left: 1rem;
}

.article-container{
  margin: 2rem 0;
}

.article-item-title{
  text-align: left;
  font-size: 1rem;
  line-height: 1.25rem;
  font-weight: 800;
}

.article-item-desc{
  font-size: 0.95rem;
}

.article-page {
  display: flex;
  justify-content: flex-end;
}
</style>