// Copyright 2015-2020, University of Colorado Boulder

/**
 * Scenery node that defines a single cell in a periodic table.
 * @author John Blanco
 * @author Aadish Gupta
 */

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

class PeriodicTableCell extends Rectangle {

  /**
   * @param {number} atomicNumber - Atomic number of atom represented by this cell.
   * @param {NumberAtom} numberAtom - Atom that is set if this cell is selected by the user.
   * @param {Color} cellColor - Color to be used for selected enabled and disabled cell
   * @param {Object} [options]
   */
  constructor( atomicNumber, numberAtom, cellColor, options ) {

    options = merge( {
      length: 25, //Width and height of cell (cells are square).
      interactive: false, // Boolean flag that determines whether cell is interactive.
      showLabels: true,
      tandem: Tandem.REQUIRED,
      phetioEventType: EventType.USER
    }, options );

    const normalFill = options.interactive ? cellColor.enabled : cellColor.disabled;

    super( 0, 0, options.length, options.length, 0, 0, {
      stroke: 'black',
      lineWidth: 1,
      fill: normalFill,
      cursor: options.interactive ? 'pointer' : null,
      tandem: options.tandem,
      phetioType: options.phetioType
    } );

    // @private
    this.options = options;
    this.normalFill = normalFill;
    this.highlightedFill = cellColor.selected;

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
        fire: () => numberAtom.setSubAtomicParticleCount(
          atomicNumber,
          AtomIdentifier.getNumNeutronsInMostCommonIsotope( atomicNumber ),
          atomicNumber
        )
      } );
      this.addInputListener( buttonListener );
    }

    // @private called by dispose
    this.disposePeriodicTableCell = () => {
      this.label.dispose();
      buttonListener && buttonListener.dispose();
    };
  }

  // @public
  setHighlighted( highLighted ) {
    this.fill = highLighted ? this.highlightedFill : this.normalFill;
    this.stroke = highLighted ? PhetColorScheme.RED_COLORBLIND : 'black';
    this.lineWidth = highLighted ? 2 : 1;
    if ( this.options.showLabels ) {
      this.label.fontWeight = highLighted ? 'bold' : 'normal';
    }
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposePeriodicTableCell();
    super.dispose();
  }
}

shred.register( 'PeriodicTableCell', PeriodicTableCell );
export default PeriodicTableCell;