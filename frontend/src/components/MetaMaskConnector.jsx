import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MetaMaskConnector = () => {
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');
  const [chainId, setChainId] = useState(null);

  useEffect(() => {
    checkIfWalletIsConnected();
    setupEventListeners();
  }, []);

  const setupEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount('');
      setError('Please connect to MetaMask.');
    } else {
      setAccount(accounts[0]);
      setError('');
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(parseInt(chainId, 16));
    window.location.reload();
  };

  const handleDisconnect = () => {
    setAccount('');
    setError('Wallet disconnected');
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const chain = await window.ethereum.request({ method: 'eth_chainId' });
      
      setChainId(parseInt(chain, 16));

      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      setError('Error checking wallet connection');
      console.error('Error checking wallet connection:', err);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      setAccount(accounts[0]);
      setError('');
    } catch (err) {
      if (err.code === 4001) {
        setError('Please connect to MetaMask.');
      } else {
        setError('Error connecting to wallet');
        console.error('Error connecting to wallet:', err);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-xl font-bold">Wallet Connection</CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {account ? (
            <div className="space-y-2">
              <Alert>
                <Check className="h-4 w-4" />
                <AlertDescription>
                  Connected to: {account.slice(0, 6)}...{account.slice(-4)}
                </AlertDescription>
              </Alert>
              <div className="text-sm">
                Network ID: {chainId}
              </div>
            </div>
          ) : (
            <Button 
              onClick={connectWallet}
              className="w-full"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaMaskConnector;