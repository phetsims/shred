// Copyright 2017, University of Colorado Boulder

/**
 * wrapper type for NumberAtom
 *
 * @author Michael Kauzamann (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var shred = require( 'SHRED/shred' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );

  /**
   * @param {NumberAtom} instance
   * @param {string} phetioID
   * @constructor
   */
  function TNumberAtom( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.shred.NumberAtom );
    TObject.call( this, instance, phetioID );
  }


  phetioInherit( TObject, 'TNumberAtom', TNumberAtom, {}, {

    documentation: 'A value type that contains quantities of electrons, protons, and neutrons.',

    /**
     * create a description of the state that isn't automatically handled by the framework (e.g. Property instances)
     * @param {NumberAtom} instance
     * @returns {Object}
     */
    toStateObject: function( instance ) {
      return {
        protonCount: instance.protonCountProperty.get(),
        electronCount: instance.electronCountProperty.get(),
        neutronCount: instance.neutronCountProperty.get()
      };
    },

    /**
     * @param {Object} stateObject
     * @returns {}
     */
    fromStateObject: function( stateObject ) { }

  } );

  shred.register( 'TNumberAtom', TNumberAtom );

  return TNumberAtom;
} );

