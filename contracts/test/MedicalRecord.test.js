const { expect } = require("chai");
const { ethers } = require("hardhat");

// describe("MY contract", function () {
//   let user1, medical, transactionResponse, transactionReceipt;
//   beforeEach(async () => {
//     const provider = ethers.getDefaultProvider();
//     const accounts = provider.getSigner();
//     user1 = accounts[1];
//     const Medical = await ethers.getContractFactory("MedicalRecord");
//     medical = await Medical.connect(user1).deploy();
//   });

//   describe("Deployment", () => {
//     it("The contract is deployed successfully", async () => {
//       expect(await medical.address).to.not.equal(0);
//     });
//   });

//   describe("Add Record", () => {
//     beforeEach(async () => {
//       transactionResponse = await medical.addPatient(
//         "0xBb08e4cA817f6c752b8d01504e01BC3996c969a6",
//         "Wastron",
//         22,
//         "Male",
//         "B positive",
//         "Qme14bJRpvP5NExom67QmJvGQpgavvvyzvc6hxaR3CjHSg"
//       );
//       transactionReceipt = await transactionResponse.wait();
//     });

//     it("Emits a Add Record event", async () => {
//       const event = transactionReceipt.events?.find(event => event.event === "MedicalRecords__AddRecord");
//       expect(event).to.exist;
      
//       const args = event.args;
//       expect(args.owner).to.equal("0xBb08e4cA817f6c752b8d01504e01BC3996c969a6");
//       expect(args.name).to.equal("Wastron");
//       expect(args.age).to.equal(22);
//       expect(args.gender).to.equal("Male");
//       expect(args.bloodType).to.equal("B positive");
//       expect(args.dataHash).to.equal("Qme14bJRpvP5NExom67QmJvGQpgavvvyzvc6hxaR3CjHSg");
      
//       // Uncomment these lines if these fields are relevant and available
//       // expect(args.recordId).to.equal("1");
//       // expect(args.timestamp).to.not.equal(0);
//     });
//   });
// });

describe("Medical Record", function (){
  it("deployment should be successsful", async function (){
    const accounts = await ethers.getSigners();
    const hardhatMedical= await ethers.deployContract("MedicalRecord");
    expect(await hardhatMedical.address).to.not.equal(0);
  })
})

describe("Add record", function (){
  it("should add a record", async function (){
    const accounts = await ethers.getSigners();
    const hardhatMedical= await ethers.deployContract("MedicalRecord");
    const transactionResponse = await hardhatMedical.addPatient(
              "0xBb08e4cA817f6c752b8d01504e01BC3996c969a6",
              "Wastron",
              22,
              "Male",
              "B positive",
              "Qme14bJRpvP5NExom67QmJvGQpgavvvyzvc6hxaR3CjHSg"
            );
    const transactionReceipt = await transactionResponse.wait();
    const event = await transactionReceipt.events.find(event => event.event === "MedicalRecords__AddRecord");
    expect(await event).to.exist;
  
  })
})