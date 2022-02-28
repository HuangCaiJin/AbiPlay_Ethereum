<template>
    <div :class="['main',show ? 'enter' : 'leave']" v-if="show">
        <div class="top">
            <div class="close" @click="$emit('close',false)">

            </div>
        </div>

        <div class="inner">
            <div class="main_left" @click="run(false)"></div>
            <div class="main_center">
                <div class="main_top">
                    <div :class="['imgbg',currnet == index ? 'enter' : 'leave']" 
                    v-for="(item,index) in imgs"
                    :key="index"
                    :style="{
                        backgroundImage:`url(${item})`,
                        overflow:'hidden',
                        width:'100%',
                        height:'100%'
                    }"></div>
                </div>
                <div class="main_bottom">
                    <el-image
                    @mousemove="currnet = index"
                    style="width: 100px; height: 100px;margin-right:10px;box-sizing:border-box"
                    v-for="(item,index) in imgs"
                    :key="index"
                    :src="item"
                    :class="[currnet == index ? 'borderSelect' : '']"
                    fit="cover"></el-image>
                </div>
            </div>
            <div class="main_right" @click="run(true)"></div>
        </div>
        <div class="bottom"></div>
    </div>
</template>
<script>
export default {
    model:{
        event:"close",
        prop:"show"
    },
    data(){
        return {
            imgs:[
                'https://w.wallhaven.cc/full/rd/wallhaven-rdwjj7.jpg',
                'https://w.wallhaven.cc/full/57/wallhaven-5763w1.png',
                'https://w.wallhaven.cc/full/pk/wallhaven-pk5yz3.jpg',
                'https://w.wallhaven.cc/full/dp/wallhaven-dp2wzo.jpg',
                'https://w.wallhaven.cc/full/x8/wallhaven-x8wp9v.jpg'
            ],
            currnet:0
        }
    },
    props:{
        show:{
            type:Boolean,
            default:false
        }
    },
    created(){
        this.$watch('show',(n)=>{
            if(n){
                this.currnet = 0
            }
        })
    },
    methods:{
        run(isNext){
            if(!isNext){
                if(this.currnet){
                    this.currnet -= 1
                }else{
                    this.currnet = this.imgs.length - 1
                }
            }else{
                if(this.currnet == this.imgs.length - 1){
                    this.currnet = 0
                }else{
                    this.currnet += 1
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.borderSelect{
    border:3px solid #fff;
}
.imgbg{
    background-position: center center;
    background-size:cover;
    background-repeat:no-repeat ;
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
}
.main{
    position: fixed;
    top:0;
    bottom:0;
    right:0;
    left:0;
    background-color: rgba(0,0,0,0.8);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .inner{
        height:90%;
        display: flex;
        width:100%;
        .main_left{
            width:6%;
            height:100%;
        }
        .main_center{
            height:100%;
            flex:1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .main_top{
                flex:1;
                position: relative;
            }
            .main_bottom{
                height:100px;
                padding-top: 10px;
                cursor: pointer;
            }
        }
        .main_right{
            width:6%;
            height:100%;
        }
    }
    .top{
        flex:1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding:10px;
        .close{
            width:50px;
            height: 50px;
            background:#000;
            border-radius: 50%;
            color:#fff;
            cursor: pointer;
        }
    }
    .bottom{
        height:10px;
    }
    
}
.enter{
    animation: enter .5s ease-out forwards;
}
.leave{
    animation: leave .5s ease-in forwards;
}
@keyframes enter {
    0%{
        opacity: 0;
        display: none;
    }
    100%{
        opacity: 1;
        display: block;
    }
}
@keyframes leave {
    0%{
        opacity: 1;
        display: block;
    }
    100%{
        opacity: 0;
        display: none;
    }
}
</style>