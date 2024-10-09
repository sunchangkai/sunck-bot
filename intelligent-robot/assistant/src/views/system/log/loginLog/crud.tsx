import * as api from './api';
import { UserPageQuery, AddReq, DelReq, EditReq, CreateCrudOptionsProps, CreateCrudOptionsRet, dict } from '@fast-crud/fast-crud';
import {commonCrudConfig} from "/@/utils/commonCrud";

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
				username: {
					title: 'User name',
					search: {
						disabled: false,
					},
					type: 'input',
					column:{
						minWidth: 120,
					},
					form: {
						disabled: true,
						component: {
							placeholder: 'Please enter',
						},
					},
				},
				ip: {
					title: 'Login ip',
					search: {
						disabled: false,
					},
					type: 'input',
					column:{
						minWidth: 120,
					},
					form: {
						disabled: true,
						component: {
							placeholder: 'Please enter',
						},
					},
				},
				isp: {
					title: 'operator',
					search: {
						disabled: true,
					},
					disabled: true,
					type: 'input',
					column:{
						minWidth: 120,
					},
					form: {
						component: {
							placeholder: 'Please enter',
						},
					},
				},
				continent: {
					title: 'Continent',
					type: 'input',
					column:{
						minWidth: 90,
					},
					form: {
						disabled: true,
						component: {
							placeholder: 'Please enter',
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				country: {
					title: 'Country',
					type: 'input',
					column:{
						minWidth: 90,
					},
					form: {
						component: {
							placeholder: 'Please enter',
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				province: {
					title: 'Province',
					type: 'input',
					column:{
						minWidth: 80,
					},
					form: {
						component: {
							placeholder: 'Please enter',
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				city: {
					title: 'City',
					type: 'input',
					column:{
						minWidth: 80,
					},
					form: {
						component: {
							placeholder: 'Please enter',
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				district: {
					title: 'County',
					key: '',
					type: 'input',
					column:{
						minWidth: 80,
					},
					form: {
						component: {
							placeholder: 'Please enter',
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				area_code: {
					title: 'Area code',
					type: 'input',
					column:{
						minWidth: 90,
					},
					form: {
						component: {
							placeholder: 'Please enter',
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				country_english: {
					title: 'Full English',
					type: 'input',
					column:{
						minWidth: 120,
					},
					form: {
						component: {
							placeholder: 'Please enter',
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				country_code: {
					title: 'Short name',
					type: 'input',
					column:{
						minWidth: 100,
					},
					form: {
						component: {
							placeholder: 'Please enter',
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				longitude: {
					title: 'Longitude',
					type: 'input',
					disabled: true,
					column:{
						minWidth: 100,
					},
					form: {
						component: {
							placeholder: 'Please enter',
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				latitude: {
					title: 'Latitude',
					type: 'input',
					disabled: true,
					column:{
						minWidth: 100,
					},
					form: {
						component: {
							placeholder: 'Please enter',
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				login_type: {
					title: 'Login type',
					type: 'dict-select',
					search: {
						disabled: false,
					},
					dict: dict({
						data: [
							{ label: 'Normal login', value: 1 },
							{ label: 'Wechat scan code login', value: 2 },
						],
					}),
					column:{
						minWidth: 120,
					},
					form: {
						component: {
							placeholder: 'Please enter',
						},
					},
				},
				os: {
					title: 'Operating system',
					type: 'input',
					column:{
						minWidth: 120,
					},
					form: {
						component: {
							placeholder: 'Please enter',
						},
					},
				},
				browser: {
					title: 'Browser',
					type: 'input',
					column:{
						minWidth: 120,
					},
					form: {
						component: {
							placeholder: 'Please enter',
						},
					},
				},
				agent: {
					title: 'Agent',
					disabled: true,
					type: 'input',
					column:{
						minWidth: 120,
					},
					form: {
						component: {
							placeholder: 'Please enter',
						},
					},
				},
				...commonCrudConfig({
					create_datetime: {
						search: true
					}
				})
			},
		},
	};
};
