// Copyright 2015-2025, University of Colorado Boulder

/**
 * Scenery node that defines a periodic table of the elements.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TProperty, { isTProperty } from '../../../axon/js/TProperty.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../dot/js/Vector2.js';
import affirm from '../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../phet-core/js/optionize.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import LinearGradient from '../../../scenery/js/util/LinearGradient.js';
import TColor from '../../../scenery/js/util/TColor.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';
import PeriodicTableCell, { CellColor } from './PeriodicTableCell.js';

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

type SelfOptions = {

  // Atomic number of the heaviest element that should be interactive
  interactiveMax?: number;
  cellDimension?: number;
  showLabels?: boolean;
  strokeHighlightWidth?: number;
  strokeHighlightColor?: TColor;
  labelTextHighlightFill?: TColor;
  enabledCellColor?: TColor | LinearGradient;
  disabledCellColor?: TColor;
  selectedCellColor?: TColor;
};

type PeriodicTableNodeOptions = SelfOptions & NodeOptions;

class PeriodicTableNode extends Node {

  // the cells of the table
  private readonly cells: PeriodicTableCell[] = [];
  private readonly disposePeriodicTableNode: VoidFunction;

  /**
   * @param protonCountProperty - Atomic number (i.e. number of protons) that defines which element is currently
   * highlighted.  This may or may not be changed by this table, depending on the interactiveMax option.
   * @param providedOptions
   */
  public constructor( protonCountProperty: TReadOnlyProperty<number> | TProperty<number>,
                      providedOptions?: PeriodicTableNodeOptions ) {

    const options = optionize<PeriodicTableNodeOptions, SelfOptions, NodeOptions>()( {
      interactiveMax: 0, // atomic number of the heaviest element that should be interactive
      cellDimension: 25,
      showLabels: true,
      strokeHighlightWidth: 2,
      strokeHighlightColor: PhetColorScheme.RED_COLORBLIND,
      labelTextHighlightFill: 'black',
      enabledCellColor: ENABLED_CELL_COLOR,
      disabledCellColor: DISABLED_CELL_COLOR,
      selectedCellColor: SELECTED_CELL_COLOR
    }, providedOptions );

    super( options );

    let elementIndex = 1;
    for ( let i = 0; i < POPULATED_CELLS.length; i++ ) {
      const populatedCellsInRow = POPULATED_CELLS[ i ];

      const cellColor: CellColor = {
        enabled: options.enabledCellColor,
        disabled: options.disabledCellColor,
        selected: options.selectedCellColor
      };
      for ( let j = 0; j < populatedCellsInRow.length; j++ ) {

        // If this cell is supposed to be interactive the atomic number property will need to be provided to it.
        let settableAtomicNumberProperty: TProperty<number> | null = null;
        if ( elementIndex <= options.interactiveMax ) {
          affirm( isTProperty<number>( protonCountProperty ),
            'If you\'re using options.interactiveMax, protonCountProperty should be settable' );
          settableAtomicNumberProperty = protonCountProperty;
        }

        const cell = new PeriodicTableCell( elementIndex, cellColor, {
          protonCountProperty: settableAtomicNumberProperty,
          showLabels: options.showLabels,
          strokeHighlightWidth: options.strokeHighlightWidth,
          strokeHighlightColor: options.strokeHighlightColor,
          labelTextHighlightFill: options.labelTextHighlightFill,
          length: options.cellDimension,
          tandem: Tandem.OPT_OUT
        } );
        cell.translation = new Vector2( populatedCellsInRow[ j ] * options.cellDimension, i * options.cellDimension );
        this.addChild( cell );
        this.cells.push( cell );
        elementIndex++;

        // Because of the lactanides and actinides groups (separate from the rest of the periodic table and not shown in the sim),
        // we need to adjust the element index to ignore those groups.
        if ( elementIndex === 58 ) {
          // When the element index is 58, it corresponds to Cerium (Ce), which is the start of the lanthanides,
          // it should jump to 72, which is Hafnium (Hf), back on the main table.
          elementIndex = 72;
        }
        if ( elementIndex === 90 ) {
          // When the element index is 90, it corresponds to Thorium (Th), which is the start of the actinides,
          // it should jump to 104, which is Rutherfordium (Rf), back on the main table.
          elementIndex = 104;
        }
      }
    }

    // Highlight the cell that corresponds to the atom.
    let highlightedCell: PeriodicTableCell | null = null;
    const updateHighlightedCell = ( protonCount: number ) => {
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
        highlightedCell = this.cells[ elementIndex - 1 ];
        highlightedCell.moveToFront();
        highlightedCell.setHighlighted( true );
      }
    };
    protonCountProperty.link( updateHighlightedCell );

    this.disposePeriodicTableNode = () => {
      this.children.forEach( node => node.dispose() );
      protonCountProperty.hasListener( updateHighlightedCell ) && protonCountProperty.unlink( updateHighlightedCell );
      this.cells.forEach( cell => { !cell.isDisposed && cell.dispose();} );
    };
  }

  public override dispose(): void {
    this.disposePeriodicTableNode();
    super.dispose();
  }

  /**
   * Given an element index (atomic number), return its coordinates in the periodic table grid.
   * This function ignores the lanthanides and actinides series, only based on POPULATED_CELLS.
   *
   * Mostly used for description purposes.
   */
  public static getElementCoordinates( elementIndex: number ): Vector2 {
    let row = 0;
    let column = 0;

    for ( let i = 0; i < elementIndex; i++ ) {
      if ( POPULATED_CELLS[ row ].length === column ) {
        row++;
        column = 0;
      }
      column++;
    }

    return new Vector2( POPULATED_CELLS[ row ][ column - 1 ] + 1, row + 1 ); // +1 to convert from 0-indexed to 1-indexed
  }
}

shred.register( 'PeriodicTableNode', PeriodicTableNode );
export default PeriodicTableNode;