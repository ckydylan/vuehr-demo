<template>
    <div>
        <el-form
                :rules="rules"
                ref="loginForm"
                :model="loginForm"
                class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input size="normal" type="text" v-model="loginForm.username" placeholder="请输入用户名"
                          prefix-icon="el-icon-user"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input size="normal" type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"
                          show-password placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input size="normal" type="text" v-model="loginForm.code" auto-complete="off"
                          placeholder="点击图片更换验证码" @keydown.enter.native="submitLogin" style="width: 250px"></el-input>
                <img :src="vcUrl" @click="updateVerifyCode" alt="" style="cursor: pointer">
            </el-form-item>
            <el-checkbox size="normal" class="loginRemember" v-model="checked">记住密码</el-checkbox>
            <br/>
            <el-button type="primary" style="width: 30%;" @click="submitLogin">登录</el-button>
            <el-button style="width: 30%;" @click="reset">重置</el-button>
        </el-form>
    </div>
</template>

<script>

    import {AxiosInstance as axios} from "axios";
    import {postKeyValueRequest} from "../utils/api";

    export default {
        name: "Login",
        data() {
            return {
                vcUrl:'/verifyCode?time='+new Date(),
                loading: false,
                loginForm: {
                    username: 'admin',
                    password: '123',
                    code:''
                },
                checked: true,
                rules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                    code: [{required: true, message: '请输入验证码', trigger: 'blur'}],

                }
            }
        },
        methods: {
            submitLogin() {
                this.$refs.loginForm.validate(async valid => {
                    if (!valid) {
                        return this.$message.error('用户名或密码格式不正确，请重新输入')
                    }
                    const resp = await postKeyValueRequest('/doLogin', this.loginForm)

                    if (resp) {
                        this.$message.success('登录成功')
                        window.sessionStorage.setItem("user", JSON.stringify(resp.obj));
                        let path = this.$route.query.redirect
                        await this.$router.replace((path === '/' || path === undefined) ? '/home' : path)
                    }else {
                        this.updateVerifyCode();
                    }
                })
            },
            reset() {
                this.$refs.loginForm.resetFields()
                // this.loginForm.username = '';
                // this.loginForm.password = '';
            },
            updateVerifyCode(){
                this.vcUrl = '/verifyCode?time='+new Date();
            }
        }
    }
</script>

<style>
    .loginContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .loginTitle {
        margin: 15px auto 20px auto;
        text-align: center;
        color: #505458;
    }

    .loginRemember {
        text-align: left;
        margin: 0 0 15px 0;
    }

    .el-form-item__content {
        display: flex;
        align-items: center;
    }
</style>
