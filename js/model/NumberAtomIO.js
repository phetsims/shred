// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for NumberAtom
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import validate from '../../../axon/js/validate.js';
import ObjectIO from '../../../tandem/js/types/ObjectIO.js';
import shred from '../shred.js';
import NumberAtom from './NumberAtom.js';

class NumberAtomIO extends ObjectIO {

  /**
   * create a description of the state that isn't automatically handled by the framework (e.g. Property instances)
   * @param {NumberAtom} numberAtom
   * @returns {Object}
   * @override
   * @public
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
   * @public
   */
  static fromStateObject( stateObject ) { }
}

NumberAtomIO.validator = { valueType: NumberAtom };
NumberAtomIO.documentation = 'A value type that contains quantities of electrons, protons, and neutrons.';
NumberAtomIO.typeName = 'NumberAtomIO';
ObjectIO.validateIOType( NumberAtomIO );

shred.register( 'NumberAtomIO', NumberAtomIO );
export default NumberAtomIO;