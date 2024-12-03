export interface CreateOrUpdateTableRequestData {
    id?: string
    userAccount: string
    userPassword?: string
    checkPassword?: string
}

export interface TableRequestData {
    /** 当前页码 */
    currentPage: number
    /** 查询条数 */
    size: number
    /** 查询参数：用户名 */
    userAccount?: string
    /** 查询参数：手机号 */
    userRole?: string
}

export interface TableData {
    createTime: string
    email: string
    id: string
    phone: string
    userRole: string
    isDelete: boolean
    userAccount: string
}

export type TableResponseData = ApiResponseData<{
    records: TableData[]
    total: number
}>
