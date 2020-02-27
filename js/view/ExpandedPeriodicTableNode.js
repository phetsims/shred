// Copyright 2015-2020, University of Colorado Boulder

/**
 *
 * @author Aadish Gupta (PhET Interactive Simulations)
 */

import Vector2 from '../../../dot/js/Vector2.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Line from '../../../scenery/js/nodes/Line.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Text from '../../../scenery/js/nodes/Text.js';
import TextPushButton from '../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../tandem/js/Tandem.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shredStrings from '../shred-strings.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';
import PeriodicTableNode from './PeriodicTableNode.js';

// constants
// 2D array that defines the table structure.
const POPULATED_CELLS = [
  [ 0, 8 ],
  [ 0, 1, 3, 4, 5, 6, 7, 8 ],
  [ 0, 1, 3, 4, 5, 6, 7, 8 ]
];

const ENABLED_CELL_COLOR = ShredConstants.DISPLAY_PANEL_BACKGROUND_COLOR;
const SELECTED_CELL_COLOR = '#FA8072'; //salmon
const BUTTON_SIZE = 50;

const periodicTableString = shredStrings.periodicTable;

/**
 * @param {NumberAtom} numberAtom
 * @param {number} interactiveMax
 * @param {Object} [options]
 * @constructor
 */
function ExpandedPeriodicTableNode( numberAtom, interactiveMax, options ) {
  options = merge( {
    tandem: Tandem.REQUIRED
  }, options );

  Node.call( this );
  const self = this;
  const periodicTableNode = new PeriodicTableNode( numberAtom, {
    tandem: options.tandem && options.tandem.createTandem( 'periodicTable' ),
    interactiveMax: interactiveMax,
    showLabels: false
  } );
  periodicTableNode.scale( 0.5 );
  this.addChild( periodicTableNode );

  this.cells = [];
  const expandedRowsNode = new Node();
  let elementIndex = 1;
  let rows = 1;
  if ( interactiveMax > 2 && interactiveMax <= 10 ) {
    rows = 2;
  }
  else if ( interactiveMax > 10 ) {
    rows = 3;
  }
  for ( var i = 0; i < rows; i++ ) {
    var populatedCellsInRow = POPULATED_CELLS[ i ];
    var j = 0;
    _.times( populatedCellsInRow.length, function() {
      const atomicNumber = elementIndex;
      const button = new TextPushButton( AtomIdentifier.getSymbol( elementIndex ), {
        listener: function() {
          numberAtom.setSubAtomicParticleCount( atomicNumber,
            AtomIdentifier.getNumNeutronsInMostCommonIsotope( atomicNumber ), atomicNumber );
        },
        baseColor: ENABLED_CELL_COLOR,
        cornerRadius: 0,
        minWidth: BUTTON_SIZE,
        maxWidth: BUTTON_SIZE,
        minHeight: BUTTON_SIZE,
        maxHeight: BUTTON_SIZE,
        font: new PhetFont( 24 )
      } );
      button.translation = new Vector2( populatedCellsInRow[ j ] * BUTTON_SIZE, i * BUTTON_SIZE );
      self.cells.push( button );
      expandedRowsNode.addChild( button );
      j++;
      elementIndex++;

    } );
  }
  expandedRowsNode.top = periodicTableNode.bottom - 30;
  periodicTableNode.centerX = expandedRowsNode.centerX;
  this.addChild( expandedRowsNode );

  const connectingLineOptions = { stroke: 'gray', lineDash: [ 9, 6 ] };
  const leftConnectingLine = new Line( periodicTableNode.left, periodicTableNode.top,
    expandedRowsNode.left, expandedRowsNode.top, connectingLineOptions );
  this.addChild( leftConnectingLine );

  const rightConnectingLine = new Line( periodicTableNode.right, periodicTableNode.top,
    expandedRowsNode.right, expandedRowsNode.top, connectingLineOptions );
  this.addChild( rightConnectingLine );

  const periodicTableTitle = new Text( periodicTableString, { font: new PhetFont( { size: 16, weight: 'bold' } ) } );
  periodicTableTitle.bottom = periodicTableNode.top - 5;
  periodicTableTitle.centerX = periodicTableNode.centerX;
  this.addChild( periodicTableTitle );
  // Highlight the cell that corresponds to the atom.
  let highlightedButton = null;
  numberAtom.protonCountProperty.link( function( protonCount ) {
    if ( highlightedButton !== null ) {
      highlightedButton.baseColor = ENABLED_CELL_COLOR;
    }
    if ( protonCount > 0 && protonCount <= self.cells.length ) {
      highlightedButton = self.cells[ protonCount - 1 ];
      highlightedButton.baseColor = SELECTED_CELL_COLOR;
    }
  } );
}

shred.register( 'ExpandedPeriodicTableNode', ExpandedPeriodicTableNode );

inherit( Node, ExpandedPeriodicTableNode );
export default ExpandedPeriodicTableNode;