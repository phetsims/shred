// Copyright 2017, University of Colorado Boulder

/**
 * IO type for ParticleAtom
 *
 * TODO: This appears unused
 *
 * @author John Blanco
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var shred = require( 'SHRED/shred' );
  
  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetio = require( 'ifphetio!PHET_IO/phetio' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );

  /**
   * @param {ParticleAtom} particleAtom
   * @param {string} phetioID
   * @constructor
   */
  function ParticleAtomIO( particleAtom, phetioID ) {
    assert && assertInstanceOf( particleAtom, phet.shred.ParticleAtom );
    ObjectIO.call( this, particleAtom, phetioID );
  }

  // helper function for retrieving the tandem for a particle
  function getParticleTandemID( particle ) {
    return particle.tandem.phetioID;
  }

  phetioInherit( ObjectIO, 'ParticleAtomIO', ParticleAtomIO, {}, {

    documentation: 'A model of an atom that tracks and arranges the subatomic particles, i.e. protons, neutrons, ' +
                   'and electrons, of which it is comprised.  When particles are added, they are moved into the ' +
                   'appropriate places.  This object also keeps track of things like atomic number, mass number, and ' +
                   'charge.',

    /**
     * create a description of the state that isn't automatically handled by the framework (e.g. Property instances)
     * @param {ParticleAtom} particleAtom
     * @returns {Object}
     */
    toStateObject: function( particleAtom ) {
      assert && assertInstanceOf( particleAtom, phet.shred.ParticleAtom );
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
    },

    /**
     * @param {string[]} stateObject
     * @returns {Object}
     */
    fromStateObject: function( stateObject ) {
      return {
        residentParticles: stateObject.residentParticleIDs.map( function( tandemID ) {
          return phetio.getInstance( tandemID );
        } ),
        electronShellOccupants: stateObject.electronShellOccupantIDs.map( function( tandemID ) {
          return tandemID ? phetio.getInstance( tandemID ) : null;
        } )
      };
    },

    /**
     * @param {ParticleAtom} particleAtom
     * @param {Object} fromStateObject
     */
    setValue: function( particleAtom, fromStateObject ) {
      assert && assertInstanceOf( particleAtom, phet.shred.ParticleAtom );

      // remove all the particles from the observable arrays
      particleAtom.clear();

      // add back the particles
      fromStateObject.residentParticles.forEach( function( value ) { particleAtom.addParticle( value ); } );

      // set the electron shell occupancy state
      fromStateObject.electronShellOccupants.forEach( function( electron, index ) {
        particleAtom.electronShellPositions[ index ].electron = electron;
      } );
    }
  } );

  shred.register( 'ParticleAtomIO', ParticleAtomIO );

  return ParticleAtomIO;
} );

