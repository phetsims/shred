// Copyright 2025, University of Colorado Boulder

/**
 * An enumeration of the possible depictions of electron shells in an atom view.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

const ElectronShellDepictionValues = [ 'shells', 'cloud' ] as const;
type ElectronShellDepiction = typeof ElectronShellDepictionValues[number];

export { ElectronShellDepictionValues };
export default ElectronShellDepiction;
