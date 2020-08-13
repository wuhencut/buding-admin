<template>
    <div class="page">
        <div class="auth-aboute">
            <div class="page-title">
                <b>用户权限</b>
            </div>
            <div class="auth-item flex">
                <span class="flex-s1">一般用户</span>
                <!--<el-button @click="authDialog = true">编辑权限</el-button>-->
            </div>
            <div class="auth-item flex">
                <span class="flex-s1">实名认证用户</span>
                <!--<el-button @click="authDialog = true">编辑权限</el-button>-->
            </div>
            <div class="auth-item flex">
                <span class="flex-s1">补叮认证用户</span>
                <!--<el-button @click="authDialog = true">编辑权限</el-button>-->
            </div>
            <div class="auth-item flex">
                <span class="flex-s1">受限用户</span>
                <!--<el-button @click="authDialog = true">编辑权限</el-button>-->
            </div>
        </div>

        <el-dialog title="权限设置" :visible.sync="authDialog">
            <el-checkbox-group v-model="authList">
                <el-checkbox-button v-for="item in 10" :label="item" :key="item">{{item}}</el-checkbox-button>
            </el-checkbox-group>
            <div style="margin-top: 20px;">
                <el-button type="primary">确认</el-button>
                <el-button @click="authDialog = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "authManagement",
        data(){
        	return {
        		authList: [],
                authDialog: false,
            }
        }
    }
</script>

<style scoped>
    .page-title{
        padding: 10px 0;
        border-bottom: 1px solid #ececec;
    }
    .flex{
        display: flex;
        line-height: 40px;
    }
    .flex-s1{
        flex: 1;
    }
    .auth-item{
        padding: 10px 0;
        border-bottom: 1px solid #ececec;
    }
</style>