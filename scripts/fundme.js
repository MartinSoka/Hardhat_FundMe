const { ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContractAt("FundMe", deployer);
  //   const [account] = await ethers.getSigners();
  //   const fundMeFactory = await ethers.getContractFactory("FundMe");
  //   const fundMe = fundMeFactory.attach(account.address);

  console.log("Funding contract ");
  const txResponse = await fundMe.fund({
    value: ethers.utils.parseEther("0.5"),
  });
  await txResponse.wait(1);
  console.log("Contract funded");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
