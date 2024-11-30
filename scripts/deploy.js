const { ethers } = require("hardhat");

const main = async () => {
    // Set unlockTime to 1 hour from now
    const unlockTime = Math.floor(Date.now() / 1000) + 60 * 60;

    // Get the contract factory
    const contractFactory = await ethers.getContractFactory("TaskContract");

    // Deploy the contract with the unlockTime and initial value
    const contract = await contractFactory.deploy(unlockTime, {
        value: ethers.parseEther("0.001"), // For ethers v6.x
    });

    // Contract is deployed once `deploy` is resolved; log the contract address
    console.log("Contract deployed to:", contract.target); // Use `contract.target` instead of `contract.address`
};

const runMain = async () => {
    try {
        await main();
        process.exit(0); // Exit successfully
    } catch (error) {
        console.error("Error deploying contract:", error);
        process.exit(1); // Exit with error
    }
};

runMain();
