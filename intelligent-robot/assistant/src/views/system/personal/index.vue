<template>
	<div class="personal layout-pd">
		<el-row>
			<!-- 个人信息 -->
			<el-col :xs="24" :sm="16">
				<el-card shadow="hover" header="个人信息">
					<div class="personal-user">
						<div class="personal-user-left">
							<avatarSelector v-model="selectImgVisible" @uploadImg="uploadImg" ref="avatarSelectorRef"></avatarSelector>
						</div>
						<div class="personal-user-right">
							<el-row>
								<el-col :span="24" class="personal-title mb18"
									>{{ currentTime }}，{{ state.personalForm.username }}
								</el-col>
								<el-col :span="24">
									<el-row>
										<el-col :xs="24" :sm="8" class="personal-item mb6">
											<div class="personal-item-label">Nickname：</div>
											<div class="personal-item-value">{{ state.personalForm.name }}</div>
										</el-col>
										<el-col :xs="24" :sm="16" class="personal-item mb6">
											<div class="personal-item-label">Dept：</div>
											<div class="personal-item-value">
												<el-tag>{{ state.personalForm.dept_info.dept_name }}</el-tag>
											</div>
										</el-col>
									</el-row>
								</el-col>
								<el-col :span="24">
									<el-row>
										<el-col :xs="24" :sm="24" class="personal-item mb6">
											<div class="personal-item-label">Role：</div>
											<div class="personal-item-value">
												<el-tag v-for="(item, index) in state.personalForm.role_info" :key="index">{{ item.name }}</el-tag>
											</div>
										</el-col>
									</el-row>
								</el-col>
							</el-row>
						</div>
					</div>
				</el-card>
			</el-col>

			<!-- 消息通知 -->
			<el-col :xs="24" :sm="8" class="pl15 personal-info">
				<el-card shadow="hover">
					<template #header>
						<span>Message notification</span>
						<span class="personal-info-more" @click="msgMore">More</span>
					</template>
					<div class="personal-info-box">
						<ul class="personal-info-ul">
							<li v-for="(v, k) in state.newsInfoList" :key="k" class="personal-info-li">
								<div class="personal-info-li-title">[{{ v.creator_name }},{{ v.create_datetime }}] {{ v.title }}</div>
							</li>
						</ul>
					</div>
				</el-card>
			</el-col>

			<!-- 更新信息 -->
			<el-col :span="24">
				<el-card shadow="hover" class="mt15 personal-edit" header="Update information">
					<div class="personal-edit-title">Basic Information</div>
					<el-form :model="state.personalForm" ref="userInfoFormRef" :rules="rules" size="default" label-width="50px" class="mt35 mb35">
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="Name" prop="name">
									<el-input v-model="state.personalForm.name" placeholder="Please enter nickname" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="Email">
									<el-input v-model="state.personalForm.email" placeholder="Please enter email" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="Mobile" prop="mobile">
									<el-input v-model="state.personalForm.mobile" placeholder="Please enter mobile phone" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="Gender">
									<el-select v-model="state.personalForm.gender" placeholder="Please select gender" clearable class="w100">
<!--										<el-option label="男" :value="1"></el-option>-->
<!--										<el-option label="女" :value="0"></el-option>-->
<!--										<el-option label="保密" :value="2"></el-option>-->
                    <el-option v-for="(item,index) in genderList" :key="index" :label="item.label" :value="item.value"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
								<el-form-item>
									<el-button type="primary" @click="submitForm">
										<el-icon>
											<ele-Position />
										</el-icon>
										Updating Personal Information
									</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<div class="personal-edit-title mb15">Account Security</div>
					<div class="personal-edit-safe-box">
						<div class="personal-edit-safe-item">
							<div class="personal-edit-safe-item-left">
								<div class="personal-edit-safe-item-left-label">Account Password</div>
								<div class="personal-edit-safe-item-left-value">Current Password Strength：strong</div>
							</div>
							<div class="personal-edit-safe-item-right">
								<el-button text type="primary" @click="passwordFormShow = true">Modify now</el-button>
							</div>
						</div>
					</div>
					<div class="personal-edit-safe-box">
						<div class="personal-edit-safe-item">
							<div class="personal-edit-safe-item-left">
								<div class="personal-edit-safe-item-left-label">Secret cell phone</div>
								<div class="personal-edit-safe-item-left-value">Tied cell phone：{{ state.personalForm.mobile }}</div>
							</div>
							<div class="personal-edit-safe-item-right">
								<!--                <el-button text type="primary">立即修改</el-button>-->
							</div>
						</div>
					</div>

					<div class="personal-edit-safe-box">
						<div class="personal-edit-safe-item">
							<div class="personal-edit-safe-item-left">
								<div class="personal-edit-safe-item-left-label">Binding the mailbox</div>
								<div class="personal-edit-safe-item-left-value">Bound mailbox：{{ state.personalForm.email }}</div>
							</div>
							<div class="personal-edit-safe-item-right">
								<!--                <el-button text type="primary">立即设置</el-button>-->
							</div>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<!--    密码修改-->
		<el-dialog v-model="passwordFormShow" title="Change password ">
			<el-form
				ref="userPasswordFormRef"
				:model="userPasswordInfo"
				required-asterisk
				label-width="100px"
				label-position="left"
				:rules="passwordRules"
				center
			>
				<el-form-item label="Original" required prop="oldPassword">
					<el-input v-model="userPasswordInfo.oldPassword" placeholder="Please enter the original password" clearable></el-input>
				</el-form-item>
				<el-form-item required prop="newPassword" label="New">
					<el-input type="password" v-model="userPasswordInfo.newPassword" placeholder="Please enter a new password" show-password clearable></el-input>
				</el-form-item>
				<el-form-item required prop="newPassword2" label="Confirm">
					<el-input type="password" v-model="userPasswordInfo.newPassword2" placeholder="Please enter the new password again" show-password clearable></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="settingPassword"> <i class="fa fa-check"></i>Submit</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="personal">
