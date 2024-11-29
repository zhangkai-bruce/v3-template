<script lang="ts" setup>
import {reactive, ref, watch} from "vue"
import {createTableDataApi, deleteTableDataApi, getTableDataApi, updateTableDataApi} from "@/api/table"
import {type CreateOrUpdateTableRequestData, type TableData} from "@/api/table/types/table"
import {ElMessage, ElMessageBox, type FormInstance, type FormRules} from "element-plus"
import {CirclePlus, Delete, Download, Refresh, RefreshRight, Search} from "@element-plus/icons-vue"
import {usePagination} from "@/hooks/usePagination"
import {cloneDeep} from "lodash-es"

defineOptions({
  // 命名当前组件
  name: "ElementPlus"
})

const loading = ref<boolean>(false)
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()

//#region 增
const DEFAULT_FORM_DATA: CreateOrUpdateTableRequestData = {
  id: undefined,
  username: "",
  password: ""
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateTableRequestData>(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules<CreateOrUpdateTableRequestData> = {
  username: [{required: true, trigger: "blur", message: "请输入用户名"}],
  password: [{required: true, trigger: "blur", message: "请输入密码"}]
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.id === undefined ? createTableDataApi : updateTableDataApi
    api(formData.value)
        .then(() => {
          ElMessage.success("操作成功")
          dialogVisible.value = false
          getTableData()
        })
        .finally(() => {
          loading.value = false
        })
  })
}
const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
//#endregion

//#region 删
const handleDelete = (row: TableData) => {
  ElMessageBox.confirm(`正在删除用户：${row.username}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTableDataApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const handleUpdate = (row: TableData) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}
//#endregion

//#region 查
const tableData = ref<TableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  username: "",
  phone: ""
})
const getTableData = () => {
  loading.value = true
  getTableDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    username: searchData.username || undefined,
    phone: searchData.phone || undefined
  })
      .then(({data}) => {
        paginationData.total = data.total
        tableData.value = data.list
      })
      .catch(() => {
        tableData.value = []
      })
      .finally(() => {
        loading.value = false
      })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, {immediate: true})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" class="search-wrapper" shadow="never">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="searchData.username" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="searchData.phone" placeholder="请输入"/>
        </el-form-item>
        <el-form-item>
          <el-button :icon="Search" type="primary" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button :icon="CirclePlus" type="primary" @click="dialogVisible = true">新增用户</el-button>
          <el-button :icon="Delete" type="danger">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button :icon="Download" circle type="primary"/>
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button :icon="RefreshRight" circle type="primary" @click="getTableData"/>
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column align="center" type="selection" width="50"/>
          <el-table-column align="center" label="用户名" prop="username"/>
          <el-table-column align="center" label="角色" prop="roles">
            <template #default="scope">
              <el-tag v-if="scope.row.roles === 'admin'" disable-transitions effect="plain" type="primary">
                admin
              </el-tag>
              <el-tag v-else disable-transitions effect="plain" type="warning">{{ scope.row.roles }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号" prop="phone"/>
          <el-table-column align="center" label="邮箱" prop="email"/>
          <el-table-column align="center" label="状态" prop="status">
            <template #default="scope">
              <el-tag v-if="scope.row.status" disable-transitions effect="plain" type="success">启用</el-tag>
              <el-tag v-else disable-transitions effect="plain" type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间" prop="createTime"/>
          <el-table-column align="center" fixed="right" label="操作" width="150">
            <template #default="scope">
              <el-button bg size="small" text type="primary" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button bg size="small" text type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
            :currentPage="paginationData.currentPage"
            :layout="paginationData.layout"
            :page-size="paginationData.pageSize"
            :page-sizes="paginationData.pageSizes"
            :total="paginationData.total"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
        v-model="dialogVisible"
        :title="formData.id === undefined ? '新增用户' : '修改用户'"
        width="30%"
        @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-position="left" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入"/>
        </el-form-item>
        <el-form-item v-if="formData.id === undefined" label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="handleCreateOrUpdate">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
