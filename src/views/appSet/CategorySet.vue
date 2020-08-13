<template>
    <div class="page">
        <div class="page-title">
            <b>设置分类</b>
        </div>
        <div class="categories">
            <el-tag style="margin-right: 20px;" v-for="(item, index) in list" :key="index">{{item.name}}</el-tag>
        </div>
        <div class="footer" style="margin: 20px">
            <el-button @click="showAdd = true" type="primary">添加</el-button>
            <!--<el-button>删除</el-button>-->
        </div>
        <modify-record :recordList="operateList"></modify-record>

        <el-dialog :visible.sync="showAdd" title="添加分类">
            <el-form label-width="120px;" label-position="left">
                <el-form-item label="分类：">
                    <el-input style="width: 50%;" v-model="categoryName"></el-input>
                </el-form-item>
                <el-form-item label="原因：">
                    <el-input style="width: 50%;" v-model="reason"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="showAdd = false; categoryName = ''; reason=  ''">取消</el-button>
                    <el-button @click="addCategory" type="primary">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import mockData from '../../mockData/authList'
    import ModifyRecord from '../../components/ModifyRecord'
    export default {
    	components: {
			ModifyRecord
        },
        name: "categorySet",
        data(){
        	return {
        		list: [],
				categories: [],
                operateList: [],
				showAdd: false,
                categoryName: '',
                reason: ''
            }
        },
        mounted(){
    		this.queryList();
			this.operateRecord();
        },
        methods: {
    		async addCategory(){
    			this.showAdd = true;
    			if(!this.categoryName || !this.reason){
    				this.$message.error('请填写分类名和原因');
    				return false;
                }
				let res = await this.$api.addCategory({
					category_name: this.categoryName,
                    reason: this.reason
                })
                if(res.code == 200){
    				this.$message.success('添加成功')
                    this.queryList()
                    this.operateRecord();
                    this.showAdd = false
                } else {
    				this.$message.error(res.msg)
                }
            },
    		async queryList(){
    			let res = await this.$api.categoryList();
    			if(res.code == 200){
    				this.list = res.data;
                } else {
    				this.$message.error(res.msg);
                }
            },
			// 操作记录
			async operateRecord(){
				let res = await this.$api.categoryOperateRecord();
				if(res.code == 200){
					this.operateList = res.data;
				} else {
					this.$message.error(res.msg)
				}
			},
        }
    }
</script>

<style>
    .category{
        border-radius: 4px;
        border:none;
    }
</style>