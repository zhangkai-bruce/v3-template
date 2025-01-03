import {request} from "@/utils/service"
import type * as Table from "./types/table"

/** 增 */
export function createTableDataApi(data: Table.CreateOrUpdateTableRequestData) {
    return request({
        url: "user/register",
        method: "post",
        data
    })
}

/** 删 */
export function deleteTableDataApi(ids: string[]) {
    return request({
        url: `user/delete/${ids}`,
        method: "delete"
    })
}

/** 改 */
export function updateTableDataApi(data: Table.CreateOrUpdateTableRequestData) {
    return request({
        url: "user/update",
        method: "post",
        data
    })
}

/** 查 */
export function getTableDataApi(data: Table.TableRequestData) {
    return request<Table.TableResponseData>({
        url: "user/list/page",
        method: "post",
        data
    })
}

/** 修改用户状态 */
export function updateStatus(id, status) {
    return request({
        url: `user/update/status/${id}/${status}`,
        method: "get",
    })
}

/** 更新个人信息 */
export function updateUserDetails(data) {
    return request({
        url: "user/update",
        method: "post",
        data
    })
}

