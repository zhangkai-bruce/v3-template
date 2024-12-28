<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useUserStore} from '@/store/modules/user'
import {setToken} from "@/utils/cache/cookies"
import {ElMessage} from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(true)

onMounted(async () => {
  const token = new URLSearchParams(window.location.href.split('?')[1]).get('token')
  console.log("token 信息：" + token)
  // 设置超时处理
  const timeout = setTimeout(() => {
    if (loading.value) {
      loading.value = false
      ElMessage.error('登录超时，请重试')
      router.push('/login')
    }
  }, 10000)
  try {
    if (!token) {
      ElMessage.error('未获取到登录凭证')
    }
    // userStore.token = token
    setToken(token)
    /*
      按道理需要获取用户的权限菜单，项目仅做了最简单的权限验证，所以这里直接跳转首页
     */
    // 跳转到首页
    router.push('/')
  } catch (error) {
    loading.value = false
    clearTimeout(timeout)
    ElMessage.error(error.message || '登录失败，请重试')
    router.push('/login')
  }
})
</script>

<template>
  <div class="auth-redirect">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>登录处理中...</span>
        </div>
      </template>
      <div class="loading-container">
        <el-loading :lock="true" :text="'正在登录，稍等片刻...'" :fullscreen="true" v-if="loading"/>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.auth-redirect {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .box-card {
    width: 480px;
    max-width: 90%;
  }

  .loading-container {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
