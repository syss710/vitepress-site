<template>
  <div class="play-list-container">
    <div class="play-list-select">

      <!-- 弹出框 -->
      <el-popover placement="bottom-start" :visible="visible" :width="400" trigger="click">
        <template #reference>

          <!-- 添加一个按钮来控制播放列表的显示与隐藏 -->
          <el-button class="play-list-button" :disabled="!(dataList.length > 0)" @click="visible = !visible" color="#626aef" :dark="isDark" plain>播放列表
          </el-button>
        </template>
        <el-table :data="dataList" highlight-current-row @current-change="handleCurrentChange" style="width: 100%"
                  max-height="350">
          <el-table-column type="index" width="45"/>
          <el-table-column width="325rem" property="title"/>
        </el-table>
      </el-popover>
    </div>

    <div class="play-instance" v-if="currentVideo.url">
      <!-- 动态绑定播放器的url -->
      <xgplayer ref="xgplayerRef" v-show="currentVideo.url" :url="currentVideo.url" playerId="playListId"/>
    </div>

    <div class="play-list-error" v-else>
      <p>播放列表为空，请为组件传递正确的参数</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import { useData } from 'vitepress'
import xgplayer from "./xgplayer.vue";
import {ElTable} from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'

interface videoItem {
  title: string
  url: string
}

// 定义props来接收外部传入的dataList
const props = defineProps({
  dataList: {
    type: Array<videoItem>,
    required: true,
    default: () => [], // 添加默认值
  }
});

// 当前选中的视频
// 使用reactive创建响应式对象
const currentVideo = reactive({
  url: '',
  title: '',
});

const xgplayerRef = ref(null);

const visible = ref(false)
const currentRow = ref()
const isDark = ref(useData().isDark);
const handleCurrentChange = (val: videoItem | undefined) => {
  currentRow.value = val
  xgplayerRef.value.setCurrentVideoUrl(val.url);
  visible.value = false;
}

onMounted(() => {
  // 组件挂载后，默认选择第一个视频（如果存在）
  if (Array.isArray(props.dataList) && props.dataList.length > 0 && props.dataList[0].url) {
    currentVideo.url = props.dataList[0].url;
    currentVideo.title = props.dataList[0].title;
  } else {
    // 处理 dataList 无效的情况，例如显示一个错误消息或加载默认视频等。
  }
});
</script>

<style scoped>
.play-list-container {
  background-color: var(--vp-sidebar-bg-color);
  margin: 25px 0;
  padding: 25px 0 25px;
  border-radius: 15px;
}

.play-list-button {
  margin-left: 25px;
  margin-bottom: 25px;
}

.play-list-error {
  text-align: center;
  font-size: 2em;
  color: #f00;
}
</style>