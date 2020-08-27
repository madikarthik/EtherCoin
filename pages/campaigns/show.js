/* This component/page is for the user to visit the address of 
campaign(from the description of the campaigns lists via 
renderCampaigns() in index.js) and check out its details*/

/*note that "ContributionForm address={this.props.address} />" in render() passes the current
campaign address to the ContributeForm.js component and then we can access the 
current campaign address there also*/

import React, { Component } from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

class CampaignShow extends Component {
	static async getInitialProps(props) {
		// this is for NEXT (for server side rendering)

		// Campaign is the function which generates INTERFACE of the contract.
		// **** We pass the address (on which, the instance of the campaign is deployed) to the interface to fetch details of the particular campaign. ****
		const campaign = Campaign(props.query.address); // campaign is the interace. The routes.js will parse the url and get the address of campaign from ":address woldcard property"
		const summary = await campaign.methods.getSummary().call(); // getting the details from the campaign from its instance

		return {
			address: props.query.address, // storing the address of the campaign. Fetched from URL. Accessed it in ContributionForm Address below in render().
			minimumContribution: summary[0], // accessing the returned object
			balance: summary[1],
			requestsCount: summary[2],
			contributorsCount: summary[3],
			manager: summary[4],
			aboutCampaign: summary[5]
		};
	}

	renderCards() {
		const {
			minimumContribution,
			balance,
			requestsCount,
			contributorsCount,
			manager,
			aboutCampaign
		} = this.props; // destructuring from this.props

		// creating custom card items objects to display on screen
		const items = [
			//item obj1
			{
				header: "About this campaign",

				meta: " What is this campaign for?",

				description: aboutCampaign
			},

			// item obj2
			{
				header: manager,
				meta: "Address of the Manager",
				description:
					"The manager created this campaign and can create requests to withdraw money",
				style: { overflowWrap: "break-word" }
			},

			//item obj3
			{
				header:
					web3.utils.fromWei(minimumContribution, "ether") +
					" ETH " +
					"/ " +
					minimumContribution +
					" Wei ",
				meta: "Minimum contribution required ",
				description:
					"You must contribute at least " +
					minimumContribution +
					" Wei to help this campaign."
			},

			// item obj4

			{
				header:
					web3.utils.fromWei(balance, "ether") +
					" ETH " +
					" / " +
					balance +
					" Wei ",
				meta: "Campaign Balance",
				description:
					"These are the funds left in this campaign. The manager can initiate spending requests to use it. "
			},

			// item obj5
			{
				header: contributorsCount,
				meta: "People contributed to this campaign.",
				description:
					"This is the count of people who have contributed to the campaign. These people can approve spending requests for progress of this campaign "
			},

			// item obj6
			{
				header: requestsCount,
				meta: "Number of spending requests initiated by the manager",
				description:
					"A request created by the manager is to use the contributed funds for this campaign. These requests must be approved by the contributors."
			}
		];

		return <Card.Group items={items} />;
	}

	render() {
		return (
			<Layout>
				<Link route={`/`}>
					<a>
						<Button secondary> Back </Button>
					</a>
				</Link>
				<hr />
				<center>
					<h1>
						<font face="helvetica"> ABOUT THIS CAMPAIGN </font>{" "}
					</h1>
				</center>
				<hr />
				<marquee scrollamount="12" bgcolor="3b5998" text="white">
					<big>
						<font color="ffffff">
							If you contribute to this campaign you can take
							decisions on the spending requests and be a part of
							its development.{" "}
							<i>
								NOTE: YOU WILL ONLY BE ABLE TO APPROVE ONCE PER
								REQUEST (EVEN IF YOU HAVE CONTRIBUTED MULTIPLE
								TIMES).
							</i>
						</font>
					</big>
				</marquee>
				<br />
				<br />
				<br />
				<Grid>
					<Grid.Row>
						<Grid.Column width={10}>
							{this.renderCards()}
						</Grid.Column>

						<Grid.Column width={6}>
							<ContributeForm
								label="ETH"
								address={this.props.address}
							/>
						</Grid.Column>
					</Grid.Row>

					<Grid.Row>
						<Grid.Column>
							<Link
								route={`/campaigns/${this.props.address}/requests`}
							>
								<center>
									<a>
										<Button
											fluid="true"
											color="google plus"
										>
											Click here to see all the spending
											requests created by the Manager
										</Button>
									</a>
								</center>
							</Link>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Layout>
		);
	}
}

export default CampaignShow;
