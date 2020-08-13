<template>
    <div class="page">
        <div class="page-title">围观任务审核</div>
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
            <el-table-column prop="publisher_nickname" label="发布人昵称"></el-table-column>
            <el-table-column prop="title" label="任务信息"width="200">
                <template slot-scope="scope">
                    <el-button type="text" @click="showInfoClick(scope.row)">{{scope.row.title}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="answer_nickname" label="完成人昵称"></el-table-column>
            <el-table-column prop="status" label="状态" sortable>
                <template slot-scope="scope">
                    <p v-if="scope.row.status == 4"><i class="tip-icon"></i>待审核</p>
                    <p v-if="scope.row.status == 7"><i class="tip-icon tip-suc"></i>已通过</p>
                    <p v-if="scope.row.status == 6"><i class="tip-icon tip-fail"></i>被驳回</p>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="申请时间" width="180" sortable sort-by="applyTime">
                <template slot-scope="scope">
                    {{moment(scope.row.created_at * 1000).format("YYYY-MM-DD HH:mm:ss")}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <!--v-if="scope.row.status == 1"-->
                    <el-button v-if="scope.row.status != 7"  @click="rejectClick(scope.row.task_id)" type="text">驳回</el-button>
                    <el-button v-else @click="showOperateInfo(scope.row.task_id)"  type="text">审核信息</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" :current-page="search.page_id"
                           :page-size="search.page_size"
                           layout="total, prev, pager, next, jumper" :total="count">
            </el-pagination>
        </div>
        <!--分页 end-->
        <el-dialog class="check-info" title="审核信息" :visible.sync="showInfo">
            <div class="flex">
                <b class="flex-s1">任务标题: {{currInfo.title}}</b> <span>发布时间: {{moment(currInfo.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
            </div>
            <div><b>发布人:</b> {{currInfo.publisher_nickname}}</div>
            <div><b>任务内容：</b>{{currInfo.content}}</div>
            <!--<div><b>任务属性：</b>任务属性任务属性任务属性</div>-->
            <div><b>申请截止时间：</b>{{moment(currInfo.apply_limit_time * 1000).format('YYYY-MM-DD HH:mm:ss')}}</div>
            <div><b>任务金额：</b>{{currInfo.price}}</div>
            <div><b>任务时长：</b>{{formater(currInfo.task_duration)}}</div>
            <!--<div><b>任务分类：</b>任务分类任务分类任务分类任务分类</div>-->
            <el-table :data="[{publisher_nickname: currInfo.publisher_nickname, agree_answer_time: currInfo.agree_answer_time}]">
                <el-table-column prop="publisher_nickname" label="申请人" >
                </el-table-column>
                <el-table-column prop="applyTime" label="接受时间">
                    <template slot-scope="scope">
                        {{moment(scope.row.agree_answer_time * 1000).format("YYYY-MM-DD HH:mm:ss")}}
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="[{answer: currInfo.answer, finished_answer_time: currInfo.finished_answer_time}]">
                <el-table-column prop="answer" label="任务答案"></el-table-column>
                <el-table-column prop="finished_answer_time" label="完成时间">
                    <template slot-scope="scope">
                        {{moment(scope.row.finished_answer_time * 1000).format("YYYY-MM-DD HH:mm:ss")}}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!--查看处理信息-->
        <el-dialog title="查看处理信息" :visible.sync="showOperate">
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
    </div>
</template>

<script>
    import {formater} from '../../assets/js/commom'
	import moment from "moment"
	export default {
		name: "WatchTaskVerify",
		data(){
			return {
				formater: formater,
				moment: moment,
				list: [], // 列表
				showInfo: false, // 展示审核信息
				selectedList: [], // 选中的列表
				search: {
					page_id: 1,
					page_size: 20,
				},
				selectedIds: [],
                count: 100,
                operateInfo: {},
				currInfo: {},
                showOperate: false, // 展示操作者弹框
			}
		},
		mounted(){
			this.queryList()
		},
		methods: {
			// 查询列表
			async queryList(){
                let res = await this.$api.watchTaskList(this.search);
                if(res.code == 200){
                	this.list = res.data.tasks;
                	this.count = res.data.count;
                } else {
                	this.$message.error(res.msg)
                }
			},
			// 点击展示审核信息
			async showInfoClick(data){
				this.showInfo = true;
				this.currInfo = data;
			},
            async showOperateInfo(id){
			    let res = await this.$api.watchOperateInfo({task_id: id})
                if(res.code == 200){
			    	this.operateInfo = res.data;
			    	this.showOperate = true;
                } else {
			    	this.$message.error(res.msg)
                }
            },
			// 点击checkbox事件
			handleSelectionChange(val){
				this.selectedList = val;
			},
			// 审核
			async passClick(){
				if(this.selectedIds.length == 0){
					this.$message.error('请选择要通过的条目')
					return false;
				}
				let res = await this.$api.verifyWatchTask({
					agree: true,
					reason: '允许',
					task_ids: this.selectedIds
				})
				if(res.code == 200){
					this.$message.success('审核通过')
					this.queryList()
				} else {
					this.$message.error(res.msg)
				}
			},
			// 跳转
			handleCurrentChange(val){
				this.search.page_id = val;
				this.queryList();
			},
			// 点击checkbox事件
			handleSelectionChange(val){
				this.selectedList = val;
				if(this.selectedList.length > 0){
					for(let i = 0; i < this.selectedList.length; i++){
						this.selectedIds[i] = this.selectedList[i].task_id
					}
				} else {
					this.selectedIds = []
				}
			},
            // 驳回
			rejectClick(task_id){
				this.$prompt('', '填写驳回理由', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(async (val) => {
					if(!val.value){
						this.$message.error('请填写驳回理由')
						return false;
					} else {
						let res = await this.$api.verifyWatchTask({
							agree: false,
							reason: val.value,
							task_ids: [task_id]
						})
						if(res.code == 200){
							this.$message.success('驳回成功');
							this.queryList()
						} else{
							this.$message.error(res.msg)
						}
					}
				})
			},
            // 查看是否可被勾选
			checkRowStatus(row){
				if(row.status == 7){
					return false
                } else {
					return true;
                }
            }
		}
	}
</script>

<style less scoped>
    .flex{
        display: flex;
    }
    .flex-s1{
        flex: 1;
    }
    .pagination{
        text-align: center;
        margin-top: 20px;
    }
    .check-info div{
        margin-bottom: 20px;
    }
</style>