import React, { Component } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class ContributeForm extends Component {
	state = {
		value: "",
		errorMessage: "",
		loading: false
	};

	onSubmit = async event => {
		event.preventDefault();

		const campaign = Campaign(this.props.address);

		this.setState({ loading: true, errorMessage: "" });

		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.contribute().send({
				from: accounts[0],
				value: web3.utils.toWei(this.state.value, "ether")
			});
			window.setTimeout(
				Router.replaceRoute(`/campaigns/${this.props.address}`),
				3000
			); // refreshing the page immediately after the contribution.
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false, value: "" });
	};

	render() {
		return (
			<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />

				<Form.Field>
					<lable>
						<strong>
							CONTRIBUTE TO HELP AND BE A PART OF THIS CAMPAIGN:
						</strong>
					</lable>

					<br />
					<br />
					<Input
						value={this.state.value}
						onChange={event =>
							this.setState({ value: event.target.value })
						}
						label="ETH"
						labelPosition="right"
						placeholder="Every contribution matters for bringing ideas to life"
					/>
				</Form.Field>

				<br />

				<center>
					<Message
						error
						header="Oops!"
						content={this.state.errorMessage}
					/>
					<Button color="facebook" loading={this.state.loading}>
						Contribute!
					</Button>
				</center>
			</Form>
		);
	}
}

export default ContributeForm;
