// Copyright 2017, University of Colorado Boulder

/**
 * IO type for NumberAtom
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var NumberAtom = require( 'SHRED/model/NumberAtom' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var shred = require( 'SHRED/shred' );
  var validate = require( 'AXON/validate' );

  /**
   * @param {NumberAtom} numberAtom
   * @param {string} phetioID
   * @constructor
   */
  function NumberAtomIO( numberAtom, phetioID ) {
    ObjectIO.call( this, numberAtom, phetioID );
  }

  phetioInherit( ObjectIO, 'NumberAtomIO', NumberAtomIO, {}, {
    validator: { valueType: NumberAtom },

    documentation: 'A value type that contains quantities of electrons, protons, and neutrons.',

    /**
     * create a description of the state that isn't automatically handled by the framework (e.g. Property instances)
     * @param {NumberAtom} numberAtom
     * @returns {Object}
     * @override
     */
    toStateObject: function( numberAtom ) {
      validate( numberAtom, this.validator );
      return {
        protonCount: numberAtom.protonCountProperty.get(),
        electronCount: numberAtom.electronCountProperty.get(),
        neutronCount: numberAtom.neutronCountProperty.get()
      };
    },

    /**
     * @param {Object} stateObject
     * @returns {}
     * @override
     */
    fromStateObject: function( stateObject ) { }
  } );

  shred.register( 'NumberAtomIO', NumberAtomIO );

  return NumberAtomIO;
} );

