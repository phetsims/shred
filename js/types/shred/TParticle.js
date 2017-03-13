// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var phetioNamespace = require( 'ifphetio!PHET_IO/phetioNamespace' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );

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
    documentation: 'The model for a single particle such as an electron, proton, or neutron.'
  } );

  phetioNamespace.register( 'TParticle', TParticle );

  return TParticle;
} );
