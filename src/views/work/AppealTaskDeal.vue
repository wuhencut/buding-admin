<template>
	<div class="page">
		<div class="page-title">申诉任务处理</div>
		<el-table ref="multipleTable" :data="list">
			<el-table-column prop="publisher_nickname" label="发布人昵称"></el-table-column>
			<el-table-column prop="publisher_phone" label="手机号"></el-table-column>
			<el-table-column prop="content" label="提交信息" width="200">
				<template slot-scope="scope">
					<!--<el-popover-->
					<!--placement="right"-->
					<!--width="200"-->
					<!--trigger="click"-->
					<!--:content="scope.row.IDCode">-->
					<!--<el-button type="text" slot="reference">举报信息</el-button>-->
					<!--</el-popover>-->
					<el-button type="text" @click="showAppealContent(scope.row)">申诉：【{{scope.row.task_title}}】</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="finisher_nickname" label="完成人昵称"></el-table-column>
			<el-table-column prop="status" label="状态" sortable>
				<template slot-scope="scope">
					<p v-if="scope.row.status == 1">
						<i class="tip-icon tip-fail"></i>冻结
					</p>
					<p v-if="scope.row.status == 2">
						<i class="tip-icon tip-suc"></i>已处理
					</p>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="申请时间" width="180" sortable sort-by="applyTime">
				<template
					slot-scope="scope"
				>{{moment(scope.row.created_at * 1000).format("YYYY-MM-DD HH:mm:ss")}}</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<!--v-if="scope.row.status == 1"-->
					<el-button v-if="scope.row.status == 1" @click="verify(scope.row.id)" type="text">标记为已处理</el-button>
					<el-button v-else @click="showInfoClick(scope.row.id)" type="text">处理信息</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页-->
		<div class="pagination">
      <el-pagination background @current-change="handleCurrentChange" :current-page="search.page"
      :page-size="search.page_size"
      layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
		</div>
		<!--分页 end-->
		<el-dialog title="查看处理信息" :visible.sync="showInfo">
			<el-form ref="form">
				<el-form-item label="操作人">
					<div class="txt-right">{{operateInfo.operate_nickname}}</div>
				</el-form-item>
				<el-form-item label="操作时间">
					<div class="txt-right">{{moment(operateInfo.operated_at * 1000).format('YYYY-MM-DD')}}</div>
				</el-form-item>
				<el-form-item label="处理备注">
					<el-input type="textarea" disabled :value="operateInfo.operate_reason"></el-input>
				</el-form-item>
			</el-form>
		</el-dialog>

		<el-dialog title="查看申诉信息" :visible.sync="showAppealInfo">
			<el-form ref="form">
				<el-form-item label="用户昵称">
					<div class="txt-right">{{currAppealInfo.appealer_nickname}}</div>
				</el-form-item>
				<el-form-item label="申诉时间">
					<div
						class="txt-right"
					>{{moment(currAppealInfo.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}}</div>
				</el-form-item>
				<el-form-item label="用户手机号">
					<div class="txt-right">{{currAppealInfo.appealer_phone}}</div>
				</el-form-item>
				<el-form-item label="申诉原因">
					<el-input type="textarea" disabled :value="currAppealInfo.appealer_content"></el-input>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import moment from "moment";

export default {
	name: "AppealTaskDeal",
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
			showAppealInfo: false, // 查看申诉信息
			operateInfo: {}, // 操作信息
			currAppealInfo: {} // 申诉详情
		};
	},
	mounted() {
		this.queryList();
	},
	methods: {
		// 查询列表
		async queryList() {
			let res = await this.$api.appealList();
			if (res.code == 200) {
        this.list = res.data.list;
        this.total = res.data.count;
			} else {
				this.$message.error(res.msg);
			}
		},
		// 点击展示审核信息
		async showInfoClick(id) {
			let res = await this.$api.appealOpearteInfo({ id: id });
			if (res.code == 200) {
				this.showInfo = true;
				this.operateInfo = res.data;
			} else {
				this.$message.error(res.msg);
			}
		},
		// 审核
		async verify(id) {
			let req = this.selectedList;
			this.$prompt("", "填写处理备注", {
				confirmButtonText: "确定",
				cancelButtonText: "取消"
			}).then(async val => {
				if (!val.value) {
					this.$message.error("填写处理信息");
					return false;
				} else {
					let res = await this.$api.dealAppeal({
						id: id,
						reason: val.value
					});
					if (res.code == 200) {
						this.$message.success("处理成功");
						this.showInfo = false;
						this.queryList();
					} else {
						this.$message.error(res.msg);
					}
				}
			});
		},
		// 跳转
		handleCurrentChange(val) {
			this.search.page = val;
			this.queryList();
		},
		// 申诉内容展示
		showAppealContent(data) {
			this.showAppealInfo = true;
			this.currAppealInfo = data;
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