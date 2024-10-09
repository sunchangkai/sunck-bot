<template>
    <fs-page>
        <fs-crud ref="crudRef" v-bind="crudBinding"></fs-crud>
    </fs-page>
</template>

<script lang="ts" setup name="datasource">
import {ref, onMounted} from 'vue';
import {useFs} from '@fast-crud/fast-crud';
import {createCrudOptions} from './crud';
import { useRouter } from 'vue-router'

const router = useRouter()


const pushDocumenPage = (row: any) => {
	router.push({
		path: "/api/document",
		query: {
			datasource_id: row.id
		}
	})
};

const {crudBinding, crudRef, crudExpose} = useFs({createCrudOptions, pushDocumenPage});



// 页面打开后获取列表数据
onMounted(() => {
    crudExpose.doRefresh();
});
</script>
