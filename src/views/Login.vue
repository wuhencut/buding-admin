<template>
    <el-container class="page-login">
        <el-main>
            <el-form>
                <el-form-item>
                    <div class="header">
                        <p class="logo-title">补叮</p>
                        <p class="logo-title">Patchlinker</p>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="user.username" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="password" v-model="user.password" @keyup.enter.native='loginBtnClick' placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <!--<el-checkbox checked>自动登录</el-checkbox>-->
                    <el-button @click="loginBtnClick" :disabled="canLogin" class="btn-login" type="primary">登录
                    </el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>
<script>
    import md5 from 'js-md5'

    export default {
        data() {
            return {
                user: {
					username: localStorage.getItem('username') || '',
                    password: ''
                },
                defaultRoute: 'cpList',//设置默认登录后展示的页面
                authObj: {},//权限对象， 因为后台传过来的是字符串
            }
        },
        computed: {
            //登录按钮可点击
            canLogin() {
                if (this.user.email != '' && this.user.password != '') {
                    return false;
                } else {
                    return true;
                }
            }
        },
        mounted() {
            localStorage.removeItem('sid');
        },
        methods: {
            async loginBtnClick() {
                let req = {
					username: this.user.username,
                    password: md5(this.user.password)
                };
                let res = await  this.$api.login(req);
                if (res.code == 200) {
                    //存登录信息
                    localStorage.setItem('user_id', res.data.user_id);
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('username', this.user.username)
                    this.$router.push({path: '/'})
                } else {
                	this.$message.error(res.msg)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .page-login {
        width: 100%;
        height: 100%;
        .header {
            padding-top: 100px;
            .logo-title {
                margin-top: 40px;
                font-size: 50px;
                font-weight: bold;
            }
        }
        .login-tip{
            color: #409EFF;
            text-align: center;
        }
        .el-main {
            .el-form {
                width: 300px;
                margin: 0 auto;
                .form-title {
                    text-align: center;
                    font-size: 18px;
                }
                .btn-login {
                    width: 100%;
                }
            }
        }
        .el-footer {
            text-align: center;
            line-height: 60px;
            color: #C0C4CC;
            font-size: 10px;
        }
    }
</style>

