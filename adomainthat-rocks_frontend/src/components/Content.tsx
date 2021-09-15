import { Container, Row, Col, Spinner } from 'react-bootstrap';
import SearchFormNodeGraph from './SearchFormNodeGraph';
import CytoscapeGraph from './CytoscapeGraph';
import { useState } from 'react';
import { myApolloClient } from '../App';
import { gql } from '@apollo/client';
import './Content.css';

const Content = () => {
    const initialEmptyGraph = { data: { nodeGraph: { startNode: {}, vertices: [], edges: [] } } }
    const [graphData, setGraphData] = useState(initialEmptyGraph);
    const [isLoadingGraph, setIsLoadingGraph] = useState(false);

    const onNodeGraphSearchHandler = async (nodeId: String, minDepth: Number, maxDepth: Number) => {
        setGraphData(initialEmptyGraph);
        const getGraphDataQuery = gql`
            query {
                nodeGraph(node_id: "${nodeId}", minDepth: "${String(minDepth)}", maxDepth: "${String(maxDepth)}") {
                    startNode {
                          _id
                          graph_name
                    }
                    vertices {
                        ... on SlimNode {
                            _id
                            graph_name
                            community
                        }
                    }
                    edges {
                        ... on SlimEdge {
                            _from
                            _to
                            label
                        }
                    }
                    communities {
                        ... on Community {
                            number
                        }
                    }
                }
            }
        `;
        setIsLoadingGraph(true);
        const result = await myApolloClient.query({ query: getGraphDataQuery });
        setGraphData(result);
        setIsLoadingGraph(false);
    };

    return (
        <Container>
            <Row className="content">
                <Col xs={12} md={3}>
                    <SearchFormNodeGraph onSearchHandler={onNodeGraphSearchHandler} isLoadingGraph={isLoadingGraph}/>
                </Col>
                <Col xs={12} md={9}>
                    <div className="graphContainer">
                        {/*TODO Use isLoadingGraph variable inside CytoscapeGraph component through props in order to display a spinner while the request is in progres*/}
                        {graphData && graphData.data && graphData.data.nodeGraph && graphData.data.nodeGraph.vertices && graphData.data.nodeGraph.vertices.length > 0 ? <CytoscapeGraph graphApiResponse={graphData}/> : isLoadingGraph ?
                            <div className="infoText">Loading graph ...
                            <br/>
                            <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        /></div> : <div className="infoText">Search to display a graph</div> }
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Content;
