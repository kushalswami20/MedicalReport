export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const NETWORK_ID = import.meta.env.VITE_NETWORK_ID;
export const NETWORK_NAME = import.meta.env.VITE_NETWORK_NAME;

export const NETWORKS = {
    11155111: {
      name: 'Sepolia',
      rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/GBM3VSDtHpUbPNlH5hgrCZEm6hQwLFZ8",
    },
    // Add other networks as needed
  };