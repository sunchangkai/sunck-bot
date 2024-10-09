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
import {dictionary} from '/@/utils/dictionary';
import {successMessage} from '/@/utils/message';
import {auth} from "/@/utils/authFunction";

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

    /**
     * 懒加载
     * @param row
     * @returns {Promise<unknown>}
     */
    const loadContentMethod = (tree: any, treeNode: any, resolve: Function) => {
        pageRequest({pcode: tree.code}).then((res: APIResponseData) => {
            resolve(res.data);
        });
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
                        show: auth('area:Create'),
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
						show: auth('area:Update')
                    },
                    remove: {
                        iconRight: 'Delete',
                        type: 'text',
						show: auth('area:Delete')
                    },
                },
            },
            pagination: {
                show: false,
            },
            table: {
                rowKey: 'id',
                lazy: true,
                load: loadContentMethod,
                treeProps: {children: 'children', hasChildren: 'hasChild'},
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
                // pcode: {
                // 	title: '父级地区',
                // 	show: false,
                // 	search: {
                // 		show: true,
                // 	},
                // 	type: 'dict-tree',
                // 	form: {
                // 		component: {
                // 			showAllLevels: false, // 仅显示最后一级
                // 			props: {
                // 				elProps: {
                // 					clearable: true,
                // 					showAllLevels: false, // 仅显示最后一级
                // 					props: {
                // 						checkStrictly: true, // 可以不需要选到最后一级
                // 						emitPath: false,
                // 						clearable: true,
                // 					},
                // 				},
                // 			},
                // 		},
                // 	},
                // },
                name: {
                    title: 'Area',
                    search: {
                        show: true,
                    },
                    treeNode: true,
                    type: 'input',
                    column: {
                        minWidth: 120,
                    },
                    form: {
                        rules: [
                            // 表单校验规则
                            {required: true, message: 'Area is required'},
                        ],
                        component: {
                            placeholder: 'Please enter Area name',
                        },
                    },
                },
                code: {
                    title: 'Code',
                    search: {
                        show: true,
                    },
                    type: 'input',
                    column: {
                        minWidth: 90,
                    },
                    form: {
                        rules: [
                            // 表单校验规则
                            {required: true, message: 'Code is required'},
                        ],
                        component: {
                            placeholder: 'Please enter Area code',
                        },
                    },
                },
                pinyin: {
                    title: 'Pinyin',
                    search: {
                        disabled: true,
                    },
                    type: 'input',
                    column: {
                        minWidth: 120,
                    },
                    form: {
                        rules: [
                            // 表单校验规则
                            {required: true, message: 'Pinyin is required'},
                        ],
                        component: {
                            placeholder: 'Please enter Area pinyin',
                        },
                    },
                },
                level: {
                    title: 'Level',
                    search: {
                        disabled: true,
                    },
                    type: 'input',
                    column: {
                        minWidth: 100,
                    },
                    form: {
                        disabled: false,
                        rules: [
                            // 表单校验规则
                            {required: true, message: 'Level is required'},
                        ],
                        component: {
                            placeholder: 'Please enter Area level',
                        },
                    },
                },
                initials: {
                    title: 'First',
                    column: {
                        minWidth: 100,
                    },
                    form: {
                        rules: [
                            // 表单校验规则
                            {required: true, message: 'First letter is required'},
                        ],

                        component: {
                            placeholder: 'Please enter Area first letter',
                        },
                    },
                },
                enable: {
                    title: 'Enable',
                    search: {
                        show: true,
                    },
                    type: 'dict-radio',
                    column: {
                        minWidth: 90,
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
            },
        },
    };
};
