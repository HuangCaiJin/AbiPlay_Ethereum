import Web3 from 'web3'

let web3Play = {
    init(){
        return new Promise((resolve,reject)=>{
            try{
                ethereum.enable().then(accounts=>{
                    let provider = ethereum || window.web3.currentProvider
                    window.web3 = new Web3(provider)
                    window.defaultAccount = accounts[0].toLowerCase()
                    resolve(accounts)
                }).catch(err=>{
                    reject(err)
                })
            }catch(err){
                
            }
            
        })
    },
    fromWei(n,l){
        let result = 0;
        switch(l){
            case 18:
                result = window.web3.utils.fromWei(n, 'ether');
            break;
            case 15:
                result = window.web3.utils.fromWei(n, 'finney');
            break;
            case 12:
                result = window.web3.utils.fromWei(n, 'micro');
            break;
            case 10:
                result = parseFloat(parseInt(n)/Math.pow(10,parseInt(l)))
            break;
            case 9:
                result = window.web3.utils.fromWei(n, 'gwei');
            break;
            case 8:
                result = parseFloat(parseInt(n)/Math.pow(10,parseInt(l)))
            break;
            case 7:
                result = parseFloat(parseInt(n)/Math.pow(10,parseInt(l)))
            break;
            case 6:
                result = window.web3.utils.fromWei(n, 'mwei');
            break;
            case 5:
                result = parseFloat(parseInt(n)/Math.pow(10,parseInt(l)))
            break;
            case 4:
                result = parseFloat(parseInt(n)/Math.pow(10,parseInt(l)))
            break;
            case 3:
                result = window.web3.utils.fromWei(n, 'kwei');
            break;
            case 2:
                result = parseFloat(parseInt(n)/Math.pow(10,parseInt(l)))
            break;
            case 1:
                result = parseFloat(parseInt(n)/Math.pow(10,parseInt(l)))
            break;
            default:
                result = n
            break;
        }
        return result;
    }
}
export default web3Play