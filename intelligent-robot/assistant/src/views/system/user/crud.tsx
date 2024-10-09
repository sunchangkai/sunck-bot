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
import {auth} from '/@/utils/authFunction';
import {SystemConfigStore} from "/@/stores/systemConfig";
import {storeToRefs} from "pinia";
import {computed} from "vue";
import { Md5 } from 'ts-md5';
import {commonCrudConfig} from "/@/utils/commonCrud";
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

    const exportRequest = async (query: UserPageQuery) => {
        return await api.exportData(query)
    }

    const resetToDefaultPasswordRequest = async (row:EditReq)=>{
        await api.resetToDefaultPassword(row.id)
        successMessage("Reset password successfully")
    }

    const systemConfigStore = SystemConfigStore()
    const {systemConfig} = storeToRefs(systemConfigStore)
    const getSystemConfig = computed(() => {
        // console.log(systemConfig.value)
        return systemConfig.value
    })


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
            form: {
                initialForm: {
                    password: computed(() => {
                        return systemConfig.value['base.default_password']
                    }),
                }
            },
            actionbar: {
                buttons: {
                    add: {
                        show: auth('user:Create')
                    },
                    export: {
                        text: "Export",//按钮文字
                        title: "Export",//鼠标停留显示的信息
                        show: auth('user:Export'),
                        click() {
                            return exportRequest(crudExpose!.getSearchFormData())
                        }
                    }
                }
            },
            rowHandle: {
                //固定右侧
                fixed: 'right',
                width: 200,
                buttons: {
                    view: {
                        show: false,
                    },
                    edit: {
                        iconRight: 'Edit',
                        type: 'text',
                        show: auth('user:Update'),
                    },
                    remove: {
                        iconRight: 'Delete',
                        type: 'text',
                        show: auth('user:Delete'),
                    },
                    custom: {
                        text: 'Reset',
                        type: 'text',
                        show: auth('user:ResetPassword'),
                        tooltip: {
                            placement: 'top',
                            content: 'Reset password',
                        },
                        //@ts-ignore
                        click: (ctx: any) => {
                            const {row} = ctx;
                            resetToDefaultPasswordRequest(row)
                        },
                    },
                },
            },
            columns: {
                _index: {
                    title: 'Index',
                    form: {show: false},
                    column: {
                        type: 'index',
                        align: 'center',
                        width: '70px',
                        columnSetDisabled: true, //禁止在列设置中选择
                    },
                },
                username: {
                    title: 'Account',
                    search: {
                        show: true,
                    },
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
                    type: 'password',
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
                    },
                    valueResolve({form}) {
                        if (form.password) {
                            form.password = Md5.hashStr(form.password)
                        }
                    }
                },
                name: {
                    title: 'Name',
                    search: {
                        show: true,
                    },
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
                            placeholder: 'Please input Name',
                        },
                    },
                },
                dept: {
                    title: 'Dept',
                    search: {
                        disabled: true,
                    },
                    type: 'dict-tree',
                    dict: dict({
                        isTree: true,
                        url: '/api/system/dept/all_dept/',
                        value: 'id',
                        label: 'name'
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
                                checkStrictly:true,
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
                        disabled: true,
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
                    title: 'Mobile',
                    search: {
                        show: true,
                    },
                    type: 'input',
                    column: {
                        minWidth: 120, //最小列宽
                    },
                    form: {
                        rules: [
                            {
                                max: 20,
                                message: 'Please enter the correct mobile number',
                                trigger: 'blur',
                            },
                            {
                                pattern: /^1[3-9]\d{9}$/,
                                message: 'Please enter the correct mobile number',
                            },
                        ],
                        component: {
                            placeholder: 'Please enter mobile number',
                        },
                    },
                },
                email: {
                    title: 'Email',
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
                    component: {props: {color: 'auto'}}, // 自动染色
                },
                user_type: {
                    title: 'Type',
                    search: {
                        show: true,
						component: {
							placeholder: 'Please select',
						}
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
                    title: 'State',
                    search: {
                        show: true,
						component: {
							placeholder: 'Please select',
						}
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
                    title: 'Avatar',
                    type: 'avatar-cropper',
                    form: {
                        show: false,
                    },
                    column: {
                        minWidth: 400, //最小列宽
                    },
                },
                ...commonCrudConfig({
                    dept_belong_id: {
                        form: true,
                        table: true
                    }
                })
            },
        },
    };
};
