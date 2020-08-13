<template>
    <div class="page">
        <div style="margin-top: 20px;" class="page-title">操作记录</div>
        <el-table :data="recordList" stripe>
            <el-table-column prop="operated_at" label="修改时间">
                <template slot-scope="scope">
                    <span>{{moment(scope.row.operated_at * 1000).format('YYYY.MM.DD')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="operate_nickname" label="修改人"></el-table-column>
            <el-table-column prop="operate_reason" label="修改原因"></el-table-column>
            <el-table-column prop="content" label="修改内容"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import moment from 'moment'
	export default {
		name: "ModifyRecord",
        props: ['recordList'],
        data(){
			return {
                moment: moment
            }
        },
        mounted(){

        }
	}
</script>

<style scoped>

</style>