import { aql } from "arangojs";
import { db } from '../config/db.js';

const getNodesIDByName2 = async (name) => {
    try {
        let queryVar = aql`
            FOR n IN all_nodes
                FILTER  n.name == ${name}
                LIMIT 2
                RETURN { _id: n.id, graph_name: n.name, the_type: n.type }
        `
        return await (await db.query(queryVar)).all()
    } catch (e) { console.error("Error:\n" + e) };
};

const getNodesIDByName3 = async (name) => {
    try {
        let queryVar = aql`
            LET query_tokens = TOKENS(LOWER(${name}), "text_en")
            FOR n IN all_nodes
                LET count_token_hits = COUNT(
                    FOR t IN query_tokens
                        FILTER t IN n.tokens
                        RETURN 1
                )
                FILTER count_token_hits == LENGTH(query_tokens)
                LIMIT 3
                RETURN { _id: n.id, graph_name: n.name, the_type: n.type }
        `
        return await (await db.query(queryVar)).all()
    } catch (e) { console.error("Error:\n" + e) };
};

const getNodesIDByName5 = async (name) => {
    try {
        let queryVar = aql`
            LET query_tokens = TOKENS(LOWER(${name}), "text_en")
            FOR n IN all_nodes
                FOR t IN query_tokens
                    FILTER t IN n.tokens
                    LIMIT 5
                    RETURN DISTINCT { _id: n.id, graph_name: n.name, the_type: n.type }
        `
        return await (await db.query(queryVar)).all()
    } catch (e) { console.error("Error:\n" + e) };
};

const getNodeGraph = async (aID, minD, maxD) => {
    try {
        let queryVar = aql`
            LET graph_data = (
                FOR vertex, edge, path IN TO_NUMBER(${minD})..TO_NUMBER(${maxD})
                ANY ${aID} GRAPH author_publisher_editor_journal_publication_series_affiliation_school_cited_crossreffed
                    RETURN { vertices: path.vertices[*], edges: path.edges[*] }
            )
            LET allVertices = UNIQUE(FLATTEN(
                FOR el IN graph_data
                    RETURN el.vertices
            ))
            LET startN = (
                FOR el IN allVertices
                    FILTER el._id == ${aID}
                    LIMIT 1
                    RETURN el
            )
            LET allEdges = UNIQUE(FLATTEN(
                FOR el IN graph_data
                    RETURN el.edges
            ))
            LET allCommunities = UNIQUE(FLATTEN(
                FOR el IN allVertices
                    RETURN { number: el.community }
            ))
            RETURN { startNode: startN[0],
                     vertices: allVertices,
                     edges: allEdges,
                     communities: allCommunities }
        `
        return (await (await db.query(queryVar)).all())[0]
    } catch (e) { console.error("Error:\n" + e) };
};

export { getNodesIDByName2, getNodesIDByName3, getNodesIDByName5, getNodeGraph }