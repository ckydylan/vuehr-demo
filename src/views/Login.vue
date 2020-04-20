<template>
    <div>
        <el-form
                :rules="rules"
                ref="loginForm"
                v-loading="loading"
                element-loading-text="正在登录..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
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
                loading: false,
                loginForm: {
                    username: 'admin',
                    password: '123',
                },
                checked: true,
                rules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                }
            }
        },
        methods: {
            submitLogin() {

                this.$refs.loginForm.validate(async valid => {
                    // console.log(valid)
                    if (!valid) {
                        return this.$message.error('用户名或密码格式不正确，请重新输入')
                    }
                    const resp = await postKeyValueRequest('/doLogin', this.loginForm)
                    console.log(resp)
                    if (resp) {
                        this.$message.success('登录成功')
                        // 1. 将登录成功之后的user保存到客户端的sessionStorage中
                        //    1.1 项目中出了登录之外的其它API接口，必须在登录之后才能访问
                        //    1.2 user只应在当前网站打开期间生效，所以将user保存在sessionStorage中
                        window.sessionStorage.setItem("user", JSON.stringify(resp.obj));
                        this.$router.replace('/home')
                    }
                })
            },
            reset() {
                this.loginForm.username = '';
                this.loginForm.password = '';
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

    /*.el-form-item__content {*/
    /*    display: flex;*/
    /*    align-items: center;*/
    /*}*/
</style>
