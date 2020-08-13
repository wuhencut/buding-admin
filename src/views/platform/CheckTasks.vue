<template>
	<div class="page">
		<!--发布的任务-->
		<div class="posted-tasks">
			<div class="page-title">发布的任务</div>
			<el-table :data="pushedList">
				<el-table-column label="任务标题" prop="title"></el-table-column>
				<el-table-column label="任务内容" prop="content">
          <template slot-scope="scope">
            <el-button @click="showInfoClick(scope.row)" type="text">{{scope.row.content}}</el-button>
          </template>
        </el-table-column>
				<el-table-column label="发布时间" prop="publish_time" sortable width="180"></el-table-column>
				<el-table-column label="任务状态" prop="status" sortable sort-by="status">
					<template slot-scope="scope">
						<p v-if="scope.row.status == 0">
							<i class="tip-icon"></i>默认
						</p>
						<p v-if="scope.row.status == 1">
							<i class="tip-icon"></i>待申请
						</p>
						<p v-if="scope.row.status == 2">
							<i class="tip-icon"></i>进行中
						</p>
						<p v-if="scope.row.status == 3">
							<i class="tip-icon"></i>已完成待确认
						</p>
						<p v-if="scope.row.status == 4">
							<i class="tip-icon tip-suc"></i>已完成已确认
						</p>
						<p v-if="scope.row.status == 5">
							<i class="tip-icon"></i>申诉中
						</p>
						<p v-if="scope.row.status == 6">
							<i class="tip-icon"></i>关闭
						</p>
						<!-- <p v-if="scope.row.status == 7">
							<i class="tip-icon tip-suc"></i>开放围观
						</p> -->
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button
							v-if="scope.row.status == 1 || scope.row.status == 2 || scope.row.status == 5 || scope.row.status == 7"
							type="text"
							@click="changeStatus(scope.row)"
						>修改任务状态</el-button>
					</template>
					<!--<el-button type="text">加入推荐</el-button>-->
				</el-table-column>
			</el-table>
			<!--分页-->
			<div class="pagination" v-if="pushedCount > 0">
				<el-pagination
					background
					@current-change="pushCurrentChange"
					:current-page="pushedQuery.page"
					:page-size="pushedQuery.page_size"
					layout="total, prev, pager, next, jumper"
					:total="pushedCount"
				></el-pagination>
			</div>
			<!--分页 end-->
		</div>

    <!-- 任务详情 -->
    <el-dialog :visible.sync="taskInfoDg" title="任务详情">
      <el-form>
        <el-form-item label="任务属性">
          <div class="txt-right">{{currTask.task_type == 'cloud' ? '云任务' : '附近'}}</div>
        </el-form-item>
        <el-form-item label="任务金额">
          <div class="txt-right">{{currTask.price}}</div>
        </el-form-item>
        <el-form-item label="任务完成人">
          <div class="txt-right"></div>
        </el-form-item>
        <el-form-item label="任务内容">
          <div style="padding-left: 16px;" class="txt-right">{{currTask.content}}</div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 申请的任务 -->
		<div class="apply-tasks">
			<div style="margin-top: 20px;" class="page-title">申请的任务</div>
			<el-table :data="applyList">
				<el-table-column label="任务标题" prop="title"></el-table-column>
				<el-table-column label="任务内容" prop="content"></el-table-column>
				<el-table-column label="申请时间" prop="publish_time" sortable width="180"></el-table-column>
				<el-table-column label="任务状态" prop="status" sortable sort-by="status">
					<template slot-scope="scope">
						<p v-if="scope.row.status == 0">
							<i class="tip-icon"></i>默认
						</p>
						<p v-if="scope.row.status == 1">
							<i class="tip-icon"></i>待申请
						</p>
						<p v-if="scope.row.status == 2">
							<i class="tip-icon"></i>进行中
						</p>
						<p v-if="scope.row.status == 3">
							<i class="tip-icon"></i>已完成待确认
						</p>
						<p v-if="scope.row.status == 4">
							<i class="tip-icon tip-suc"></i>已完成已确认
						</p>
						<p v-if="scope.row.status == 5">
							<i class="tip-icon"></i>申诉中
						</p>
						<p v-if="scope.row.status == 6">
							<i class="tip-icon"></i>关闭
						</p>
						<p v-if="scope.row.status == 7">
							<i class="tip-icon tip-suc"></i>开放围观
						</p>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button
							v-if="scope.row.status == 1 || scope.row.status == 2 || scope.row.status == 5 || scope.row.status == 7"
							type="text"
							@click="changeStatus(scope.row)"
						>修改任务状态</el-button>
					</template>
					<!--<el-button type="text">加入推荐</el-button>-->
				</el-table-column>
			</el-table>
			<!--分页-->
			<div class="pagination" v-if="applyCount > 0">
				<el-pagination
					background
					@current-change="applyCurrentChange"
					:current-page="applyQuery.page"
					:page-size="applyQuery.page_size"
					layout="total, prev, pager, next, jumper"
					:total="applyCount"
				></el-pagination>
			</div>
			<!--分页 end-->
		</div>

		<el-dialog title="修改任务状态" :visible.sync="showStatusDialog">
			<el-radio-group v-model="radioStatus">
				<el-radio v-if="currStatus == 1 || currStatus == 2 || currStatus == 5" :label="4">已完成</el-radio>
				<el-radio :label="6">关闭</el-radio>
			</el-radio-group>
			<div style="margin-top: 50px;">
				<el-button type="primary" @click="saveClick">确认</el-button>
				<el-button @click="showStatusDialog = false">取消</el-button>
			</div>
		</el-dialog>

		<!-- <modify-record :record="list"></modify-record> -->
	</div>