import { reactive, computed, onMounted, ref, defineAsyncComponent } from 'vue';
import { formatAxis } from '/@/utils/formatTime';
import * as api from './api';
import { ElMessage } from 'element-plus';
import { getBaseURL } from '/@/utils/baseUrl';
import { Session } from '/@/utils/storage';
import { useRouter } from 'vue-router';
import { useUserInfo } from '/@/stores/userInfo';
import { successMessage } from '/@/utils/message';
import {dictionary} from "/@/utils/dictionary";
import {Md5} from "ts-md5";
const router = useRouter();

// 头像裁剪组件
const avatarSelector = defineAsyncComponent(() => import('/@/components/avatarSelector/index.vue'));
const avatarSelectorRef = ref(null);
// 当前时间提示语
const currentTime = computed(() => {
	return formatAxis(new Date());
});
const userInfoFormRef = ref();
const rules = reactive({
	name: [{ required: true, message: 'Please enter nickname', trigger: 'blur' }],
	mobile: [{ pattern: /^1[3-9]\d{9}$/, message: 'Please enter the correct mobile phone number' }],
});

let selectImgVisible = ref(false);

const state = reactive<PersonalState>({
	newsInfoList: [],
	personalForm: {
		avatar: '',
		username: '',
		name: '',
		email: '',
		mobile: '',
		gender: '',
		dept_info: {
			dept_id: 0,
			dept_name: '',
		},
		role_info: [
			{
				id: 0,
				name: '',
			},
		],
	},
});

/**
 * 跳转消息中心
 */
const route = useRouter();
const msgMore = () => {
	route.push({ path: '/messageCenter' });
};

const genderList = ref();
/**
 * 获取用户个人信息
 */
const getUserInfo = function () {
	api.GetUserInfo({}).then((res: any) => {
		const { data } = res;
    genderList.value = dictionary('gender')
		state.personalForm.avatar = data.avatar || '';
		state.personalForm.username = data.username || '';
		state.personalForm.name = data.name || '';
		state.personalForm.email = data.email || '';
		state.personalForm.mobile = data.mobile || '';
		state.personalForm.gender = data.gender;
		state.personalForm.dept_info.dept_name = data.dept_info.dept_name || '';
		state.personalForm.role_info = data.role_info || [];
	});
};

/**
 * 更新用户信息
 * @param formEl
 */
const submitForm = async () => {
	if (!userInfoFormRef.value) return;
	await userInfoFormRef.value.validate((valid, fields) => {
		if (valid) {
			api.updateUserInfo(state.personalForm).then((res: any) => {
				ElMessage.success('Update successful');
				getUserInfo();
			});
		} else {
			ElMessage.error('Form validation failed, check ~');
		}
	});
};

/**
 * 获取消息通知
 */
const getMsg = () => {
	api.GetSelfReceive({}).then((res: any) => {
		const { data } = res;
		state.newsInfoList = data || [];
	});
};
onMounted(() => {
	getUserInfo();
	getMsg();
});

/**************************密码修改部分************************/
const passwordFormShow = ref(false);
const userPasswordFormRef = ref();
const userPasswordInfo = reactive({
	oldPassword: '',
	newPassword: '',
	newPassword2: '',
});

const validatePass = (rule, value, callback) => {
	const pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}');
	if (value === '') {
		callback(new Error('Please enter password'));
	} else if (value === userPasswordInfo.oldPassword) {
		callback(new Error('The original password is the same as the new password'));
	} else if (!pwdRegex.test(value)) {
		callback(new Error('Your password is too low complexity (it must contain letters and numbers)'));
	} else {
		if (userPasswordInfo.newPassword2 !== '') {
			userPasswordFormRef.value.validateField('newPassword2');
		}
		callback();
	}
};
const validatePass2 = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('Please enter your password again'));
	} else if (value !== userPasswordInfo.newPassword) {
		callback(new Error('Two different password entries!'));
	} else {
		callback();
	}
};

