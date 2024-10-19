
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';


export const AccessRequestForm = ({ contract, patientId }) => {
    const [reason, setReason] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const tx = await contract.requestAccess(patientId, reason);
        await tx.wait();
        setReason('');
      } catch (error) {
        console.error('Error requesting access:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="space-y-2">
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for access request"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Request Access
          </button>
        </div>
      </form>
    );
  };

  export default  AccessRequestForm;