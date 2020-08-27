// Layout for the web page.

import React from "react";
import { Container } from "semantic-ui-react"; // for fitting the content on mid screen
import Head from "next/head";
import Header from "./Header";

/* children property is the content between <Layout></Layout> from index.js render */
export default props => {
	return (
		<Container>
			<Head>
				<link // Link from semantic ui react site
					rel="stylesheet"
					href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
				/>
			</Head>

			<Header />
			<br />

			{props.children}
		</Container>
	);
};
