<template>
  <div class="main">
    <div class="link">
      <span class="net">{{netWork}}</span><span class="address">{{address}}</span>
    </div>
    <div style="display:flex">
      <div style="width:60%">
        <el-input v-model="name" placeholder="请输入合约合约名称（可选）" style="margin-bottom:15px;"></el-input>
        <el-input @blur="bornContranct" v-model="contractAddress" placeholder="请输入合约地址"></el-input>
        <el-input
          @blur="bornContranct"
          type="textarea"
          :rows="10"
          class="abi"
          placeholder="请输入ABI数组"
          v-model="abi">
        </el-input>
      </div>
      <div style="padding:10px;flex:1;margin-left:20px;overflow:auto;max-height:332px;box-shadow: 2px 2px 2px 2px #888888 inset;border-radius:10px;">
          <div  v-for="(item,index) in abiList" :key="index+'a'" @click="selectAbi(item)" :style="{
            padding:'8px',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            background:contractAddress==item.address ? '#000' : '#f8f8f8',
            color:contractAddress==item.address ? '#fff' : '#000',
            cursor: 'pointer',
            marginBottom:index < abiList.length - 1 ? '10px' : '0px',
            borderRadius:'6px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'

          }">{{item.name}}</div>
      </div>
    </div>
    <div style="margin:15px;display:flex;justify-content:flex-end">
      <!-- <el-button style="margin-right:15px;" :type="contractAddress==item.address ? 'primary' : 'default'" v-for="(item,index) in abiList" :key="index+'a'" @click="selectAbi(item)">{{item.name}}</el-button> -->
      <el-button type="primary" style="margin-right:15px;" @click="save()">保存</el-button>
      <el-button type="danger" style="margin-right:15px;" @click="del()">删除</el-button>
    </div>

    <div style="height:300px;overflow:auto;border:1px solid #ccc;margin:20px 0;border-radius:10px;padding:15px;box-shadow: 2px 2px 2px 2px #888888 inset;border-radius:10px;">
      
      <div style="margin-bottom:15px;" v-if="result && result.transactionHash">
        transactionHash:{{result.transactionHash}}
      </div>
      <div style="margin-bottom:15px" v-if="result">{{result}}</div>
    </div>
    <div style="display:flex">
      <div style="width:60%;height:500px;overflow:auto;">
        
        <el-input v-if="pay" style="margin-bottom:15px"  v-model="payAmount" placeholder="输入金额"></el-input>
        <el-input style="margin-bottom:15px" v-for="(item,index) in paramsInput" :key="index"  v-model="param[index]" :placeholder="item.name + '   ' + item.type"></el-input>
        <el-button style="margin-bottom:15px;width:100%;" type="primary" @click="submit">提交</el-button>
      </div>
      <div style="padding:10px;flex:1;margin-left:20px;overflow:auto;max-height:500px;box-shadow: 2px 2px 2px 2px #888888 inset;border-radius:10px;">
        <!-- <el-select class="select" @change="selectMethod" v-model="methodName" placeholder="请选择调用方法">
          <el-option
            v-for="(item,index) in methods"
            :key="index"
            :label="item.name"
            style="width:90%;box-sizing: border-box;"
            :value="item.name">
          </el-option>
        </el-select> -->
        <div  v-for="(item,index) in methods" :key="index+'b'" @click="selectMethod(item.name)" :style="{
            padding:'8px 20px',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            background:methodName==item.name ? '#000' : '#f8f8f8',
            color:methodName==item.name ? '#fff' : '#000',
            cursor: 'pointer',
            marginBottom:'10px',
            borderRadius:'6px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow:'hidden'

          }">{{item.name}}</div>
        <!-- <el-select  class="select" v-model="type" placeholder="请选择请求方式">
          <el-option
            v-for="(item,index) in types"
            :key="index"
            style="width:90%;box-sizing: border-box;"
            :label="item"
            :value="item">
          </el-option>
        </el-select> -->
        
      </div>
    </div>  

    
    <div style="margin-top:50px; display:flex;">
      <input type="text" v-model="hash" placeholder="查询交易">
      <el-button type="primary" style="margin-left:15px;" @click="getTransaction(hash)">查询</el-button>
    </div>
    <div style="margin-top:20px;">Transaction:{{transaction}}</div>

    <div style="padding:10px 0;font-size:20px;margin-top:30px;">精度处理</div>
    <el-input style="margin-top:15px"  v-model="val" placeholder="数字(Number类型)"></el-input>
    <div style="width:20px;"></div>
    <el-input style="margin-top:15px"  v-model="decimals" placeholder="精度(Number类型)"></el-input>
    <el-input style="margin-top:15px"  v-model="realVal" placeholder="处理精度后的数据"></el-input>
    
    

    <!-- <div style="margin-top:15px" v-if="result">Result(查看控制台):{{result}}</div>
    <div style="margin-top:15px" v-if="result && result.transactionHash">
      transactionHash:{{result.transactionHash}}

      
    </div> -->
    <!-- <div style="margin-top:50px; display:flex;">
      <input type="text" v-model="hash" placeholder="查询交易">
      <el-button type="primary" style="margin-left:15px;" @click="getTransaction(hash)">查询</el-button>
    </div>
    <div style="margin-top:20px;">Transaction:{{transaction}}</div> -->
    <div style="margin-top:50px; display:flex;">
      <input type="text" v-model="msg" placeholder="签名消息">
      <el-button type="primary" style="margin-left:15px;" @click="getSign(msg)">签名</el-button>
    </div>
    <div style="margin-top:20px;">Sign:{{sign}}</div>
    <Show v-model="showModel"></Show>
  </div>
