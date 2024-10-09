<template>
	<div class="menu-form-com">
		<div class="menu-form-alert">
			1.The red menu means the status is disabled;<br />
			2.Add a menu, if it is a directory, the component address is empty;<br />
			3.Add the root menu with an empty parent ID;
		</div>
		<el-form ref="formRef" :rules="rules" :model="menuFormData" label-width="80px" label-position="right">
			<el-form-item label="Name" prop="name">
				<el-input v-model="menuFormData.name" placeholder="Please enter the menu name" />
			</el-form-item>
			<el-form-item label="Parent" prop="parent">
				<el-tree-select
					v-model="menuFormData.parent"
					:props="defaultTreeProps"
					:data="deptDefaultList"
					:cache-data="props.cacheData"
					lazy
					check-strictly
					clearable
					:load="handleTreeLoad"
					placeholder="Please select the parent menu"
					style="width: 100%"
				/>
			</el-form-item>

			<el-form-item  label="URL" prop="web_path">
				<el-input v-model="menuFormData.web_path" placeholder="Please enter the route address, starting with /" />
			</el-form-item>

			<el-form-item label="icon" prop="icon">
				<IconSelector clearable v-model="menuFormData.icon" />
			</el-form-item>

			<el-row>
				<el-col :span="12">
					<el-form-item required label="State">
						<el-switch v-model="menuFormData.status" width="60" inline-prompt active-text="Enable" inactive-text="Disable" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item v-if="menuFormData.status" required label="Sidedisplay">
						<el-switch v-model="menuFormData.visible" width="60" inline-prompt active-text="Display" inactive-text="Hide" />
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="12">
					<el-form-item required label="Directory">
						<el-switch v-model="menuFormData.is_catalog" width="60" inline-prompt active-text="Yes" inactive-text="No" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item v-if="!menuFormData.is_catalog" required label="External Links">
						<el-switch v-model="menuFormData.is_link" width="60" inline-prompt active-text="Yes" inactive-text="No" />
					</el-form-item>
				</el-col>
        <el-col :span="12">
          <el-form-item required v-if="!menuFormData.is_catalog" label="Fixed">
            <el-switch v-model="menuFormData.is_affix" width="60" inline-prompt active-text="Yes" inactive-text="No" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="!menuFormData.is_catalog && menuFormData.is_link" required label="Inlay">
            <el-switch v-model="menuFormData.is_iframe" width="60" inline-prompt active-text="Yes" inactive-text="No" />
          </el-form-item>
        </el-col>
			</el-row>

			<el-form-item label="Remarks">
				<el-input v-model="menuFormData.description" maxlength="200" show-word-limit type="textarea" placeholder="Please enter comments" />
			</el-form-item>

			<el-divider></el-divider>

			<div style="min-height: 184px">
				<el-form-item v-if="!menuFormData.is_catalog && !menuFormData.is_link" label="Address" prop="component">
					<el-autocomplete
						class="w-full"
						v-model="menuFormData.component"
						:fetch-suggestions="querySearch"
						:trigger-on-focus="false"
						clearable
						:debounce="100"
						placeholder="Please enter the component address"
					/>
				</el-form-item>

				<el-form-item v-if="!menuFormData.is_catalog && !menuFormData.is_link" label="Name" prop="component_name">
					<el-input v-model="menuFormData.component_name" placeholder="Please enter the component name" />
				</el-form-item>

				<el-form-item v-if="!menuFormData.is_catalog && menuFormData.is_link" label="Links" prop="link_url">
					<el-input v-model="menuFormData.link_url" placeholder="Please enter the external link address" />
				</el-form-item>

				<el-form-item v-if="!menuFormData.is_catalog" label="cache">
					<el-switch v-model="menuFormData.cache" width="60" inline-prompt active-text="Enable" inactive-text="Disable" />
				</el-form-item>
			</div>

			<el-divider></el-divider>
		</el-form>

		<div class="menu-form-btns">
			<el-button @click="handleSubmit" type="primary" :loading="menuBtnLoading">Save</el-button>
			<el-button @click="handleCancel">Cancel</el-button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { ElForm, FormRules } from 'element-plus';
import IconSelector from '/@/components/iconSelector/index.vue';
import { lazyLoadMenu, AddObj, UpdateObj } from '../../api';
import { successNotification } from '/@/utils/message';
import { MenuFormDataType, MenuTreeItemType, ComponentFileItem, APIResponseData } from '../../types';
import type Node from 'element-plus/es/components/tree/src/model/node';

interface IProps {
	initFormData: Partial<MenuTreeItemType> | null;
	treeData: MenuTreeItemType[];
	cacheData: MenuTreeItemType[];
}

const defaultTreeProps: any = {
	children: 'children',
	label: 'name',
	value: 'id',
	isLeaf: (data: MenuTreeItemType[], node: Node) => {
		if (node?.data.hasChild) {
			return false;
		} else {
			return true;
		}
	},
};
const validateWebPath = (rule: any, value: string, callback: Function) => {
	let pattern = /^\/.*?/;
	const reg = pattern.test(value);
	if (reg) {
		callback();
	} else {
		callback(new Error('Please enter the correct address'));
	}
};

