// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Particle
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import IOType from '../../../tandem/js/types/IOType.js';
import shred from '../shred.js';

const ParticleIO = new IOType( 'ParticleIO', {
  isValidValue: v => v instanceof phet.shred.Particle,
  documentation: 'The model for a single particle such as an electron, proton, or neutron.',
  toStateObject: particle => particle.tandem.phetioID // TODO: https://github.com/phetsims/tandem/issues/211 ReferenceIO
} );

shred.register( 'ParticleIO', ParticleIO );
export default ParticleIO;