<template>
    <fs-page>
        <fs-crud ref="crudRef" v-bind="crudBinding">
			<template #actionbar-right>
				<importFile api="api/management/document/" v-auth="'document:Import'" :datasource_id="datasource_id">上传</importFile>
			</template>
		</fs-crud>
    </fs-page>
</template>

<script lang="ts" setup name="document">
import {ref, onMounted} from 'vue';
import {useFs} from '@fast-crud/fast-crud';
import {createCrudOptions} from './crud';
import importFile from '/@/components/importFile/index.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
let datasource_id = 112

const {crudBinding, crudRef, crudExpose} = useFs({createCrudOptions});

// 页面打开后获取列表数据
onMounted(() => {
	datasource_id = parseInt(router.currentRoute.value.query.datasource_id)
    crudExpose.doRefresh();
});
</script>
