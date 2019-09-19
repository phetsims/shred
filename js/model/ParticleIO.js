// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for Particle
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const shred = require( 'SHRED/shred' );

  class ParticleIO extends ObjectIO {

    /**
     * Return the json that ObjectIO is wrapping.  This can be overriden by subclasses, or types can use ObjectIO type
     * directly to use this implementation.
     * @param {Particle} particle
     * @returns {Object}
     */
    static toStateObject( particle ) {

      // Avoid circular JSON.stringify(), see https://github.com/phetsims/build-an-atom/issues/184
      return particle.phetioID;
    }
  }

  ParticleIO.validator = { isValidValue: v => v instanceof phet.shred.Particle };
  ParticleIO.documentation = 'The model for a single particle such as an electron, proton, or neutron.';
  ParticleIO.typeName = 'ParticleIO';

  return shred.register( 'ParticleIO', ParticleIO );
} );
