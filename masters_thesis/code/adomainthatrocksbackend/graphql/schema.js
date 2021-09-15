const typeDefs = `
	type Affiliation {
		value: String
		label: String
		type: String
	}
	type Note {
		value: String
		label: String
		type: String
	}
	type Author {
		_id: String!
		name: String!
		orcid: String
		bibtex: String
		aux: String
		graph_name: String!
		kind: String
		other_orcid: String
		isnot: String
		url: [Url]
		other_names: [String]
		affiliation: [Affiliation]
		note: [Note]
	}
	type Publication {
		_id: String!
		title: String
		author: [String]
		year: String
		graph_name: String!
	}
	type Institution {
		_id: String!
		name: String!
		graph_name: String!
	}
    type Community {
        number: String!
    }
	type Url {
		address: String
		label: String
	}
	type Year {
		_id: String
		number: String
	}
	type SuggestedNode {
		_id: String!
		graph_name: String
		the_type: String
		appearances: Int
	}
	type SlimNode {
		_id: String!
		graph_name: String!
        community: String
	}
	type SlimEdge {
		_from: String!
		_to: String!
		label: String
	}
	type SlimGraph {
		startNode: SlimNode!
		vertices: [SlimNode!]
		edges: [SlimEdge]
        communities: [Community]
	}
	type Query {
		nodesID(name: String!): [SuggestedNode]
		nodeGraph(node_id: String!, minDepth: String = "1", maxDepth: String = "2"): SlimGraph!
	}
`

export { typeDefs }