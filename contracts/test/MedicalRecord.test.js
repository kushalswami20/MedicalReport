const { expect } = require("chai");
const { ethers } = require("hardhat");


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
              "0xaddress",
              "Wastron",
              22,
              "Male",
              "B positive",
              "Qme...."
            );
    const transactionReceipt = await transactionResponse.wait();
    const event = await transactionReceipt.events.find(event => event.event === "MedicalRecords__AddRecord");
    expect(await event).to.exist;
  
  })
})
