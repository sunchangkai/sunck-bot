import { request } from '/@/utils/service';
import { UserPageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

export const sessionApiPrefix = '/api/assistant/session/';
export const dialogueApiPrefix = '/api/assistant/dialogue/';
export const botApiPrefix = '/api/management/bot/';

export function AddSession(obj: AddReq) {
	return request({
		url: sessionApiPrefix,
		method: 'post',
		data: obj,
	});
}

export function UpdateSession(obj: {session_id: number, session_name: string}) {
	return request({
		url: sessionApiPrefix + obj.session_id + '/',
		method: 'put',
		data: obj,
	});
}

// 添加新的接口来获取 assistants 数据
export function GetAssistants() {
	return request({
		url: botApiPrefix,
		method: 'get',
	});
}

export function GetSessionDialogue(id: InfoReq) {
	return request({
		url: sessionApiPrefix + id + '/',
		method: 'get',
	});
}

export function GetAnswer(query: UserPageQuery) {
	return request({
		url: dialogueApiPrefix,
		method: 'get',
		params: query,
	});
}

export function AddObj(obj: { content: string; assistantId: number }) {
	return request({
		url: dialogueApiPrefix,
		method: 'post',
		data: obj,
	});
}










