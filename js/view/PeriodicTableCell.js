// Copyright 2015, University of Colorado Boulder

/**
 * Scenery node that defines a single cell in a periodic table.
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var AtomIdentifier = require( 'SHRED/AtomIdentifier' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var shred = require( 'SHRED/shred' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Tandem = require( 'TANDEM/Tandem' );

  // phet-io modules
  var TPeriodicTableCell = require( 'SHRED/view/TPeriodicTableCell' );

  // constants
  var NOMINAL_CELL_DIMENSION = 25;
  var NOMINAL_FONT_SIZE = 14;

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
      tandem: Tandem.tandemRequired(),
      phetioType: TPeriodicTableCell
    }, options );

    var self = this;
    this.options = options;

    // @private (phet-io) send a message when this button is pressed (only occurs when interactive===true)
    this.startedCallbacksForPressedEmitter = new Emitter( { indicateCallbacks: false } );
    this.endedCallbacksForPressedEmitter = new Emitter( { indicateCallbacks: false } );

    // @private
    this.normalFill = options.interactive ? cellColor.enabled : cellColor.disabled;
    this.highlightedFill = cellColor.selected;

    Rectangle.call( this, 0, 0, options.length, options.length, 0, 0, {
      stroke: 'black',
      lineWidth: 1,
      fill: this.normalFill,
      cursor: options.interactive ? 'pointer' : null
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
    if ( options.interactive ) {
      this.addInputListener(
        new ButtonListener( {
          tandem: options.tandem.createTandem( 'buttonListener' ),
          fire: function( evt ) {
            self.startedCallbacksForPressedEmitter.emit();
            numberAtom.setSubAtomicParticleCount(
              atomicNumber,
              AtomIdentifier.getNumNeutronsInMostCommonIsotope( atomicNumber ),
              atomicNumber
            );
            self.endedCallbacksForPressedEmitter.emit();
          }
        } )
      );
    }
    this.mutate( {
      tandem: options.tandem,
      phetioType: options.phetioType
    } );
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
    }
  } );
} );