const validateLinkUrl = (rule: any, value: string, callback: Function) => {
  let pattern = /^\/.*?/;
  let patternUrl = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
  const reg = pattern.test(value) || patternUrl.test(value)
  if (reg) {
    callback();
  } else {
    callback(new Error('Please enter the correct address'));
  }
};

const props = withDefaults(defineProps<IProps>(), {
	initFormData: () => null,
	treeData: () => [],
	cacheData: () => [],
});
const emit = defineEmits(['drawerClose']);

const formRef = ref<InstanceType<typeof ElForm>>();

const rules = reactive<FormRules>({
	web_path: [{ required: true, message: 'Please enter the correct address', validator: validateWebPath, trigger: 'blur' }],
	name: [{ required: true, message: 'Menu name is required', trigger: 'blur' }],
	component: [{ required: true, message: 'Please enter the component address', trigger: 'blur' }],
	component_name: [{ required: true, message: 'Please enter the component name', trigger: 'blur' }],
  link_url: [{ required: true, message: 'Please enter the external link address',validator:validateLinkUrl, trigger: 'blur' }],
});

let deptDefaultList = ref<MenuTreeItemType[]>([]);
let menuFormData = reactive<MenuFormDataType>({
	parent: '',
	name: '',
	component: '',
	web_path: '',
	icon: '',
	cache: true,
	status: true,
	visible: true,
	component_name: '',
	description: '',
	is_catalog: false,
	is_link: false,
  is_iframe: false,
  is_affix: false,
  link_url:''
});
let menuBtnLoading = ref(false);

const setMenuFormData = () => {
	if (props.initFormData?.id) {
		menuFormData.id = props.initFormData?.id || '';
		menuFormData.name = props.initFormData?.name || '';
		menuFormData.parent = props.initFormData?.parent || '';
		menuFormData.component = props.initFormData?.component || '';
		menuFormData.web_path = props.initFormData?.web_path || '';
		menuFormData.icon = props.initFormData?.icon || '';
		menuFormData.status = !!props.initFormData.status;
		menuFormData.visible = !!props.initFormData.visible;
		menuFormData.cache = !!props.initFormData.cache;
		menuFormData.component_name = props.initFormData?.component_name || '';
		menuFormData.description = props.initFormData?.description || '';
		menuFormData.is_catalog = !!props.initFormData.is_catalog;
		menuFormData.is_link = !!props.initFormData.is_link;
    menuFormData.is_iframe =!!props.initFormData.is_iframe;
    menuFormData.is_affix =!!props.initFormData.is_affix;
    menuFormData.link_url =props.initFormData.link_url;
	}
};

const querySearch = (queryString: string, cb: any) => {
	const files: any = import.meta.glob('@views/**/*.vue');
	let fileLists: Array<any> = [];
	Object.keys(files).forEach((queryString: string) => {
		fileLists.push({
			label: queryString.replace(/(\.\/|\.vue)/g, ''),
			value: queryString.replace(/(\.\/|\.vue)/g, ''),
		});
	});
	const results = queryString ? fileLists.filter(createFilter(queryString)) : fileLists;
	// 统一去掉/src/views/前缀
	results.forEach((val) => {
		val.label = val.label.replace('/src/views/', '');
		val.value = val.value.replace('/src/views/', '');
	});
	cb(results);
};

const createFilter = (queryString: string) => {
	return (file: ComponentFileItem) => {
		return file.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1;
	};
};

/**
 * 树的懒加载
 */
const handleTreeLoad = (node: Node, resolve: Function) => {
	if (node.level !== 0) {
		lazyLoadMenu({ parent: node.data.id }).then((res: APIResponseData) => {
			resolve(res.data);
		});
	}
};

const handleSubmit = () => {
	if (!formRef.value) return;
	formRef.value.validate(async (valid) => {
		if (!valid) return;
		try {
			let res;
			menuBtnLoading.value = true;
			if (menuFormData.id) {
				res = await UpdateObj(menuFormData);
			} else {
				res = await AddObj(menuFormData);
			}
			if (res?.code === 2000) {
				successNotification(res.msg as string);
				handleCancel('submit');
			}
		} finally {
			menuBtnLoading.value = false;
		}
	});
};

const handleCancel = (type: string = '') => {
	emit('drawerClose', type);
	formRef.value?.resetFields();
};

onMounted(async () => {
	props.treeData.map((item) => {
		deptDefaultList.value.push(item);
	});
	setMenuFormData();
});
</script>

<style lang="scss" scoped>
.menu-form-com {
	margin: 10px;
	overflow-y: auto;
	.menu-form-alert {
		color: #fff;
		line-height: 24px;
		padding: 8px 16px;
		margin-bottom: 20px;
		border-radius: 4px;
		background-color: var(--el-color-primary);
	}
	.menu-form-btns {
		padding-bottom: 10px;
		box-sizing: border-box;
	}
}
</style>
