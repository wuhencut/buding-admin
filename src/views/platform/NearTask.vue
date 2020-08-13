<template>
<div class="posted-tasks">
			<div class="page-title">附近的任务</div>
			<el-table :data="list">
				<el-table-column label="地理位置" prop="address" width="150"></el-table-column>
				<el-table-column label="任务标题" prop="title" width="130">
          <template slot-scope="scope">
            <el-button type="text" @click="showTaskDetail(scope.row.task_id)">{{scope.row.title}}</el-button>
          </template>
        </el-table-column>
				<el-table-column label="发布人" sortable width="180">
          <template slot-scope="scope">
            {{scope.row.publish_user_info.user_name}}
          </template>
        </el-table-column>
				<el-table-column label="发布时间" prop="create_time" sortable width="180"></el-table-column>
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
			<div class="pagination" v-if="total > 0">
				<el-pagination
					background
					@current-change="handelCurrentChange"
					:current-page="search.page"
					:page-size="search.page_size"
					layout="total, prev, pager, next, jumper"
					:total="total"
				></el-pagination>
			</div>
			<!--分页 end-->

      <!-- 任务详情 -->
      <el-dialog :visible.sync="detailDg" title="任务详情">
        <el-form>
          <el-form-item label="任务金额">
            <div class="txt-right">{{currTask.price}}</div>
          </el-form-item>
          <el-form-item label="任务标题">
            <div class="txt-right">{{currTask.title}}</div>
          </el-form-item>
          <el-form-item label="任务完成人">
            <div class="txt-right">{{currTask.doing_user_info.user_name}}</div>
          </el-form-item>
          <el-form-item label="内务内容">
            
            <div class="txt-right">{{currTask.content}}</div>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 修改任务状态 -->
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
		</div>
</template>

<script>
	import moment from "moment"

	export default {
		name: "NearTaskDeal",
		data() {
			return {
        showStatusDialog: false,
        detailDg: false,
        currTask: {
          doing_user_info: {}
        },
        total: 10,
        list: [],
        search:{
          page: 1, 
          page_size: 10
        }
			}
		},
		mounted() {
			this.queryList();
		},
		methods: {
      // 查看任务详情
      async showTaskDetail(id){
        let res = await this.$api.getNearTaskInfo({
          task_id: id
        })
        if(res.code == 200){
          this.currTask = res.data;
          this.detailDg = true;
        } else {
          this.$message.error(res.msg)
        }
      },
			// 查询列表
			async queryList() {
        let res = await this.$api.getNearTaskList(this.search);
        if(res.code == 200){
          this.list = res.data.list;
          this.total = res.data.count;
        }
      },
      // 修改任务状态
      changeStatus(data) {
        this.currStatus = data.status;
        this.radioStatus = this.currStatus;
        this.currId = data.task_id;
        this.showStatusDialog = true;
      },
      handelCurrentChange(val){
        this.search.page = val;
			  this.queryList();
      },
      // 改变状态保存
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