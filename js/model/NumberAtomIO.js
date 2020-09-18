// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for NumberAtom
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import IOType from '../../../tandem/js/types/IOType.js';
import shred from '../shred.js';
import NumberAtom from './NumberAtom.js';

const NumberAtomIO = new IOType( 'NumberAtomIO', {
  valueType: NumberAtom,
  documentation: 'A value type that contains quantities of electrons, protons, and neutrons.',
  toStateObject: numberAtom => ( {
    protonCount: numberAtom.protonCountProperty.get(),
    electronCount: numberAtom.electronCountProperty.get(),
    neutronCount: numberAtom.neutronCountProperty.get()
  } ),

  fromStateObject( stateObject ) { }
} );

shred.register( 'NumberAtomIO', NumberAtomIO );
export default NumberAtomIO;