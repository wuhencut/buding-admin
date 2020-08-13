<template>
    <div class="page">
        <el-table :data="list">
            <el-table-column prop="nickname" label="用户昵称"></el-table-column>
            <el-table-column prop="IDCode" label="手机号" width="200"></el-table-column>
            <el-table-column prop="status" label="用户余额"></el-table-column>
            <el-table-column prop="status" label="开放申请的任务数"></el-table-column>
            <el-table-column label="操作" prop="11">
                <el-button @click="taskClick" type="text">任务操作</el-button>
                <!--<el-button type="text" @click="letterClick">查看私信</el-button>-->
            </el-table-column>
        </el-table>
        <el-dialog title="开放申请任务" :visible.sync="taskApplyDialog">
            <!--开放申请任务-->
            <div v-for="item in 3">
                <div class="task-item">
                    <p class="task-title">任务标题</p>
                    <div class="apply-person flex" v-for="i in 3">
                        <span class="name flex-s1">申请人1</span>
                        <!--<el-button type="success" class="float-right">接受</el-button>-->
                    </div>
                </div>
            </div>
            <!--进行中的任务-->
            <div>
                <p style="font-weight: bold; font-size: 18px">进行中的任务</p>
                <div v-for="item in 2">
                    <div class="task-title flex" style="margin-top: 20px;">
                        <span class="flex-s1">任务标题</span>
                        <el-button style="padding: 10px">确认完成</el-button>
                    </div>
                    <div class="flex">
                        <span class="flex-s1 apply-person">完成人昵称</span>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="查看私信" :visible.sync="letterDialog">
            <div v-for="item in 2">
                <div class="task-title flex">
                    <span class="flex-s1">用户昵称</span> 私信时间
                </div>
                <div class="letter-content">
                    私信内容私信内容私信内容私信内容私信内容私信内容私信内容私信内容
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import authList from "../../mockData/authList.json"
	import moment from "moment"

	export default {
		name: "Account", // 平台账户管理
		data() {
			return {
				moment: moment,
				list: authList, // 列表
				taskApplyDialog: false, // 任务申请dialog
				letterDialog: false, // 查看私信dialog
			}
		},
		mounted() {
			this.queryList()
		},
		methods: {
			searchBtnClick() {
				this.queryList();
			},
			// 查询列表
			async queryList() {

			},
			// 点击展示审核信息
			async taskClick() {
				this.taskApplyDialog = true;
			},

			letterClick() {
				this.letterDialog = true;
			}
		}
	}
</script>

<style lang="less" scoped>
    .pagination {
        text-align: center;
        margin-top: 20px;
    }

    .txt-right {
        text-align: right;
    }

    .flex-s1 {
        flex: 1
    }

    .flex {
        display: flex;
    }

    .task-title {
        font-weight: bold;
        border-bottom: 1px solid #ececec;
        padding: 10px 0;
    }

    .float-right {
        float: right;
    }

    .apply-person {
        padding-top: 10px;
    }
    .letter-content{
        padding: 20px 0;
        color: #a0a0a0;
    }

    .name{
        line-height: 40px;
    }
</style>