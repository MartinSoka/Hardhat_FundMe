const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", async () => {
  let fundMe;
  let deployer;
  let fundMeDeployment;
  let mockAggregatorDeployment;
  let sendValue = ethers.utils.parseEther("1");

  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    //deploy everything in deploy folder
    await deployments.fixture("all");

    fundMeDeployment = await deployments.get("FundMe");
    fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);

    mockAggregatorDeployment = await deployments.get("MockV3Aggregator");
    mockAggregatorContract = await ethers.getContractAt(
      "MockV3Aggregator",
      mockAggregatorDeployment.address
    );
  });

  describe("constructor", async () => {
    it("Sets the aggregator addresses correctly", async () => {
      const response = await fundMe.priceFeed();
      assert.equal(response, mockAggregatorContract.address);
    });
  });

  describe("fund", async () => {
    it("Revert transaction if it fails", async () => {
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });

    it("Updates the funders mapping", async () => {
      await fundMe.fund({ value: sendValue });
      const amountFunded = await fundMe.addressToAmountFunded(deployer);
      assert.equal(amountFunded.toString(), sendValue.toString());
    });

    it("Updates the funders array", async () => {
      await fundMe.fund({ value: sendValue });
      const funder = await fundMe.funders(0);
      assert.equal(deployer, funder);
    });
  });

  describe("withdraw", async () => {
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue });
    });

    it("Withdraw ETH from a single funder", async () => {
      const startingBalanceOfContract = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingBalanceOfDeployer = await fundMe.provider.getBalance(
        deployer
      );

      const tx = await fundMe.withdraw();
      const txRecepit = await tx.wait(1);
      const { gasUsed, effectiveGasPrice } = txRecepit;
      const gasPaid = gasUsed.mul(effectiveGasPrice);

      const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
      const endingContractBalance = await fundMe.provider.getBalance(
        fundMe.address
      );

      assert.equal(
        endingDeployerBalance.add(gasPaid).toString(),
        startingBalanceOfDeployer.add(startingBalanceOfContract).toString()
      );
      assert.equal(endingContractBalance, 0);
    });

    it("Withdraw ETH from multiple funders", async () => {
      //arange
      const accounts = await ethers.getSigners();
      for (let i = 1; i < 7; i++) {
        const fundMeConnectedContract = fundMe.connect(accounts[i]);
        await fundMeConnectedContract.fund({ value: sendValue });
      }
      const startingBalanceOfContract = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingBalanceOfDeployer = await fundMe.provider.getBalance(
        deployer
      );
      //act
      const tx = await fundMe.withdraw();
      const txRecepit = await tx.wait(1);
      const { gasUsed, effectiveGasPrice } = txRecepit;
      const gasPaid = gasUsed.mul(effectiveGasPrice);

      const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
      const endingContractBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      //assert
      assert.equal(
        endingDeployerBalance.add(gasPaid).toString(),
        startingBalanceOfDeployer.add(startingBalanceOfContract).toString()
      );
      assert.equal(endingContractBalance, 0);
      await expect(fundMe.funders(0)).to.be.reverted;

      for (let i = 1; i < 7; i++) {
        assert.equal(
          await fundMe.addressToAmountFunded(accounts[i].address),
          0
        );
      }
    });

    it("Only owner should be able to withdraw", async () => {
      const accounts = await ethers.getSigners();
      const attacker = accounts[1];

      const attackerConnectedContract = await fundMe.connect(attacker);
      await expect(
        attackerConnectedContract.withdraw()
      ).to.be.revertedWithCustomError(fundMe, "FundMe_NotOwner");
    });
  });
});
