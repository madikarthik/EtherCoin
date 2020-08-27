// index.js is the root route.

import React, { Component } from "react";
import factory from "../ethereum/factory"; // the factory instance that we created
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout"; // importing the layout from components folder
import { Link, Router } from "../routes";

// class based component:

class CampaignIndex extends Component {
	static async getInitialProps() {
		// this is for NEXT (for server side rendering)

		const campaigns = await factory.methods.getDeployedCampaigns().call();

		return { campaigns };
	}

	// showing list of campaigns on screen.

	renderCampaigns() {
		const items = this.props.campaigns.map(address => {
			return {
				header: address,
				description: (
					<Link route={`/campaigns/${address}`}>
						<a> Click here to view and help this campaign </a>
					</Link>
				),
				fluid: true
			};
		});
		return <Card.Group items={items} />;
	}

	// render is like main, most important for loading content on screen

	render() {
		return (
			<Layout>
				<marquee scrollamount="8" bgcolor="3b5998">
					<big>
						<font color="ffffff">
							Welcome to ETHERCOIN! A platform where people help
							you bring your ideas to life!
						</font>
					</big>
				</marquee>

				<Link route="/campaigns/new">
					<a>
						<Button
							icon="add circle"
							color="red"
							floated="left"
							fluid="true"
						>
							<font color="white">＋ Create a New Campaign!</font>
						</Button>
					</a>
				</Link>
				<br />
				<br />

				<br />
				<hr />
				<div>
					<center>
						<h1>
							<font face="Helvetica">
								ACTIVE CAMPAIGNS ON ETHERCOIN
							</font>
						</h1>
					</center>
					<hr />
					<br />
					<br />
					<br />
					{this.renderCampaigns()}
				</div>
			</Layout>
		);
	}
}

export default CampaignIndex;
