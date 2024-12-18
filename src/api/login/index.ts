import {request} from "@/utils/service"
import type * as Login from "./types/login"

/** 获取登录验证码 */
export function getLoginCodeApi() {
    return request({
        url: "common/verifyCode",
        method: "get",
    })
}

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
    return request({
        url: "user/login",
        method: "post",
        data
    })
}

/** 获取用户详情 */
export function getUserInfoApi() {
    return request({
        url: "user/get/login",
        method: "get"
    })
}

