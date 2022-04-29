
const yargs = require("yargs");
let argv = yargs.argv
let wallet = argv.wallet;

const axios = require ('axios')
const Web3 = require("web3");

const INFRA_API_KEY = process.env.INFURA_API_KEY
const INFURA_URL = process.env.INFURA_URL
const COVAL_API_KEY = process.env.COVAL_API_KEY
const COVAL_URL = process.env.COVAL_URL
const web3 = new Web3(new Web3.providers.HttpProvider(`${INFURA_URL}${INFRA_API_KEY}`))


const getBalance = async (address='0xa79E63e78Eec28741e711f89A672A4C40876Ebf3') => {   
    try {        
        const balance = await web3.eth.getBalance(address)           
        return web3.utils.fromWei(balance, "ether")
    } catch (err) {        
        return null
    }        
}

const getPositions = async (address='0xa79E63e78Eec28741e711f89A672A4C40876Ebf3', channel = 1) => {
    let positions = [];
    let positionsData = null;    
    try {
        positionsData = await axios.get(`${COVAL_URL}/${channel}/address/${address}/balances_v2/?key=${COVAL_API_KEY}`)        
    } catch (e) {        
        return null
    }        
    const nCount = positionsData.data.data.items.length    
    for (let i = 0; i < nCount; i++) {        
        positions.push ({
            symbol: positionsData.data.data.items[i]?.contract_ticker_symbol,
            quantity: web3.utils.fromWei (positionsData.data.data.items[i]?.balance),
            change_rate: positionsData.data.data.items[i]?.quote_rate? positionsData.data.data.items[i]?.quote_rate: null,            
            usd_equivalent_quantity: positionsData.data.data.items[i]?.quote_rate? Number(web3.utils.fromWei (positionsData.data.data.items[i]?.balance)) * positionsData.data.data.items[i]?.quote_rate: null
        })        
    }        
    return positions
}

const getTransactions = async (address='0xa79E63e78Eec28741e711f89A672A4C40876Ebf3', channel = 1) => {

    let transactionData = null
    try {
        transactionData= await axios.get(`${COVAL_URL}/${channel}/address/${address}/transactions_v2/?key=${COVAL_API_KEY}`)      
    } catch (e) {        
        return null
    }    
    return transactionData.data.data?.items
}

const testScript = async () => {
    if (!wallet) return;    
    const channel = 1  
    try {
        const balance = await getBalance (wallet)
        const positions = await getPositions (wallet, channel)        
        const transactionData = await getTransactions (wallet, channel) 
        const usd_rate = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')           
        if (balance && positions && transactionData) {
            const response = {
                balance: balance,
                usd_rate: usd_rate.data.ethereum.usd,
                usd_balance: balance * usd_rate.data.ethereum.usd,
                positions: positions,
                transactions: transactionData,                
            }    
            console.log ("response.....", response)     
        } else {
            console.log ("no data...")
        }
    } catch (e) {
        console.log (e)        
    }    
}

if (wallet) {
    testScript (wallet)    
} else {
    console.log ("You must pass a wallet for test")
}

exports.getWalletInfo = async function (req, res, next) {

    const address = req.query.address
    const channel = req.query.channel     
    const contracAddress = req.query.contractAddress     

    try {
        const balance = await getBalance (address);  
        const positions = await getPositions (address, channel)            
        const transactionData = await getTransactions (address, channel)               
        const usd_rate = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')                  
        if (balance && positions && transactionData) {
            const response = {
                balance: balance,
                usd_rate: usd_rate.data.ethereum.usd,
                usd_balance: balance * usd_rate.data.ethereum.usd,
                positions: positions,
                transactions: transactionData,                
            }    
            return res.send (response)   
        } else {
            return res.status(500).send({ error: 'error' })
        }

    } catch (e) {
        console.log (e)
        return res.status(500).send({ error: 'error' })
    }    
}






