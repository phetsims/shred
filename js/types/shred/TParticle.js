// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TObject = require( 'PHET_IO/types/TObject' );
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );

  /**
   * Wrapper type for phet/shred's Particle class.
   * @param particle
   * @param phetioID
   * @constructor
   */
  function TParticle( particle, phetioID ) {
    assertInstanceOf( particle, phet.shred.Particle );
    TObject.call( this, particle, phetioID );
  }

  phetioInherit( TObject, 'TParticle', TParticle, {}, {

    /**
     * TOTO: this is stubbed because because TObservableArray assumes that everything it contains is serializable, which
     * is not necessarily a valid assumption.  Once this is fixed or otherwise resolved, this function can be removed.
     * @param particle
     * @returns {string}
     */
    toStateObject: function( particle ) {
      return 'TParticle';
    },

    fromStateObject: function( stateObject ) {
      // TODO: This function is also stubbed, as is toStateObject, due to issues with TObservableArray and its
      // assumptions about serializing and deserializing the objects contained in an observable array.
      return stateObject;
    },

    documentation: 'The model for a single particle such as an electron, proton, or neutron.'
  } );

  phetioNamespace.register( 'TParticle', TParticle );

  return TParticle;
} );
