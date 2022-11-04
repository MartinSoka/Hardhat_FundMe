# Sample Hardhat Project

This is a hardhat demo based on this awesome tutorial https://www.youtube.com/watch?v=gyMwXuJrbJQ from Patrick Collins

Deploy on dev chain/test chain using following commands:

```shell
npx hardhat deploy
npx hardhat deploy --network goerli
npx hardhat deploy --network ganache
```

Test or interact with the deployed contracts: 
```shell
npx hardhat test
npx hardhat run scripts/fundme.js
```

Make sure to change the RPC URLs and PRIVATE_KEYs within your .env file
