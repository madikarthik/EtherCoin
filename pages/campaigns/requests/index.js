/* This component is called when the user clicks on "View Requests" from 
"show.js" page. show.js is the component which renders the summary of a campaign. */

import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import { Link } from "../../../routes";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

// 197B Listing Requests
// 199A More Routing
class RequestIndex extends Component {
	static async getInitialProps(props) {
		const { address } = props.query;
		const campaign = Campaign(address);
		const requestCount = await campaign.methods.getRequestsCount().call();
		const contributorCount = await campaign.methods
			.contributorCount()
			.call();
		// as all the requests are stored as structs in an array, we cant directly fetch all the requests
		//so we do this :
		const requests = await Promise.all(
			Array(parseInt(requestCount)) // Array expects a number and not a string so we parseInt
				.fill() // fill gives a list of a list of different indices i.e if requestCount is 5, it gives 1,2,3,4,5.
				.map((element, index) => {
					return campaign.methods.requests(index).call();
				})
		);

		return { address, requests, requestCount, contributorCount };
	}

	renderRows() {
		return this.props.requests.map((request, index) => {
			return (
				<RequestRow
					key={index}
					id={index}
					request={request}
					address={this.props.address}
					contributorCount={this.props.contributorCount}
				/>
			);
		});
	}

	render() {
		const { Header, Row, HeaderCell, Body } = Table; // destructuring properties of Table component

		return (
			<Layout>
				<Link route={`/campaigns/${this.props.address}`}>
					<a>
						<Button secondary> Back </Button>
					</a>
				</Link>
				<hr />

				<center>
					<h1>
						<font face="Helvetica">
							SPENDING REQUESTS CREATED BY THE MANAGER FOR THIS
							CAMPAIGN
						</font>
					</h1>
					<hr />

					<marquee scrollamount="8" bgcolor="3b5998">
						<big>
							<font color="white">
								Only Contributors can APPROVE a request
							</font>
						</big>
					</marquee>

					<br />

					<marquee
						scrollamount="8"
						direction="right"
						bgcolor="FDB813"
					>
						<big>
							Only the Manager can ADD and FINALIZE a request
						</big>
					</marquee>
				</center>
				<br />
				<br />
				<Link route={`/campaigns/${this.props.address}/requests/new`}>
					<a>
						<Button
							color="yellow"
							floated="right"
							style={{ marginBottom: 30 }}
						>
							<font color="black">Add Request!</font>
						</Button>
					</a>
				</Link>

				<Table>
					<Header>
						<Row>
							<HeaderCell>ID</HeaderCell>
							<HeaderCell>Description</HeaderCell>
							<HeaderCell>Amount </HeaderCell>
							<HeaderCell>Recipient </HeaderCell>
							<HeaderCell>Approval Count</HeaderCell>
							<HeaderCell> Approve </HeaderCell>
							<HeaderCell>Finalize </HeaderCell>
						</Row>
					</Header>

					<Body>{this.renderRows()}</Body>
				</Table>
				<div>
					The Manager has created {this.props.requestCount} spending
					requests until now.
				</div>
			</Layout>
		);
	}
}

export default RequestIndex;
