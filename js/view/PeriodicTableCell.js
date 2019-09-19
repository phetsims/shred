// Copyright 2015-2019, University of Colorado Boulder

/**
 * Scenery node that defines a single cell in a periodic table.
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const EventType = require( 'TANDEM/EventType' );
  const AtomIdentifier = require( 'SHRED/AtomIdentifier' );
  const FireListener = require( 'SCENERY/listeners/FireListener' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const shred = require( 'SHRED/shred' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );

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
    options = _.extend( {
      length: 25, //Width and height of cell (cells are square).
      interactive: false, // Boolean flag that determines whether cell is interactive.
      showLabels: true,
      tandem: Tandem.required,
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

  return inherit( Rectangle, PeriodicTableCell, {

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
} );
