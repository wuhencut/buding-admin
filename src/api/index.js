import axios from 'axios'
import router from '../router'
import {
	Loading,
	Message
} from 'element-ui'

let loadinginstace, // loading
	count = 0; // 计算请求数，控制loding关闭时间
let timer = null;
// http 请求拦截器
axios.interceptors.request.use(config => {
	count++ ;
	if(count == 1){ //只要有请求肯定会 = 1，只要有1 就会展示loading，不用管多少个请求；
		loadinginstace =  Loading.service({
			fullscreen: true
		})
	}

	return config
}, error => {
	loadinginstace.close();
	Message.error({
		message: '请求超时'
	})
	return Promise.reject(error)
})

// http 响应拦截器
axios.interceptors.response.use(res => { // 响应成功关闭 loading
	count--;//成功回调则删除1次，直到为0说明所有请求完成
	if(count == 0){
		loadinginstace.close();
	}
	if (res.status == 401) {
		localStorage.removeItem('token');
		router.push({
			name: 'login'
		});
	}
	return res.data || res;
}, error => {
	if((error + '').indexOf(401) >= 0){
		localStorage.removeItem('token');
		router.push({name: 'login'})
	}
	loadinginstace.close();
	Message.error({
		message: '服务器请求异常'
	})
	return Promise.reject(error)
})

// 测试环境
let BASEURL = 'http://test.manager.patchlinker.com';
if(location.host == 'admin.patchlinker.com'){ // 判断线上环境url
	BASEURL = 'http://manager.patchlinker.com';
}

// 业务接口
let post = (path, data) => {
	let url = BASEURL + path;
	return axios({
		method: 'POST',
		url: url,
		headers: {
			'Token': localStorage.getItem('token'),
			'User-Id': localStorage.getItem('user_id')
		},
		data: {
			data: data || {}
		}
	})
}

let loginPost = (path, data) => {
	let url = BASEURL + path;
	return axios({
		method: 'POST',
		url: url,
		data: {
			data: data || {}
		}
	})
}

export default {
	login(data) {
		return loginPost('/v1/management/user/login', data)
	},
	// 用户列表
	searchUserList(data){
		return post('/v1/management/app-user/list', data)
	},
	// 实名认证
	authList(data){
		return post('/v1/management/app-user/real-name', data)
	},
	// 实名认证审核
	authVerify(data){
		return post('/v1/management/app-user/real-name/handle', data)
	},
	// 审核信息
	operateInfo(data){
		return post('/v1/management/operate/real-name', data)
	},
	// 反馈信息列表
	feedBackList(data){
		return post('/v1/management/feedback/user-feedback', data)
	},
	// 标记反馈信息
	dealFeedBack(data){
		return post('/v1/management/reports/handle', data)
	},
	// 反馈操作信息
	feedbackOperate(data){
		return post('/v1/management/reports/operate_info', data)
	},
	// 申诉列表
	appealList(data){
		return post('/v1/management/feedback/task-appeal',data)
	},
	// 处理申诉
	dealAppeal(data){
		return post('/v1/management/feedback/task-appeal/handle',data)
	},
	// 申诉操作信息
	appealOpearteInfo(data){
		return post('/v1/management/operate/task-appeal', data)
	},
	// 任务列表
	taskList(data){
		return post('/v1/patchlinker/tasks/search', data)
	},
	// 围观任务列表
	watchTaskList(data){
		return post('/v1/management/tasks/onlooker', data)
	},
	// 围观任务审核
	verifyWatchTask(data){
		return post('/v1/management/tasks/onlooker/handle', data)
	},
	// 围观操作信息
	watchOperateInfo(data){
		return post('/v1/management/tasks/onlooker/operate_info', data)
	},
	// 分类列表
	categoryList(data){
		return post('/v1/management/categories', data)
	},
	// 添加分类
	addCategory(data){
		return post('/v1/management/categories/add', data)
	},
	//分类操作记录
	categoryOperateRecord(data){
		return post('/v1/management/categories/operate_info', data)
	},
	// 删除分类
	delCategory(data){
		return post('/v1/patchlinker/categories/del', data)
	},
	//提现列表
	withdrawList(data){
		return post('/v1/management/app-user/withdraw', data)
	},
	// 标记提现
	handleWithdraw(data){
		return post('/v1/management/app-user/withdraw/handle', data)
	},
	// 提现处理信息
	withdrawOperateInfo(data){
		return post('/v1/management/wallet/withdraw/operate_info', data)
	},
	// 修改补叮用户组
	setAuth(data){
		return post('/v1/management/app/users/budingauthed/handle', data)
	},
	// 任务管理相关
	// 围观中的任务列表
	getWatchList(data){
		return post('/v1/management/tasks/user/onlooker', data)
	},
	// 发布的任务列表
	getPushedList(data){
		return post('/v1/management/task/user/publish', data)
	},
	// 申请的任务列表
	getApplyList(data){
		return post('/v1/management/task/user/doing', data)
	},
	// 用户详情
	getPersonDetail(data){
		return post('/v1/management/app-user/info', data)
	},
	// 修改任务状态
	changeTaskStatus(data){
		return post('/v1/management/task/change', data)
  }, 
  // 附近的任务列表
  getNearTaskList(data){
    return post('/v1/management/task/near', data)
  },
  // 附近的任务详情
  getNearTaskInfo(data){
    return post('/v1/management/task/info', data)
  },
  // 查看用户详情
  getUserInfo(data){
    return post('/v1/management/app-user/info', data)
  }, 
  // 创建用户
  addUser(data){
    return post('/v1/management/app-user/generate', data)
  },
  // 获取oss授权
  getSts(data){
    return post('/v1/management/common/sts', data)
  },
  // 举报列表
  getRepostList(data){
    return post('/v1/management/feedback/task-complain', data)
  },
  // 处理举报信息
  dealReport(data){
    return post('/v1/management/feedback/task-complain/handle', data)
  },
  // 查看操作者信息
  checkOperateInfo(data){
    return post('/v1/management/operate/user-complain', data)
  },
  // 修改补叮认证状态
  changeBudingStatus(data){
    return post('/v1/management/app-user/buding-auth/handle', data)
  },
  // 个人动态列表
  personDoingList(data){
    return post('/v1/management/app-user/moment', data)
  }
}