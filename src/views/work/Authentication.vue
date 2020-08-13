<template>
    <div class="page">
        <div class="page-title">实名认证审核</div>
        <el-form inline>
            <el-form-item>
                <i class="el-icon-warning" style="color: #409EFF; margin-right: 10px;"></i>已选择{{selectedList.length}}项
            </el-form-item>
            <!--<el-form-item>-->
            <!--<el-button type="text" @click="clearSelect">清空</el-button>-->
            <!--</el-form-item>-->
            <el-form-item style="float: right">
                <el-button @click="passClick">通过所有已选条目</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="multipleTable" :data="list" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" :selectable="checkRowStatus"></el-table-column>
            <el-table-column prop="nickname" label="昵称"></el-table-column>
            <el-table-column prop="id_card_number" label="身份证号码" width="200"></el-table-column>
            <el-table-column prop="real_name" label="姓名"></el-table-column>
            <el-table-column prop="real_name_status" label="状态" sortable>
                <template slot-scope="scope">
                    <p v-if="scope.row.real_name_status == 2"><i class="tip-icon"></i>待认证</p>
                    <p v-if="scope.row.real_name_status == 3"><i class="tip-icon tip-suc"></i>认证成功</p>
                    <p v-if="scope.row.real_name_status == 4"><i class="tip-icon tip-fail"></i>认证失败</p>
                </template>
            </el-table-column>
            <!--后台获取不到申请时间 先砍了-->
            <!--<el-table-column prop="status" label="申请时间" width="180" sortable sort-by="applyTime">
                <template slot-scope="scope">
                    {{moment(scope.row.applyTime).format("YYYY-MM-DD HH:mm:ss")}}
                </template>
            </el-table-column>-->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <p v-if="scope.row.real_name_status == 2">
                        <el-button @click="rejectClick(scope.row.user_id)" type="text">驳回</el-button>
                        <el-button type="text" @click="showPicClick(scope.row.hand_card_pic)">查看照片</el-button>
                    </p>
                    <el-button @click="showInfoClick(scope.row.user_id, scope.row.hand_card_pic)"
                               v-if="scope.row.real_name_status != 2" type="text">审核信息
                    </el-button>
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

        <el-dialog title="身份证照片" :visible.sync="showPic">
            <img :src="currPic" alt="" width="100%">
        </el-dialog>
        <el-dialog title="审核信息" :visible.sync="showInfo">
            <el-form ref="form">
                <el-form-item label="操作人">
                    <div class="txt-right">{{currInfo.operate_nickname}}</div>
                </el-form-item>
                <el-form-item label="操作时间">
                    <div v-if="currInfo.operated_at" class="txt-right">{{moment(currInfo.operated_at * 1000).format('YYYY.MM.DD HH:mm:ss')}}</div>
                </el-form-item>
                <el-form-item label="原因">
                    <el-input type="textarea" disabled :value="currInfo.operate_reason"></el-input>
                </el-form-item>
                <el-form-item label="查看照片">
                    <img width="100%" :src="currPic" alt="">
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
	// import authList from "../../mockData/authList.json"
	import moment from "moment"

	export default {
		name: "Authentication",
		data() {
			return {
        total: 100,
				moment: moment,
				list: [], // 列表
				showPic: false, // 展示身份证照片
				showInfo: false, // 展示审核信息
				selectedList: [], // 选中的列表
				search: {
					page: 1,
					page_size: 10,
				},
				currInfo: {}, // 当前展示的审核信息
				currPic: '', // 展示当前审核的照片
				selectedUserIds: [], // 选中的userids
			}
		},
		mounted() {
			this.queryList()
		},
		methods: {
			async passClick() {
				if (this.selectedUserIds.length == 0) {
					this.$message.error('请选择要通过的条目')
					return false;
				}
				let res = await this.$api.authVerify({
					agree: true,
					reason: '允许',
					user_ids: this.selectedUserIds
				})
				if (res.code == 200) {
					this.$message.success('审核通过')
					this.queryList()
				} else {
					this.$message.error(res.msg)
				}
			},
			// 查询列表
			async queryList() {
				let res = await this.$api.authList(this.search)
				if (res.code == 200) {
          this.list = res.data.data;
          this.total = res.data.count;
				} else if (res.code == 401) {
					this.$router.push({name: 'login'})
				} else {
					this.$message.error(res.msg)
				}
			},
			// 点击展示审核信息
			async showInfoClick(id, pic) {
        this.currPic = pic;
        let res =  await this.$api.operateInfo({"user_id": id});
        if(res.code == 200){
          this.currInfo = res.data;
          this.showInfo = true;
        } else {
          this.$message.error(res.msg)
        }
			},
			// 点击展示照片
			async showPicClick(pic) {
				this.showPic = true;
				this.currPic = pic;
			},
			// 点击checkbox事件
			handleSelectionChange(val) {
				this.selectedList = val;
				if (this.selectedList.length > 0) {
					for (let i = 0; i < this.selectedList.length; i++) {
						this.selectedUserIds[i] = this.selectedList[i].user_id
					}
				} else {
					this.selectedUserIds = []
				}
			},
			// 切换checkbox状态
			// toggleSelection(rows){
			// if(rows){ // 切换单个，也可以选择多个
			// 	rows.forEach(row => {
			// 		this.$refs.multipleTable.toggleSelection(row)
			//         })
			//     } else {
			// 	this.$refs.multipleTable.clearSelection();
			//     }
			// }
			// 清空选择
			clearSelect() {
				this.$refs.multipleTable.clearSelection();
			},
			// 跳转
			handleCurrentChange(val) {
				this.search.page = val;
				this.queryList();
			},
			async rejectClick(user_id) {
				this.$prompt('', '填写驳回理由', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(async (val) => {
					if (!val.value) {
						this.$message.error('请填写驳回理由')
						return false;
					} else {
						let res = await this.$api.authVerify({
							agree: false,
							reason: val.value,
							user_ids: [user_id]
						})
						if (res.code == 200) {
							this.$message.success('驳回成功');
							this.queryList()
						} else {
							this.$message.error(res.msg)
						}
					}
				})
			},
			// 查看是否可被勾选
			checkRowStatus(row) {
				if (row.real_name_status != 2) {
					return false
				} else {
					return true;
				}
			}
		}
	}
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