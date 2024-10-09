<template>
	<div style="padding: 20px">
		<el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
			<el-form-item label="group" prop="parent">
				<el-select v-model="form.parent" placeholder="Please select group" clearable>
					<el-option :label="item.title" :value="item.id" :key="index" v-for="(item, index) in parentOptions"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="title" prop="title">
				<el-input v-model="form.title" placeholder="Please enter" clearable></el-input>
			</el-form-item>
			<el-form-item label="key" prop="key">
				<el-input v-model="form.key" placeholder="Please enter" clearable></el-input>
			</el-form-item>
			<el-form-item label="type" prop="form_item_type">
				<el-select v-model="form.form_item_type" placeholder="Please select" clearable>
					<el-option :label="item.label" :value="item.value" :key="index" v-for="(item, index) in dictionary('config_form_type')"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item
				v-if="[4, 5, 6].indexOf(form.form_item_type) > -1"
				label="dict key"
				prop="setting"
				:rules="[{ required: true, message: 'Cannot be null' }]"
			>
				<el-input v-model="form.setting" placeholder="Please enter the key value in the dictionary" clearable></el-input>
			</el-form-item>
			<div v-if="[13, 14].indexOf(form.form_item_type) > -1">
				<associationTable ref="associationTableRef" v-model="form.setting" @updateVal="associationTableUpdate"></associationTable>
			</div>
			<el-form-item label="validation">
				<el-select v-model="form.rule" multiple placeholder="Please select (Multiple options available)" clearable>
					<el-option :label="item.label" :value="item.value" :key="index" v-for="(item, index) in ruleOptions"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="tips" prop="placeholder">
				<el-input v-model="form.placeholder" placeholder="Please enter" clearable></el-input>
			</el-form-item>
			<el-form-item label="sort" prop="sort">
				<el-input-number v-model="form.sort" :min="0" :max="99"></el-input-number>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit(formRef)">Create Now</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import * as api from '../api';
import associationTable from './components/associationTable.vue';
import {ref, reactive, onMounted, inject} from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { successMessage } from '/@/utils/message';
import { dictionary } from '/@/utils/dictionary';
let form: any = reactive({
	parent: null,
	title: null,
	key: null,
	form_item_type: '',
	rule: null,
	placeholder: null,
});
const formRef = ref<FormInstance>();
const associationTableRef: any = ref<FormInstance>();
const rules = reactive<FormRules>({
	parent: [
		{
			required: true,
			message: 'Please select',
		},
	],
	title: [
		{
			required: true,
			message: 'Please enter',
		},
	],
	key: [
		{
			required: true,
			message: 'Please enter',
		},
		{
			pattern: /^[A-Za-z0-9_]+$/,
			message: 'Please enter numbers, letters, or underscores',
		},
	],
	form_item_type: [
		{
			required: true,
			message: 'Please enter',
		},
	],
});
let parentOptions: any = ref([]);
let ruleOptions = ref([
	{
		label: 'Required Field',
		value: '{"required": true, "message": "Required fields cannot be blank."}',
	},
	{
		label: 'email',
		value: '{ "type": "email", "message": "Please enter the correct email address"}',
	},
	{
		label: 'URL',
		value: '{ "type": "url", "message": "Please enter the correct URL"}',
	},
]);
const getParent = () => {
	api
		.GetList({
			parent__isnull: true,
			limit: 999,
		})
		.then((res: any) => {
			parentOptions.value = res.data;
		});
};

const refreshView:any = inject('refreshView')
const onSubmit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate((valid, fields) => {
		if (valid) {
			api.AddObj(form).then((res: any) => {
				if (res.code == 2000) {
          successMessage('Add success');
          refreshView()
        }
			});
		} else {
			console.log('error submit!', fields);
		}
	});
};

// 关联表数据更新
const associationTableUpdate = () => {
	return new Promise(function (resolve, reject) {
		if (associationTableRef) {
			if (!associationTableRef.onSubmit()) {
				// eslint-disable-next-line prefer-promise-reject-errors
				return reject(false);
			}
			const { formObj } = associationTableRef;
			form.setting = formObj;
			return resolve(true);
		} else {
			return resolve(true);
		}
	});
};

onMounted(() => {
	getParent();
});
</script>

<style></style>
