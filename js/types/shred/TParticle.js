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

  function TParticle( particle, phetioID ) {
    assertInstanceOf( particle, phet.shred.Particle );
    TObject.call( this, particle, phetioID );
  }

  phetioInherit( TObject, 'TParticle', TParticle, {}, {} );

  phetioNamespace.register( 'TParticle', TParticle );

  return TParticle;
} );
