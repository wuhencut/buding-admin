<template>
	<div class="page">
		<!--<div class="page-title">实名认证审核</div>-->
		<el-form inline>
			<el-form-item label="用户手机号">
				<el-input v-model="search.phone"></el-input>
			</el-form-item>
			<el-form-item label="用户昵称">
				<el-input v-model="search.nickname"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="searchBtnClick">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table ref="multipleTable" :data="list" @selection-change="handleSelectionChange">
			<el-table-column prop="nickname" label="用户昵称"></el-table-column>
			<el-table-column prop="phone" label="手机号" width="200"></el-table-column>
			<el-table-column prop="created_at" label="注册时间" width="180" sortable sort-by="created_at">
        
			</el-table-column>
			<el-table-column prop="real_name_status" label="用户组" sortable>
				<template slot-scope="scope">
					<span v-if="scope.row.real_name_status == 1">
						<i class="tip-icon"></i>未认证实名
					</span>
					<span v-if="scope.row.real_name_status == 2">
						<i class="tip-icon"></i>实名认证中
					</span>
					<span v-if="scope.row.real_name_status == 3">
						<i class="tip-icon tip-suc"></i>实名认证成功
					</span>
					<span v-if="scope.row.real_name_status == 4">
						<i class="tip-icon tip-fail"></i>实名认证失败
					</span>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button @click="showInfoClick(scope.row.user_id)" type="text">查看相关任务</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页-->
		<div class="pagination">
			<el-pagination
				background
				@current-change="handleCurrentChange"
				:current-page="search.page"
				:page-size="search.page_size"
				layout="total, prev, pager, next, jumper"
				:total="count"
			></el-pagination>
		</div>
		<!--分页 end-->
	</div>
</template>

<script>
import authList from "../../mockData/authList.json";
import moment from "moment";
export default {
	name: "TaskManagement",
	data() {
		return {
			record: [1, 2, 3],
			moment: moment,
			list: [], // 列表
			showPic: false, // 展示身份证照片
			showInfo: false, // 展示审核信息
			selectedList: [], // 选中的列表
			search: {
				page: 1,
				page_size: 10,
				phone: "", //手机号
				nickname: "", // 昵称
				only_buding_status: false
			},
			count: 0
		};
	},
	mounted() {
		this.queryList();
	},
	methods: {
		searchBtnClick() {
			this.search.page = 1;
			this.queryList();
		},
		// 查询列表
		async queryList() {
			let res = await this.$api.searchUserList(this.search);
			if (res.code == 200) {
				this.list = res.data.list;
				this.count = res.data.count;
			} else {
				this.$message.error(res.msg);
			}
		},
		// 点击展示审核信息
		async showInfoClick(user_id) {
			this.$router.push({
				name: "checkTasks",
				path: "checkTasks",
				query: { user_id: user_id }
			});
		},
		// 点击checkbox事件
		handleSelectionChange(val) {
			this.selectedList = val;
		},
		// 跳转
		handleCurrentChange(val) {
			this.search.page = val;
			this.queryList();
		}
	}
};
</script>

<style less scoped>
.pagination {
	text-align: center;
	margin-top: 20px;
}
.txt-right {
	text-align: right;
}
</style>