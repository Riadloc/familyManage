const BASE_URL = '/api'

/* 用户 */
const USER_INFO = BASE_URL + '/user/getUser'
const LOGIN_OUT = BASE_URL + '/user/loginout'
const UPDATE_USER = BASE_URL + '/user/updateUser'
const UPDATE_PRIVACY = BASE_URL + '/member/updateConfig'
const MEMBER_CONFIG = BASE_URL + '/member/getConfig'
const MEMBER_MONTH_ACCOUNT = BASE_URL + '/member/getUserMonthAccount'
const MEMBER_ACCOUNT_DETAIL = BASE_URL + '/member/getUserMonthDetail'

/* 家庭组 */
const JOIN_GROUP = BASE_URL + '/group/applyForGroup'
const GROUP_INFO = BASE_URL + '/group/getGroupInfo'
const UPDATE_GROUP = BASE_URL + '/group/updateGroup'
const GET_REQUESTS = BASE_URL + '/group/getNeedHandelRequests'
const HANDLE_REQUESTS = BASE_URL + '/group/handleGroupApply'
const REMOVE_MEMBER = BASE_URL + '/group/removeFromGroup'

/* 财务 */
const ACCOUNT_TYPE = BASE_URL + '/accountType/getAccountType'
const BASIC_ACCOUNT = BASE_URL + '/account/getByBasicConditions'
const MONTH_ACCOUNT = BASE_URL + '/account/getMonthAccounts'
const RANGE_ACCOUNT = BASE_URL + '/account/getByConditions'
const CREATE_TYPE = BASE_URL + '/accountType/createAccountType'
const UPDATE_TYPE = BASE_URL + '/accountType/updateAccountType'
const UPDATE_ACCOUNT = BASE_URL + '/account/updateAccount'
const DELETE_ACCOUNT = BASE_URL + '/account/deleteAccount'
const DELETE_TYPE = BASE_URL + '/accountType/deleteAccountType'

/* 小贴士 */
const GET_PAGENUM = BASE_URL + '/article/getPageNum'
const TIPS_LIST = BASE_URL + '/article/getPage'
const ARTICLE_DETAIL = BASE_URL + '/article/getArticle'

/* 配置 */
const GET_CONFIG = BASE_URL + '/config/getConfig'
const UPDATE_CONFIG = BASE_URL + '/config/updateConfig'
const DELETE_CONFIG = BASE_URL + '/config/deleteConfig'
const CREATE_CONFIG = BASE_URL + '/config/createConfig'

export {
  USER_INFO,
  LOGIN_OUT,
  UPDATE_USER,
  JOIN_GROUP,
  GROUP_INFO,
  BASIC_ACCOUNT,
  MONTH_ACCOUNT,
  RANGE_ACCOUNT,
  ACCOUNT_TYPE,
  CREATE_TYPE,
  UPDATE_TYPE,
  REMOVE_MEMBER,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
  DELETE_TYPE,
  DELETE_CONFIG,
  GET_REQUESTS,
  HANDLE_REQUESTS,
  UPDATE_GROUP,
  GET_CONFIG,
  UPDATE_CONFIG,
  CREATE_CONFIG,
  MEMBER_CONFIG,
  MEMBER_MONTH_ACCOUNT,
  MEMBER_ACCOUNT_DETAIL,
  GET_PAGENUM,
  TIPS_LIST,
  UPDATE_PRIVACY,
  ARTICLE_DETAIL
}
