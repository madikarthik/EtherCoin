/* pre-configured instance of our campaign factory

Using the instance of this contract we can generate 
instances of campaigns.*/

import web3 from "./web3"; // the file that we created to import web3 provider

import CampaignFactory from "./build/CampaignFactory.json"; // for the abi of the campaign factory

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	"0x7248xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" // this address is the address to which we deploy the application
	// this address is generated on running: node deploy.js located in ethereum folder.
	// replace 0x7248xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx with the address that you get on running the above command.
);

export default instance;


