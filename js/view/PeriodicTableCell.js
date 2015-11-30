// Copyright 2015, University of Colorado Boulder

/**
 * Scenery node that defines a single cell in a periodic table.
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/Util/Color' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var AtomIdentifier = require( 'SHRED/AtomIdentifier' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var SharedConstants = require( 'SHRED/SharedConstants' );

  // constants
  var ENABLED_CELL_COLOR = SharedConstants.DISPLAY_PANEL_BACKGROUND_COLOR;
  var DISABLED_CELL_COLOR = '#EEEEEE';
  var SELECTED_CELL_COLOR = '#FA8072'; //salmon
  var NOMINAL_CELL_DIMENSION = 25;
  var NOMINAL_FONT_SIZE = 14;

  /**
   * Constructor.
   *
   * @param atomicNumber - Atomic number of atom represented by this cell.
   * @param length - Width and height of cell (cells are square).
   * @param interactive - Boolean flag that determines whether cell is interactive.
   * @param numberAtom - Atom that is set if this cell is selected by the user.
   * @constructor
   */
  function PeriodicTableCell( atomicNumber, length, interactive, numberAtom ) {
    var self = this;

    // @private
    this.normalFill = interactive ? ENABLED_CELL_COLOR : DISABLED_CELL_COLOR;
    this.highlightedFill = SELECTED_CELL_COLOR;

    Rectangle.call( this, 0, 0, length, length, 0, 0, {
      stroke: 'black',
      lineWidth: 1,
      fill: this.normalFill,
      cursor: interactive ? 'pointer' : null
    } ); // Call super constructor.

    // @private
    this.label = new Text( AtomIdentifier.getSymbol( atomicNumber ), {
      font: new PhetFont( NOMINAL_FONT_SIZE * ( length / NOMINAL_CELL_DIMENSION ) ),
      center: this.center
    } );

    this.addChild( this.label );

    // If interactive, add a listener to set the atom when this cell is pressed.
    if ( interactive ) {
      var rectangle = new Rectangle( 0, 0, 2 * length, 2 * length, 0, 0, {
        stroke: 'black',
        lineWidth: 1,
        fill: self.normalFill,
        cursor: interactive ? 'pointer' : null,
        pickable: false,
        visible: false
      } );
      this.addChild(rectangle);

      this.addInputListener( {
        up: function() {
          numberAtom.setSubAtomicParticleCount( atomicNumber, AtomIdentifier.getNumNeutronsInMostCommonIsotope( atomicNumber ), atomicNumber)
        },
        over: function() {
          self.moveToFront();
          rectangle.visible = true;
        },
        exit: function() {
          rectangle.visible = false;
        }
      } );
    }
  }

  return inherit( Rectangle, PeriodicTableCell, {
    setHighlighted: function( highLighted ) {
      this.fill = highLighted ? this.highlightedFill : this.normalFill;
      this.stroke = highLighted ? PhetColorScheme.RED_COLORBLIND : 'black';
      this.lineWidth = highLighted ? 2 : 1;
      this.label.fontWeight = highLighted ? 'bold' : 'normal';
    }
  } );
} );
