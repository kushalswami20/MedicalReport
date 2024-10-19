import MedicalRecord from "../contracts/MedicalRecord.json";

// Ensure environment variables are loaded
// dotenv.config();

const contractABI = MedicalRecord.abi;

export const getContractABI = () => {
  try {
    return contractABI;  // Simply return contractABI, not contractABI.abi
  } catch (error) {
    console.error('Error loading contract ABI:', error);
    return null;
  }
};

export const getContractConfig = () => {
  return {
    address: "0x3227098630Ec0FAD76B597f8A2EB5C536E7e9bcc", // Hardcoded for now, could use environment variable
    abi: getContractABI(),
  };
};
