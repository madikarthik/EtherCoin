/* this file on running "node deploy.js" give two addresses:
 1) from address
 2) To address

 The "To" address is the address on which the factory contract is deployed.
 This "To" is used in factory.js
 */

const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");

//we only deploy the factory contract so:
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
	"your metamask seed goes here", // you have to provide your 12 word metamask seed here.
	"https://rinkeby.infura.io/v3/xxxxxxxxxxxxxxxxxxxxxx" // you have to provide your rinkby - infura test link here to run this
);
const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log("Attempting to deploy from account", accounts[0]);

	const result = await new web3.eth.Contract(
		JSON.parse(compiledFactory.interface)
	)
		.deploy({ data: "0x" + compiledFactory.bytecode }) // added "0x" +
		.send({ /*gas: "1000000",*/ from: accounts[0] }); // removed gas. These changes are for updated truffle wallet

	console.log("Contract deployed to", result.options.address);
};
deploy();
