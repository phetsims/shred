// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for ParticleAtom
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var shred = require( 'SHRED/shred' );
  var validate = require( 'AXON/validate' );

  // ifphetio
  var phetioEngine = require( 'ifphetio!PHET_IO/phetioEngine' );

  class ParticleAtomIO extends ObjectIO {

    /**
     * create a description of the state that isn't automatically handled by the framework (e.g. Property instances)
     * @param {ParticleAtom} particleAtom
     * @returns {Object}
     */
    static toStateObject( particleAtom ) {
      validate( particleAtom, this.validator );
      return {

        // an array of all the particles currently contained within the particle atom
        residentParticleIDs: particleAtom.protons.map( getParticleTandemID ).getArray()
          .concat( particleAtom.neutrons.map( getParticleTandemID ).getArray() )
          .concat( particleAtom.electrons.map( getParticleTandemID ).getArray() ),

        // an ordered array that tracks which electron, if any, is in each shell position
        electronShellOccupantIDs: particleAtom.electronShellPositions.map( function( electronShellPosition ) {
          return electronShellPosition.electron ? getParticleTandemID( electronShellPosition.electron ) : null;
        } )
      };
    }

    /**
     * @param {string[]} stateObject
     * @returns {Object}
     */
    static fromStateObject( stateObject ) {
      return {
        residentParticles: stateObject.residentParticleIDs.map( function( tandemID ) {
          return phetioEngine.getPhetioObject( tandemID );
        } ),
        electronShellOccupants: stateObject.electronShellOccupantIDs.map( function( tandemID ) {
          return tandemID ? phetioEngine.getPhetioObject( tandemID ) : null;
        } )
      };
    }

    /**
     * @param {ParticleAtom} particleAtom
     * @param {Object} fromStateObject
     */
    static setValue( particleAtom, fromStateObject ) {
      validate( particleAtom, this.validator );

      // remove all the particles from the observable arrays
      particleAtom.clear();

      // add back the particles
      fromStateObject.residentParticles.forEach( function( value ) { particleAtom.addParticle( value ); } );

      // set the electron shell occupancy state
      fromStateObject.electronShellOccupants.forEach( function( electron, index ) {
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
  ObjectIO.validateSubtype( ParticleAtomIO );

  // helper function for retrieving the tandem for a particle
  function getParticleTandemID( particle ) {
    return particle.tandem.phetioID;
  }

  return shred.register( 'ParticleAtomIO', ParticleAtomIO );
} );