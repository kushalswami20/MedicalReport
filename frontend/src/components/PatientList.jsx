import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader, ExternalLink } from 'lucide-react';
import { getContractConfig } from '../utils/contract';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractConfig = getContractConfig();
      const contract = new ethers.Contract(
        contractConfig.address,
        contractConfig.abi,
        signer
      );

      const currentRecordId = await contract.getRecordId();
      const patientData = [];

      for (let i = 1; i <= currentRecordId.toNumber(); i++) {
        try {
          const [
            recordId,
            owner,
            timestamp,
            name,
            age,
            gender,
            bloodType,
            dataHash
          ] = await contract.getPatientData(i);

          if (name) {
            patientData.push({
              recordId: recordId.toNumber(),
              owner,
              name,
              age: age.toString(),
              gender,
              bloodType,
              timestamp: timestamp ? new Date(timestamp.toNumber() * 1000).toLocaleString() : 'N/A',
              dataHash
            });
          }
        } catch (err) {
          console.log(`Skipping record ${i}: ${err.message}`);
          continue;
        }
      }

      setPatients(patientData);
    } catch (err) {
      setError(err.message || 'Error fetching patients');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const shortenAddress = (address) => {
    if (!address || address === 'N/A') return 'N/A';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const shortenHash = (hash) => {
    if (!hash || hash === 'N/A') return 'N/A';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  const getIpfsLink = (hash) => {
    if (!hash || hash === 'N/A') return null;
    const cleanHash = hash.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${cleanHash}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="min-h-[calc(100vh-2rem)] flex flex-col">
        <CardHeader className="border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Patient Records</h2>
            <div className="text-sm text-gray-500">
              Total Records: {patients.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          {patients.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No patients found
            </div>
          ) : (
            <div className="overflow-auto h-full">
              <Table>
                <TableHeader className="sticky top-0 bg-gray-50">
                  <TableRow>
                    <TableHead className="whitespace-nowrap">ID</TableHead>
                    <TableHead className="whitespace-nowrap">Name</TableHead>
                    <TableHead className="whitespace-nowrap">Age</TableHead>
                    <TableHead className="whitespace-nowrap">Gender</TableHead>
                    <TableHead className="whitespace-nowrap">Blood Type</TableHead>
                    <TableHead className="whitespace-nowrap">Owner Address</TableHead>
                    <TableHead className="whitespace-nowrap">Date Added</TableHead>
                    <TableHead className="whitespace-nowrap">IPFS Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.recordId} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{patient.recordId}</TableCell>
                      <TableCell>{patient.name || 'N/A'}</TableCell>
                      <TableCell>{patient.age || 'N/A'}</TableCell>
                      <TableCell>{patient.gender || 'N/A'}</TableCell>
                      <TableCell>{patient.bloodType || 'N/A'}</TableCell>
                      <TableCell title={patient.owner}>
                        {shortenAddress(patient.owner)}
                      </TableCell>
                      <TableCell>{patient.timestamp || 'N/A'}</TableCell>
                      <TableCell title={patient.dataHash}>
                        {patient.dataHash !== 'N/A' ? (
                          <a
                            href={getIpfsLink(patient.dataHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {shortenHash(patient.dataHash)}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientList;