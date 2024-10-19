// scripts/copyContractAbi.js
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../artifacts/contracts');
const targetDir = path.join(__dirname, '../../frontend/src/contracts');

const copyAbi = () => {
  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Copy PatientManagement ABI
  const sourcePath = path.join(sourceDir, 'MedicalRecord.sol/MedicalRecord.json');
  const targetPath = path.join(targetDir, 'MedicalRecord.json');

  try {
    const contractArtifact = require(sourcePath);
    const minifiedArtifact = {
      abi: contractArtifact.abi,
      networks: contractArtifact.networks
    };

    fs.writeFileSync(
      targetPath,
      JSON.stringify(minifiedArtifact, null, 2)
    );

    console.log('Successfully copied ABI to src/contracts');
  } catch (error) {
    console.error('Error copying ABI:', error);
    process.exit(1);
  }
};

copyAbi();