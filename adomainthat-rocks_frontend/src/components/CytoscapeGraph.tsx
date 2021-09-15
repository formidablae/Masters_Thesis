import {useEffect, useRef} from 'react';
import Cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
// @ts-ignore
import COSEBilkent from 'cytoscape-cose-bilkent';
// @ts-ignore
import Cola from "cytoscape-cola";
// @ts-ignore
import fcose from 'cytoscape-fcose';
// @ts-ignore
import cytoscapeExpandCollapse from 'cytoscape-expand-collapse';
// @ts-ignore
import popper from 'cytoscape-popper';
// @ts-ignore
import tippy from 'tippy.js';

import 'tippy.js/dist/tippy.css'; // optional for styling


//cytoscapeExpandCollapse(Cytoscape);
Cytoscape.use(COSEBilkent);
Cytoscape.use(Cola);
Cytoscape.use(fcose);
Cytoscape.use(popper);

const CytoscapeGraph = (props: any) => {
    const APIresponseStartNode = props.graphApiResponse.data.nodeGraph.startNode;
    const APIresponseNodes = props.graphApiResponse.data.nodeGraph.vertices;
    const APIresponseEdges = props.graphApiResponse.data.nodeGraph.edges;
    const APIresponseCmmunities = props.graphApiResponse.data.nodeGraph.communities;

    let base_height = 20;
    let base_width = 20;
    let base_font_size = 7;
    let the_selectable = true;
    let the_locked = false;
    let the_grabbable = true;
    let base_border_width = 0;
    let the_border_style = 'solid';

    const mappedNodes = APIresponseNodes.map((n: { _id: any; graph_name: any; community: any }, index: any) => {
        let the_type = n._id.split('/')[0];
        let the_name = n.graph_name.substring(0, 20);
        let the_community = n.community;
        let the_width = 0;
        let the_height = 0;
        let the_shape = '';
        let the_background_color = '';
        let the_font_size = 0;
        let the_border_width = 0 + base_border_width;

        switch (the_type) {
            case ('affiliation_institution'):
                the_width = 0.75 * base_width;
                the_height = 0.75 * base_height;
                the_font_size = 0.8 * base_font_size;
                the_shape = 'round-heptagon';
                the_background_color = 'yellow';
                break;
            case ('author'):
                the_width = 1 * base_width;
                the_height = 1 * base_height;
                the_font_size = 1 * base_font_size;
                the_shape = 'circle';
                the_background_color = 'green';
                break;
            case ('editor'):
                the_width = 0.5 * base_width;
                the_height = 0.5 * base_height;
                the_font_size = 0.8 * base_font_size;
                the_shape = 'round-pentagon';
                the_background_color = 'gray';
                break;
            case ('journal'):
                the_width = 0.5 * base_width;
                the_height = 0.5 * base_height;
                the_font_size = 0.8 * base_font_size;
                the_shape = 'round-rectangle';
                the_background_color = 'pink';
                break;
            case ('publication'):
                the_width = 0.75 * base_width;
                the_height = 0.75 * base_height;
                the_font_size = 0.6 * base_font_size;
                the_shape = 'octagon';
                the_background_color = 'blue';
                break;
            case ('school'):
                the_width = 0.67 * base_width;
                the_height = 0.67 * base_height;
                the_font_size = 0.6 * base_font_size;
                the_shape = 'round-hexagon';
                the_background_color = 'red';
                break;
            case ('series'):
                the_width = 0.5 * base_width;
                the_height = 0.5 * base_height;
                the_font_size = 0.6 * base_font_size;
                the_shape = 'round-diamond';
                the_background_color = 'purple';
                break;
            default:
                break;
        }

        if (n._id === APIresponseStartNode._id) {
            the_width = 2 * base_width;
            the_height = 2 * base_height;
            the_background_color = 'gray';
            the_font_size = 1 * base_font_size;
            the_border_width = 0.5 + base_border_width;
            the_border_style = 'dotted';
        }

        let constructed_node = {
            data: {
                id: n._id,
                'label': the_name,
                'parent': the_community
            },
            style: {
                width: the_width,
                height: the_height,
                'background-color': the_background_color,
                shape: the_shape,
                'font-size': the_font_size,
                'border-width': 0 + the_border_width,
                'border-style': the_border_style,
                'color': "white"
            },
            position: {
                x: Math.floor(Math.random() * 1000),
                y: Math.floor(Math.random() * 1000)
            },
            labelPosition: "bottom",
            selectable: the_selectable,
            locked: the_locked,
            grabbable: the_grabbable
        };

        return constructed_node;
    });

    const mappedEdges = APIresponseEdges.map((e: { _from: any; _to: any; }, index: any) => {
        let constructed_edge = {
            data: {
                source: e._from,
                target: e._to,
                label: 'edge'
            },
            style: {
                width: 0.25
            }
        };
        return constructed_edge;
    });

    const mappedCommunities = APIresponseCmmunities.map((c: { number: any; }, index: any) => {
        let constructed_community = {
            data: {
                id: c.number,
                'label': 'Community ' + c.number
            },
            style: {
                'background-color': 'black',
                'background-opacity': 0.25,
                'color': "white",
                shape: 'round-rectangle'
            },
            selectable: the_selectable,
            locked: the_locked,
            grabbable: the_grabbable
        };
        return constructed_community;
    });

    const graphElements = [...mappedNodes, ...mappedEdges, ...mappedCommunities];

    let coseLayoutOptions = {
        name: 'cose',

        // Called on `layoutready`
        ready: function () {
        },

        // Called on `layoutstop`
        stop: function () {
        },

        // Whether to animate while running the layout
        // true : Animate continuously as the layout is running
        // false : Just show the end result
        // 'end' : Animate with the end result, from the initial positions to the end positions
        animate: true,

        // Easing of the animation for animate:'end'
        animationEasing: undefined,

        // The duration of the animation for animate:'end'
        animationDuration: 500,

        // A function that determines whether the node should be animated
        // All nodes animated by default on animate enabled
        // Non-animated nodes are positioned immediately when the layout starts
        animateFilter: function (node: any, i: any) {
            return true;
        },


        // The layout animates only after this many milliseconds for animate:true
        // (prevents flashing on fast runs)
        animationThreshold: 250,

        // Number of iterations between consecutive screen positions update
        refresh: 20,

        // Whether to fit the network view after when done
        fit: true,

        // Padding on fit
        padding: 20,

        // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        boundingBox: undefined,

        // Excludes the label when calculating node bounding boxes for the layout algorithm
        nodeDimensionsIncludeLabels: true,

        // Randomize the initial positions of the nodes (true) or use existing positions (false)
        randomize: true,

        // Extra spacing between components in non-compound graphs
        componentSpacing: 150,

        // Node repulsion (non overlapping) multiplier
        nodeRepulsion: function (node: any) {
            return 4500;
        },

        // Node repulsion (overlapping) multiplier
        nodeOverlap: 4,

        // Ideal edge (non nested) length
        idealEdgeLength: function (edge: any) {
            return 32;
        },

        smartRestLength: true,

        // Divisor to compute edge forces
        edgeElasticity: function (edge: any) {
            return 32;
        },

        // Nesting factor (multiplier) to compute ideal edge length for nested edges
        nestingFactor: 1.2,

        // Gravity force (constant)
        gravity: 0.25,

        // Maximum number of iterations to perform
        numIter: 1000,

        // Initial temperature (maximum node displacement)
        initialTemp: 1000,

        // Cooling factor (how the temperature is reduced between consecutive iterations
        coolingFactor: 0.99,

        // Lower temperature threshold (below this point the layout will end)
        minTemp: 1.0
    };

    let coseBilkentLayoutOptions = {
        name: 'cose-bilkent',

        // Called on `layoutready`
        ready: function () {
        },

        // Called on `layoutstop`
        stop: function () {
        },

        // Type of layout animation. The option set is {'during', 'end', false}
        animate: 'end',

        // Duration for animate:end
        animationDuration: 500,

        // Extra spacing between components in non-compound graphs
        componentSpacing: 150,

        // Divisor to compute edge forces
        edgeElasticity: 0.45,

        // Whether to fit the network view after when done
        fit: true,

        // Gravity force (constant)
        gravity: 0.25,

        // Gravity force (constant) for compounds
        gravityCompound: 1.0,

        // Gravity range (constant)
        gravityRange: 3.8,

        // Gravity range (constant) for compounds
        gravityRangeCompound: 1.5,

        // Ideal (intra-graph) edge length
        //idealEdgeLength: Math.min(base_height, base_width) * 10,

        // Initial cooling factor for incremental layout
        initialEnergyOnIncremental: 0.5,

        // Lower temperature threshold (below this point the layout will end)
        minTemp: 1.0,

        // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
        nestingFactor: 0.1,

        // Whether to include labels in node dimensions. Useful for avoiding label overlap
        nodeDimensionsIncludeLabels: true,

        // Node repulsion (overlapping) multiplier
        nodeOverlap: 4,

        // Node repulsion (non overlapping) multiplier
        nodeRepulsion: 4500,

        // Maximum number of iterations to perform
        numIter: 2500,

        // Padding on fit
        padding: 10,

        // 'draft', 'default' or 'proof"
        // - 'draft' fast cooling rate
        // - 'default' moderate cooling rate
        // - "proof" slow cooling rate
        quality: 'default',

        // Randomize the initial positions of the nodes (true) or use existing positions (false)
        randomize: true,
        // number of ticks per frame; higher is faster but more jerky
        refresh: 30,
        // Whether to tile disconnected nodes
        tile: true,
        // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
        tilingPaddingVertical: 10,
        // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
        tilingPaddingHorizontal: 10

    };

    let colaSpringyLayoutOptions = {
        name: 'cola',

        // Called on `layoutready`
        ready: function () {
        },

        // Called on `layoutstop`
        stop: function () {
        },

        fit: true, // whether to fit the viewport to the graph
        padding: 10, // the padding on fit
        animate: true,
        edgeLength: 300, // sets edge length directly in simulation
        nodeSpacing: 50
    };

    let fcodeLayoutOptions = {

        name: 'fcose',

        // 'draft', 'default' or 'proof'
        // - "draft" only applies spectral layout
        // - "default" improves the quality with incremental layout (fast cooling rate)
        // - "proof" improves the quality with incremental layout (slow cooling rate)
        quality: "default",
        // Use random node positions at beginning of layout
        // if this is set to false, then quality option must be "proof"
        randomize: true,
        // Whether or not to animate the layout
        animate: true,
        // Duration of animation in ms, if enabled
        animationDuration: 1000,
        // Easing of animation, if enabled
        animationEasing: undefined,
        // Fit the viewport to the repositioned nodes
        fit: true,
        // Padding around layout
        padding: 30,
        // Whether to include labels in node dimensions. Valid in "proof" quality
        nodeDimensionsIncludeLabels: true,
        // Whether or not simple nodes (non-compound nodes) are of uniform dimensions
        uniformNodeDimensions: true,
        // Whether to pack disconnected components - cytoscape-layout-utilities extension should be registered and initialized
        packComponents: true,
        // Layout step - all, transformed, enforced, cose - for debug purpose only
        step: "all",

        /* spectral layout options */

        // False for random, true for greedy sampling
        samplingType: true,
        // Sample size to construct distance matrix
        sampleSize: 25,
        // Separation amount between nodes
        nodeSeparation: 75,
        // Power iteration tolerance
        piTol: 0.0000001,

        /* incremental layout options */

        // Node repulsion (non overlapping) multiplier
        nodeRepulsion: function (node: any) {
            return 4500;
        },
        // Ideal edge (non nested) length
        idealEdgeLength: function (edge: any) {
            return 50;
        },
        // Divisor to compute edge forces
        edgeElasticity: function (edge: any) {
            return 0.45;
        },
        // Nesting factor (multiplier) to compute ideal edge length for nested edges
        nestingFactor: 0.1,
        // Maximum number of iterations to perform - this is a suggested value and might be adjusted by the algorithm as required
        numIter: 2500,
        // For enabling tiling
        tile: true,
        // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
        tilingPaddingVertical: 10,
        // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
        tilingPaddingHorizontal: 10,
        // Gravity force (constant)
        gravity: 0.25,
        // Gravity range (constant) for compounds
        gravityRangeCompound: 1.5,
        // Gravity force (constant) for compounds
        gravityCompound: 1.0,
        // Gravity range (constant)
        gravityRange: 3.8,
        // Initial cooling factor for incremental layout
        initialEnergyOnIncremental: 0.3,

        /* constraint options */

        // Fix desired nodes to predefined positions
        // [{nodeId: 'n1', position: {x: 100, y: 200}}, {...}]
        fixedNodeConstraint: undefined,
        // Align desired nodes in vertical/horizontal direction
        // {vertical: [['n1', 'n2'], [...]], horizontal: [['n2', 'n4'], [...]]}
        alignmentConstraint: undefined,
        // Place two nodes relatively in vertical/horizontal direction
        // [{top: 'n1', bottom: 'n2', gap: 100}, {left: 'n3', right: 'n4', gap: 75}, {...}]
        relativePlacementConstraint: undefined,

        /* layout event callbacks */
        ready: () => {
        }, // on layoutready
        stop: () => {
        } // on layoutstop
    };

    let expandCollapseLayoutOptions = {
        name: 'cose-bilkent',
        layoutBy: null, // to rearrange after expand/collapse. It's just layout options or whole layout function. Choose your side!
        // recommended usage: use cose-bilkent layout with randomize: false to preserve mental map upon expand/collapse
        fisheye: true, // whether to perform fisheye view after expand/collapse you can specify a function too
        animate: true, // whether to animate on drawing changes you can specify a function too
        animationDuration: 1000, // when animate is true, the duration in milliseconds of the animation
        ready: function () {
        }, // callback when expand/collapse initialized
        undoable: true, // and if undoRedoExtension exists,

        cueEnabled: true, // Whether cues are enabled
        expandCollapseCuePosition: 'top-left', // default cue position is top left you can specify a function per node too
        expandCollapseCueSize: 12, // size of expand-collapse cue
        expandCollapseCueLineSize: 8, // size of lines used for drawing plus-minus icons
        expandCueImage: undefined, // image of expand icon if undefined draw regular expand cue
        collapseCueImage: undefined, // image of collapse icon if undefined draw regular collapse cue
        expandCollapseCueSensitivity: 1, // sensitivity of expand-collapse cues
        //edgeTypeInfo: "edgeType", // the name of the field that has the edge type, retrieved from edge.data(), can be a function, if reading the field returns undefined the collapsed edge type will be "unknown"
        groupEdgesOfSameTypeOnCollapse: false, // if true, the edges to be collapsed will be grouped according to their types, and the created collapsed edges will have same type as their group. if false the collapased edge will have "unknown" type.
        allowNestedEdgeCollapse: true, // when you want to collapse a compound edge (edge which contains other edges) and normal edge, should it collapse without expanding the compound first
        zIndex: 999 // z-index value of the canvas in which cue ımages are drawn
    };

    function makePopper(ele: any) {
        let ref = ele.popperRef(); // used only for positioning
        let dummyDomEle = document.createElement('div');
        // @ts-ignore
        ele.tippy = new tippy(dummyDomEle, { // tippy props:
            getReferenceClientRect: ref.getBoundingClientRect, // https://atomiks.github.io/tippyjs/v6/all-props/#getreferenceclientrect
            trigger: 'manual', // mandatory, we cause the tippy to show programmatically.
            content: () => {
                let content = document.createElement('div');
                content.innerHTML = ele.id();
                return content;
            }
        });
    }

// });
    return (<CytoscapeComponent
        elements={graphElements}
        style={{
            width: '100%',
            height: '75vh',
            //maxWidth: '100%',
            //left: '-0vw',
            backgroundColor: '#2F3034',
            border: 1
        }}
        cy={(cy) => {
            cy.ready(function () {
                cy.elements().forEach(function (ele: any) {
                    makePopper(ele);
                });
            });
            cy.elements().unbind('click');
            cy.elements().bind('click', (event: any) => event.target.tippy.show());

            cy.elements().unbind('mouseout');
            cy.elements().bind('mouseout', (event: any) => event.target.tippy.hide());
        }}
        // style={ { width: '500px', height: '75vh' } }
        // @ts-ignore
        layout={coseBilkentLayoutOptions}
    />)
};

export default CytoscapeGraph;
