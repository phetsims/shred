// Copyright 2015-2019, University of Colorado Boulder

/**
 * Scenery node that defines a periodic table of the elements.
 */

import Vector2 from '../../../dot/js/Vector2.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Tandem from '../../../tandem/js/Tandem.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';
import PeriodicTableCell from './PeriodicTableCell.js';

// constants
// 2D array that defines the table structure.
const POPULATED_CELLS = [
  [ 0, 17 ],
  [ 0, 1, 12, 13, 14, 15, 16, 17 ],
  [ 0, 1, 12, 13, 14, 15, 16, 17 ],
  [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ],
  [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ],
  [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ],
  [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ]
];
const ENABLED_CELL_COLOR = ShredConstants.DISPLAY_PANEL_BACKGROUND_COLOR;
const DISABLED_CELL_COLOR = '#EEEEEE';
const SELECTED_CELL_COLOR = '#FA8072'; //salmon

/**
 * Constructor.
 *
 * @param {NumberAtom} numberAtom - Atom that defines which element is currently highlighted.
 * @param {Object} [options]
 * @constructor
 */
function PeriodicTableNode( numberAtom, options ) {
  options = merge( {
    interactiveMax: 0, //Atomic number of the heaviest element that should be interactive
    cellDimension: 25,
    showLabels: true,
    enabledCellColor: ENABLED_CELL_COLOR,
    disabledCellColor: DISABLED_CELL_COLOR,
    selectedCellColor: SELECTED_CELL_COLOR,
    tandem: Tandem.REQUIRED
  }, options );

  Node.call( this ); // Call super constructor.
  const self = this;

  // Add the cells of the table.
  this.cells = []; // @private
  let elementIndex = 1;
  for ( let i = 0; i < POPULATED_CELLS.length; i++ ) {
    const populatedCellsInRow = POPULATED_CELLS[ i ];
    const cellColor = {
      'enabled': options.enabledCellColor,
      'disabled': options.disabledCellColor,
      'selected': options.selectedCellColor
    };
    for ( let j = 0; j < populatedCellsInRow.length; j++ ) {
      const cell = new PeriodicTableCell( elementIndex, numberAtom, cellColor, {
        interactive: elementIndex <= options.interactiveMax,
        showLabels: options.showLabels,
        length: options.cellDimension,
        tandem: options.tandem.createTandem( AtomIdentifier.getEnglishName( elementIndex ) + 'Cell' )
      } );
      cell.translation = new Vector2( populatedCellsInRow[ j ] * options.cellDimension, i * options.cellDimension );
      this.addChild( cell );
      this.cells.push( cell );
      elementIndex++;
      if ( elementIndex === 58 ) {
        elementIndex = 72;
      }
      if ( elementIndex === 90 ) {
        elementIndex = 104;
      }
    }
  }

  // Highlight the cell that corresponds to the atom.
  const updateHighlightedCell = function( protonCount ) {
    if ( highlightedCell !== null ) {
      highlightedCell.setHighlighted( false );
    }
    if ( protonCount > 0 && protonCount <= 118 ) {
      let elementIndex = protonCount;
      if ( protonCount >= 72 ) {
        elementIndex = elementIndex - 14;
      }
      if ( protonCount >= 104 && protonCount <= 118 ) {
        elementIndex = elementIndex - 14;
      }
      highlightedCell = self.cells[ elementIndex - 1 ];
      highlightedCell.moveToFront();
      highlightedCell.setHighlighted( true );
    }
  };
  var highlightedCell = null;
  numberAtom.protonCountProperty.link( updateHighlightedCell );

  // @private - unlink from Properties
  this.disposePeriodicTableNode = function() {
    numberAtom.protonCountProperty.hasListener( updateHighlightedCell ) && numberAtom.protonCountProperty.unlink( updateHighlightedCell );
    this.cells.forEach( function( cell ) { !cell.isDisposed && cell.dispose();} );
  };
}

shred.register( 'PeriodicTableNode', PeriodicTableNode );
// Inherit from Node.
export default inherit( Node, PeriodicTableNode, {

  // @public
  dispose: function() {
    this.children.forEach( function( node ) { node.dispose();} );
    this.disposePeriodicTableNode();
    Node.prototype.dispose.call( this );
  }
} );