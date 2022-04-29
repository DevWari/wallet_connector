# install & run
- Go to root folder of project and try this command
   - npm install
   - node index.js
- After run server, open your browser and go to this url
  - http://localhost:3000/api/get-wallet-info
  - You can pass request params (GET)

     - address: wallet address
     - channel: channel id (for example: channel id of mainnet is 1 )
     - Example

          - http://localhost:3000/api/get-wallet-info?address=0xa79E63e78Eec28741e711f89A672A4C40876Ebf3&channel=1

# test

 - node index.js --wallet=[address]
 - Example

     - node index.js --wallet=0xa79E63e78Eec28741e711f89A672A4C40876Ebf3

