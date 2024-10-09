import {AddReq, DelReq, EditReq, dict, CreateCrudOptionsRet, CreateCrudOptionsProps} from '@fast-crud/fast-crud';
import * as api from './api';
import {auth} from '/@/utils/authFunction'
import {request} from '/@/utils/service';
import { successNotification } from '/@/utils/message';
import { ElMessage } from 'element-plus';
//此处为crudOptions配置
export const createCrudOptions = function ({crudExpose, context}: CreateCrudOptionsProps): CreateCrudOptionsRet {
    const pageRequest = async () => {
        if (context!.selectOptions.value.id) {
            return await api.GetList({menu: context!.selectOptions.value.id} as any);
        } else {
            return undefined;
        }
    };
    const editRequest = async ({form, row}: EditReq) => {
        return await api.UpdateObj({...form, menu: row.menu});
    };
    const delRequest = async ({row}: DelReq) => {
        return await api.DelObj(row.id);
    };
    const addRequest = async ({form}: AddReq) => {
        return await api.AddObj({...form, ...{menu: context!.selectOptions.value.id}});
    };
    return {
        crudOptions: {
            pagination:{
                show:false
            },
            search: {
                container: {
                    action: {
                        //按钮栏配置
                        col: {
                            span: 8,
                        },
                    },
                },
            },
            actionbar: {
                buttons: {
                    add: {
                        show: auth('btn:Create')
                    },
                    batchAdd: {
						show: true,
						type: 'primary',
						text: 'Batch generation',
						click: async () => {
							if (context!.selectOptions.value.id == undefined) {
								ElMessage.error('Please select menu');
								return;
							}
							const result = await api.BatchAdd({ menu: context!.selectOptions.value.id });
							if (result.code == 2000) {
								successNotification(result.msg);
								crudExpose.doRefresh();
							}
						},
					},
                },
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
                        icon: '',
                        type: 'primary',
                        show: auth('btn:Update')
                    },
                    remove: {
                        show: auth('btn:Delete')
                    },
                },
            },
            request: {
                pageRequest,
                addRequest,
                editRequest,
                delRequest,
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
                search: {
                    title: 'Keyword',
                    column: {show: false},
                    type: 'text',
                    search: {show: true},
                    form: {
                        show: false,
                        component: {
                            placeholder: 'Please enter keyword search',
                        },
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
                    title: 'Permission name',
                    type: 'text',
                    search: {show: true},
                    column: {
                        minWidth: 120,
                        sortable: true,
                    },
                    form: {
                        rules: [{required: true, message: 'Permission name is required'}],
                        component: {
                            placeholder: 'Please enter permission name search',
                            props: {
                                clearable: true,
                                allowCreate: true,
                                filterable: true,
                            },
                        },
                        helper: {
                            render() {
                                return <el-alert title="Manual input" type="warning"
                                                 description="The name of the button on the page or a custom name"/>;
                            },
                        },
                    },
                },
                value: {
                    title: 'Permission value',
                    type: 'text',
                    search: {show: false},
                    column: {
                        width: 200,
                        sortable: true,
                    },
                    form: {
                        rules: [{required: true, message: 'Permission value is required'}],
                        placeholder: 'Please enter Permission value',
                        helper: {
                            render() {
                                return <el-alert title="Unique value" type="warning"
                                                 description="Used to determine front-end button permissions or interface permissions"/>;
                            },
                        },
                    },
                },
                method: {
                    title: 'Request method',
                    search: {show: false},
                    type: 'dict-select',
                    column: {
                        width: 120,
                        sortable: true,
                    },
                    dict: dict({
                        data: [
                            {label: 'GET', value: 0},
                            {label: 'POST', value: 1, color: 'success'},
                            {label: 'PUT', value: 2, color: 'warning'},
                            {label: 'DELETE', value: 3, color: 'danger'},
                        ],
                    }),
                    form: {
                        rules: [{required: true, message: 'Request method is required'}],
                    },
                },
                api: {
                    title: 'Interface address',
                    search: {show: false},
                    type: 'dict-select',
                    dict: dict({
                        getData() {
                            return request({url: '/swagger.json'}).then((res: any) => {
                                const ret = Object.keys(res.paths);
                                const data = [];
                                for (const item of ret) {
                                    const obj: any = {};
                                    obj.label = item;
                                    obj.value = item;
                                    data.push(obj);
                                }
                                return data;
                            });
                        },
                    }),
                    column: {
                        minWidth: 250,
                        sortable: true,
                    },
                    form: {
                        rules: [{required: true, message: 'Interface address is required'}],
                        component: {
                            props: {
                                allowCreate: true,
                                filterable: true,
                                clearable: true,
                            },
                        },
                        helper: {
                            render() {
                                return <el-alert title="Please fill it out correctly so that your request will not be blocked. A regular is used to match singletons,For example:/api/xx/.*?/"
                                                 type="warning"/>;
                            },
                        },
                    },
                },
            },
        },
    };
};
