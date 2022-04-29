const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');

router.get('/get-wallet-info', walletController.getWalletInfo)

module.exports = router;