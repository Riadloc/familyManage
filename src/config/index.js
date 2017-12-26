const BASE_URL = '/api'

/* 用户 */
const LOGIN_OUT = BASE_URL + '/user/loginout'
const UPDATE_USER = BASE_URL + '/user/updateUser'

/* 家庭组 */
const JOIN_GROUP = BASE_URL + '/group/applyForGroup'
const GROUP_INFO = BASE_URL + '/group/getGroupInfo'
const UPDATE_GROUP = BASE_URL + '/group/updateGroup'
const GET_REQUESTS = BASE_URL + '/group/getNeedHandelRequests'
const HANDLE_REQUESTS = BASE_URL + '/group/handleGroupApply'
const REMOVE_MEMBER = BASE_URL + '/group/removeFromGroup'

/* 财务 */
const ACCOUNT_TYPE = BASE_URL + '/accountType/getAccountType'
const CREATE_TYPE = BASE_URL + '/accountType/createAccountType'
const UPDATE_TYPE = BASE_URL + '/accountType/updateAccountType'
const UPDATE_ACCOUNT = BASE_URL + '/account/updateAccount'
const DELETE_ACCOUNT = BASE_URL + '/account/deleteAccount'
const DELETE_TYPE = BASE_URL + '/accountType/deleteAccountType'

/* 配置 */
const GET_CONFIG = BASE_URL + '/config/getConfig'
const UPDATE_CONFIG = BASE_URL + '/config/updateConfig'
const DELETE_CONFIG = BASE_URL + '/config/deleteConfig'
const CREATE_CONFIG = BASE_URL + '/config/createConfig'

export {
  LOGIN_OUT,
  UPDATE_USER,
  JOIN_GROUP,
  GROUP_INFO,
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
  CREATE_CONFIG
}
