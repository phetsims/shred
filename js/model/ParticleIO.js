// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for Particle
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import ObjectIO from '../../../tandem/js/types/ObjectIO.js';
import shred from '../shred.js';

class ParticleIO extends ObjectIO {

  /**
   * Return the json that ObjectIO is wrapping.  This can be overriden by subclasses, or types can use ObjectIO type
   * directly to use this implementation.
   * @param {Particle} particle
   * @returns {Object}
   */
  static toStateObject( particle ) {

    // Avoid circular JSON.stringify(), see https://github.com/phetsims/build-an-atom/issues/184
    return particle.tandem.phetioID;
  }
}

ParticleIO.validator = { isValidValue: v => v instanceof phet.shred.Particle };
ParticleIO.documentation = 'The model for a single particle such as an electron, proton, or neutron.';
ParticleIO.typeName = 'ParticleIO';

shred.register( 'ParticleIO', ParticleIO );
export default ParticleIO;