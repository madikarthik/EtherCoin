pragma solidity ^0.4.17;


contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum, string description) public { // minimum contribution that the campaign expects
       address newCampaign = new Campaign(minimum, description, msg.sender); // msg.sender here is the address of the user creating the campaign.
       
       deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns( address[]) {
        
        return deployedCampaigns;
    }
}


contract Campaign {
    
    struct Request { // request will be called my manager. This will then be broadcasted to all the approvers/contributers
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount; // for majority concensus 
        mapping(address => bool) approvals; // to store the address of users who have voted

    }
    
    address public manager;
    string public aboutCampaign;
    uint public minimumContribution; 
    uint public contributorCount;
    Request[] public requests; 
    mapping(address => bool) public approvers;

    
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(uint minimum, string description, address creator) public {// we pass creator here and not msg.sender because msg.sender will have the address of the factory and not the user.
        manager = creator; // as we passed msg.sender up in the instance of campaign in the factory, manager will be the person holding the campaign.
        minimumContribution = minimum; // manager can set his minimum minimumContribution required
        aboutCampaign = description;
     }
     
     function contribute() public payable { // payable makes this function able to recieve some amount of money.
        
        require(msg.value > minimumContribution); //msg.value is the amount in wei that the person calling this method is sending.
        
        if( approvers[msg.sender] == false) // incrementing contributorCount only once. If the same user contributes more than once. the count doesnt increase.
        {
            contributorCount++;

        }
        approvers[msg.sender]=true; // msg.sender (address of the user calling this function) is the "key" in this mapping.

     }
     
     function createRequest(string description, uint value, address recipient) public restricted 
     {
         Request memory newRequest = Request({
             description: description,
             value: value,
             recipient: recipient,
             complete: false,
             approvalCount: 0
             // note that mapping property is not required here
             // that is because mapping is a reference type and not a value type.
             
         });
         
         requests.push(newRequest);
         
    } 
    
    function approveRequest(uint index) public { // index of the request that user is trying to approve.
        Request storage request = requests[index];
        
        require(approvers[msg.sender]); // checking if the users has already contributed to the campaign.
        require(!request.approvals[msg.sender]); // by default approvals has false so we give ! because require needs "true" to proceed.
        
        if( request.approvals[msg.sender] == false)
        {
            request.approvalCount++; // incrementing the number of yes votes.

        }
        request.approvals[msg.sender]=true; // user has now voted.
         
     }
     
     function finalizeRequest(uint index) public restricted {// index is the request which the user is trying to finalize.
        Request storage request = requests[index];
        
        require(request.approvalCount >= (contributorCount /2));
        require(!request.complete); // we add ! so that the require message fails if the request is already completed.
        
        request.recipient.transfer(request.value); // the value that is mentioned in the spending request is transferred. The transfer property is available as recepient is an address.
        request.complete= true; // now complete is marked true so next time when this request is pressed to finalize, it fails. 
        
     }

     function getSummary() public view returns (uint, uint, uint, uint, address, string) {

        return (
            minimumContribution,
            this.balance,
            requests.length,
            contributorCount,
            manager,
            aboutCampaign
            );
     }

     function getRequestsCount() public view returns (uint) {
        return requests.length;
     }
     
}