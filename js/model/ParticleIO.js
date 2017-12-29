// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var shred = require( 'SHRED/shred' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );

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
    documentation: 'The model for a single particle such as an electron, proton, or neutron.'
  } );

  shred.register( 'ParticleIO', ParticleIO );

  return ParticleIO;
} );
