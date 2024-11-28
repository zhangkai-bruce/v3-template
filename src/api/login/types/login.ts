export interface LoginRequestData {
  /** admin 或 editor */
  userAccount: "admin" | "editor"
  /** 密码 */
  userPassword: string
  /** 验证码 */
  // code: string
}

export type LoginCodeResponseData = ApiResponseData<string>

export type LoginResponseData = ApiResponseData<{ token: string }>

export type UserInfoResponseData = ApiResponseData<{ username: string; roles: string[] }>
