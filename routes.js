/* For dynamic routing solution. We are using next-routes
NOTE: EVERYTIME A NEW ROUTE IS ADDED, WE NEED TO RESTART THE SERVER */

const routes = require("next-routes")(); // returms a function and is invoked automatically

routes.add("/campaigns/new", "/campaigns/new");
routes.add("/campaigns/:address", "/campaigns/show"); // arg1: ":address" is a wildcard , arg2: is the target page that should trigger from folder
routes.add("/campaigns/:address/requests", "/campaigns/requests/index"); // arg1: ":address" is a wildcard , arg2: is the target page that should trigger from folder
routes.add("/campaigns/:address/requests/new", "/campaigns/requests/new"); // arg1: ":address" is a wildcard , arg2: is the target page that should trigger from folder

module.exports = routes;
