/* This file is for generating ABI and BYTECODE for both:
factory as well as campaign contracts.

This file automatically deletes the "build" folder and creates a new 
one on every successful compilation of the contracts written in solidity 
by the solc compiler*/

const path = require("path");
const solc = require("solc");
const fs = require("fs-extra"); // part of the node library, gives us file system access. This is an improved version of fs module

// 1. logic to delete the entire BUILD folder if it already exists.

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath); // removes the entire directory

// 2. read "campaign.sol" from the contracts folder

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8"); // getting the source code of our file.

// 3. Compile everything that we have pulled out of the contracts folder.

// output stores 2 objects. one object is the output from compiling the campaign contract
// and the other is from campaignFactory
const output = solc.compile(source, 1).contracts;

// 4. Before we store our content, we need to create the BUILD folder again
//because earlier we deleted that folder to remove old compiled files in the
//first step.

//if it doesnt then it creates it for us.
fs.ensureDirSync(buildPath);

// 5. now we are going to loop over the output object
// and take each contract that is inside it and then write
//it to seperate files inside the BUILD directory

for (let contract in output) {
	fs.outputJsonSync(
		path.resolve(buildPath, contract.replace(":", "") + ".json"),
		output[contract]
	);
}
