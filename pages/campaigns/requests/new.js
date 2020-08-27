/* This file is for creating a new component which will provide 
a new form for creating a new spending request. Initiated by Manager */

import React, { Component } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Router, Link } from "../../../routes";
import Layout from "../../../components/Layout";

class RequestNew extends Component {
	state = {
		value: "",
		description: "",
		recipient: "",
		loading: false,
		errorMessage: ""
	};
	static async getInitialProps(props) {
		const { address } = props.query;

		return { address };
	}

	onSubmit = async event => {
		event.preventDefault();

		const campaign = Campaign(this.props.address);
		const { description, value, recipient } = this.state; // destructuring the state variable

		this.setState({ loading: true, errorMessage: "" });

		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods
				.createRequest(
					description,
					web3.utils.toWei(value, "ether"),
					recipient
				)
				.send({ from: accounts[0] });

			Router.pushRoute(`/campaigns/${this.props.address}/requests`); // on successful creation, the user is sent back to the requests page
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
	};

	render() {
		return (
			<Layout>
				<Link route={`/campaigns/${this.props.address}/requests`}>
					<a>
						<Button secondary> Back </Button>
					</a>
				</Link>
				<hr />

				<center>
					<h1>
						<font face="Helvetica">CREATE A SPENDING REQUEST </font>
					</h1>
				</center>
				<hr />
				<marquee scrollamount="8" bgcolor="ffd700" text="white">
					<big>
						<font color="black">
							Hey Manager! You will be able to finalize the
							request only if majority of contributors approve it.
						</font>
					</big>
				</marquee>
				<br />
				<br />
				<br />
				<Form
					onSubmit={this.onSubmit}
					error={!!this.state.errorMessage}
				>
					<Form.Field>
						<strong>
							<label>DESCRIPTION:</label>
						</strong>
						<Input
							placeholder="What are you planning to spend on? Your contributors need to know!"
							label="Where are the funds going?"
							labelPosition="right"
							value={this.state.description}
							onChange={event =>
								this.setState({
									description: event.target.value
								})
							}
						/>
					</Form.Field>
					<br />

					<Form.Field>
						<strong>
							<label> AMOUNT:</label>
						</strong>
						<Input
							placeholder="How much are you willing to spend on this? Dont forget to check the the available balance!"
							label="ETH"
							labelPosition="right"
							value={this.state.value}
							onChange={event =>
								this.setState({ value: event.target.value })
							}
						/>
					</Form.Field>
					<br />

					<Form.Field>
						<strong>
							<label> RECIPIENTS ADDRESS: </label>
						</strong>
						<Input
							placeholder="Enter the address of the Recipient. The funds automatically move to this address on finalization! "
							label="Who is receiving the funds?"
							labelPosition="right"
							value={this.state.recipient}
							onChange={event =>
								this.setState({ recipient: event.target.value })
							}
						/>
					</Form.Field>

					<br />
					<center>
						<Message
							error
							header="Oops!"
							content={this.state.errorMessage}
						/>
						<Button color="yellow" loading={this.state.loading}>
							<font color="black"> Create Spending Request</font>
						</Button>
					</center>
				</Form>
			</Layout>
		);
	}
}

export default RequestNew;
