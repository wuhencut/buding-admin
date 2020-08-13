<template>
	<div class="page">
		<div class="page-title">反馈信息处理</div>
		<!-- <el-form inline>
			<el-form-item>
				<i class="el-icon-warning" style="color: #409EFF; margin-right: 10px;"></i>
				已选择{{selectedList.length}}项
			</el-form-item>
			<el-form-item style="float: right">
				<el-button @click="verify('')">标记所有已选条目</el-button>
			</el-form-item>
		</el-form> -->
		<el-table :data="list">
			<!-- <el-table-column type="selection" width="55" :selectable="checkRowStatus"></el-table-column> -->
			<el-table-column prop="user_name" label="用户昵称"></el-table-column>
			<el-table-column prop="report_content" label="提交信息" width="200">
				<template slot-scope="scope">
					<el-button
						type="text"
						@click="showReportDialog = true; currReportInfo = scope.row"
					>反馈：【{{scope.row.content}}】</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" sortable>
				<template slot-scope="scope">
					<p v-if="scope.row.status == 1">
						<i class="tip-icon"></i>待处理
					</p>
					<p v-if="scope.row.status == 2">
						<i class="tip-icon tip-suc"></i>已处理
					</p>
				</template>
			</el-table-column>
			<el-table-column prop="create_time" label="申请时间" width="180" sortable sort-by="create_time"></el-table-column>
			<!-- <el-table-column label="操作">
				<template slot-scope="scope">
					<el-button v-if="scope.row.status == 1" type="text" @click="verify(scope.row.user_id)">标记为已处理</el-button>
					<el-button v-else @click="showInfoClick(scope.row.id)" type="text">已处理</el-button>
				</template>
			</el-table-column> -->
		</el-table>
		<!--分页-->
		<div class="pagination">
			<el-pagination
				background
				@current-change="handleCurrentChange"
				:current-page="search.page"
				:page-size="search.page_size"
				layout="total, prev, pager, next, jumper"
				:total="total"
			></el-pagination>
		</div>
		<!--分页 end-->
		<!--查看处理信息-->
		<el-dialog title="查看处理信息" :visible.sync="showInfo">
			<el-form ref="form">
				<el-form-item label="操作人">
					<div class="txt-right">{{operateInfo.operate_nickname}}</div>
				</el-form-item>
				<el-form-item label="操作时间">
					<div class="txt-right">{{moment(operateInfo.operated_at * 1000).format('YYYY.MM.DD HH:mm:ss')}}</div>
				</el-form-item>
				<el-form-item label="处理备注">
					<el-input type="textarea" disabled :value="operateInfo.operate_reason"></el-input>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--查看举报信息-->
		<el-dialog title="查看举报信息" :visible.sync="showReportDialog">
			<el-form ref="form">
				<el-form-item label="举报人">
					<div class="txt-right">{{currReportInfo.user_name}}</div>
				</el-form-item>
				<el-form-item label="举报时间">
					<div
						class="txt-right"
					>{{currReportInfo.create_time}}</div>
				</el-form-item>
        <el-form-item label="内容">
          <div class="txt-right">{{currReportInfo.content}}</div>
        </el-form-item>
				<!-- <el-form-item label="任务标题">
					<div class="txt-right">{{currReportInfo.task_title}}</div>
				</el-form-item> -->
				<!-- <el-form-item label="发布人昵称">
					<div class="txt-right">{{currReportInfo.publisher_nickname}}</div>
				</el-form-item>
				<el-form-item label="发布人手机号">
					<div class="txt-right">{{currReportInfo.publisher_phone}}</div>
				</el-form-item> -->
				<!-- <el-form-item label="任务内容">
					<el-input type="textarea" disabled :value="currReportInfo.task_content"></el-input>
				</el-form-item> -->
				<!-- <el-form-item label="举报原因">
					<el-input type="textarea" disabled :value="currReportInfo.report_content"></el-input>
				</el-form-item> -->
			</el-form>
		</el-dialog>
		<!--查看反馈信息-->
		<el-dialog title="查看反馈信息" :visible.sync="showFeedBackDialog">
			<el-form ref="form">
				<el-form-item label="用户昵称">
					<div class="txt-right">111</div>
				</el-form-item>
				<el-form-item label="反馈时间">
					<div class="txt-right">2019-1-1</div>
				</el-form-item>
				<el-form-item label="用户手机号">
					<div class="txt-right">135777777</div>
				</el-form-item>
				<el-form-item label="反馈内容">
					<el-input type="textarea" disabled value="驳回理由"></el-input>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import authList from "../../mockData/authList.json";
import moment from "moment";

export default {
	name: "FeedbackInfoDeal",
	data() {
		return {
      total: 10,
			moment: moment,
			list: [], // 列表
			showInfo: false, // 展示审核信息
			selectedList: [], // 选中的列表
			search: {
				page: 1,
				page_size: 20
			},
			showReportDialog: false,
			showFeedBackDialog: false,
			selectedIds: [],
			operateInfo: {}, // 操作者信息
			currReportInfo: {} // 当前举报信息
		};
	},
	mounted() {
		this.queryList();
	},
	methods: {
		// 查询列表
		async queryList() {
			let res = await this.$api.feedBackList();
			if (res.code == 200) {
				this.list = res.data.list;
				this.total = res.data.count || 0;
			} else {
				this.$message.error(res.msg);
			}
		},
		// 点击展示审核信息
		async showInfoClick(id) {
			let res = await this.$api.feedbackOperate({ id: id });
			if (res.code == 200) {
				this.operateInfo = res.data;
				this.showInfo = true;
			} else {
				this.$message.error(res.msg);
			}
		},
		// 点击checkbox事件
		handleSelectionChange(val) {
			this.selectedList = val;
			if (this.selectedList.length > 0) {
				for (let i = 0; i < this.selectedList.length; i++) {
					this.selectedIds[i] = this.selectedList[i].id;
				}
			} else {
				this.selectedIds = [];
			}
		},
		// 清空选择
		clearSelect() {
			this.$refs.multipleTable.clearSelection();
		},
		// 审核
		async verify(id) {
			if (!id && this.selectedIds.length == 0) {
				this.$message.error("请选择要处理的条目");
				return false;
			}
			let ids = [];
			if (id) {
				ids = [id];
			} else {
				ids = this.selectedIds;
			}
			this.$prompt("", "填写处理备注", {
				confirmButtonText: "确定",
				cancelButtonText: "取消"
			}).then(async val => {
				if (!val.value) {
					this.$message.error("填写处理信息");
					return false;
				} else {
					let res = await this.$api.dealFeedBack({
						ids: ids,
						reason: val.value
					});
					if (res.code == 200) {
						this.$message.success("处理成功");
						this.queryList();
					} else {
						this.$message.error(res.msg);
					}

					// this.showInfo = false;
				}
			});
		},
		// 跳转
		handleCurrentChange(val) {
			this.search.page = val;
			this.queryList();
		},
		// 查看是否可被勾选
		checkRowStatus(row) {
			if (row.status != 1) {
				return false;
			} else {
				return true;
			}
		}
	}
};
</script>

<style less scoped>
.txt-right {
	text-align: right;
}
.pagination {
	text-align: center;
	margin-top: 20px;
}
</style>