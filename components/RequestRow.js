/* This component is for rendering one individual row of request-details 
at a time */

import React, { Component } from "react";
import web3 from "../ethereum/web3";
import { Table, Button } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import { Router } from "../routes";

class RequestRow extends Component {
	// function for onClick approve button
	onApprove = async () => {
		const campaign = Campaign(this.props.address);
		const accounts = await web3.eth.getAccounts();
		await campaign.methods.approveRequest(this.props.id).send({
			from: accounts[0]
		});
		Router.pushRoute(`/campaigns/${this.props.address}/requests`);
	};
	// function for onClick finalize button
	onFinalize = async () => {
		const campaign = Campaign(this.props.address);
		const accounts = await web3.eth.getAccounts();
		await campaign.methods.finalizeRequest(this.props.id).send({
			from: accounts[0]
		});
		Router.pushRoute(`/campaigns/${this.props.address}/requests`);
	};

	render() {
		const { Row, Cell } = Table;
		const { id, request, contributorCount } = this.props; // now under rows we dont have to call {this.props.id} ... we can directly give {id}.
		const readyToFinalize =
			request.approvalCount >= contributorCount / 2 &&
			request.approvalCount != 0;

		return (
			<Row
				disabled={request.complete}
				positive={readyToFinalize && !request.complete}
				negative={!readyToFinalize && !request.complete}
				warning={
					request.approvalCount == contributorCount / 2 ||
					(request.approvalCount && contributorCount == 0)
				}
			>
				<Cell> {id} </Cell>

				<Cell> {request.description} </Cell>

				<Cell> {web3.utils.fromWei(request.value, "ether")} </Cell>

				<Cell> {request.recipient} </Cell>

				<Cell>
					{request.approvalCount}/{contributorCount}
				</Cell>

				<Cell>
					{request.complete ? null : (
						<Button color="blue" basic onClick={this.onApprove}>
							Approve
						</Button>
					)}
				</Cell>

				<Cell>
					{request.complete ? null : (
						<Button color="yellow" basic onClick={this.onFinalize}>
							Finalize
						</Button>
					)}
				</Cell>
			</Row>
		);
	}
}

export default RequestRow;
