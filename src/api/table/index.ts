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
