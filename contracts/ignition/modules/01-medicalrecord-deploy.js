
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MedicalRecordModule", (m) => {
    
    const MedicalRecord = m.contract("MedicalRecord", []);
  
    return { MedicalRecord };
  });