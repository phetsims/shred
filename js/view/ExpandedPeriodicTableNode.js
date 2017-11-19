// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Aadish Gupta (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AtomIdentifier = require( 'SHRED/AtomIdentifier' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PeriodicTableNode = require( 'SHRED/view/PeriodicTableNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var shred = require( 'SHRED/shred' );
  var ShredConstants = require( 'SHRED/ShredConstants' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  // 2D array that defines the table structure.
  var POPULATED_CELLS = [
    [ 0, 8 ],
    [ 0, 1, 3, 4, 5, 6, 7, 8 ],
    [ 0, 1, 3, 4, 5, 6, 7, 8 ]
  ];

  var ENABLED_CELL_COLOR = ShredConstants.DISPLAY_PANEL_BACKGROUND_COLOR;
  var SELECTED_CELL_COLOR = '#FA8072'; //salmon
  var BUTTON_SIZE = 50;

  // strings
  var periodicTableString = require( 'string!SHRED/periodicTable' );

  /**
   * @param {NumberAtom} numberAtom
   * @param {number} interactiveMax
   * @param {Object} options
   * @constructor
   */
  function ExpandedPeriodicTableNode( numberAtom, interactiveMax, options ) {
    options = _.extend( {
      tandem: Tandem.required
    }, options );

    Node.call( this );
    var self = this;
    var periodicTableNode = new PeriodicTableNode( numberAtom, {
      tandem: options.tandem && options.tandem.createTandem( 'periodicTable' ),
      interactiveMax: interactiveMax,
      showLabels: false
    } );
    periodicTableNode.scale( 0.5 );
    this.addChild( periodicTableNode );

    this.cells = [];
    var expandedRowsNode = new Node();
    var elementIndex = 1;
    var rows = 1;
    if ( interactiveMax > 2 && interactiveMax <= 10 ) {
      rows = 2;
    }
    else if ( interactiveMax > 10 ) {
      rows = 3;
    }
    for ( var i = 0; i < rows; i++ ) {
      var populatedCellsInRow = POPULATED_CELLS[ i ];
      var j = 0;
      _.times( populatedCellsInRow.length, function() {
        var atomicNumber = elementIndex;
        var button = new TextPushButton( AtomIdentifier.getSymbol( elementIndex ), {
          listener: function() {
            numberAtom.setSubAtomicParticleCount( atomicNumber,
              AtomIdentifier.getNumNeutronsInMostCommonIsotope( atomicNumber ), atomicNumber );
          },
          baseColor: ENABLED_CELL_COLOR,
          cornerRadius: 0,
          minWidth: BUTTON_SIZE,
          maxWidth: BUTTON_SIZE,
          minHeight: BUTTON_SIZE,
          maxHeight: BUTTON_SIZE,
          font: new PhetFont( 24 )
        } );
        button.translation = new Vector2( populatedCellsInRow[ j ] * BUTTON_SIZE, i * BUTTON_SIZE );
        self.cells.push( button );
        expandedRowsNode.addChild( button );
        j++;
        elementIndex++;

      } );
    }
    expandedRowsNode.top = periodicTableNode.bottom - 30;
    periodicTableNode.centerX = expandedRowsNode.centerX;
    this.addChild( expandedRowsNode );

    var connectingLineOptions = { stroke: 'gray', lineDash: [ 9, 6 ] };
    var leftConnectingLine = new Line( periodicTableNode.left, periodicTableNode.top,
      expandedRowsNode.left, expandedRowsNode.top, connectingLineOptions );
    this.addChild( leftConnectingLine );

    var rightConnectingLine = new Line( periodicTableNode.right, periodicTableNode.top,
      expandedRowsNode.right, expandedRowsNode.top, connectingLineOptions );
    this.addChild( rightConnectingLine );

    var periodicTableTitle = new Text( periodicTableString, { font: new PhetFont( { size: 16, weight: 'bold' } ) } );
    periodicTableTitle.bottom = periodicTableNode.top - 5;
    periodicTableTitle.centerX = periodicTableNode.centerX;
    this.addChild( periodicTableTitle );
    // Highlight the cell that corresponds to the atom.
    var highlightedButton = null;
    numberAtom.protonCountProperty.link( function( protonCount ) {
      if ( highlightedButton !== null ) {
        highlightedButton.baseColor = ENABLED_CELL_COLOR;
      }
      if ( protonCount > 0 && protonCount <= self.cells.length ) {
        highlightedButton = self.cells[ protonCount - 1 ];
        highlightedButton.baseColor = SELECTED_CELL_COLOR;
      }
    } );
  }

  shred.register( 'ExpandedPeriodicTableNode', ExpandedPeriodicTableNode );

  return inherit( Node, ExpandedPeriodicTableNode );
} );