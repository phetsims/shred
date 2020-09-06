// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for ParticleAtom
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import validate from '../../../axon/js/validate.js';
import ObjectIO from '../../../tandem/js/types/ObjectIO.js';
import shred from '../shred.js';

class ParticleAtomIO extends ObjectIO {

  /**
   * create a description of the state that isn't automatically handled by the framework (e.g. Property instances)
   * @param {ParticleAtom} particleAtom
   * @returns {Object}
   * @override
   * @public
   */
  static toStateObject( particleAtom ) {
    validate( particleAtom, this.validator );
    return {

      // an array of all the particles currently contained within the particle atom
      residentParticleIDs: particleAtom.protons.map( getParticleTandemID )
        .concat( particleAtom.neutrons.map( getParticleTandemID ) )
        .concat( particleAtom.electrons.map( getParticleTandemID ) ),

      // an ordered array that tracks which electron, if any, is in each shell position
      electronShellOccupantIDs: particleAtom.electronShellPositions.map( function( electronShellPosition ) {
        return electronShellPosition.electron ? getParticleTandemID( electronShellPosition.electron ) : null;
      } )
    };
  }

  /**
   * @param {ParticleAtom} particleAtom
   * @param {Object} stateObject
   * @public
   * @override
   */
  static applyState( particleAtom, stateObject ) {
    validate( particleAtom, this.validator );

    // remove all the particles from the observable arrays
    particleAtom.clear();

    const deserializedState = {
      residentParticles: stateObject.residentParticleIDs.map( function( tandemID ) {
        return phet.phetio.phetioEngine.getPhetioObject( tandemID );
      } ),
      electronShellOccupants: stateObject.electronShellOccupantIDs.map( function( tandemID ) {
        return tandemID ? phet.phetio.phetioEngine.getPhetioObject( tandemID ) : null;
      } )
    };

    // add back the particles
    deserializedState.residentParticles.forEach( function( value ) { particleAtom.addParticle( value ); } );

    // set the electron shell occupancy state
    deserializedState.electronShellOccupants.forEach( function( electron, index ) {
      particleAtom.electronShellPositions[ index ].electron = electron;
    } );
  }
}

ParticleAtomIO.validator = { isValidValue: v => v instanceof phet.shred.ParticleAtom };

ParticleAtomIO.documentation = 'A model of an atom that tracks and arranges the subatomic particles, i.e. protons, neutrons, ' +
                               'and electrons, of which it is comprised.  When particles are added, they are moved into the ' +
                               'appropriate places.  This object also keeps track of things like atomic number, mass number, and ' +
                               'charge.';
ParticleAtomIO.typeName = 'ParticleAtomIO';
ObjectIO.validateIOType( ParticleAtomIO );

// helper function for retrieving the tandem for a particle
function getParticleTandemID( particle ) {
  return particle.tandem.phetioID;
}

shred.register( 'ParticleAtomIO', ParticleAtomIO );
export default ParticleAtomIO;
