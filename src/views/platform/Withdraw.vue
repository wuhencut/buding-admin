<template>
    <div class="page">
        <div class="page-title">提现请求列表</div>
        <!-- <el-form inline>
          <el-form-item>
            <i class="el-icon-warning" style="color: #409EFF; margin-right: 10px;"></i>已选择{{selectedList.length}}项
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="clearSelect">清空</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button @click="verify">标记所有已选条目</el-button>
          </el-form-item>
        </el-form> -->
        <el-table ref="multipleTable" :data="list" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" :selectable="checkRowStatus"></el-table-column>
            <el-table-column prop="nickname" label="用户昵称"></el-table-column>
            <el-table-column prop="real_name" label="用户姓名" width="200"></el-table-column>
            <el-table-column prop="ali_pay_account" label="支付宝账户"></el-table-column>
            <el-table-column prop="money" label="提现金额"></el-table-column>
            <el-table-column prop="status" label="状态" sortable>
                <template slot-scope="scope">
                    <p v-if="scope.row.status == 1"><i class="tip-icon"></i>提现中</p>
                    <p v-if="scope.row.status == 2"><i class="tip-icon tip-suc"></i>提现成功</p>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="申请时间" width="180" sortable sort-by="applyTime">
                <template slot-scope="scope">
                    {{moment(scope.row.updated_at * 1000).format("YYYY-MM-DD HH:mm:ss")}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status == 1" type="text" @click="verify(scope.row.id)">标记为已处理</el-button>
                    <el-button v-else @click="showInfoClick(scope.row.id)" type="text">已处理</el-button>
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
        <!--查看处理信息-->
        <el-dialog title="查看处理信息" :visible.sync="showInfo">
            <el-form ref="form">
                <el-form-item label="操作人">
                    <div class="txt-right">{{operateInfo.operate_nickname}}</div>
                </el-form-item>
                <el-form-item label="操作时间">
                    <div class="txt-right">{{moment(operateInfo.operated_at * 1000).format('YYYY.MM.DD')}}</div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
	import authList from "../../mockData/authList.json"
	import moment from "moment"

	export default {
		name: "Withdraw",
		data() {
			return {
        total: 100,
				operateInfo: {},
				moment: moment,
				list: [], // 列表
				showInfo: false, // 展示审核信息
				selectedList: [], // 选中的列表
				search: {
					page: 1,
					page_size: 10,
				},
				showReportDialog: false,
				showFeedBackDialog: false
			}
		},
		mounted() {
			this.queryList();
		},
		methods: {
			// 查询列表
			async queryList() {
        let res = await this.$api.withdrawList(this.search);
        if(res.code == 200){
          this.list = res.data.list || [];
          this.total = res.data.count
        } else {
          this.$message.error(res.msg)
        }
			},
			// 点击展示审核信息
			async showInfoClick(id) {
				let res = await this.$api.withdrawOperateInfo({id: id})
          if(res.code == 200){
            this.operateInfo = res.data;
            this.showInfo = true;
          } else {
					  this.$message.error(res.msg)
          }
			},
			// 点击checkbox事件
			handleSelectionChange(val) {
				this.selectedList = val;
			},
			// 清空选择
			clearSelect() {
				this.$refs.multipleTable.clearSelection();
			},
			// 审核
			async verify(id) {
				this.$confirm('确认处理该条提现？', '提示', {
					confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                	let res = await this.$api.handleWithdraw({id: id});
                	if(res.code == 200){
                		this.$message.success('处理成功');
                		this.queryList()
                    } else {
                		this.$message.error(res.msg)
                    }
                })
			},
			// 跳转
			handleCurrentChange(val) {
				this.search.page = val;
				this.queryList();
			},
			// 查看是否可被勾选
			checkRowStatus(row){
				if(row.status != 1){
					return false
				} else {
					return true;
				}
			}
		}
	}
</script>

<style less scoped>
    .txt-right{
        text-align: right;
    }
    .pagination {
        text-align: center;
        margin-top: 20px;
    }
</style>