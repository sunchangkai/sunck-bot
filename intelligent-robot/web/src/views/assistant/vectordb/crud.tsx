import * as api from './api';
import {
    dict,
    UserPageQuery,
    AddReq,
    DelReq,
    EditReq,
    compute,
    CreateCrudOptionsProps,
    CreateCrudOptionsRet
} from '@fast-crud/fast-crud';
import {request} from '/@/utils/service';
import {dictionary} from '/@/utils/dictionary';
import {successMessage} from '/@/utils/message';
import {auth} from '/@/utils/authFunction'

export const createCrudOptions = function ({crudExpose}: CreateCrudOptionsProps): CreateCrudOptionsRet {
    const pageRequest = async (query: UserPageQuery) => {
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
                        show: auth('vectordb:Create')
                    }
                }
            },
            rowHandle: {
                //固定右侧
                fixed: 'right',
                width: 150,
                buttons: {
                    view: {
                        show: false,
                    },
                    edit: {
                        iconRight: 'Edit',
                        type: 'text',
                        show: auth("vectordb:Update")
                    },
                    remove: {
                        iconRight: 'Delete',
                        type: 'text',
                        show: auth("vectordb:Delete")
                    },
                },
            },
            form: {
                col: {span: 24},
                labelWidth: '110px',
                wrapper: {
                    is: 'el-dialog',
                    width: '600px',
                },
            },
            columns: {
                _index: {
                    title: '序号',
                    form: {show: false},
                    column: {
                        //type: 'index',
                        align: 'center',
                        width: '70px',
                        columnSetDisabled: true, //禁止在列设置中选择
                        //@ts-ignore
                        formatter: (context) => {
                            //计算序号,你可以自定义计算规则，此处为翻页累加
                            let index = context.index ?? 1;
                            let pagination: any = crudExpose!.crudBinding.value.pagination;
                            return ((pagination.currentPage ?? 1) - 1) * pagination.pageSize + index + 1;
                        },
                    },
                },
                search: {
                    title: '关键词',
                    column: {
                        show: false,
                    },
                    search: {
                        show: true,
                        component: {
                            props: {
                                clearable: true,
                            },
                            placeholder: '请输入关键词',
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
				name: {
					title: '名称',
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
								message: '必填项',
							},
							{
							    max: 128,
							    message: '请输入正确的名称',
							    trigger: 'blur',
							},
						],
						component: { span: 24, placeholder: '请输入名称' },
					},
				},
				host: {
					title: 'IP',
					type: ['text'],
					column:{
						width: 200,
					},
					form: {
						rules: [
							// 表单校验规则
							{
								required: true,
								message: '必填项',
							},
							{
							    pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
							    message: '请输入正确的IP',
							},
						],
						component: { span: 24, placeholder: '请输入IP' },
					},
				},
				port: {
					title: '端口',
					type: ['text', 'colspan'],
					column:{
						width: 100,
					},
					form: {
						rules: [
							// 表单校验规则
							{
								required: true,
								message: '必填项',
							},
							{
							    pattern: /^(?:[0-9]{1,4}|[1-5][0-9]{4}|6[0-5][0-5][0-3][0-5])$/,
							    message: '请输入正确的端口',
							},
						],
						component: { span: 24, placeholder: '请输入端口' },
					},
				},
            },
        },
    };
};
