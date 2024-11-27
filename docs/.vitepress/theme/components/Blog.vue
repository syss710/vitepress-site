<script setup lang="ts">
import { data as posts } from "../posts.data.mts";
import { ref, computed } from "vue";
import { inBrowser } from 'vitepress'

///
// 非 Vue 组件需要手动引入
import {
	MessagePlugin,
	PaginationProps,
	Pagination as TPagination,
  Tag as TTag,
} from "tdesign-vue-next";
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';
///

const isMobile = () => {
  if (inBrowser) {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  return false;
};

const page = 1;
const current = ref(+page);
const pageSize = ref(8);
const total = ref(posts.length);

const curPosts = computed(() => {
	return posts.slice(
		(current.value - 1) * pageSize.value,
		current.value * pageSize.value
	);
});

const onCurrentChange: PaginationProps["onCurrentChange"] = (
	index,
	pageInfo
) => {
	MessagePlugin.success(`转到第${index}页`);

	const url = new URL(window.location as any);
	url.searchParams.set("page", index.toString());
	window.history.replaceState({}, "", url);
  location.reload();

	window.scrollTo({
		top: 0,
	});
};
</script>

<template>
  <div id="blog" v-for="post in curPosts" :key="post.url">
    <h2 :id="post.title" class="post-title">
      <a :href="post.url">{{ post.title }}</a>
      <a
          class="header-anchor"
          :href="`#${post.title}`"
          :aria-label="`Permalink to &quot;${post.title}&quot;`"
      >​</a
      >
      <div class="post-date hollow-text">{{ post.date.string }}</div>
    </h2>
    <t-tag
        v-for="tag in post.tags"
        class="mr-2"
        variant="outline"
        shape="round"
        style="color: var(--vp-code-color);"
    >
      {{ tag }}
    </t-tag>
    <div v-if="post.excerpt" v-html="post.excerpt"></div>
  </div>

  <!-- <Pagination /> -->
  <div class="pagination-container">
    <t-pagination
        v-model="current"
        v-model:pageSize="pageSize"
        :total="total"
        size="small"
        :showPageSize="false"
        :showPageNumber="!isMobile()"
        :showJumper="isMobile()"
        @current-change="onCurrentChange"
    /></div>
</template>

<style scoped>
/* 去掉.vp-doc li + li 的 margin-top */
.pagination-container {
  margin-top: 60px;

  :deep(li) {
    margin-top: 0px;
  }
}

.mr-2 {
  margin-right: 2px;
}

.post-title {
  margin-bottom: 6px;
  border-top: 0px;
  position: relative;
  top: 0;
  left: 0;

  .post-date {
    position: absolute;
    top: -6px;
    left: -10px;

    z-index: -1;
    opacity: .12;
    font-size: 66px;
    font-weight: 900;
  }
}

.hollow-text {

  /* 设置文本颜色为透明 */
  color: var(--vp-c-bg);

  -webkit-text-stroke: 1px var(--vp-c-text-1);
}

</style>