// GENERATES THE INTERFACE FOR A CONTRACT DEPLOYED ON A PARTICULAR ADDRESS
// THIS FUNCTION IS CALLED IN SHOW.JS FOR CREATING AN INTERFACE INSTANCE

import web3 from "./web3";
import Campaign from "./build/Campaign.json"; // to get the ABI of the contract

export default address => {
	return new web3.eth.Contract(JSON.parse(Campaign.interface), address);
};
