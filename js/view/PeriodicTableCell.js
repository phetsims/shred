// Copyright 2015-2020, University of Colorado Boulder

/**
 * Scenery node that defines a single cell in a periodic table.
 * @author John Blanco
 * @author Aadish Gupta
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import FireListener from '../../../scenery/js/listeners/FireListener.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../scenery/js/nodes/Text.js';
import EventType from '../../../tandem/js/EventType.js';
import Tandem from '../../../tandem/js/Tandem.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shred from '../shred.js';

// constants
const NOMINAL_CELL_DIMENSION = 25;
const NOMINAL_FONT_SIZE = 14;

/**
 * @param {number} atomicNumber - Atomic number of atom represented by this cell.
 * @param {NumberAtom} numberAtom - Atom that is set if this cell is selected by the user.
 * @param {Color} cellColor - Color to be used for selected enabled and disabled cell
 * @param {Object} [options]
 * @constructor
 */
function PeriodicTableCell( atomicNumber, numberAtom, cellColor, options ) {
  options = merge( {
    length: 25, //Width and height of cell (cells are square).
    interactive: false, // Boolean flag that determines whether cell is interactive.
    showLabels: true,
    tandem: Tandem.REQUIRED,
    phetioEventType: EventType.USER
  }, options );

  this.options = options;

  // @private
  this.normalFill = options.interactive ? cellColor.enabled : cellColor.disabled;
  this.highlightedFill = cellColor.selected;

  Rectangle.call( this, 0, 0, options.length, options.length, 0, 0, {
    stroke: 'black',
    lineWidth: 1,
    fill: this.normalFill,
    cursor: options.interactive ? 'pointer' : null,
    tandem: options.tandem,
    phetioType: options.phetioType
  } ); // Call super constructor.

  if ( options.showLabels ) {
    // @private
    this.label = new Text( AtomIdentifier.getSymbol( atomicNumber ), {
      font: new PhetFont( NOMINAL_FONT_SIZE * ( options.length / NOMINAL_CELL_DIMENSION ) ),
      center: this.center,
      maxWidth: options.length - 5,
      tandem: options.tandem.createTandem( 'label' )
    } );
    this.addChild( this.label );
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
  this.disposePeriodicTableCell = function() {
    this.label.dispose();
    buttonListener && buttonListener.dispose();
  };
}

shred.register( 'PeriodicTableCell', PeriodicTableCell );

inherit( Rectangle, PeriodicTableCell, {

  setHighlighted: function( highLighted ) {
    this.fill = highLighted ? this.highlightedFill : this.normalFill;
    this.stroke = highLighted ? PhetColorScheme.RED_COLORBLIND : 'black';
    this.lineWidth = highLighted ? 2 : 1;
    if ( this.options.showLabels ) {
      this.label.fontWeight = highLighted ? 'bold' : 'normal';
    }
  },

  dispose: function() {
    this.disposePeriodicTableCell();
    Rectangle.prototype.dispose.call( this );
  }
} );

export default PeriodicTableCell;