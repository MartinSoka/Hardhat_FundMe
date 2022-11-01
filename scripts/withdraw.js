const { ethers } = require("hardhat");

async function main() {
  const [account] = await ethers.getSigners();
  const fundMeFactory = await ethers.getContractFactory("FundMe");
  const fundMeInstance = fundMeFactory.attach(account.address);

  console.log("Withdrawing funds..");
  const txResponse = await fundMeInstance.withdraw();
  await txResponse.wait(1);
  console.log("Transaction successfull");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
