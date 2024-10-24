<template>
  <el-button v-if="isPosts && !frontmatter.isNoBackBtn" text bg type="text" size="large" style="margin-bottom: 10px" @click="goBack">回到上一页</el-button>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useData } from "vitepress";

const route = useRoute();
const isPosts = computed(() => route.path.startsWith("/posts"));
const { frontmatter } = useData();

function goBack() {
  if (window.history.length <= 1) {
    location.href = "/";
  } else {
    window.history.go(hashChangeCount.value);
    hashChangeCount.value = -1;
  }
}

const hashChangeCount = ref(-1);
onMounted(() => {
  window.onhashchange = () => {
    hashChangeCount.value--;
  }
})

onUnmounted(() => {
  window.onhashchange = null;
})
</script>
<style scoped>
.img-container {
  height: 105px;
  width: 100px;
}

img {
  height: 100px;
  border-radius: 5px;
  margin-top: 5px;
}
</style>