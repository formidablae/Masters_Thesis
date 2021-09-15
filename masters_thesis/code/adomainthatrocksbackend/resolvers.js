import { getNodesIDByName, getNodeGraph } from './resolverFunctions.js';

const resolvers = {
    Query: {
	    nodesID: async (root, args) => await getNodesIDByName(args.name),
	    nodeGraph: async (root, args) => await getNodeGraph(args.node_id, args.minDepth, args.maxDepth)
	}
};

export { resolvers }