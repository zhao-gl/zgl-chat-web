import {get, post} from "@/utils/request"

// 新建会话
export const createSession = async () => {
    return await post('/chat/new', undefined, {})
}
// 获取会话
export const querySessionById = async (params) => {
    return await get('/chat/querySessionById', params, {})
}
export const queryAllSessions = async () => {
    return await get('/chat/queryAllSessions', undefined, {})
}
export const delSession = async (params) => {
    return await get('/chat/delSession', params, {})
}