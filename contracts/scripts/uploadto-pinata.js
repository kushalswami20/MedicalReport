const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const ethers = require('ethers');
require('dotenv').config();

// Contract ABI - Include only the functions we need
const contractABI = [
    "function addPatient(address owner, string memory name, uint age, string memory gender, string memory bloodType, string memory dataHash) public",
    "event MedicalRecords__AddRecord(uint256 recordId, address owner)"
];

// Upload image to Pinata and get hash
async function uploadToPinata(imagePath) {
    const PINATA_API_KEY = process.env.PINATA_API_KEY;
    const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

    try {
        const formData = new FormData();
        const file = fs.createReadStream(imagePath);
        formData.append('file', file);

        const response = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            formData,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_KEY
                }
            }
        );

        console.log('Upload successful to Pinata! ✨');
        console.log('IPFS Hash:', response.data.IpfsHash);
        return response.data.IpfsHash;

    } catch (error) {
        console.error('Pinata Error:', error.response?.data || error.message);
        throw error;
    }
}

// Add patient record to smart contract
async function addPatientRecord(
    imagePath,
    patientName,
    age,
    gender,
    bloodType
) {
    try {
        // First upload image to Pinata
        const ipfsHash = await uploadToPinata(imagePath);
        console.log('Image uploaded to IPFS with hash:', ipfsHash);

        // Connect to provider (e.g., Infura, local node)
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        
        // Connect wallet
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        
        // Connect to smart contract
        const contractAddress = process.env.CONTRACT_ADDRESS;
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);

        // Add patient to smart contract
        const tx = await contract.addPatient(
            wallet.address,  // owner address
            patientName,
            age,
            gender,
            bloodType,
            ipfsHash        // IPFS hash from Pinata
        );

        console.log('Transaction sent:', tx.hash);
        
        // Wait for transaction confirmation
        const receipt = await tx.wait();
        console.log('Transaction confirmed in block:', receipt.blockNumber);

        // Get the event data
        const event = receipt.events.find(event => event.event === 'MedicalRecords__AddRecord');
        const [recordId, owner] = event.args;

        console.log('Patient record added successfully!');
        console.log('Record ID:', recordId.toString());
        console.log('Owner:', owner);
        console.log('IPFS Hash:', ipfsHash);
        
        return {
            recordId: recordId.toString(),
            owner,
            ipfsHash
        };

    } catch (error) {
        console.error('Error adding patient record:', error);
        throw error;
    }
}

// Example usage
async function main() {
    try {
        const result = await addPatientRecord(
            './assets/Dashboard 1.png',    // Path to image file
            'John Doe',               // Patient name
            30,                       // Age
            'Male',                   // Gender
            'O+'                      // Blood type
        );
        
        console.log('Complete record:', result);
    } catch (error) {
        console.error('Main error:', error);
    }
}

// Export functions for use in other files
module.exports = {
    uploadToPinata,
    addPatientRecord
};

// Run the main function if this file is run directly
if (require.main === module) {
    main();
}