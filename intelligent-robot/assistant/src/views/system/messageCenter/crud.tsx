import * as api from './api';
import {dict, useCompute, PageQuery, AddReq, DelReq, EditReq, CrudExpose, CrudOptions} from '@fast-crud/fast-crud';
import tableSelector from '/@/components/tableSelector/index.vue';
import {shallowRef, computed, ref, inject} from 'vue';
import manyToMany from '/@/components/manyToMany/index.vue';
import {auth} from '/@/utils/authFunction'
import  {createCrudOptions as userCrudOptions } from "/@/views/system/user/crud";
import {request} from '/@/utils/service'
const {compute} = useCompute();

interface CreateCrudOptionsTypes {
    crudOptions: CrudOptions;
}

export const createCrudOptions = function ({
                                               crudExpose,
                                               tabActivted
                                           }: { crudExpose: CrudExpose; tabActivted: any }): CreateCrudOptionsTypes {
    const pageRequest = async (query: PageQuery) => {
        if (tabActivted.value === 'receive') {
            return await api.GetSelfReceive(query);
        }
        return await api.GetList(query);
    };
    const editRequest = async ({form, row}: EditReq) => {
        form.id = row.id;
        return await api.UpdateObj(form);
    };
    const delRequest = async ({row}: DelReq) => {
        return await api.DelObj(row.id);
    };
    const addRequest = async ({form}: AddReq) => {
        return await api.AddObj(form);
    };

    const viewRequest = async ({row}: { row: any }) => {
        return await api.GetObj(row.id);
    };

    const IsReadFunc = computed(() => {
        return tabActivted.value === 'receive';
    });


	return {
		crudOptions: {
			request: {
				pageRequest,
				addRequest,
				editRequest,
				delRequest,
			},
			actionbar:{
				buttons:{
					add:{
						show:computed(() =>{
							return tabActivted.value !== 'receive' && auth('messageCenter:Create');
						})
					},
				}
			},
			rowHandle: {
				fixed:'right',
				width:150,
				buttons: {
					edit: {
						show: false,
					},
					view: {
						text:"View",
						type:'text',
						iconRight:'View',
						show:auth("messageCenter:Search"),
						click({ index, row }) {
							crudExpose.openView({ index, row });
							if (tabActivted.value === 'receive') {
								viewRequest({ row });
								crudExpose.doRefresh();
							}
						},
					},
					remove: {
						iconRight: 'Delete',
						type: 'text',
						show:auth('messageCenter:Delete')
					},
				},
			},
			columns: {
				id: {
					title: 'id',
					form: {
						show: false,
					},
				},
				title: {
					title: 'Title',
					search: {
						show: true,
					},
					type: ['text', 'colspan'],
					column:{
						minWidth: 120,
					},
					form: {
						rules: [
							// 表单校验规则
							{
								required: true,
								message: 'Title is required',
							},
						],
						component: { span: 24, placeholder: 'Please enter title' },
					},
				},
				is_read: {
					title: 'Read?',
					type: 'dict-select',
					column: {
						show: IsReadFunc.value,
					},
					dict: dict({
						data: [
							{ label: 'Read already', value: true, color: 'success' },
							{ label: 'Unread', value: false, color: 'danger' },
						],
					}),
					form: {
						show: false,
					},
				},
				target_type: {
					title: 'Target type',
					type: ['dict-radio', 'colspan'],
					column:{
						minWidth: 120,
					},
					dict: dict({
						data: [
							{ value: 0, label: 'By user' },
							{ value: 1, label: 'By role' },
							{
								value: 2,
								label: 'By dept',
							},
							{ value: 3, label: 'Notice and announcement' },
						],
					}),
					form: {
						component: {
							optionName: 'el-radio-button',
						},
						rules: [
							{
								required: true,
								message: 'Target type is required',
								// @ts-ignore
								trigger: ['blur', 'change'],
							},
						],
					},
				},
				target_user: {
					title: 'Target Audience',
					search: {
						disabled: true,
					},
					form: {
						component: {
							name: shallowRef(tableSelector),
							vModel: 'modelValue',
							displayLabel: compute(({ row }) => {
								if (row) {
									return row.user_info;
								}
								return null;
							}),
							tableConfig: {
								url: '/api/system/user/',
								label: 'name',
								value: 'id',
								isMultiple: true,
								columns: [
									{
										prop: 'name',
										label: 'User name',
										width: 120,
									},
									{
										prop: 'phone',
										label: 'User phone',
										width: 120,
									},
								],
							},
						},
						show: compute(({ form }) => {
							return form.target_type === 0;
						}),
						rules: [
							// 表单校验规则
							{
								required: true,
								message: 'Target Audience is required',
							},
						],
					},
					column: {
						show: false,
						component: {
							name: shallowRef(manyToMany),
							vModel: 'modelValue',
							bindValue: compute(({ row }) => {
								return row.user_info;
							}),
							displayLabel: 'name',
						},
					},
				},
				target_role: {
					title: 'Target role',
					search: {
						disabled: true,
					},
					width: 130,
					form: {
						component: {
							name: shallowRef(tableSelector),
							vModel: 'modelValue',
							displayLabel: compute(({ row }) => {
								if (row) {
									return row.role_info;
								}
								return null;
							}),
							tableConfig: {
								url: '/api/system/role/',
								label: 'name',
								value: 'id',
								isMultiple: true,
								columns: [
									{
										prop: 'name',
										label: 'Role name',
									},
									{
										prop: 'key',
										label: 'Permission identification',
									},
								],
							},
						},
						show: compute(({ form }) => {
							return form.target_type === 1;
						}),
						rules: [
							// 表单校验规则
							{
								required: true,
								message: 'Target role is required',
							},
						],
					},
					column: {
						show: false,
						component: {
							name: shallowRef(manyToMany),
							vModel: 'modelValue',
							bindValue: compute(({ row }) => {
								return row.role_info;
							}),
							displayLabel: 'name',
						},
					},
				},
				target_dept: {
					title: 'Target dept',
					search: {
						disabled: true,
					},
					width: 130,
					type: 'table-selector',
					form: {
						component: {
							name: shallowRef(tableSelector),
							vModel: 'modelValue',
							displayLabel: compute(({ form }) => {
								return form.target_dept_name;
							}),
							tableConfig: {
								url: '/api/system/dept/all_dept/',
								label: 'name',
								value: 'id',
								isTree: true,
								isMultiple: true,
								columns: [
									{
										prop: 'name',
										label: 'Dept name',
                                        width: 150,
									},
									{
										prop: 'status_label',
										label: 'State',
									},
									{
										prop: 'parent_name',
										label: 'Parent dept',
									},
								],
							},
						},
						show: compute(({ form }) => {
							return form.target_type === 2;
						}),
						rules: [
							// 表单校验规则
							{
								required: true,
								message: 'Target dept is required',
							},
						],
					},
					column: {
						show: false,
						component: {
							name: shallowRef(manyToMany),
							vModel: 'modelValue',
							bindValue: compute(({ row }) => {
								return row.dept_info;
							}),
							displayLabel: 'name',
						},
					},
				},
				content: {
					title: 'Content',
					column: {
						width: 300,
						show: false,
					},
					type: ['editor-wang5', 'colspan'],
					form: {
						rules: [
							// 表单校验规则
							{
								required: true,
								message: 'Content is required',
							},
						],
						component: {
							disabled: true,
							id: '1', // 当同一个页面有多个editor时，需要配置不同的id
							editorConfig: {
								// 是否只读
								readOnly: compute((context) => {
									const { mode } = context;
									if (mode === 'add') {
										return false;
									}
									return true;
								}),
							},
							uploader: {
								type: 'form',
								buildUrl(res: any) {
									return res.url;
								},
							},
						},
					},
				},
			},
		},
	};
};
