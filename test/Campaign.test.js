// Boilerplate for the test file.
// Kind of similar to the the other projects

const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

// first moving out of the test directory and then giving the
// path for the CampaignFactory.json file and Campaign.json file
const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

/*............................................................................................................................................*/

//TESTING STARTS:

let accounts; // for listing out all the accounts from the ganache network.
let factory; // reference to the deployed instance of the factory.
let campaignAddress;
let campaign;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts(); // getting list of accounts

	//creating an instance of the factory campaign. Parsing the ABI(interface) from json to js
	factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
		.deploy({ data: compiledFactory.bytecode })
		.send({ from: accounts[0], gas: "1000000" });

	// creating a campaign
	await factory.methods.createCampaign("100", "test").send({
		from: accounts[0], // manager
		gas: "1000000"
	});

	const addresses = await factory.methods.getDeployedCampaigns().call(); // call as we are only viewing and not changing data on blockchain
	campaignAddress = addresses[0]; // taking the first deployed address

	// creating an instance of the campaign contract
	campaign = await new web3.eth.Contract(
		JSON.parse(compiledCampaign.interface),
		campaignAddress // dont have to give .deploy and .send because we have the deployed address of the first campaign from factory
	);
});

describe("Campaigns", () => {
	it("deploys a factory and a campaign", () => {
		assert.ok(factory.options.address); // checking the addresses of instances  deployed on ganache-cli
		assert.ok(campaign.options.address);
	});

	it("marks caller as the campaign manager", async () => {
		const manager = await campaign.methods.manager().call();
		assert.equal(accounts[0], manager);
	});

	it("allows people to contribute money and marks them as approvers", async () => {
		await campaign.methods.contribute().send({
			value: "200",
			from: accounts[1]
		});
		const isContributor = await campaign.methods
			.approvers(accounts[1]) // returns true or false
			.call();
		assert(isContributor); // if isContributor is true then the test passes else fails
	});

	it("requires a minimum contribution", async () => {
		try {
			await campaign.methods.contribute().send({
				value: "5",
				from: accounts[1]
			});
			assert(false); // always fails our test, no matter what
		} catch (err) {
			assert(err); // assert(false) results "yes something went wrong" and the test passes.
		}
	});

	it("allows a manager to make a payment request", async () => {
		await campaign.methods
			.createRequest("Buy batteries", "100", accounts[1])
			.send({
				from: accounts[0],
				gas: "1000000"
			});
		const request = await campaign.methods.requests(0).call(); // automatically generated getter because of "public" , needs and index as parameter.

		assert.equal("Buy batteries", request.description);
	});

	it("processes requests", async () => {
		await campaign.methods.contribute().send({
			from: accounts[0],
			value: web3.utils.toWei("10", "ether")
		});

		await campaign.methods
			.createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
			.send({ from: accounts[0], gas: "1000000" });

		await campaign.methods.approveRequest(0).send({
			from: accounts[0],
			gas: "1000000"
		});

		await campaign.methods.finalizeRequest(0).send({
			from: accounts[0],
			gas: "1000000"
		});

		let balance = await web3.eth.getBalance(accounts[1]);
		balance = web3.utils.fromWei(balance, "ether");
		balance = parseFloat(balance);

		assert(balance > 104);
	});
});
