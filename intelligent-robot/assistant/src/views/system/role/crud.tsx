import {CrudOptions, AddReq, DelReq, EditReq, dict, CrudExpose, compute} from '@fast-crud/fast-crud';
import * as api from './api';
import {dictionary} from '/@/utils/dictionary';
import {columnPermission} from '../../../utils/columnPermission';
import {successMessage} from '../../../utils/message';
import {auth} from '/@/utils/authFunction'

interface CreateCrudOptionsTypes {
    output: any;
    crudOptions: CrudOptions;
}

//此处为crudOptions配置
export const createCrudOptions = function ({
                                               crudExpose,
                                               rolePermission,
                                               handleDrawerOpen,
                                           }: {
    crudExpose: CrudExpose;
    rolePermission: any;
    handleDrawerOpen: Function;
}): CreateCrudOptionsTypes {
    const pageRequest = async (query: any) => {
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

    //权限判定

    // @ts-ignore
    // @ts-ignore
    return {
        crudOptions: {
            request: {
                pageRequest,
                addRequest,
                editRequest,
                delRequest,
            },
            pagination: {
                show: true
            },
            actionbar: {
                buttons: {
                    add: {
                        show: auth('role:Create')
                    }
                }
            },
            rowHandle: {
                //固定右侧
                fixed: 'right',
                width: 320,
                buttons: {
                    view: {
                        show: true,
                    },
                    edit: {
                        show: auth('role:Update'),
                    },
                    remove: {
                        show: auth('role:Delete'),
                    },
                    permission: {
                        type: 'primary',
                        text: 'config',
                        show: auth('role:Permission'),
                        tooltip: {
                            placement: 'top',
                            content: 'config',
                        },
                        click: (context: any): void => {
                            const {row} = context;
                            handleDrawerOpen(row);
                        },
                    },
                },
            },
            form: {
                col: {span: 24},
                labelWidth: '100px',
                wrapper: {
                    is: 'el-dialog',
                    width: '600px',
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
                id: {
                    title: 'ID',
                    type: 'text',
                    column: {show: false},
                    search: {show: false},
                    form: {show: false},
                },
                name: {
                    title: 'Name',
                    type: 'text',
                    search: {show: true},
                    column: {
                        minWidth: 120,
                        sortable: 'custom',
                    },
                    form: {
                        rules: [{required: true, message: 'Name is required'}],
                        component: {
                            placeholder: 'Please enter a role name',
                        },
                    },
                },
                key: {
                    title: 'Identification',
                    type: 'text',
                    search: {show: false},
                    column: {
                        minWidth: 120,
                        sortable: 'custom',
                        columnSetDisabled: true,
                    },
                    form: {
                        rules: [{required: true, message: 'Identification is required'}],
                        component: {
                            placeholder: 'Please enter permission identifier',
                        },
                    },
                    valueBuilder(context) {
                        const {row, key} = context
                        return row[key]
                    }
                },
                sort: {
                    title: 'Sort',
                    search: {show: false},
                    type: 'number',
                    column: {
                        minWidth: 90,
                        sortable: 'custom',
                    },
                    form: {
                        rules: [{required: true, message: 'Sort is required'}],
                        value: 1,
                    },
                },
                status: {
                    title: 'State',
                    search: {show: true},
                    type: 'dict-radio',
                    column: {
                        width: 100,
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
                }
            },
        },
    };
};
