// Copyright 2017-2019, University of Colorado Boulder

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
  var shred = require( 'SHRED/shred' );
  var validate = require( 'AXON/validate' );

  class NumberAtomIO extends ObjectIO {

    /**
     * create a description of the state that isn't automatically handled by the framework (e.g. Property instances)
     * @param {NumberAtom} numberAtom
     * @returns {Object}
     * @override
     */
    static toStateObject( numberAtom ) {
      validate( numberAtom, this.validator );
      return {
        protonCount: numberAtom.protonCountProperty.get(),
        electronCount: numberAtom.electronCountProperty.get(),
        neutronCount: numberAtom.neutronCountProperty.get()
      };
    }

    /**
     * @param {Object} stateObject
     * @returns {}
     * @override
     */
    static fromStateObject( stateObject ) { }
  }

  NumberAtomIO.validator = { valueType: NumberAtom };
  NumberAtomIO.documentation = 'A value type that contains quantities of electrons, protons, and neutrons.';
  NumberAtomIO.typeName = 'NumberAtomIO';
  ObjectIO.validateSubtype( NumberAtomIO );

  return shred.register( 'NumberAtomIO', NumberAtomIO );
} );

