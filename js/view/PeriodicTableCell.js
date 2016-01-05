// Copyright 2015, University of Colorado Boulder

/**
 * Scenery node that defines a single cell in a periodic table.
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var Emitter = require( 'AXON/Emitter' );
  var shred = require( 'SHRED/shred' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var AtomIdentifier = require( 'SHRED/AtomIdentifier' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var NOMINAL_CELL_DIMENSION = 25;
  var NOMINAL_FONT_SIZE = 14;

  /**
   * Constructor.
   *
   * @param atomicNumber - Atomic number of atom represented by this cell.
   * @param numberAtom - Atom that is set if this cell is selected by the user.
   * @param cellColor - Color to be used for selected enabled and disabled cell
   * @param {Tandem} tandem
   * @constructor
   */
  function PeriodicTableCell( atomicNumber, numberAtom, cellColor, tandem, options ) {
    options = _.extend( {
      length: 25, //Width and height of cell (cells are square).
      interactive: false, // Boolean flag that determines whether cell is interactive.
      showLabels: true,
      popOnTouch: false
    }, options );
    var self = this;
    this.options = options;

    // @public (together) send a message when this button is pressed (only occurs when interactive===true)
    this.cellPressedEmitter = new Emitter();

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
        center: this.center
      } );
      this.addChild( this.label );
    }

    // If interactive, add a listener to set the atom when this cell is pressed.
    if ( options.interactive ) {
      if ( options.popOnTouch ) {
        var popupInflation = 0.5 * options.length;
        var popupShape = new Shape().
          moveTo( 0, 0 ).
          lineTo( 0, options.length ).
          lineTo( options.length, options.length ).
          lineTo( options.length, 0 ).
          lineTo( 1.5 * options.length, -popupInflation ).
          lineTo( 1.5 * options.length, -popupInflation - ( 2 * options.length ) ).
          lineTo( -0.5 * options.length, -popupInflation - ( 2 * options.length ) ).
          lineTo( -0.5 * options.length, -popupInflation ).
          lineTo( 0, 0 );

        var popup = new Path( popupShape, {
          stroke: 'black',
          lineWidth: 1,
          fill: self.normalFill,
          cursor: options.interactive ? 'pointer' : null,
          pickable: false,
          visible: false
        } );

        var popupLabel = new Text( AtomIdentifier.getSymbol( atomicNumber ), {
          font: new PhetFont( NOMINAL_FONT_SIZE * ( 2.5 * options.length / NOMINAL_CELL_DIMENSION ) ),
          centerX: popup.centerX,
          centerY: 0.5 * (-popupInflation - ( 2 * options.length ))
        } );
        popup.addChild( popupLabel );
        this.addChild( popup );
      }

      this.addInputListener( {
        up: function() {
          numberAtom.setSubAtomicParticleCount( atomicNumber, AtomIdentifier.getNumNeutronsInMostCommonIsotope( atomicNumber ), atomicNumber);
          self.cellPressedEmitter.emit();
        },
        over: function( event ) {
          if ( options.popOnTouch ) {
            if ( event.pointer.type === 'touch' ) {
              self.moveToFront();
              popup.visible = true;
            }
          }
        },
        exit: function() {
          if ( options.popOnTouch ) {
            popup.visible = false;
          }
        }
      } );
    }
    tandem.addInstance( this );
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
