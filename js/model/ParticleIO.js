// Copyright 2016, University of Colorado Boulder

/**
 * IO type for Particle
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var shred = require( 'SHRED/shred' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );

  /**
   * IO type for phet/shred's Particle class.
   * @param {Particle} particle
   * @param {string} phetioID
   * @constructor
   */
  function ParticleIO( particle, phetioID ) {
    assert && assertInstanceOf( particle, phet.shred.Particle );
    ObjectIO.call( this, particle, phetioID );
  }

  phetioInherit( ObjectIO, 'ParticleIO', ParticleIO, {}, {
    documentation: 'The model for a single particle such as an electron, proton, or neutron.',

    /**
     * Return the json that ObjectIO is wrapping.  This can be overriden by subclasses, or types can use ObjectIO type
     * directly to use this implementation.
     * @param {Particle} particle
     * @returns {Object}
     */
    toStateObject: function( particle ) {

      // Avoid circular JSON.stringify(), see https://github.com/phetsims/build-an-atom/issues/184
      return particle.phetioID;
    }
  } );

  shred.register( 'ParticleIO', ParticleIO );

  return ParticleIO;
} );
