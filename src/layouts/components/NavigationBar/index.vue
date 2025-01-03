<script lang="ts" setup>
import {useRouter} from "vue-router"
import {storeToRefs} from "pinia"
import {useAppStore} from "@/store/modules/app"
import {useSettingsStore} from "@/store/modules/settings"
import {useUserStore} from "@/store/modules/user"
import Hamburger from "../Hamburger/index.vue"
import Breadcrumb from "../Breadcrumb/index.vue"
import Sidebar from "../Sidebar/index.vue"
import Notify from "@/components/Notify/index.vue"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import Screenfull from "@/components/Screenfull/index.vue"
import SearchMenu from "@/components/SearchMenu/index.vue"
import {useDevice} from "@/hooks/useDevice"
import {useLayoutMode} from "@/hooks/useLayoutMode"
import {reactive, ref} from "vue";
import {updateUserDetails} from "@/api/table";
import {ElMessage} from "element-plus";

const {isMobile} = useDevice()
const {isTop} = useLayoutMode()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const {showNotify, showThemeSwitch, showScreenfull, showSearchMenu} = storeToRefs(settingsStore)

// 上传请求头
const uploadHeaders = reactive({
  Authorization: "Bearer " + userStore.token
});

// 上传请求头
const uploadParams = reactive({
  biz: "user_avatar",
});

const dialogVisible = ref(false); // 控制弹窗显示
const userInfo = ref({
  userName: userStore.username, // 用户名
  userAvatar: userStore.userAvatar, // 用户头像
  userProfile: userStore.userProfile, // 用户简介
  id: userStore.id
}); // 用户信息

/** 保存用户信息 */
const saveUserInfo = () => {
  console.log("保存用户信息", userInfo.value);
  updateUserDetails(userInfo.value).then((res) => {
    if (res.code == 0) {
      ElMessage.success("操作成功")
      dialogVisible.value = false; // 关闭弹窗
    }
  })
};

const handleAvatarUpload = (response: any) => {
  console.log("执行了回调函数！。。。。" + response.data)
  // 假设接口返回图片地址
  userInfo.value.userAvatar = response.data;
};

/** 切换侧边栏 */
const toggleSidebar = () => {
  appStore.toggleSidebar(false)
}

/** 登出 */
const logout = () => {
  userStore.logout()
  router.push("/login")
}
const individualCenter = () => {
  dialogVisible.value = true;
}
const userAvatar = userStore.userAvatar // 用户头像链接
</script>
<template>
  <div class="navigation-bar">
    <Hamburger
        v-if="!isTop || isMobile"
        :is-active="appStore.sidebar.opened"
        class="hamburger"
        @toggle-click="toggleSidebar"
    />
    <Breadcrumb v-if="!isTop || isMobile" class="breadcrumb"/>
    <Sidebar v-if="isTop && !isMobile" class="sidebar"/>
    <div class="right-menu">
      <SearchMenu v-if="showSearchMenu" class="right-menu-item"/>
      <Screenfull v-if="showScreenfull" class="right-menu-item"/>
      <ThemeSwitch v-if="showThemeSwitch" class="right-menu-item"/>
      <Notify v-if="showNotify" class="right-menu-item"/>
      <el-dropdown class="right-menu-item">
        <el-avatar
            :src="userInfo.userAvatar"
            :size="40"
            class="avatar-dropdown"
        >
        </el-avatar>
        <template #dropdown>
          <!-- 展示头像 -->
          <el-dropdown-menu>
            <el-dropdown-item @click="individualCenter">
              <span style="display: block">个人中心</span>
            </el-dropdown-item>
            <a href="https://github.com/zhangkai-bruce" target="_blank">
              <el-dropdown-item>GitHub</el-dropdown-item>
            </a>
            <el-dropdown-item @click="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <!-- 个人中心弹窗 -->
  <el-dialog
      v-model="dialogVisible"
      title="个人信息"
      width="500px"
      class="modern-dialog"
  >
    <el-form :model="userInfo" label-width="70px" class="modern-form">
      <!-- 昵称 -->
      <el-form-item label="昵称">
        <el-input
            v-model="userInfo.userName"
            placeholder="请输入昵称"
            class="modern-input"
        />
      </el-form-item>

      <!-- 简介 -->
      <el-form-item label="简介">
        <el-input
            v-model="userInfo.userProfile"
            type="textarea"
            placeholder="简单介绍一下自己"
            class="modern-input"
        />
      </el-form-item>

      <!-- 头像 -->
      <el-form-item label="头像">
        <div class="avatar-wrapper">
          <el-avatar
              :src="userInfo.userAvatar"
              :size="80"
              class="modern-avatar"
          />
          <el-upload
              class="avatar-uploader"
              action="http://localhost:8101/api/common/upload"
              :show-file-list="false"
              :on-success="handleAvatarUpload"
              :headers="uploadHeaders"
              :data="uploadParams"
          >
            <el-button type="text" size="small" class="upload-btn">上传头像</el-button>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUserInfo">保存</el-button>
      </div>
    </template>
  </el-dialog>


</template>

<style lang="scss" scoped>
.navigation-bar {
  height: var(--v3-navigationbar-height);
  overflow: hidden;
  color: var(--v3-navigationbar-text-color);
  display: flex;
  justify-content: space-between;

  .hamburger {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 15px;
    cursor: pointer;
  }

  .breadcrumb {
    flex: 1;
    // 参考 Bootstrap 的响应式设计将宽度设置为 576
    @media screen and (max-width: 576px) {
      display: none;
    }
  }

  .sidebar {
    flex: 1;
    // 设置 min-width 是为了让 Sidebar 里的 el-menu 宽度自适应
    min-width: 0px;

    :deep(.el-menu) {
      background-color: transparent;
    }

    :deep(.el-sub-menu) {
      &.is-active {
        .el-sub-menu__title {
          color: var(--el-color-primary) !important;
        }
      }
    }
  }

  .right-menu {
    margin-right: 10px;
    height: 100%;
    display: flex;
    align-items: center;

    .right-menu-item {
      padding: 0 10px;
      cursor: pointer;

      .right-menu-avatar {
        display: flex;
        align-items: center;

        .el-avatar {
          margin-right: 10px;
        }

        span {
          font-size: 16px;
        }
      }
    }
  }

  .avatar-dropdown {
    cursor: pointer;
    display: inline-block;
    margin-right: 10px;
  }

  .modern-dialog {
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  .modern-form {
    padding: 20px 10px;
  }

  .modern-input {
    border-radius: 5px;
  }

  .avatar-wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .modern-avatar {
    border-radius: 50%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .upload-btn {
    font-size: 12px;
    color: #409eff;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

}
</style>
