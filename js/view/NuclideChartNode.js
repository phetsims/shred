// Copyright 2015-2020, University of Colorado Boulder

/**
 * Scenery node that defines a partial nuclide chart of the nuclides.
 */

import buildAnAtomStrings from '../../../build-an-atom/js/buildAnAtomStrings.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Shape from '../../../kite/js/Shape.js';
import merge from '../../../phet-core/js/merge.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../scenery/js/nodes/Text.js';
import Tandem from '../../../tandem/js/Tandem.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';
import NuclideChartCell from './NuclideChartCell.js';
import NuclideChartX from './NuclideChartX.js';

// constants
// 2D array that defines the table structure.
const POPULATED_CELLS = [
  [ 6, 7, 8, 9, 10, 11, 12 ],
  [ 6, 7, 8, 9, 10, 11, 12 ],
  [ 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
  [ 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
  [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
  [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
  [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
  [ 1, 2, 3, 4, 5, 6, 7, 8 ],
  [ 1, 2, 3, 4, 5, 6, 7, 8 ],
  [ 0, 1, 2, 3, 4, 5 ],
  [ 1 ]
];
const nuclides = [
  [ [ 'p' ], [ 'ec b+', 'ec p', 'ec a' ], [ 'ec b+' ], [ 'ec b+' ], [ 'stable' ], [ 'stable' ], [ 'stable' ] ],
  [ [ 'p' ], [ 'p' ], [ 'ec b+' ], [ 'ec b+' ], [ 'stable' ], [ 'b-' ], [ 'b-' ] ],
  [ [ 'p' ], [ 'ec b+', 'b+ p' ], [ 'ec b+' ], [ 'ec b+' ], [ 'stable' ], [ 'stable' ], [ 'stable' ], [ 'b-' ], [ 'b-' ] ],
  [ [ 'p' ], [ 'p' ], [ 'ec b+' ], [ 'ec b+' ], [ 'stable' ], [ 'stable' ], [ 'b-', 'b- a' ], [ 'b-', 'b- n' ], [ 'b-', 'b- n', 'b- a' ], [ 'b-', 'b- n' ] ],
  [ [ 'p', 'a' ], [ 'ec b+', 'b+ p', 'b+ a' ], [ 'ec b+' ], [ 'ec b+' ], [ 'stable' ], [ 'stable' ], [ 'b-' ], [ 'b-' ], [ 'b-', 'b- n' ], [ 'b-', 'b- n' ], [ 'b-', 'b- n' ] ],
  [ [ 'p', 'a' ], [ 'b+ a', 'ec b+' ], [ 'p' ], [ 'stable' ], [ 'stable' ], [ 'b-' ], [ 'b-' ], [ 'b-' ], [ 'b-' ], [ 'n' ], [ 'b-', 'b- n', 'b- 2n', 'b- 3n', 'b- 4n' ] ],
  [ [ 'p' ], [ 'p', 'a' ], [ 'ec' ], [ 'a' ], [ 'stable' ], [ 'b-' ], [ 'b-' ], [ 'b-', 'b- n' ], [ 'n' ], [ 'b-', 'b- n', 'b- 2n' ] ],
  [ [ 'p' ], [ 'p' ], [ 'stable' ], [ 'stable' ], [ 'b-', 'b- a' ], [ 'b-', 'b- n' ], [ 'n' ], [ 'b-' ] ],
  [ [ 'stable' ], [ 'stable' ], [ 'n' ], [ 'b-' ], [ 'n' ], [ 'b-', 'b- n' ], [ 'n' ], [ 'n' ] ],
  [ [ 'stable' ], [ 'stable' ], [ 'b-' ], [ 'n' ], [ 'n' ], [ 'n' ] ],
  [ [ 'b-' ] ]
];
const ENABLED_CELL_COLOR = ShredConstants.DISPLAY_PANEL_BACKGROUND_COLOR;
const DISABLED_CELL_COLOR = '#EEEEEE';
const SELECTED_CELL_COLOR = '#ff0000'; //salmon // vs phet selected '#FA8072'
const NOMINAL_CELL_DIMENSION = 25;
const NOMINAL_FONT_SIZE = 14;
const LABEL_FONT_SIZE = 15;
const AXIS_FONT_SIZE = 17;
const protonAxisString = buildAnAtomStrings.protonAxis;
const neutronAxisString = buildAnAtomStrings.neutronAxis;
const alphaDecayString = buildAnAtomStrings.alphaDecay;
const betaMinusDecayString = buildAnAtomStrings.betaMinusDecay;
const betaPlusDecayString = buildAnAtomStrings.betaPlusDecay;
const electronCaptureString = buildAnAtomStrings.electronCapture;
const neutronEmissionString = buildAnAtomStrings.neutronEmission;
const protonEmissionString = buildAnAtomStrings.protonEmission;
const stableString = buildAnAtomStrings.stable;
const selectedString = buildAnAtomStrings.selected;
const magicNumbersString = buildAnAtomStrings.magicNumbers;
const doesNotFormString = buildAnAtomStrings.doesNotForm;

class NuclideChartNode extends Node {
  /**
   * Constructor.
   *
   * @param {NumberAtom} numberAtom - Atom that defines which element is currently highlighted.
   * @param {Object} [options]
   */
  constructor( numberAtom, options ) {
    options = merge( {
      cellDimension: 25,
      showLabels: true,
      enabledCellColor: ENABLED_CELL_COLOR,
      disabledCellColor: DISABLED_CELL_COLOR,
      selectedCellColor: SELECTED_CELL_COLOR,
      tandem: Tandem.REQUIRED
    }, options );
    
    super(); // Call super constructor.
    
    // Stores cells and non-cell arrays ex. [0,0] - [proton, neutron]
    this.nuclide_cells = [
      [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
      [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
      [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
      [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
      [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
      [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
      [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
      [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
      [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
      [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
      [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]
    ];
    
    // Add the cells of the table.
    let elementIndex = 0; // Changed from 1 to zero so neutron included
    const pos_n = []; // Positions with neutron labels

    // Adding nuclide cells from the bottom of the chart upwards.
    for ( let i = POPULATED_CELLS.length - 1; i >= 0; i-- ) {
      const proton = elementIndex;
      const populatedCellsInRow = POPULATED_CELLS[ i ];
      const cellColor = {
        enabled: options.enabledCellColor,
        disabled: options.disabledCellColor,
        selected: options.selectedCellColor
      };
      for ( let j = 0; j < populatedCellsInRow.length; j++ ) {
        if ( j === 0 && elementIndex % 2 === 0 ) {
          const protonLabel = new Text( elementIndex, {
            font: new PhetFont( NOMINAL_FONT_SIZE * ( options.cellDimension / NOMINAL_CELL_DIMENSION ) ),
            center: new Vector2( ( ( populatedCellsInRow[ j ] - 1 ) * options.cellDimension ) + ( options.cellDimension / 2 ), ( i * options.cellDimension ) + ( options.cellDimension / 2 ) ),
            maxWidth: options.cellDimension - 5,
            tandem: options.tandem.createTandem( 'protonLabel' )
          } );
          this.addChild( protonLabel );
        }
        const neutron = populatedCellsInRow[ j ];
        const cell = new NuclideChartCell( elementIndex, numberAtom, cellColor, neutron, nuclides[ i ][ j ], {
          interactive: false,
          showLabels: options.showLabels,
          length: options.cellDimension,
          tandem: options.tandem.createTandem( AtomIdentifier.getEnglishName( elementIndex ) + 'Cell' )
        } );
        cell.translation = new Vector2( populatedCellsInRow[ j ] * options.cellDimension, i * options.cellDimension );
        this.addChild( cell );
        this.nuclide_cells[ proton ][ neutron ] = cell;
        if ( pos_n.indexOf( neutron ) === -1 ) {
          pos_n.push( neutron );
          if ( neutron % 2 === 0 ) {
            const neutronLabel = new Text( neutron, {
              font: new PhetFont( NOMINAL_FONT_SIZE * ( options.cellDimension / NOMINAL_CELL_DIMENSION ) ),
              center: new Vector2( ( populatedCellsInRow[ j ] * options.cellDimension ) + ( options.cellDimension / 2 ), ( ( i + 1 ) * options.cellDimension ) + ( options.cellDimension / 2 ) ),
              maxWidth: options.cellDimension - 5,
              tandem: options.tandem.createTandem( 'neutronLabel' )
            } );
            this.addChild( neutronLabel );
          }
        }
        //making the arrows for the cell, coordinates are with respect to the cell's top left corner
        for ( let k = 0; k < cell.daughters.length; k++ ) {
          if ( !( cell.daughters[ k ][ 1 ] === 0 ) || cell.daughters[ k ][ 0 ] === 9 ) {
            const neutronDiff = cell.neutronNumber - cell.daughters[ k ][ 1 ];
            let tipX;
            if ( neutronDiff !== 0 ) {
              tipX = options.cellDimension / 2 - ( neutronDiff * options.cellDimension );
            }
            else {
              tipX = options.cellDimension / 2;
            }
            const protonDiff = cell.protonNumber - ( 11 - 1 - cell.daughters[ k ][ 0 ] );
            let tipY;
            if ( protonDiff !== 0 ) {
              tipY = options.cellDimension / 2 + ( protonDiff * options.cellDimension );
            }
            else {
              tipY = options.cellDimension / 2;
            }
            cell.makeArrow( k, options.cellDimension / 2, options.cellDimension / 2, tipX, tipY );
          }
        }
      }
      elementIndex++;
      if ( elementIndex === 58 ) {
        elementIndex = 72;
      }
      if ( elementIndex === 90 ) {
        elementIndex = 104;
      }
    }
    for ( let i = 0; i < this.nuclide_cells.length; i++ ) {
      for ( let j = 0; j < this.nuclide_cells[ i ].length; j++ ) {
        if ( typeof this.nuclide_cells[ i ][ j ] !== 'object' ) {
          if ( !( i === 0 && j === 0 ) ) {
            this.nuclide_cells[ i ][ j ] = new NuclideChartX( i, j, SELECTED_CELL_COLOR ); // red X label where no nuclide cells exist
          }
          else {
            this.nuclide_cells[ i ][ j ] = [ i, j ];
          }
        }
      }
    }
    //25 is options.cellDimension for all 
    //add axis arrows and labels
    const protonAxisLabel = new Text( protonAxisString, {
      font: new PhetFont( AXIS_FONT_SIZE ),
      maxWidth: options.cellDimension * 12,
      tandem: options.tandem.createTandem( 'protonLabel' )
    } );
    protonAxisLabel.setRotation( 3 * Math.PI / 2 );
    protonAxisLabel.bottom = 10.5 * 25;
    protonAxisLabel.left = ( -1 * 25 ) - ( 25 / 2 );
    this.addChild( protonAxisLabel );
    const protonAxis = new ArrowNode( ( -1 * 25 ), protonAxisLabel.top - ( 25 / 2 ), ( -1 * 25 ), ( 25 / 2 ) );
    this.addChild( protonAxis );
    const neutronAxisLabel = new Text( neutronAxisString, {
      font: new PhetFont( AXIS_FONT_SIZE ),
      maxWidth: options.cellDimension * 12,
      tandem: options.tandem.createTandem( 'neutronLabel' )
    } );
    neutronAxisLabel.top = ( 11 * 25 );
    neutronAxisLabel.left = 0;
    this.addChild( neutronAxisLabel );
    const neutronAxis = new ArrowNode( neutronAxisLabel.right + ( 25 / 2 ), ( 11 * 25 ) + ( 25 / 2 ), ( 12 * 25 ) + ( 25 / 2 ), ( 11 * 25 ) + ( 25 / 2 ) );
    this.addChild( neutronAxis );

    //add legend items
    const alpha = new Rectangle( ( 14 * 25 ), 0, 25 - 5, 25 - 5, 0, 0, {
      stroke: 'black',
      lineWidth: 1,
      fill: '#ffff00',
      cursor: options.interactive ? 'pointer' : null,
      tandem: options.tandem,
      phetioType: options.phetioType
    } ); // Call super constructor. 
    this.addChild( alpha );
    const alphaLabel = new Text( alphaDecayString, {
      font: new PhetFont( LABEL_FONT_SIZE ),
      maxWidth: options.cellDimension * 12,
      tandem: options.tandem.createTandem( 'alphaLabel' )
    } );
    alphaLabel.left = alpha.right + ( 20 / 3 );
    alphaLabel.top = alpha.top + ( 20 / 6 );
    this.addChild( alphaLabel );
    const betaMinus = new Rectangle( ( 14 * 25 ), 1.25 * 25, 25 - 5, 25 - 5, 0, 0, {
      stroke: 'black',
      lineWidth: 1,
      fill: '#00ff00',
      cursor: options.interactive ? 'pointer' : null,
      tandem: options.tandem,
      phetioType: options.phetioType
    } ); // Call super constructor. 
    this.addChild( betaMinus );
    const betaMinusLabel = new Text( betaMinusDecayString, {
      font: new PhetFont( LABEL_FONT_SIZE ),
      maxWidth: options.cellDimension * 12,
      tandem: options.tandem.createTandem( 'betaMinusLabel' )
    } );
    betaMinusLabel.left = betaMinus.right + ( 20 / 3 );
    betaMinusLabel.top = betaMinus.top + ( 20 / 6 );
    this.addChild( betaMinusLabel );
    const betaPlus = new Rectangle( ( 14 * 25 ), 2.65 * 25, 25 - 5, 25 - 5, 0, 0, {
      stroke: 'black',
      lineWidth: 1,
      fill: '#00aaff',
      cursor: options.interactive ? 'pointer' : null,
      tandem: options.tandem,
      phetioType: options.phetioType
    } ); // Call super constructor. 
    this.addChild( betaPlus );
    const betaPlusLabel = new Text( betaPlusDecayString, {
      font: new PhetFont( LABEL_FONT_SIZE ),
      maxWidth: options.cellDimension * 12,
      tandem: options.tandem.createTandem( 'betaPlusLabel' )
    } );
    betaPlusLabel.left = betaPlus.right + ( 20 / 3 );
    betaPlusLabel.top = betaPlus.top - ( 20 / 4 );
    this.addChild( betaPlusLabel );
    const electronCaptureLabel = new Text( electronCaptureString, {
      font: new PhetFont( LABEL_FONT_SIZE ),
      maxWidth: options.cellDimension * 12,
      tandem: options.tandem.createTandem( 'electronCaptureLabel' )
    } );
    electronCaptureLabel.left = betaPlus.right + ( 20 / 3 );
    electronCaptureLabel.top = betaPlus.bottom - ( 20 / 2 );
    this.addChild( electronCaptureLabel );
    const neutronEmission = new Rectangle( ( 14 * 25 ), 4 * 25, 25 - 5, 25 - 5, 0, 0, {
      stroke: 'black',
      lineWidth: 1,
      fill: '#ff6699',
      cursor: options.interactive ? 'pointer' : null,
      tandem: options.tandem,
      phetioType: options.phetioType
    } ); // Call super constructor. 
    this.addChild( neutronEmission );
    const neutronEmissionLabel = new Text( neutronEmissionString, {
      font: new PhetFont( LABEL_FONT_SIZE ),
      maxWidth: options.cellDimension * 12,
      tandem: options.tandem.createTandem( 'neutronEmissionLabel' )
    } );
    neutronEmissionLabel.left = neutronEmission.right + ( 20 / 3 );
    neutronEmissionLabel.top = neutronEmission.top + ( 20 / 6 );
    this.addChild( neutronEmissionLabel );
    const protonEmission = new Rectangle( ( 14 * 25 ), 5.25 * 25, 25 - 5, 25 - 5, 0, 0, {
      stroke: 'black',
      lineWidth: 1,
      fill: '#ff6600',
      cursor: options.interactive ? 'pointer' : null,
      tandem: options.tandem,
      phetioType: options.phetioType
    } ); // Call super constructor. 
    this.addChild( protonEmission );
    const protonEmissionLabel = new Text( protonEmissionString, {
      font: new PhetFont( LABEL_FONT_SIZE ),
      maxWidth: options.cellDimension * 12,
      tandem: options.tandem.createTandem( 'protonEmissionLabel' )
    } );
    protonEmissionLabel.left = protonEmission.right + ( 20 / 3 );
    protonEmissionLabel.top = protonEmission.top + ( 20 / 6 );
    this.addChild( protonEmissionLabel );
    const stable = new Rectangle( ( 14 * 25 ), 6.5 * 25, 25 - 5, 25 - 5, 0, 0, {
      stroke: 'black',
      lineWidth: 1,
      fill: '#000066',
      cursor: options.interactive ? 'pointer' : null,
      tandem: options.tandem,
      phetioType: options.phetioType
    } ); // Call super constructor. 
    this.addChild( stable );
    const stableLabel = new Text( stableString, {
      font: new PhetFont( LABEL_FONT_SIZE ),
      maxWidth: options.cellDimension * 12,
      tandem: options.tandem.createTandem( 'stableLabel' )
    } );
    stableLabel.left = stable.right + ( 20 / 3 );
    stableLabel.top = stable.top + ( 20 / 6 );
    this.addChild( stableLabel );
    const magicNumbers = new Rectangle( ( 14 * 25 ), 7.75 * 25, 25 - 7, 25 - 7, 0, 0, {
      stroke: '#cccccc',
      lineWidth: 5,
      fill: ENABLED_CELL_COLOR,
      cursor: options.interactive ? 'pointer' : null,
      tandem: options.tandem,
      phetioType: options.phetioType
    } ); // Call super constructor. 
    this.addChild( magicNumbers );
    const magicNumbersLabel = new Text( magicNumbersString, {
      font: new PhetFont( LABEL_FONT_SIZE ),
      maxWidth: options.cellDimension * 12,
      tandem: options.tandem.createTandem( 'magicNumbersLabel' )
    } );
    magicNumbersLabel.left = magicNumbers.right + ( 20 / 3 );
    magicNumbersLabel.top = magicNumbers.top + ( 20 / 6 );
    this.addChild( magicNumbersLabel );
    const selected = new Rectangle( ( 14 * 25 ), 9 * 25, 25 - 5, 25 - 5, 0, 0, {
      stroke: 'black',
      lineWidth: 1,
      fill: '#ff0000',
      cursor: options.interactive ? 'pointer' : null,
      tandem: options.tandem,
      phetioType: options.phetioType
    } ); // Call super constructor. 
    this.addChild( selected );
    const selectedLabel = new Text( selectedString, {
      font: new PhetFont( LABEL_FONT_SIZE ),
      maxWidth: options.cellDimension * 12,
      tandem: options.tandem.createTandem( 'selectedLabel' )
    } );
    selectedLabel.left = selected.right + ( 20 / 3 );
    selectedLabel.top = selected.top + ( 20 / 6 );
    this.addChild( selectedLabel );
    const xLegendShape = new Shape();
    xLegendShape.moveTo( ( 14 * 25 ), ( 10.25 * 25 ) + 20 );
    xLegendShape.lineTo( ( 14 * 25 ) + 20, ( 10.25 * 25 ) );
    xLegendShape.moveTo( ( 14 * 25 ), ( 10.25 * 25 ) );
    xLegendShape.lineTo( ( 14 * 25 ) + 20, ( 10.25 * 25 ) + 20 );
    const xLabelObject = new Path( xLegendShape, {
      stroke: SELECTED_CELL_COLOR,
      lineWidth: 6,
      pickable: false,
      tandem: options.tandem.createTandem( 'xLabel' ),
      phetioType: options.phetioType
    } );
    this.addChild( xLabelObject );
    const theXLabel = new Text( doesNotFormString, {
      font: new PhetFont( LABEL_FONT_SIZE ),
      center: new Vector2( ( 17 * 25 ), ( 10.25 * 25 ) + 10 ),
      maxWidth: options.cellDimension * 12,
      tandem: options.tandem.createTandem( 'selectedLabel' )
    } );
    theXLabel.left = xLabelObject.right + ( 20 / 3 );
    theXLabel.top = xLabelObject.top + ( 20 / 6 );
    this.addChild( theXLabel );

    const updateHighlightedCellProton = protonCount => {
      let neutronNum;
      if ( highlightedCell.type === 'NuclideCell' ) {
        highlightedCell.setHighlighted( false ); //if previous one was highlighted, set it to false
        neutronNum = highlightedCell.neutronNumber;
        highlightedCell.removeArrows();//removes arrows in arrow array
      }
      else if ( highlightedCell.type === 'xLabel' ) {
        if ( this.hasChild( highlightedCell ) ) {
          this.removeChild( highlightedCell );
        }
        neutronNum = highlightedCell.neutronNumber;
      }
      else {
        neutronNum = highlightedCell[ 1 ];
      }
      const cell = this.nuclide_cells[ protonCount ][ neutronNum ];
      highlightedCell = cell;
      if ( cell.type === 'NuclideCell' ) {
        highlightedCell.moveToFront();
        highlightedCell.drawArrows();
        highlightedCell.setHighlighted( true );
      }
      else if ( highlightedCell.type === 'xLabel' ) {
        if ( !this.hasChild( highlightedCell ) ) {
          this.addChild( highlightedCell );
        }
      }
    };

    const updateHighlightedCellNeutron = neutronCount => {
      let protonNum;
      if ( highlightedCell.type === 'NuclideCell' ) {
        highlightedCell.setHighlighted( false ); //if previous one was highlighted, set it to false
        protonNum = highlightedCell.protonNumber;
        highlightedCell.removeArrows();//removes arrows in arrow array
      }
      else if ( highlightedCell.type === 'xLabel' ) {
        if ( this.hasChild( highlightedCell ) ) {
          this.removeChild( highlightedCell );
        }
        protonNum = highlightedCell.protonNumber;
      }
      else {
        protonNum = highlightedCell[ 0 ];
      }
      const cell = this.nuclide_cells[ protonNum ][ neutronCount ];
      highlightedCell = cell;
      if ( cell.type === 'NuclideCell' ) {
        highlightedCell.moveToFront();
        highlightedCell.drawArrows();
        highlightedCell.setHighlighted( true );

      }
      else if ( highlightedCell.type === 'xLabel' ) {
        if ( !this.hasChild( highlightedCell ) ) {
          this.addChild( highlightedCell );
        }
      }
    };

    let highlightedCell = this.nuclide_cells[ 0 ][ 0 ];
    numberAtom.protonCountProperty.link( updateHighlightedCellProton );
    numberAtom.neutronCountProperty.link( updateHighlightedCellNeutron );

    // @private - unlink from Properties
    this.disposeNuclideChartNode = function() {
      numberAtom.protonCountProperty.hasListener( updateHighlightedCellProton ) && numberAtom.protonCountProperty.unlink( updateHighlightedCellProton );
      numberAtom.neutronCountProperty.hasListener( updateHighlightedCellNeutron ) && numberAtom.neutronCountProperty.unlink( updateHighlightedCellNeutron );
      for ( let i = 0; i < this.nuclide_cells.length; i++ ) {
        for ( let j = 0; j < this.nuclide_cells[ i ].length; j++ ) {
          if ( !isArray( this.nuclide_cells[ i ][ j ] ) ) {
            const cell = this.nuclide_cells[ i ][ j ];
            !cell.isDisposed && cell.dispose();
          }
        }
      }
    };
  }

  // @public
  dispose() {
    this.children.forEach( node => { node.dispose();} );
    this.disposeNuclideChartNode();
    super.dispose();
  }
}

function isArray( a ) {
  return ( !!a ) && ( a.constructor === Array );
}

shred.register( 'NuclideChartNode', NuclideChartNode );
// Inherit from Node.
export default NuclideChartNode;