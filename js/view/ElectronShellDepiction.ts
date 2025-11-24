// Copyright 2025, University of Colorado Boulder

/**
 * An enumeration of the possible depictions of electron shells in an atom view.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
import shred from '../shred.js';

const ElectronShellDepictionValues = [ 'shells', 'cloud' ] as const;
type ElectronShellDepiction = typeof ElectronShellDepictionValues[number];

shred.register( 'ElectronShellDepictionValues', ElectronShellDepictionValues );
export { ElectronShellDepictionValues };
export default ElectronShellDepiction;
