// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract MedicalRecord {
    uint256 public recordId;
    enum AccessStatus {Pending, Approved, Denied}
    
    struct Patient {
        uint256 recordId;
        address owner;
        uint256 timestamp;
        string name;
        uint age;
        string gender;
        string bloodType;
        string dataHash;
        
    }

    struct AccessRequest {
        address requester;
        uint256 patientId;
        AccessStatus status;
        string reason;
        uint256 timestamp;
        uint256 expirationTime;
    }

    event AccessRequested(uint256 patientId, address requester, string reason);
    event AccessApproved(uint256 patientId, address requester, uint256 expirationTime);
    event AccessDenied(uint256 patientId, address requester);
    event MedicalRecords__AddRecord(
        uint256 recordId, 
        address indexed owner,
        uint256 timestamp,
        string  name,
        uint256 age,
        string  gender,
        string bloodType,
        string dataHash);

    mapping(uint256 => Patient) public patients; 
    mapping(address => Patient) public patientsbyaddress;
    address[] private patientAddresses;
    mapping(uint256 => mapping(address => AccessRequest)) public accessRequests;
    mapping(uint256 => mapping(address => bool)) public approvedAccess;

    modifier onlyPatient(uint256 patientId) {
        require(patients[patientId].owner == msg.sender, "Only the patient can perform this action");
        _;
    }

    function addPatient(
        address owner,
        string memory name,
        uint age,
        string memory gender,
        string memory bloodType,
        string memory dataHash
    ) public {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(age > 0 && age < 150, "Invalid age");
        
        recordId++;
        
        // Create the patient record
        Patient memory newPatient = Patient(
            recordId,
            owner,
            block.timestamp,
            name,
            age,
            gender,
            bloodType,
            dataHash
        );
        
        // Store in both mappings
        patients[recordId] = newPatient;
        patientsbyaddress[owner] = newPatient;
        
        // Store the owner's address
        patientAddresses.push(owner);
        
        emit MedicalRecords__AddRecord(
            recordId,
            owner,
            block.timestamp,
            name,
            age,
            gender,
            bloodType,
            dataHash);
    }

    function approveAccess(uint256 patientId, address requester, uint256 durationInDays) public onlyPatient(patientId) {
        AccessRequest storage request = accessRequests[patientId][requester];
        require(request.status == AccessStatus.Pending, "Request already processed");
        request.status = AccessStatus.Approved;
        request.expirationTime = block.timestamp + (durationInDays * 1 days);
        approvedAccess[patientId][requester] = true;
        emit AccessApproved(patientId, requester, request.expirationTime);
    }

    function denyAccess(uint256 patientId, address requester) public onlyPatient(patientId) {
        AccessRequest storage request = accessRequests[patientId][requester];
        require(request.status == AccessStatus.Pending, "Request already processed");
        request.status = AccessStatus.Denied;
        approvedAccess[patientId][requester] = false;
        emit AccessDenied(patientId, requester);
    }

    function requestAccess(uint256 patientId, string memory _reason) public {
        require(patients[patientId].owner != address(0), "Patient does not exist");
        accessRequests[patientId][msg.sender] = AccessRequest(msg.sender, patientId, AccessStatus.Pending, _reason, block.timestamp, 0);
        emit AccessRequested(patientId, msg.sender, _reason);
    }

    function hasAccess(uint256 patientId, address entity) public view returns(bool) {
        if (approvedAccess[patientId][entity]) {
            AccessRequest memory request = accessRequests[patientId][entity];
            if (request.expirationTime > block.timestamp) {
                return true;
            }
        }
        return true;
    }

    function getPatientData(uint256 patientId) public view returns(
        uint256,
        address,
        uint256,
        string memory,
        uint,
        string memory,
        string memory,
        string memory
    ) {
        require(hasAccess(patientId, msg.sender), "Access not granted");
        Patient storage patientData = patients[patientId];
        return (
            patientData.recordId,
            patientData.owner,
            patientData.timestamp,
            patientData.name,
            patientData.age,
            patientData.gender,
            patientData.bloodType,
            patientData.dataHash
        );
    }

     // Update getAllPatients to use correct addresses
    function getAllPatients() public view returns (Patient[] memory) {
        Patient[] memory allPatients = new Patient[](patientAddresses.length);
        
        for(uint i = 0; i < patientAddresses.length; i++) {
            address patientAddress = patientAddresses[i];
            allPatients[i] = patientsbyaddress[patientAddress];
        }
        
        return allPatients;
    }

    function getPatientByAddress(address patientAddress) public view returns (
        uint256,
        address,
        uint256,
        string memory,
        uint,
        string memory,
        string memory,
        string memory
    ) {
        Patient memory patient = patientsbyaddress[patientAddress];
        
        
        return (
            patient.recordId,
            patient.owner,
            patient.timestamp,
            patient.name,
            patient.age,
            patient.gender,
            patient.bloodType,
            patient.dataHash
        );
    }

    function getPatientCount() public view returns (uint256) {
        return patientAddresses.length;
    }

    // Additional getter functions can be implemented as needed
    function getRecordId() public view returns (uint) {
        return recordId;
    }

    function getTimeStamp(uint _recordId) public view returns (uint) {
        return patients[_recordId].timestamp;
    }

    function getName(uint _recordId) public view returns (string memory) {
        return patients[_recordId].name;
    }

    function getAge(uint _recordId) public view returns (uint) {
        return patients[_recordId].age;
    }

    function getGender(uint _recordId) public view returns (string memory) {
        return patients[_recordId].gender;
    }

    function getBloodType(uint _recordId) public view returns (string memory) {
        return patients[_recordId].bloodType;
    }
    
}
   