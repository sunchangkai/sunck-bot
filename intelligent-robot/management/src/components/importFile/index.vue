<template>
  <div style="display: inline-block">
    <el-button size="default" type="success" @click="handleImport()">
      <slot>上传</slot>
    </el-button>
    <el-dialog :title="props.upload.title" v-model="uploadShow" width="400px" append-to-body>
      <div v-loading="loading">
        <el-upload
            ref="uploadRef"
            multiple
			:limit=5
            :headers="props.upload.headers"
            :action="props.upload.url"
            :disabled="isUploading"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :auto-upload="false"
            drag
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <template #tip>
			  <div  class="el-upload__tip" style="color:red">提示：最多允许同时上传5个文件！</div>
          </template>
        </el-upload>
      </div>
      <template #footer>
      <div  class="dialog-footer">
        <el-button type="primary" :disabled="loading" @click="submitFileForm">确 定</el-button>
        <el-button :disabled="loading" @click="cancelUpload">取 消</el-button>
      </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="importFile">
import { request, downloadFile } from '/@/utils/service';
import {inject,ref} from "vue";
import { getBaseURL } from '/@/utils/baseUrl';
import { Session } from '/@/utils/storage';
import {  ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
const refreshView = inject('refreshView')

let props = defineProps({
  upload: {
    type: Object,
    default () {
      return {
        // 是否显示弹出层
        open: true,
        // 弹出层标题
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'JWT ' + Session.get('token') },
        // 上传的地址
        url: getBaseURL() + 'api/system/file/'
      }
    }
  },
  api: { // 导入接口地址
    type: String,
    default () {
      return undefined
    }
  },
  datasource_id: {
	type: Number,
    default (){
		return 0
    }
  },
})

let loading = ref(false)
const uploadRef = ref()
const uploadShow = ref(false)
const isUploading = ref(false)
let theory_num = 0
let success_num = 0
let execute_num = 0
/** 导入按钮操作 */
const handleImport = function () {
  uploadShow.value = true
}

// 文件上传中处理
const handleFileUploadProgress=function (event:any, file:any, fileList:any) {
  theory_num++
  isUploading.value = true
}
// 文件上传成功处理
const handleFileSuccess=function (response:any, file:any, fileList:any) {
	
  isUploading.value = false
  loading.value = true
  // uploadRef.value.clearFiles()
  // // 是否更新已经存在的用户数据
  // return request({
  //   url: props.api + 'upload_data/',
  //   method: 'post',
  //   data: {
  // 	  datasource_id: props.datasource_id,
  // 	  name: response.data.name,
  // 	  url: response.data.url,
  // 	  file_url: response.data.file_url,
  // 	  size: response.data.size
  //   }
  // }).then((response:any) => {
  //   loading.value = false
  //   ElMessageBox.alert('导入成功', '导入完成', {
  //     confirmButtonText: 'OK',
  //     callback: (action: Action) => {
  //       refreshView()
  //     },
  //   })
  // }).catch(()=>{
  //   loading.value = false
  // })
  
  request({
    url: props.api + 'upload_data/',
    method: 'post',
    data: {
  	  datasource_id: props.datasource_id,
  	  name: response.data.name,
  	  url: response.data.url,
  	  file_url: response.data.file_url,
  	  size: response.data.size
    }
  }).then((response:any) => {
	  if (response.msg === "Upload success") {
		  success_num++
	  }
  }).finally(() => {
	  execute_num++
	  if (execute_num === theory_num) {
		if (execute_num === success_num) {
			ElMessageBox.alert(success_num+'个文件导入成功', '导入完成', {
			  confirmButtonText: 'OK',
			  callback: (action: Action) => {
			    refreshView()
			  },
			})
		} else {
			ElMessageBox.alert(execute_num-success_num+'个文件导入失败', '导入失败', {
			  confirmButtonText: 'OK',
			  callback: (action: Action) => {
			    refreshView()
			  },
			})
		}
		execute_num = 0
		theory_num = 0
		success_num = 0
		uploadRef.value.clearFiles()
		loading.value = false
	  } 
  })
}
// 提交上传文件
const submitFileForm=function () {
  uploadRef.value.submit()
}

const cancelUpload =function () {
	uploadShow.value = false
	uploadRef.value.clearFiles()
}

</script>

<style scoped>

</style>
