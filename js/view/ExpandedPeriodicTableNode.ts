// Copyright 2015-2023, University of Colorado Boulder

/**
 * TODO https://github.com/phetsims/shred/issues/40 missing documentation
 *
 * @author Aadish Gupta (PhET Interactive Simulations)
 */

import Vector2 from '../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { Line, Node, NodeOptions, Text } from '../../../scenery/js/imports.js';
import TextPushButton from '../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../tandem/js/Tandem.js';
import AtomIdentifier from '../AtomIdentifier.js';
import NumberAtom from '../model/NumberAtom.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';
import ShredStrings from '../ShredStrings.js';
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
type ExpandedPeriodicTableNodeOptions = NodeOptions;

class ExpandedPeriodicTableNode extends Node {

  public constructor( numberAtom: NumberAtom, interactiveMax: number, providedOptions?: ExpandedPeriodicTableNodeOptions ) {

    const options = optionize<ExpandedPeriodicTableNodeOptions, EmptySelfOptions, NodeOptions>()( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super();

    // A scaled down periodic table with element labels hidden
    const periodicTableNode = new PeriodicTableNode( numberAtom, {
      tandem: options.tandem && options.tandem.createTandem( 'periodicTable' ),
      interactiveMax: interactiveMax,
      showLabels: false
    } );
    periodicTableNode.scale( 0.5 );
    this.addChild( periodicTableNode );

    // Larger cells for the elements that we want to emphasize
    const cells: TextPushButton[] = [];
    const expandedRowsNode = new Node();
    let elementIndex = 1;
    let rows = 1;
    if ( interactiveMax > 2 && interactiveMax <= 10 ) {
      rows = 2;
    }
    else if ( interactiveMax > 10 ) {
      rows = 3;
    }
    for ( let i = 0; i < rows; i++ ) {
      const populatedCellsInRow = POPULATED_CELLS[ i ];

      for ( let j = 0; j < populatedCellsInRow.length; j++ ) {
        const atomicNumber = elementIndex;
        const button = new TextPushButton( AtomIdentifier.getSymbol( elementIndex ), {
          listener: () => numberAtom.setSubAtomicParticleCount( atomicNumber,
            AtomIdentifier.getNumNeutronsInMostCommonIsotope( atomicNumber ), atomicNumber ),
          baseColor: ENABLED_CELL_COLOR,
          cornerRadius: 0,
          minWidth: BUTTON_SIZE,
          maxWidth: BUTTON_SIZE,
          minHeight: BUTTON_SIZE,
          maxHeight: BUTTON_SIZE,
          font: new PhetFont( 24 )
        } );
        button.translation = new Vector2( populatedCellsInRow[ j ] * BUTTON_SIZE, i * BUTTON_SIZE );
        cells.push( button );
        expandedRowsNode.addChild( button );
        elementIndex++;
      }
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

    const periodicTableTitle = new Text( ShredStrings.periodicTable, { font: new PhetFont( { size: 16, weight: 'bold' } ) } );
    periodicTableTitle.bottom = periodicTableNode.top - 5;
    periodicTableTitle.centerX = periodicTableNode.centerX;
    this.addChild( periodicTableTitle );

    // Highlight the cell that corresponds to the atom.
    let highlightedCell: TextPushButton | null = null;
    numberAtom.protonCountProperty.link( protonCount => {
      if ( highlightedCell !== null ) {
        highlightedCell.baseColor = ENABLED_CELL_COLOR;
      }
      if ( protonCount > 0 && protonCount <= cells.length ) {
        highlightedCell = cells[ protonCount - 1 ];
        highlightedCell.baseColor = SELECTED_CELL_COLOR;
      }
    } );
  }
}

shred.register( 'ExpandedPeriodicTableNode', ExpandedPeriodicTableNode );
export default ExpandedPeriodicTableNode;