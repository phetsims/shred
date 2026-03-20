// Copyright 2014-2025, University of Colorado Boulder

/**
 * Collection of utility functions used in multiple places within the sim.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

const Utils = {

  /**
   * Determine if two values are equal within a tolerance.
   */
  roughlyEqual: function( value1: number, value2: number, tolerance: number ): boolean {
    return Math.abs( value1 - value2 ) < tolerance;
  }
};

export default Utils;