</template>

<script>
import moment from "moment";
import ModifyRecord from "../../components/ModifyRecord.vue";
export default {
	components: {
		ModifyRecord
	},
	name: "CheckTasks",
	data() {
		return {
      taskInfoDg: false, // 任务详情dg
			moment: moment,
			list: [],
			search: {
				page_id: 1,
				page_size: 10
			},
			showStatusDialog: false, // 修改任务
			watchDialog: false, // 围观权限
			adminStatus: "",
			pushedList: [], // 发布的任务列表
			applyList: [], // 申请的任务
			watchList: [], // 围观的任务
			watchQuery: {
				user_id: this.$route.query.user_id,
				page: 1,
				page_size: 10
			},
			pushedQuery: {
				user_id: this.$route.query.user_id,
				page: 1,
				page_size: 10
			},
			applyQuery: {
				user_id: this.$route.query.user_id,
				page: 1,
				page_size: 10
			},
			watchCount: 0, // 围观任务数
			pushedCount: 0, // 发布的任务数
			applyCount: 0, // 申请的任务数，
			currStatus: -1, // 当前任务的状态
			currId: "", // 当前id
      radioStatus: -1, // 选择的按钮状态
      currTask: {}, // 当前点击展示的任务详情
		};
	},
	mounted() {
		this.initList();
	},
	methods: {
    showInfoClick(data){
      this.currTask = data;
      this.taskInfoDg = true;

    },
		async initList() {
			// let res = await this.$api.getWatchList(this.watchQuery);
			let res1 = await this.$api.getPushedList(this.pushedQuery);
			let res2 = await this.$api.getApplyList(this.applyQuery);
			if (res1.code == 200 && res2.code == 200) {
				// this.watchList = res.data.tasks;
				// this.watchCount = res.data.count || 0;
				this.pushedList = res1.data.tasks;
				this.pushedCount = res1.data.count;
				this.applyList = res2.data.tasks;
				this.applyCount = res2.data.count;
			} else {
				this.$message.error(res1.msg + "," + res2.msg);
			}
		},
		// 跳转
		pushCurrentChange(val) {
			this.pushedQuery.page = val;
			this.initList();
		},
		applyCurrentChange(val) {
			this.applyQuery.page = val;
			this.initList();
		},
		watchCurrentChange(val) {
			this.watchQuery.page = val;
			this.initList();
		},
		// 修改任务状态
		changeStatus(data) {
			this.currStatus = data.status;
			this.radioStatus = this.currStatus;
			this.currId = data.task_id;
			this.showStatusDialog = true;
		},
		async saveClick() {
			let res = await this.$api.changeTaskStatus({
				task_id: this.currId,
				status: this.radioStatus
			});
			if (res.code == 200) {
				this.showStatusDialog = false;
				this.initList();
			} else {
				this.$message.error(res.msg);
			}
		}
	}
};
</script>

<style scoped>
.pagination {
	text-align: center;
	margin-top: 20px;
}
.txt-right {
	text-align: right;
}
</style>