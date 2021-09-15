// launch arangosh in terminal with
/usr/bin/arangosh --javascript.execute
// choose database
db._useDatabase('academic_db')
// import pregel
const pregel = require("@arangodb/pregel");
// start execution
const handle = pregel.start(
	"labelpropagation", // type of algorithm
	"nameOfTheGraph", // name of the graph on which to execute the algorithm
	{
		maxGSS: 100, // maximum iteration bound, default is 500
		resultField: "community" // attribute field where to place the result for each vertex's detected community
	}
);
// check the status periodically for completion
pregel.status(handle);