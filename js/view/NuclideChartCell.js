// Copyright 2015-2020, University of Colorado Boulder

/**
 * Scenery node that defines a single cell in the nuclide chart.
 * @author John Blanco
 * @author Aadish Gupta
 * @author Luisa Vargas
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import FireListener from '../../../scenery/js/listeners/FireListener.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../scenery/js/nodes/Text.js';
import EventType from '../../../tandem/js/EventType.js';
import Tandem from '../../../tandem/js/Tandem.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shred from '../shred.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';

// constants
const NOMINAL_CELL_DIMENSION = 25;
const NOMINAL_FONT_SIZE = 14;
//original selected '#ff0000', vs phet selected '#FA8072'
const chart_material = [ '#FFFF00', '#00ff00', '#00aaff', '#00ccff', '#6600ff', '#FF6699', '#ff6600', '#ff0000', '#000066', '#666666' ];
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

/**
 * @param {number} atomicNumber - Atomic number of atom represented by this cell.
 * @param {NumberAtom} numberAtom - Atom that is set if this cell is selected by the user.
 * @param {Color} cellColor - Color to be used for selected enabled and disabled cell
 * @param {number} neutronNumber - Neutron number of nuclide represented by this cell.
 * @param {string[]} decay - String array of decay types to determine where white decay arrow(s) point(s).
 * @param {Object} [options]
 * @constructor
 */
function NuclideChartCell( atomicNumber, numberAtom, cellColor, neutronNumber, decay, options ) {
  options = merge( {
    length: 25, //Width and height of cell (cells are square).
    interactive: false, // Boolean flag that determines whether cell is interactive.
    showLabels: true,
    tandem: Tandem.REQUIRED,
    phetioEventType: EventType.USER
  }, options );

  this.type = 'NuclideCell';
  this.options = options;
  this.protonNumber = atomicNumber;
  this.neutronNumber = neutronNumber;
  this.decay = decay;
  this.arrows = []; // Stores daughter arrows as they're added
  this.daughters = getDaughterNuclides( this );

  // @private
  this.normalFill = chart_material[ getMaterialIndex( decay[ 0 ] ) ];

  Rectangle.call( this, 0, 0, options.length, options.length, 0, 0, {
    stroke: 'black',
    lineWidth: 1,
    fill: this.normalFill,
    cursor: options.interactive ? 'pointer' : null,
    tandem: options.tandem,
    phetioType: options.phetioType
  } ); // Call super constructor.

  //to go on top of arrows
  this.cover = new Rectangle( 0, 0, options.length, options.length, 0, 0, {
    stroke: 'black',
    lineWidth: 2,
    fill: cellColor.selected,
    cursor: options.interactive ? 'pointer' : null,
    tandem: options.tandem,
    phetioType: options.phetioType
  } );

  //add lines if magic proton
  if ( this.protonNumber === 2 || this.protonNumber === 8 ) {
    this.topBorder = new Rectangle( 1, 1, options.length - 2, options.length / 5, {
      stroke: 'black',
      lineWidth: 0,
      fill: '#cccccc',
      cursor: options.interactive ? 'pointer' : null,
      tandem: options.tandem,
      phetioType: options.phetioType
    } ); // Call super constructor.
    this.addChild( this.topBorder );
    this.cover.addChild( this.topBorder );
    this.bottomBorder = new Rectangle( 1, ( options.length / 5 * 4 ) - 1, options.length - 2, options.length / 5, {
      stroke: 'black',
      lineWidth: 0,
      fill: '#cccccc',
      cursor: options.interactive ? 'pointer' : null,
      tandem: options.tandem,
      phetioType: options.phetioType
    } ); // Call super constructor.
    this.addChild( this.bottomBorder );
    this.cover.addChild( this.bottomBorder );
  }
  //add lines if magic neutron
  if ( this.neutronNumber === 2 || this.neutronNumber === 8 ) {
    this.leftBorder = new Rectangle( 1, 1, options.length / 5, options.length - 2, {
      stroke: 'black',
      lineWidth: 0,
      fill: '#cccccc',
      cursor: options.interactive ? 'pointer' : null,
      tandem: options.tandem,
      phetioType: options.phetioType
    } ); // Call super constructor.
    this.addChild( this.leftBorder );
    this.cover.addChild( this.leftBorder );
    this.rightBorder = new Rectangle( ( options.length / 5 * 4 ) - 1, 1, options.length / 5, options.length - 2, {
      stroke: 'black',
      lineWidth: 0,
      fill: '#cccccc',
      cursor: options.interactive ? 'pointer' : null,
      tandem: options.tandem,
      phetioType: options.phetioType
    } ); // Call super constructor.
    this.addChild( this.rightBorder );
    this.cover.addChild( this.rightBorder );
  }

  if ( options.showLabels ) {
    // @private
    this.label = new Text( AtomIdentifier.getSymbol( atomicNumber ), {
      font: new PhetFont( NOMINAL_FONT_SIZE * ( options.length / NOMINAL_CELL_DIMENSION ) ),
      fontWeight: 'bold',
      center: this.center,
      maxWidth: options.length - 5,
      tandem: options.tandem.createTandem( 'label' )
    } );
    this.cover.addChild( this.label );
  }

  // If interactive, add a listener to set the atom when this cell is pressed.
  let buttonListener = null; // scope for disposal
  if ( options.interactive ) {
    buttonListener = new FireListener( {
      tandem: options.tandem.createTandem( 'inputListener' ),
      fire: function( evt ) {
        numberAtom.setSubAtomicParticleCount(
          atomicNumber,
          AtomIdentifier.getNumNeutronsInMostCommonIsotope( atomicNumber ),
          atomicNumber
        );
      }
    } );
    this.addInputListener( buttonListener );
  }

  // @private called by dispose
  this.disposeNuclideChartCell = function() {
    //this.label.dispose();
    this.cover.dispose();
    buttonListener && buttonListener.dispose();
  };
}

