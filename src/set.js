import Vue from 'vue'
import http from 'axios';
import web3Play from './web3.js';
Vue.prototype.http = http
Vue.prototype.web3Play = web3Play
Vue.prototype.longHandle = (n,l = 18) => {
  n = "" + n;
  if(n.indexOf('.') == -1){
      n = n + new Array(l).fill(0).join('')
  }else{
      let h = n.split('.')[0]
      let e = n.split('.')[1]
      if(e.length >= l){
          e = e.substr(0,l)
      }else{
          e = e + new Array(l-e.length).fill(0).join('')
      }
      if(parseInt(h)){
          n = h + e
      }else{
          n = e
      }
      
  }
  return n
}

Vue.prototype.zeroHandle = (n,l=18) => {
//     return parseFloat(parseInt(n)/Math.pow(10,parseInt(l)))
    return web3Play.fromWei(n,l)
}
/* 截取小数位 */
Vue.prototype.saveNum = (n,l = 4) => {
  n = "" + n;
  if(n.indexOf('.') == -1){
      n = n + '.' + new Array(l).fill(0).join('')
  }else{
      let h = n.split('.')[0]
      let e = n.split('.')[1]
      if(e.length >= l){
          e = e.substr(0,l)
      }else{
          e = e + new Array(l-e.length).fill(0).join('')
      }
      n = h + '.' + e
  }
  return n
}
/* 科学计数法转字符串 */
Vue.prototype.goodNumber = (n) => {
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
}
export default Vue