</template>

<script>
import staking_abi from './abi.json'
import Show from './Show.vue'
export default {
    data(){
      return {
        showModel:false,
        abi:'',
        contractAddress:'',
        ContractObj:null,
        types:['send','call'],
        netWork:'',
        address:'',
        methodName:'',
        type:'',
        paramsInput:[],
        param:[],
        hash:'',
        curMethod:null,
        price:'',
        gas:'',
        result:null,
        decimals:18,
        val:'',
        transaction:null,
        msg:'',
        sign:'',
        name:'',
        abiList:[],
        curContract:'',
        payAmount:0,
        pay:false
      }
    },
    components:{
      Show
    },
    created(){
      this.web3Play.init().then(res=>{
         this.address = res[0]
         this.bornContranct()
         this.getWorkNet()
         this.changeHandle()
         this.getAbis()
      })
    },

    computed:{
      realVal(){
        if(!this.val){
          return ''
        }else{
          return this.longHandle(parseFloat(this.val),parseInt(this.decimals))
        }
      },
      methods(){
          let temp = []
          try{
            temp = JSON.parse(this.abi)
            
          }catch(err){
            temp = []
          }
          return temp.filter(item=>{
            return item.type == 'function'
          })
      }
    },
    methods:{
      del(){
        if(localStorage.getItem('abis')){
            let temp = JSON.parse(localStorage.getItem('abis'))
            temp = temp.filter(item=>{
              return item.address != this.contractAddress
            })
            localStorage.setItem('abis',JSON.stringify(temp))
          }
          this.getAbis()
      },
      save(){
          if(localStorage.getItem('abis')){
            let temp = JSON.parse(localStorage.getItem('abis'))
            temp.push({
              name:this.name,
              abi:this.abi,
              address:this.contractAddress
            })
            localStorage.setItem('abis',JSON.stringify(temp))
          }else{
            localStorage.setItem('abis',JSON.stringify([
              {
                name:this.name,
                abi:this.abi,
                address:this.contractAddress
              }
            ]))
          }
          this.getAbis()
      },
      selectAbi(obj){
        this.name = obj.name
        this.abi = obj.abi
        this.contractAddress = obj.address
        this.bornContranct()
      },
      getAbis(){
        if(localStorage.getItem('abis')){
            this.abiList = JSON.parse(localStorage.getItem('abis'))
        }
      },
      getSign(msg){
         window.web3.eth.personal.sign(msg,this.address, "").then(res=>{
           this.sign = res
         });
      },
      getTransaction(hash){
          window.web3.eth.getTransactionReceipt(hash).then(data=>{
              this.transaction = data
              console.log(this.transaction)
          });
      },
      getData(){
          return web3.eth.abi.encodeFunctionCall(this.curMethod, this.param)
      },
      submit(){
        
        /* this.param = this.param.map(item=>{
          if(/\[/.test(item)){
            return JSON.parse(item).map(sub=>{
              console.log(sub.toString())
              return sub.toString()
            })
          }else{
            return item.replace(/\s/g,'')
          }
          
        }) */
        /* console.log(this.param)
        this.getPrice(()=>{
            this.$confirm(this.type == 'send' ? `Gas Price:${this.price}ETH 是否继续交易?` : '是否继续', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.swichParam()
            }).catch(() => {
                    
            });
        }) */

        this.swichParam()
        // this.swichParam()
      },
      switchGas(fn){
        
        console.log(this.ContractObj.methods[this.curMethod.name](this.param[0],this.param[1]))
        switch(this.param.length){
          case 0:
            this.ContractObj.methods[this.curMethod.name]().estimateGas({from:this.address})
            .then((gasAmount)=>{
              this.gas = gasAmount
              console.log('gas:'+this.gas)
              fn()
            })
            .catch(function(error){
              console.log(error)
            });
          break;
          case 1:
            this.ContractObj.methods[this.curMethod.name](this.param[0]).estimateGas({from:this.address})
            .then((gasAmount)=>{
              this.gas = gasAmount
              console.log('gas:'+this.gas)
              fn()
            })
            .catch(function(error){
              console.log(error)
            });
          break;
          case 2:
            this.ContractObj.methods[this.curMethod.name](this.param[0],this.param[1]).estimateGas({from:this.address})
            .then((gasAmount)=>{
              this.gas = gasAmount
              console.log('gas:'+this.gas)
              fn()
            })
            .catch(function(error){
              console.log(error)
            });
          break;
        }
        
        
      },
      swichParam(fn = ()=>{}){
        let temp = []
        this.param.forEach(item=>{
          let newTemp;
          if(/\[/.test(item)){
            newTemp = item.slice(1,item.length - 1).split(',').map(s=>{
              let t = s.replace(/\s/g,'')
              if(t == 'false'){
                t = false
              }else if(t == 'true'){
                t = true
              }
              return t
            })
          }else{
            newTemp = item.replace(/\s/g,'')
            if(newTemp == 'false'){
              newTemp = false
            }else if(newTemp == 'true'){
              newTemp = true
            }
          }
          
          temp.push(newTemp)
          
        })

        if(this.type == 'send'){
          this.ContractObj.methods[this.curMethod.name](...temp).send({
            from:this.address,
            value:this.payAmount
          }).then(data=>{
             this.result = data
             console.log(data)
          })
        }else{
          this.ContractObj.methods[this.curMethod.name](...temp).call().then(data=>{
             this.result = data
             console.log(data)
          })
        }

      },
      goodNumber(n){ 
        n = n + ''
        let r = n.split('e')[0]
        let l = n.split('e')[1] ? n.split('e')[1] : ''
        if(l){
            let zl;
            let zs='';
            let rf = 0;
            if(/^\+\d+$/.test(l)){
                zl = l.split('+')[1]
                for(let i = 0;i < zl;i++){
                    zs += '0'
                }
                if(r.split('.')[1]){
                    rf = r.split('.')[1].length
                    r = r.split('.')[0] + r.split('.')[1]
                }
                zs = zs.slice(0,zs.length - rf)
                return r + zs
            }else if(/^\-\d+$/.test(l)){
                zl = l.split('-')[1]
                for(let i = 0;i < zl;i++){
                    zs += '0'
                }
                rf = r.split('.')[0].length
                if(r.split('.')[1]){
                    r = r.split('.')[0] + r.split('.')[1]
                }
                zs = zs.slice(0,zs.length - rf)
                return '0.' + zs + r
            }
        }else{
            return r
        }
      },
      selectMethod(n){
        
        let m = this.methods.find(item=>{
          return item.name == n
        })
        this.curMethod = m
        this.methodName = n
        // console.log(this.curMethod)
        this.param = []
        if(m.stateMutability == 'view' || m.stateMutability == 'pure'){
          this.type = 'call'
          this.pay = false
          this.payAmount = 0
        }else if(m.stateMutability == 'payable'){
          this.pay = true
          this.payAmount = 0
          this.type = 'send'
        }else{
          this.pay = false
          this.payAmount = 0
          this.type = 'send'
        }
        this.paramsInput = m.inputs ? m.inputs : []
        
      },
      watchHandle(){
        
      },
      changeHandle(){
         ethereum.on('accountsChanged', (data) => {
           window.defaultAccount = data[0]
           this.address = data[0].toLowerCase()
           this.getWorkNet()
         })
         ethereum.on('networkChanged', () => {
           this.getWorkNet()
         })
      },
      getWorkNet(){
        window.web3.eth.net.getId().then((ID)=>{
            switch(ID){
                case 1:
                    this.netWork = 'ETH'
                break;
                case 4:
                    this.netWork = 'Rinkeby'
                break;
                case 137:
                    this.netWork = 'Polygon'
                break;
                default:
                    this.netWork = '未知'
                break;
            }
        })
      },
      bornContranct(){
        if(this.abi && this.contractAddress){
          this.ContractObj = new window.web3.eth.Contract(JSON.parse(this.abi),this.contractAddress)
          // console.log(this.ContractObj)
        }
      },
      getGas(fn){
        
        web3.eth.estimateGas({
            from:this.address,
            to: this.contractAddress,
            data: this.getData()
        }).then(gas=>{
          this.gas = gas
          
          fn()
        }).catch(err=>{
          alert(err)
        })
      },
      getPrice(fn=()=>{}){
        web3.eth.getGasPrice().then((price)=>{
          this.price = parseFloat(window.web3.utils.fromWei(price, 'ether'))
          console.log('price:'+price)
          this.getGas(fn)
        });
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.select{
  margin-top:15px;
  margin-right:15px;
}
.abi{
  margin-top:15px;
  
  
}
.link{
  height:40px;
  display: flex;
  align-items: center;
}
.net{
  margin-right:15px;
  font-size: 16px;
  font-weight: bold;
  
  
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
  
}
</style>
