// Copyright 2014-2015, University of Colorado Boulder

/**
 * Collection of utility functions used in multiple places within the sim.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';
  var shred = require( 'SHRED/shred' );

  var Utils = {
    /**
     * Determine if two values are equal within a tolerance.
     *
     * @param {number} value1
     * @param {number} value2
     * @param {number} tolerance
     * @public
     */
    roughlyEqual: function( value1, value2, tolerance ) {
      return Math.abs( value1 - value2 ) < tolerance;
    }
  };
  shred.register( 'Utils', Utils);
  return Utils;
} );