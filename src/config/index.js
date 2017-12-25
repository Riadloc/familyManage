const BASE_URL = '/api'

/* 用户 */
const LOGIN_OUT = BASE_URL + '/user/loginout'
const UPDATE_USER = BASE_URL + '/user/updateUser'

/* 家庭组 */
const JOIN_GROUP = BASE_URL + '/group/applyForGroup'
const GROUP_INFO = BASE_URL + '/group/getGroupInfo'
const UPDATE_GROUP = BASE_URL + '/group/updateGroup'
const GET_REQUESTS = BASE_URL + '/group/getNeedHandelRequests'

/* 财务 */
const ACCOUNT_TYPE = BASE_URL + '/accountType/getAccountType'
const UPDATE_ACCOUNT = BASE_URL + '/account/updateAccount'
const DELETE_ACCOUNT = BASE_URL + '/account/deleteAccount'
const DELETE_TYPE = BASE_URL + '/accountType/deleteAccountType'

export {
  LOGIN_OUT,
  UPDATE_USER,
  JOIN_GROUP,
  GROUP_INFO,
  ACCOUNT_TYPE,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
  DELETE_TYPE,
  GET_REQUESTS,
  UPDATE_GROUP
}
