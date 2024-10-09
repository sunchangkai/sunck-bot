import * as api from './api';
import { UserPageQuery, AddReq, DelReq, EditReq, CrudExpose, CrudOptions, CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud';

export const createCrudOptions = function ({ crudExpose }: CreateCrudOptionsProps): CreateCrudOptionsRet {
	const pageRequest = async (query: UserPageQuery) => {
		return await api.GetList(query);
	};
	const editRequest = async ({ form, row }: EditReq) => {
		form.id = row.id;
		return await api.UpdateObj(form);
	};
	const delRequest = async ({ row }: DelReq) => {
		return await api.DelObj(row.id);
	};
	const addRequest = async ({ form }: AddReq) => {
		return await api.AddObj(form);
	};
	return {
		crudOptions: {
			request: {
				pageRequest,
				addRequest,
				editRequest,
				delRequest,
			},
			actionbar: {
				buttons: {
					add: {
						show: false,
					},
				},
			},
			rowHandle: {
				fixed:'right',
				width: 100,
				buttons: {
					view: {
						type: 'text',
					},
					edit: {
						show: false,
					},
					remove: {
						show: false,
					},
				},
			},
			columns: {
				_index: {
					title: 'Index',
					form: { show: false },
					column: {
						//type: 'index',
						align: 'center',
						width: '70px',
						columnSetDisabled: true, //禁止在列设置中选择
						formatter: (context) => {
							//计算序号,你可以自定义计算规则，此处为翻页累加
							let index = context.index ?? 1;
							let pagination = crudExpose!.crudBinding.value.pagination;
							return ((pagination!.currentPage ?? 1) - 1) * pagination!.pageSize + index + 1;
						},
					},
				},
				search: {
					title: 'Keyword',
					column: {
						show: false,
					},
					search: {
						show: true,
						component: {
							props: {
								clearable: true,
							},
							placeholder: 'Please enter',
						},
					},
					form: {
						show: false,
						component: {
							props: {
								clearable: true,
							},
						},
					},
				},
				request_modular: {
					title: 'Request model',
					search: {
						disabled: false,
					},
					type: 'input',
					column:{
						minWidth: 100,
					},
					form: {
						disabled: true,
						component: {
							placeholder: 'Please enter',
						},
					},
				},
				request_path: {
					title: 'URL',
					search: {
						disabled: false,
					},
					type: 'input',
					column:{
						minWidth: 200,
					},
					form: {
						disabled: true,
						component: {
							placeholder: 'Please enter',
						},
					},
				},
				request_body: {
					column: {
						showOverflowTooltip: true,
						width: 200, //列宽
						minWidth: 100, //最小列宽
					},
					title: 'Request parameters',
					search: {
						disabled: true,
					},
					disabled: true,
					type: 'textarea',
					form: {
						component: {
							props: {
								type: 'textarea',
							},
							autosize: {
								minRows: 2,
								maxRows: 8,
							},
							placeholder: 'Please enter',
						},
					},
				},
				request_method: {
					title: 'Request method',
					type: 'input',
					search: {
						disabled: false,
					},
					column:{
						minWidth: 100,
					},
					form: {
						disabled: true,
						component: {
							placeholder: 'Please enter',
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				request_msg: {
					title: 'Notes',
					disabled: true,
					form: {
						component: {
							span: 12,
						},
					},
				},
				request_ip: {
					title: 'IP',
					search: {
						disabled: false,
					},
					type: 'input',
					column:{
						minWidth: 100,
					},
					form: {
						disabled: true,
						component: {
							placeholder: 'Please enter',
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				request_browser: {
					title: 'Browser',
					type: 'input',
					column:{
						minWidth: 120,
					},
					form: {
						disabled: true,
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				response_code: {
					title: 'Response code',
					search: {
						disabled: true,
					},
					type: 'input',
					column:{
						minWidth: 100,
					},
					form: {
						disabled: true,
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				request_os: {
					title: 'Operating system',
					disabled: true,
					search: {
						disabled: true,
					},
					type: 'input',
					column:{
						minWidth: 120,
					},
					form: {
						disabled: true,
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				json_result: {
					title: 'Information',
					search: {
						disabled: true,
					},
					type: 'input',
					column:{
						minWidth: 150,
					},
					form: {
						disabled: true,
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				creator_name: {
					title: 'Operator',
					column:{
						minWidth: 100,
					},
					form: {
						disabled: true,
					},
				},
			},
		},
	};
};
