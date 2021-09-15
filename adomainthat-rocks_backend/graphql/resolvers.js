import { getNodesIDByName2, getNodesIDByName3, getNodesIDByName5, getNodeGraph } from './resolverFunctions.js';

const resolvers = {
    Query: {
        nodesID2: async (root, args) => await getNodesIDByName2(args.name),
        nodesID3: async (root, args) => await getNodesIDByName3(args.name),
        nodesID5: async (root, args) => await getNodesIDByName5(args.name),
        nodeGraph: async (root, args) => await getNodeGraph(args.node_id, args.minDepth, args.maxDepth)
    }
};

export { resolvers }