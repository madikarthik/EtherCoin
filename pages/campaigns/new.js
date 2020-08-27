import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory"; // factory is the instance of the contract from factory.js
import web3 from "../../ethereum/web3"; // for .send of onSubmit function
import { Router, Link } from "../../routes"; // from the routes.js

// component
class CampaignNew extends Component {
	state = {
		minimumContribution: "",
		aboutCampaign: "",
		errorMessage: "",
		loading: false
	};

	// Creating a campaign
	onSubmit = async event => {
		event.preventDefault(); // prevents the browser from submitting the form

		this.setState({ loading: true, errorMessage: "" }); // as soon as the user clicks create.
		try {
			const accounts = await web3.eth.getAccounts();

			await factory.methods
				.createCampaign(
					this.state.minimumContribution,
					this.state.aboutCampaign
				)
				.send({
					from: accounts[0]
				});

			//Router.pushRoute("/");
			window.setTimeout(Router.pushRoute("/"), 3000); // pushing the user back to the index page after 3secs on successful transaction.
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
	};

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
						<font face="Helvetica">
							CREATE A NEW CAMPAIGN ON ETHERCOIN
						</font>
					</h1>
				</center>
				<hr />
				<marquee scrollamount="12" bgcolor="3b5998">
					<big>
						<font color="ffffff">
							Hey there! On publishing your campaign you will be
							marked as the MANAGER and you will be able to CREATE
							and FINALIZE spending requests.{" "}
							<i> NOTE: NO OTHER USERS WILL BE ABLE TO DO SO. </i>
						</font>
					</big>
				</marquee>
				<br />
				<br />
				<Form
					onSubmit={this.onSubmit}
					error={!!this.state.errorMessage}
				>
					<br />
					<Form.Field>
						<strong>
							<label>
								WHAT IS THE MINIMUM CONTRIBUTION YOU REQUIRE?
							</label>
						</strong>
						<Input
							label="wei"
							labelPosition="right"
							placeholder="This is the minimum amount you expect from each contributor."
							value={this.state.minimumContribution}
							onChange={event =>
								this.setState({
									minimumContribution: event.target.value
								})
							}
						/>
					</Form.Field>
					<br />
					<br />

					<Form.Field>
						<strong>
							<label> WHAT ARE YOU BUILDING/DEVELOPING?</label>
						</strong>
						<Input
							label="Description"
							labelPosition="right"
							placeholder="Something about your idea for the contributors to take interest."
							value={this.state.aboutCampaign}
							onChange={event =>
								this.setState({
									aboutCampaign: event.target.value
								})
							}
						/>
					</Form.Field>
					<br />

					<Message
						error
						header="Oops!"
						content={this.state.errorMessage}
					/>
					<center>
						<Button loading={this.state.loading} color="facebook">
							✔ Publish Campaign ✔
						</Button>
					</center>
				</Form>
			</Layout>
		);
	}
}

export default CampaignNew;
