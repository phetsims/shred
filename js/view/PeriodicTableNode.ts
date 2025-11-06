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
import { OneKeyStroke } from '../../../scenery/js/input/KeyDescriptor.js';
import KeyboardListener from '../../../scenery/js/listeners/KeyboardListener.js';
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
const NAVIGATION_KEYS: OneKeyStroke[] = [ 'arrowRight', 'arrowLeft', 'arrowDown', 'arrowUp', 'w', 'a', 's', 'd' ];

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

    affirm( options.interactiveMax === 0 || isTProperty<number>( protonCountProperty ),
      'If the table is at all interactive, protonCountProperty should be settable'
    );

    super( options );

    let protonCount = 1;
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
        if ( protonCount <= options.interactiveMax ) {
          affirm( isTProperty<number>( protonCountProperty ),
            'If you\'re using options.interactiveMax, protonCountProperty should be settable' );
          settableAtomicNumberProperty = protonCountProperty;
        }

        const cell = new PeriodicTableCell( protonCount, cellColor, {
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
        protonCount++;

        // Because of the lactanides and actinides groups (separate from the rest of the periodic table and not shown in the sim),
        // we need to adjust the element index to ignore those groups.
        if ( protonCount === 58 ) {
          // When the element index is 58, it corresponds to Cerium (Ce), which is the start of the lanthanides,
          // it should jump to 72, which is Hafnium (Hf), back on the main table.
          protonCount = 72;
        }
        if ( protonCount === 90 ) {
          // When the element index is 90, it corresponds to Thorium (Th), which is the start of the actinides,
          // it should jump to 104, which is Rutherfordium (Rf), back on the main table.
          protonCount = 104;
        }
      }
    }

    // Highlight the cell that corresponds to the atom.
    let highlightedCell: PeriodicTableCell | null = null;
    const updateHighlightedCell = ( protonCount: number ) => {
      if ( highlightedCell !== null ) {
        highlightedCell.setHighlighted( false );
      }
      if ( protonCount !== 0 ) {
        const elementIndex = PeriodicTableNode.protonCountToElementIndex( protonCount );
        highlightedCell = this.cells[ elementIndex ];
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

    if ( options.interactiveMax > 0 ) {

      affirm(
        isTProperty<number>( protonCountProperty ),
        'If the table is interactive, protonCountProperty should be settable'
      );

      // Add a keyboard listener that will allow users to navigate the table with arrow keys.
      this.addInputListener( new KeyboardListener<OneKeyStroke[]>( {
        keys: NAVIGATION_KEYS,
        fire: ( event, keysPressed ) => {
          if ( protonCountProperty.value === 0 ) {

            // Nothing is selected, so set it to Hydrogen regardless of what key was pressed.
            protonCountProperty.value = 1;
          }
          else {
            if ( keysPressed === 'arrowRight' || keysPressed === 'd' ) {
              let proposedProtonCount = Math.min( protonCountProperty.value + 1, options.interactiveMax );
              if ( proposedProtonCount === 58 ) {

                // When the element index is 58, it corresponds to Cerium (Ce), which is the start of the lanthanides,
                // it should jump to 72, which is Hafnium (Hf), back on the main table.
                proposedProtonCount = 72;
              }
              if ( proposedProtonCount === 90 ) {

                // When the element index is 90, it corresponds to Thorium (Th), which is the start of the actinides,
                // it should jump to 104, which is Rutherfordium (Rf), back on the main table.
                proposedProtonCount = 104;
              }

              protonCountProperty.value = proposedProtonCount;
            }
            else if ( keysPressed === 'arrowLeft' || keysPressed === 'a' ) {
              let proposedProtonCount = Math.max( protonCountProperty.value - 1, 1 );
              if ( proposedProtonCount === 71 ) {
                proposedProtonCount = 57;
              }
              if ( proposedProtonCount === 103 ) {
                proposedProtonCount = 89;
              }
              protonCountProperty.value = proposedProtonCount;
            }
            else if ( keysPressed === 'arrowDown' || keysPressed === 's' ) {
              const currentCoordinates = PeriodicTableNode.getElementCoordinates( protonCountProperty.value );
              const proposedNewCoordinates = new Vector2( currentCoordinates.x, currentCoordinates.y + 1 );
              if ( proposedNewCoordinates.y < POPULATED_CELLS.length ) {
                const proposedElementIndex = PeriodicTableNode.tableCoordinatesToElementIndex( proposedNewCoordinates );
                affirm( this.cells[ proposedElementIndex ], 'proposedElementIndex should be valid' );
                protonCountProperty.value = this.cells[ proposedElementIndex ].atomicNumber;
              }
              // else do nothing, at bottom of table
            }
            else if ( keysPressed === 'arrowUp' || keysPressed === 'w' ) {
              const currentCoordinates = PeriodicTableNode.getElementCoordinates( protonCountProperty.value );
              const proposedNewCoordinates = new Vector2( currentCoordinates.x, currentCoordinates.y - 1 );
              if ( proposedNewCoordinates.y >= 0 ) {
                const proposedElementIndex = PeriodicTableNode.tableCoordinatesToElementIndex( proposedNewCoordinates );
                affirm( this.cells[ proposedElementIndex ], 'proposedElementIndex should be valid' );
                protonCountProperty.value = this.cells[ proposedElementIndex ].atomicNumber;
              }
              // else do nothing, at top of table
            }
          }
        }
      } ) );
    }
  }

  public override dispose(): void {
    this.disposePeriodicTableNode();
    super.dispose();
  }

  /**
   * Given an element index (atomic number), return its coordinates in the periodic table grid.
   * This function ignores the lanthanides and actinides series, only based on POPULATED_CELLS.
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

    return new Vector2( POPULATED_CELLS[ row ][ column - 1 ], row );
  }

  private static protonCountToElementIndex( protonCount: number ): number {
    const maxProtonCount = 118;
    affirm( protonCount > 0 && protonCount <= maxProtonCount, 'protonCount must be between 1 and 118' );
    let elementIndex = protonCount - 1;

    // adjust for lanthanides and actinides
    if ( protonCount >= 72 ) {
      elementIndex -= 14;
    }
    if ( protonCount >= 104 && protonCount <= maxProtonCount ) {
      elementIndex -= 14;
    }
    return elementIndex;
  }

  private static tableCoordinatesToElementIndex( coordinates: Vector2 ): number {
    let elementIndex = 0;
    for ( let i = 0; i < coordinates.y; i++ ) {
      elementIndex += POPULATED_CELLS[ i ].length;
    }
    for ( let j = 0; j < POPULATED_CELLS[ coordinates.y ].length; j++ ) {
      if ( POPULATED_CELLS[ coordinates.y ][ j ] === coordinates.x ) {
        elementIndex += j;
        break;
      }
    }
    return elementIndex;
  }
}

shred.register( 'PeriodicTableNode', PeriodicTableNode );
export default PeriodicTableNode;