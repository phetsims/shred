// Copyright 2015-2023, University of Colorado Boulder

/**
 * Scenery node that defines a periodic table of the elements.
 */

import Vector2 from '../../../dot/js/Vector2.js';
import { Node, NodeOptions, TColor } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';
import PeriodicTableCell from './PeriodicTableCell.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import optionize from '../../../phet-core/js/optionize.js';
import NumberAtom from '../model/NumberAtom.js';
import ParticleAtom from '../model/ParticleAtom.js';

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
  enabledCellColor?: TColor;
  disabledCellColor?: TColor;
  selectedCellColor?: TColor;
};

type PeriodicTableNodeOptions = SelfOptions & NodeOptions;

class PeriodicTableNode extends Node {

  // the cells of the table
  private readonly cells: PeriodicTableCell[] = [];
  private readonly disposePeriodicTableNode: VoidFunction;

  /**
   * @param numberAtom - Atom that defines which element is currently highlighted.
   * @param providedOptions
   */
  public constructor( numberAtom: NumberAtom | ParticleAtom, providedOptions?: PeriodicTableNodeOptions ) {

    const options = optionize<PeriodicTableNodeOptions, SelfOptions, NodeOptions>()( {
      interactiveMax: 0, //Atomic number of the heaviest element that should be interactive
      cellDimension: 25,
      showLabels: true,
      strokeHighlightWidth: 2,
      strokeHighlightColor: PhetColorScheme.RED_COLORBLIND,
      labelTextHighlightFill: 'black',
      enabledCellColor: ENABLED_CELL_COLOR,
      disabledCellColor: DISABLED_CELL_COLOR,
      selectedCellColor: SELECTED_CELL_COLOR,
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super();

    let elementIndex = 1;
    for ( let i = 0; i < POPULATED_CELLS.length; i++ ) {
      const populatedCellsInRow = POPULATED_CELLS[ i ];
      const cellColor = {
        enabled: options.enabledCellColor,
        disabled: options.disabledCellColor,
        selected: options.selectedCellColor
      };
      for ( let j = 0; j < populatedCellsInRow.length; j++ ) {
        const cell = new PeriodicTableCell( elementIndex, numberAtom, cellColor, {
          interactive: elementIndex <= options.interactiveMax,
          showLabels: options.showLabels,
          strokeHighlightWidth: options.strokeHighlightWidth,
          strokeHighlightColor: options.strokeHighlightColor,
          labelTextHighlightFill: options.labelTextHighlightFill,
          length: options.cellDimension,
          tandem: options.tandem.createTandem( `${AtomIdentifier.getEnglishName( elementIndex )}Cell` )
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
    numberAtom.protonCountProperty.link( updateHighlightedCell );

    this.disposePeriodicTableNode = () => {
      this.children.forEach( node => node.dispose() );
      numberAtom.protonCountProperty.hasListener( updateHighlightedCell ) && numberAtom.protonCountProperty.unlink( updateHighlightedCell );
      this.cells.forEach( cell => { !cell.isDisposed && cell.dispose();} );
    };
  }

  public override dispose(): void {
    this.disposePeriodicTableNode();
    super.dispose();
  }
}

shred.register( 'PeriodicTableNode', PeriodicTableNode );
export default PeriodicTableNode;