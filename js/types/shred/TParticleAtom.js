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
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetio = require( 'PHET_IO/phetio' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TObject = require( 'PHET_IO/types/TObject' );

  /**
   * @param {ParticleAtom} instance
   * @param {string} phetioID
   * @constructor
   */
  var TParticleAtom = function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.shred.ParticleAtom );
  };

  // helper function for retrieving the tandem for a particle
  function getParticleTandemID( particle ) {
    return particle.particleTandem.id;
  }

  phetioInherit( TObject, 'TParticleAtom', TParticleAtom, {}, {

    /**
     * create a description of the state that isn't automatically handled by the framework (e.g. Property instances)
     * @param {ParticleAtom} instance
     */
    toStateObject: function( instance ) {
      return instance.protons.map( getParticleTandemID ).getArray().
      concat( instance.neutrons.map( getParticleTandemID ).getArray() ).
      concat( instance.electrons.map( getParticleTandemID ).getArray() );
    },

    /**
     * @param {string[]} stateArray
     * @returns {Particle[]}
     */
    fromStateObject: function( stateArray ) {
      return stateArray.map( function( tandemID ) { return phetio.getInstance( tandemID ); } );
    },

    /**
     * @param {ParticleAtom} instance
     * @param {Particle[]} particleArray
     */
    setValue: function( instance, particleArray ) {

      // remove all the particles from the observable arrays
      instance.clear();

      // add back the particles
      particleArray.forEach( function( value ) { instance.addParticle( value ); } );
    }
  } );

  phetioNamespace.register( 'TParticleAtom', TParticleAtom );

  return TParticleAtom;
} );

