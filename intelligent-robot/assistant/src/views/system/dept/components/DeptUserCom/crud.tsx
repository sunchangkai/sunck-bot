import { inject } from 'vue';
import { dict, UserPageQuery, AddReq, DelReq, EditReq, compute, CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud';
import { request } from '/@/utils/service';
import * as api from './api';
import { dictionary } from '/@/utils/dictionary';
import { successMessage } from '/@/utils/message';
import {auth} from "/@/utils/authFunction";

export const createCrudOptions = function ({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
	const pageRequest = async (query: UserPageQuery) => {
		const show_all = context?.isShowChildFlag.value ? '1' : '0';
		const res = await api.GetList({ ...query, show_all });
		/**
		 * 处理crud警告：Invalid prop: type check failed for prop "name". Expected String with value "2", got Number with value 2.
		 */
		// res.data.forEach((item: any) => {
		// 	item.dept = String(item.dept);
		// 	if (item.role && Array.isArray(item.role) && item.role.length > 0) {
		// 		item.role = item.role.map((r: number) => String(r));
		// 	}
		// });
		return res;
	};
	const editRequest = async ({ form, row }: EditReq) => {
		form.id = row.id;
		return await api.UpdateObj(form);
	};
	const delRequest = async ({ row }: DelReq) => {
		const res = await api.DelObj(row.id);
		context?.getDeptInfo();
		return res;
	};
	const addRequest = async ({ form }: AddReq) => {
		const res = await api.AddObj(form);
		context?.getDeptInfo();
		return res;
	};

	const exportRequest = async (query: UserPageQuery) => {
		return await api.exportData(query);
	};

	return {
		crudOptions: {
			table: {
				remove: {
					confirmMessage: 'Delete the user?',
				},
			},
			request: {
				pageRequest,
				addRequest,
				editRequest,
				delRequest,
			},
			actionbar: {
				buttons: {
					add: {
						show: auth('user:Create')
					},
					export: {
						text: 'Export', //按钮文字
						title: 'Export', //鼠标停留显示的信息
						show: auth('user:Export'),
						click() {
							return exportRequest(crudExpose!.getSearchFormData());
						},
					},
				},
			},
			search: {
				container: {
					layout: 'multi-line',
					action: {
						col: {
							span: 10,
						},
					},
				},
			},
			rowHandle: {
				//固定右侧
				fixed: 'right',
				width: 250,
				buttons: {
					view: {
						show: false,
					},
					edit: {
						show: auth('user:Update'),
					},
					remove: {
						show: auth('user:Delete'),
					},
					custom: {
						text: 'Reset',
						type: 'primary',
						show: auth('user:ResetPassword'),
						tooltip: {
							placement: 'top',
							content: 'Reset',
						},
						click: (ctx: any) => {
							const { row } = ctx;
							context?.handleResetPwdOpen(row);
						},
					},
				},
			},
			columns: {
				_index: {
					title: 'Index',
					form: { show: false },
					column: {
						type: 'index',
						align: 'center',
						width: '70px',
						columnSetDisabled: true, //禁止在列设置中选择
					},
				},
				search: {
					title: 'Keywords',
					column: {
						show: false,
					},
					search: {
						show: true,
						component: {
							props: {
								clearable: true,
							},
							placeholder: 'Please enter keywords',
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
					title: 'Account',
					type: 'input',
					column: {
						minWidth: 100, //最小列宽
					},
					form: {
						rules: [
							// 表单校验规则
							{
								required: true,
								message: 'Account is required',
							},
						],
						component: {
							placeholder: 'Please enter account',
						},
					},
				},
				password: {
					title: 'Password',
					type: 'input',
					column: {
						show: false,
					},
					editForm: {
						show: false,
					},
					form: {
						rules: [
							// 表单校验规则
							{
								required: true,
								message: 'Password is required',
							},
						],
						component: {
							span: 12,
							showPassword: true,
							placeholder: 'Please enter password',
						},
						// value: vm.systemConfig('base.default_password'),
					},
					/* valueResolve(row, key) {
                        if (row.password) {
                            row.password = vm.$md5(row.password)
                        }
                    } */
				},
				name: {
					title: 'Name',
					type: 'input',
					column: {
						minWidth: 100, //最小列宽
					},
					form: {
						rules: [
							// 表单校验规则
							{
								required: true,
								message: 'Name is required',
							},
						],
						component: {
							span: 12,
							placeholder: 'Please enter name',
						},
					},
				},
				dept: {
					title: 'Dept',
					type: 'dict-tree',
					dict: dict({
						isTree: true,
						url: '/api/system/dept/all_dept/',
						value: 'id',
						label: 'name',
					}),
					column: {
						minWidth: 150, //最小列宽
					},
					form: {
						rules: [
							// 表单校验规则
							{
								required: true,
								message: 'Dept is required',
							},
						],
						component: {
							filterable: true,
							placeholder: 'Please select',
							props: {
								props: {
									value: 'id',
									label: 'name',
								},
							},
						},
					},
				},
				role: {
					title: 'Role',
					search: {
						show: true,
						component: {
							props: {
								clearable: true,
							},
						},
					},
					type: 'dict-select',
					dict: dict({
						url: '/api/system/role/',
						value: 'id',
						label: 'name',
					}),
					column: {
						minWidth: 100, //最小列宽
					},
					form: {
						rules: [
							// 表单校验规则
							{
								required: true,
								message: 'Role is required',
							},
						],
						component: {
							multiple: true,
							filterable: true,
							placeholder: 'Please select',
						},
					},
				},
				mobile: {
					title: 'Phone',
					type: 'input',
					column: {
						minWidth: 120, //最小列宽
					},
					form: {
						rules: [
							{
								max: 20,
								message: 'Please enter the correct mobile phone number',
								trigger: 'blur',
							},
							{
								pattern: /^1[3-9]\d{9}$/,
								message: 'Please enter the correct mobile phone number',
							},
						],
						component: {
							placeholder: 'Please enter mobile number',
						},
					},
				},
				email: {
					title: 'email',
					column: {
						width: 260,
					},
					form: {
						rules: [
							{
								type: 'email',
								message: 'Please enter the correct email address',
								trigger: ['blur', 'change'],
							},
						],
						component: {
							placeholder: 'Please enter email',
						},
					},
				},
				gender: {
					title: 'Gender',
					type: 'dict-select',
					dict: dict({
						data: dictionary('gender'),
					}),
					form: {
						value: 1,
						component: {
							span: 12,
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				user_type: {
					title: 'User Type',
					search: {
						show: true,
						component: {
							placeholder: 'Please select',
						},
					},
					type: 'dict-select',
					dict: dict({
						data: dictionary('user_type'),
					}),
					column: {
						minWidth: 100, //最小列宽
					},
					form: {
						show: false,
						value: 0,
						component: {
							span: 12,
						},
					},
				},
				is_active: {
					title: 'Lock in',
					search: {
						show: true,
						component: {
							placeholder: 'Please select',
						},
					},
					type: 'dict-radio',
					column: {
						component: {
							name: 'fs-dict-switch',
							activeText: '',
							inactiveText: '',
							style: '--el-switch-on-color: var(--el-color-primary); --el-switch-off-color: #dcdfe6',
							onChange: compute((context) => {
								return () => {
									api.UpdateObj(context.row).then((res: APIResponseData) => {
										successMessage(res.msg as string);
									});
								};
							}),
						},
					},
					dict: dict({
						data: dictionary('button_status_bool'),
					}),
				},
				avatar: {
					title: 'avatar',
					type: 'avatar-cropper',
					form: {
						show: false,
					},
				},
			},
		},
	};
};