function getMaterialIndex( type ) {
  let color_index;
  switch( type ) {
    case 'a':
      color_index = 0;
      break;
    case 'b-':
    case '2b-':
    case 'b- n':
      color_index = 1;
      break;
    case 'ec':
    case '2ec':
      color_index = 2;
      break;
    case 'ec b+':
    case 'b+ a':
    case '2b+':
    case 'b+ ec':
    case 'b+':
      color_index = 2;
      break;
    case 'p':
    case '2p':
    case 'ec p':
      color_index = 6;
      break;
    case 'n':
      color_index = 5;
      break;
    case '':
      color_index = 9;
      break;
    case 'stable':
      color_index = 8;
      break;
    case 'SF':
    case 'ec SF':
      color_index = 4;
      break;
    default:
      color_index = 7;
  }
  return color_index;
}

function getDaughterNuclides( parent ) {//get daughter nuclides position
  let to_n, to_p;
  let daughters = [];
  let decay = parent.decay;
  let proton = parent.protonNumber;
  let neutron = parent.neutronNumber;
  let len = decay.length;
  for ( let i = 0; i < len; i++ ) {
    switch( decay[ i ] ) {
      case 'b-':
        to_n = neutron - 1;
        to_p = proton + 1;
        break;
      case '2b-':
        to_n = neutron - 2;
        to_p = proton + 2;
        break;
      case 'ec b+':
      case 'ec':
      case 'b+':
      case 'b+ ec':
        to_n = neutron + 1;
        to_p = proton - 1;
        break;
      case '2ec':
      case '2b+':
        to_n = neutron + 2;
        to_p = proton - 2;
        break;
      case 'a':
        to_n = neutron - 2;
        to_p = proton - 2;
        break;
      case 'p':
        to_n = neutron;
        to_p = proton - 1;
        break;
      case 'n':
        to_n = neutron - 1;
        to_p = proton;
        break;
      case '2p':
        to_n = neutron;
        to_p = proton - 2;
        break;
      case 'b+ a':
      case 'ec a':
        to_n = neutron - 1;
        to_p = proton - 3;
        break;
      case 'b- a':
        to_n = neutron - 3;
        to_p = proton - 1;
        break;
      case 'b- n':
        to_n = neutron - 2;
        to_p = proton + 1;
        break;
      case 'b- 2n':
        to_n = neutron - 3;
        to_p = proton + 1;
        break;
      case 'b- 3n':
        to_n = neutron - 4;
        to_p = proton + 1;
        break;
      case 'b- 4n':
        to_n = neutron - 5;
        to_p = proton + 1;
        break;
      case 'ec p':
      case 'b+ p':
      case 'b- p': // ?
        to_n = neutron + 1;
        to_p = proton - 2;
        break;
      case 'ec 2p':
      case 'b+ 2p':
        to_n = neutron + 1;
        to_p = proton - 3;
        break;
      case '24Ne':
        to_n = neutron - 14;
        to_p = proton - 10;
        break;
      case '34Si':
        to_n = neutron - 20;
        to_p = proton - 14;
        break;
      case '12C':
        to_n = neutron - 6;
        to_p = proton - 6;
        break;
      case 'b- F':
      default:
        if ( decay[ i ] !== '' && decay[ i ] !== 'stable' && decay[ i ].indexOf( 'SF' ) === -1 ) {
          window.alert( decay[ i ] );
        }
        to_n = 0;
        to_p = 0;
        break;
    }
    let aProton = nuclides.length - 1 - to_p;
    let aNeutron = POPULATED_CELLS[ aProton ].indexOf( to_n );
    if ( aNeutron !== null && aNeutron !== undefined ) {
      daughters.push( [ aProton, to_n ] );
    }
  }
  if ( daughters.length ) {
    return daughters;
  }
  else {
    return false;
  }
}

shred.register( 'NuclideChartCell', NuclideChartCell );

inherit( Rectangle, NuclideChartCell, {

  removeArrows: function() {
    for ( let i = 0; i < this.arrows.length; i++ ) {
      if ( this.hasChild( this.arrows[ i ] ) ) {
        this.removeChild( this.arrows[ i ] );
      }
    }
  },

  makeArrow: function( cellArrowNum, tailX, tailY, headX, headY ) {
    if ( typeof this.arrows[ cellArrowNum ] === 'undefined' ) {
      this.arrows[ cellArrowNum ] = new ArrowNode( tailX, tailY, headX, headY, {
        headHeight: 8,
        headWidth: 8,
        tailWidth: 4,
        fill: '#FFFFFF'
      } );
    }
  },

  drawArrows: function() {
    for ( let i = 0; i < this.arrows.length; i++ ) {
      if ( !this.hasChild( this.arrows[ i ] ) ) {
        this.addChild( this.arrows[ i ] );
      }
    }
  },

  setHighlighted: function( highLighted ) {
    this.lineWidth = highLighted ? 2 : 1;
    if ( highLighted ) {
      if ( !this.hasChild( this.cover ) ) {
        this.addChild( this.cover );
      }
    }
    else {
      if ( this.hasChild( this.cover ) ) {
        this.removeChild( this.cover );
      }
    }
  },

  dispose: function() {
    this.disposeNuclideChartCell();
    Rectangle.prototype.dispose.call( this );
  }
} );

export default NuclideChartCell;