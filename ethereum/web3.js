/* web3 instance with configured providers.
This file gets executed two times, once on the NEXT server 
and once on the users browser.*/

import Web3 from "web3";

let web3;

// node returns undefined for typeof windows, thus this case:

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
	// checking if it is running on the browser (windows is a global variable) && metamask is running.

	web3 = new Web3(window.web3.currentProvider);
} else {
	// user is on the server or the user is not running metamask

	const provider = new Web3.providers.HttpProvider(
		"https://rinkeby.infura.io/v3/xxxxxxxxxxxxxxxxxxxxxx" // our infura link goes here
	);

	web3 = new Web3(provider);
}

export default web3;
