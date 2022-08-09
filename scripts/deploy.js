const hre = require('hardhat');
const ethers = hre.ethers;
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  const MACToken = await ethers.getContractFactory("MACToken",deployer);
  const erc = await MACToken.deploy(ethers.utils.parseEther('1000000'));
  await erc.deployed();
  console.log("MACToken deployed at: ", erc.address);
  
  saveFrontendFiles({
    MACToken:erc
  })

}

function saveFrontendFiles(contracts) {
  const contractsDir = path.join(__dirname, '/..', 'src/contracts')

  if(!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir)
  }

  Object.entries(contracts).forEach((contract_item) => {
    const [name, contract] = contract_item

    if(contract) {
      fs.writeFileSync(
        path.join(contractsDir, '/', name + '-contract-address.json'),
        JSON.stringify({[name]: contract.address}, undefined, 2)
      )
    }

    const ContractArtifact = hre.artifacts.readArtifactSync(name)

    fs.writeFileSync(
      path.join(contractsDir, '/', name + ".json"),
      JSON.stringify(ContractArtifact, null, 2)
    )
  })
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })