// Copyright 2017, University of Colorado Boulder

/**
 * IO type for NumberAtom
 *
 * @author Michael Kauzamann (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var shred = require( 'SHRED/shred' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );

  /**
   * @param {NumberAtom} numberAtom
   * @param {string} phetioID
   * @constructor
   */
  function NumberAtomIO( numberAtom, phetioID ) {
    assert && assertInstanceOf( numberAtom, phet.shred.NumberAtom );
    ObjectIO.call( this, numberAtom, phetioID );
  }

  phetioInherit( ObjectIO, 'NumberAtomIO', NumberAtomIO, {}, {

    documentation: 'A value type that contains quantities of electrons, protons, and neutrons.',

    /**
     * create a description of the state that isn't automatically handled by the framework (e.g. Property instances)
     * @param {NumberAtom} numberAtom
     * @returns {Object}
     */
    toStateObject: function( numberAtom ) {
      assert && assertInstanceOf( numberAtom, phet.shred.NumberAtom );
      return {
        protonCount: numberAtom.protonCountProperty.get(),
        electronCount: numberAtom.electronCountProperty.get(),
        neutronCount: numberAtom.neutronCountProperty.get()
      };
    },

    /**
     * @param {Object} stateObject
     * @returns {}
     */
    fromStateObject: function( stateObject ) { }
  } );

  shred.register( 'NumberAtomIO', NumberAtomIO );

  return NumberAtomIO;
} );

