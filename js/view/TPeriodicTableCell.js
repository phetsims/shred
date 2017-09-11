// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var shred = require( 'SHRED/shred' );
  var TNode = require( 'SCENERY/nodes/TNode' );
  var toEventOnEmit = require( 'ifphetio!PHET_IO/toEventOnEmit' );

  /**
   *
   * @param periodicTableCell
   * @param phetioID
   * @constructor
   */
  function TPeriodicTableCell( periodicTableCell, phetioID ) {
    assertInstanceOf( periodicTableCell, phet.shred.PeriodicTableCell );
    TNode.call( this, periodicTableCell, phetioID );

    toEventOnEmit(
      periodicTableCell.startedCallbacksForPressedEmitter,
      periodicTableCell.endedCallbacksForPressedEmitter,
      'user',
      phetioID,
      TPeriodicTableCell,
      'fired'
    );
  }

  phetioInherit( TNode, 'TPeriodicTableCell', TPeriodicTableCell, {}, {
    documentation: 'The type that wraps a periodic table cell.',
    events: [ 'fired' ],

    fromStateObject: function( stateObject ) {
      return new phet.dot.Vector2( stateObject.x, stateObject.y );
    },

    toStateObject: function( instance ) {
      return { x: instance.x, y: instance.y };
    }
  } );

  shred.register( 'TPeriodicTableCell', TPeriodicTableCell );

  return TPeriodicTableCell;
} );

