// Copyright 2017, University of Colorado Boulder

/**
 * wrapper type for ParticleAtom
 *
 * @author John Blanco
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetio = require( 'ifphetio!PHET_IO/phetio' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var shred = require( 'SHRED/shred' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );

  /**
   * @param {ParticleAtom} instance
   * @param {string} phetioID
   * @constructor
   */
  function TParticleAtom( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.shred.ParticleAtom );
    ObjectIO.call( this, instance, phetioID );
  }

  // helper function for retrieving the tandem for a particle
  function getParticleTandemID( particle ) {
    return particle.particleTandem.id;
  }

  phetioInherit( ObjectIO, 'TParticleAtom', TParticleAtom, {}, {

    documentation: 'A model of an atom that tracks and arranges the subatomic particles, i.e. protons, neutrons, ' +
                   'and electrons, of which it is comprised.  When particles are added, they are moved into the ' +
                   'appropriate places.  This object also keeps track of things like atomic number, mass number, and ' +
                   'charge.',

    /**
     * create a description of the state that isn't automatically handled by the framework (e.g. Property instances)
     * @param {ParticleAtom} instance
     * @returns {Object}
     */
    toStateObject: function( instance ) {
      return {

        // an array of all the particles currently contained within the particle atom
        residentParticleIDs: instance.protons.map( getParticleTandemID ).getArray()
          .concat( instance.neutrons.map( getParticleTandemID ).getArray() )
          .concat( instance.electrons.map( getParticleTandemID ).getArray() ),

        // an ordered array that tracks which electron, if any, is in each shell position
        electronShellOccupantIDs: instance.electronShellPositions.map( function( electronShellPosition ) {
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
     * @param {ParticleAtom} instance
     * @param {Object} particleAtomState
     */
    setValue: function( instance, particleAtomState ) {

      // remove all the particles from the observable arrays
      instance.clear();

      // add back the particles
      particleAtomState.residentParticles.forEach( function( value ) { instance.addParticle( value ); } );

      // set the electron shell occupancy state
      particleAtomState.electronShellOccupants.forEach( function( electron, index ) {
        instance.electronShellPositions[ index ].electron = electron;
      } );
    }
  } );

  shred.register( 'TParticleAtom', TParticleAtom );

  return TParticleAtom;
} );

