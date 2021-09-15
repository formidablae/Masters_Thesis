import {useEffect, useRef} from 'react';
import Cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
// @ts-ignore
import COSEBilkent from 'cytoscape-cose-bilkent';
// @ts-ignore
import cytoscapeExpandCollapse from 'cytoscape-expand-collapse';
// @ts-ignore
import popper from 'cytoscape-popper';
// @ts-ignore
import tippy from 'tippy.js';

import 'tippy.js/dist/tippy.css';

Cytoscape.use(COSEBilkent);
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
				label: the_name,
				parent: the_community
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
			style: {width: 0.25}
		};
		return constructed_edge;
	});

	const mappedCommunities = APIresponseCmmunities.map((c: { number: any; }, index: any) => {
		let constructed_community = {
			data: {
			    id: c.number,
			    label: 'Community ' + c.number
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

	let coseBilkentLayoutOptions = {
		name: 'cose-bilkent',
		ready: function () {},
		stop: function () {},
		animate: 'end',
		animationDuration: 500,
		componentSpacing: 150,
		edgeElasticity: 0.45,
		fit: true,
		gravity: 0.25,
		gravityCompound: 1.0,
		gravityRange: 3.8,
		gravityRangeCompound: 1.5,
		initialEnergyOnIncremental: 0.5,
		minTemp: 1.0,
		nestingFactor: 0.1,
		nodeDimensionsIncludeLabels: true,
		nodeOverlap: 4,
		nodeRepulsion: 4500,
		numIter: 2500,
		padding: 10,
		quality: 'default',
		randomize: true,
		refresh: 30,
		tile: true,
		tilingPaddingVertical: 10,
		tilingPaddingHorizontal: 10

	};
	
	let expandCollapseLayoutOptions = {
		name: 'cose-bilkent',
		layoutBy: null,
		fisheye: true,
		animate: true,
		animationDuration: 1000,
		ready: function () {},
		undoable: true,
		cueEnabled: true,
		expandCollapseCuePosition: 'top-left',
		expandCollapseCueSize: 12,
		expandCollapseCueLineSize: 8,
		expandCueImage: undefined,
		collapseCueImage: undefined,
		expandCollapseCueSensitivity: 1,
		groupEdgesOfSameTypeOnCollapse: false,
		allowNestedEdgeCollapse: true,
		zIndex: 999
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
	
	return (<CytoscapeComponent
		elements={graphElements}
		style={{
			width: '100%',
			height: '75vh',
			backgroundColor: '#2F3034',
			border: 1
		}}
		cy={(cy) => {
			cy.ready(function () {
				cy.elements().forEach(function (ele: any) {makePopper(ele);});
			});
			cy.elements().unbind('click');
			cy.elements().bind('click', (event: any) => event.target.tippy.show());

			cy.elements().unbind('mouseout');
			cy.elements().bind('mouseout', (event: any) => event.target.tippy.hide());
		}}
		layout={coseBilkentLayoutOptions}
	/>)
};

export default CytoscapeGraph;