<template>
	<div class="columns-table-com">
		<p class="ctc-title">Field permissions</p>

		<div class="ctc-head">
			<el-button type="primary" @click="handleUpdateColumn('create')">New additions</el-button>
			<el-button type="primary" @click="handleAutomatch">Automatic matching</el-button>
		</div>

		<el-table :data="state.data" border v-loading="state.loading" class="ctc-table">
			<el-table-column prop="field_name" label="Field name" />
			<el-table-column prop="title" label="Column name" />
			<el-table-column label="Operation" width="180" align="center">
				<template #default="scope">
					<el-button type="primary" @click="handleUpdateColumn('update', scope.row)">Edit</el-button>
					<el-button type="danger" @click="handleDelete(scope.row)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="ctc-pagination">
			<el-pagination
				v-model:current-page="searchParams.page"
				v-model:page-size="searchParams.limit"
				:page-sizes="[5, 10, 20, 50]"
				:total="state.total"
				background
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>

		<el-drawer v-model="drawerVisible" title="Field permissions" direction="rtl" size="500px" :close-on-click-modal="false" :before-close="handleDrawerClose">
			<ColumnsFormCom v-if="drawerVisible" :currentInfo="props.currentInfo" :initFormData="drawerFormData" @drawerClose="handleDrawerClose" />
		</el-drawer>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { ElMessageBox } from 'element-plus';
import ColumnsFormCom from '../ColumnsFormCom/index.vue';
import { getColumnsData, automatchColumnsData, deleteColumnsData, updateColumnsData } from './api';
import { successNotification, warningNotification } from '/@/utils/message';
import { APIResponseData, CurrentInfoType, ColumnsFormDataType, AddColumnsDataType } from '../../types';

const props = defineProps({
	currentInfo: {
		type: Object as () => CurrentInfoType,
		required: true,
		default: () => {},
	},
});

let searchParams = reactive({
	page: 1,
	limit: 20,
});
let state = reactive({
	loading: false,
	data: [],
	total: 0,
});
let drawerVisible = ref(false);
let drawerFormData = ref<Partial<ColumnsFormDataType>>({});

const fetchData = async (query: CurrentInfoType = props.currentInfo) => {
	try {
		state.loading = true;
		const res = await getColumnsData({ ...searchParams, ...query });
		if (res?.code === 2000) {
			state.data = res.data;
			state.total = res.total;
		}
	} finally {
		state.loading = false;
	}
};

/**
 * 自动匹配列
 */
const handleAutomatch = async () => {
	if (props.currentInfo?.role && props.currentInfo?.model && props.currentInfo?.app) {
		const res = await automatchColumnsData(props.currentInfo);
		if (res?.code === 2000) {
			successNotification('Successful match');
			fetchData();
		}
		return;
	}
	warningNotification('Please select the roles and models table!');
};

/**
 * 新增 or 编辑
 */
const handleUpdateColumn = (type: string, record?: ColumnsFormDataType) => {
	if (props.currentInfo?.role && props.currentInfo?.model && props.currentInfo?.app) {
		if (type === 'update' && record) {
			drawerFormData.value = record;
		}
		drawerVisible.value = true;
		return;
	}
	warningNotification('Please select the roles and models table!');
};
const handleDrawerClose = (type?: string) => {
	if (type === 'submit') {
		fetchData();
	}
	drawerVisible.value = false;
	drawerFormData.value = {};
};

/**
 * 删除 deleteColumnsData
 */
const handleDelete = ({ id }: { id: number }) => {
	ElMessageBox.confirm('Are you sure to delete this field?', 'Tips', {
		type: 'error',
		confirmButtonText: 'Determine',
		cancelButtonText: 'Cancel',
	})
		.then(async () => {
			const res = await deleteColumnsData(id);
			if (res?.code === 2000) {
				successNotification('Delete successfully');
				fetchData();
			}
		})
		.catch(() => {});
};

const handleChange = (record: AddColumnsDataType) => {
	updateColumnsData(record).then((res: APIResponseData) => {
		successNotification(res.msg || 'Update successful');
	});
};

/**
 * 分页
 */
const handleSizeChange = (limit: number) => {
	searchParams.limit = limit;
	fetchData();
};
const handleCurrentChange = (page: number) => {
	searchParams.page = page;
	fetchData();
};

defineExpose({ fetchData });
</script>

<style lang="scss" scoped>
.columns-table-com {
	height: 100%;
	.ctc-title {
		font-size: 16px;
		font-weight: 900;
		padding-bottom: 10px;
		border-bottom: 1px solid #dcdfe6;
	}
	.ctc-head {
		height: 35px;
		margin-top: 10px;
	}
	.ctc-table {
		width: 100%;
		height: calc(100% - 135px);
		margin: 10px 0;
	}
	.ctc-pagination {
		height: 35px;
	}
}
</style>