const passwordRules = reactive({
	oldPassword: [
		{
			required: true,
			message: 'Please enter the original password',
			trigger: 'blur',
		},
	],
	newPassword: [{ validator: validatePass, trigger: 'blur' }],
	newPassword2: [{ validator: validatePass2, trigger: 'blur' }],
});

/**
 * 重新设置密码
 */
const settingPassword = () => {
	userPasswordFormRef.value.validate((valid) => {
		if (valid) {
			api.UpdatePassword(userPasswordInfo).then((res: any) => {
				ElMessage.success('Password changed successfully');
        setTimeout(() => {
          Session.remove('token');
          router.push('/login');
			}, 1000);
			});
		} else {
			// 校验失败
			// 登录表单校验失败
			ElMessage.error('Form validation failed, please check');
		}
	});
};

const uploadImg = (data: any) => {
	let formdata = new FormData();
	formdata.append('file', data);
	api.uploadAvatar(formdata).then((res: any) => {
		if (res.code === 2000) {
			selectImgVisible.value = false;
			state.personalForm.avatar = getBaseURL() + res.data.url;
			api.updateUserInfo(state.personalForm).then((res: any) => {
				successMessage('Update successful');
				getUserInfo();
				useUserInfo().updateUserInfos();
				// @ts-ignore
				avatarSelectorRef.value.updateAvatar(state.personalForm.avatar);
			});
		}
	});
};
</script>

<style scoped lang="scss">
@import '/@/theme/mixins/index.scss';
.personal {
	.personal-user {
		height: 130px;
		display: flex;
		align-items: center;
		.personal-user-left {
			width: 100px;
			height: 130px;
			border-radius: 3px;
			:deep(.el-upload) {
				height: 100%;
			}
			.personal-user-left-upload {
				img {
					width: 100%;
					height: 100%;
					border-radius: 3px;
				}
				&:hover {
					img {
						animation: logoAnimation 0.3s ease-in-out;
					}
				}
			}
		}
		.personal-user-right {
			flex: 1;
			padding: 0 15px;
			.personal-title {
				font-size: 18px;
				@include text-ellipsis(1);
			}
			.personal-item {
				display: flex;
				align-items: center;
				font-size: 13px;
				.personal-item-label {
					color: var(--el-text-color-secondary);
					@include text-ellipsis(1);
				}
				.personal-item-value {
					@include text-ellipsis(1);
				}
			}
		}
	}
	.personal-info {
		.personal-info-more {
			float: right;
			color: var(--el-text-color-secondary);
			font-size: 13px;
			&:hover {
				color: var(--el-color-primary);
				cursor: pointer;
			}
		}
		.personal-info-box {
			height: 130px;
			overflow: hidden;
			.personal-info-ul {
				list-style: none;
				.personal-info-li {
					font-size: 13px;
					padding-bottom: 10px;
					.personal-info-li-title {
						display: inline-block;
						@include text-ellipsis(1);
						color: var(--el-text-color-secondary);
						text-decoration: none;
					}
					& a:hover {
						color: var(--el-color-primary);
						cursor: pointer;
					}
				}
			}
		}
	}
	.personal-recommend-row {
		.personal-recommend-col {
			.personal-recommend {
				position: relative;
				height: 100px;
				border-radius: 3px;
				overflow: hidden;
				cursor: pointer;
				&:hover {
					i {
						right: 0px !important;
						bottom: 0px !important;
						transition: all ease 0.3s;
					}
				}
				i {
					position: absolute;
					right: -10px;
					bottom: -10px;
					font-size: 70px;
					transform: rotate(-30deg);
					transition: all ease 0.3s;
				}
				.personal-recommend-auto {
					padding: 15px;
					position: absolute;
					left: 0;
					top: 5%;
					color: var(--next-color-white);
					.personal-recommend-msg {
						font-size: 12px;
						margin-top: 10px;
					}
				}
			}
		}
	}
	.personal-edit {
		.personal-edit-title {
			position: relative;
			padding-left: 10px;
			color: var(--el-text-color-regular);
			&::after {
				content: '';
				width: 2px;
				height: 10px;
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				background: var(--el-color-primary);
			}
		}
		.personal-edit-safe-box {
			border-bottom: 1px solid var(--el-border-color-light, #ebeef5);
			padding: 15px 0;
			.personal-edit-safe-item {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.personal-edit-safe-item-left {
					flex: 1;
					overflow: hidden;
					.personal-edit-safe-item-left-label {
						color: var(--el-text-color-regular);
						margin-bottom: 5px;
					}
					.personal-edit-safe-item-left-value {
						color: var(--el-text-color-secondary);
						@include text-ellipsis(1);
						margin-right: 15px;
					}
				}
			}
			&:last-of-type {
				padding-bottom: 0;
				border-bottom: none;
			}
		}
	}
}
</style>
