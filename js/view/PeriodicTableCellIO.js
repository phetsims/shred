// Copyright 2016, University of Colorado Boulder

/**
 * IO type for PeriodicTableCell
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var shred = require( 'SHRED/shred' );
  var NodeIO = require( 'SCENERY/nodes/NodeIO' );
  
  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  
  /**
   *
   * @param {PeriodicTableCell} periodicTableCell
   * @param {string} phetioID
   * @constructor
   */
  function PeriodicTableCellIO( periodicTableCell, phetioID ) {
    assert && assertInstanceOf( periodicTableCell, phet.shred.PeriodicTableCell );
    NodeIO.call( this, periodicTableCell, phetioID );
  }

  phetioInherit( NodeIO, 'PeriodicTableCellIO', PeriodicTableCellIO, {}, {
    documentation: 'The type that wraps a periodic table cell.',
    events: [ 'fired' ],

    toStateObject: function( periodicTableCell ) {
      assert && assertInstanceOf( periodicTableCell, phet.shred.PeriodicTableCell );
      return { x: periodicTableCell.x, y: periodicTableCell.y };
    },

    fromStateObject: function( stateObject ) {
      return new phet.dot.Vector2( stateObject.x, stateObject.y );
    }
  } );

  shred.register( 'PeriodicTableCellIO', PeriodicTableCellIO );

  return PeriodicTableCellIO;
} );

