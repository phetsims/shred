// Copyright 2025, University of Colorado Boulder
/**
 * AccessibleListNode that displays the information on the particle counts panel.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import AccessibleListNode from '../../../../scenery-phet/js/accessibility/AccessibleListNode.js';
import NumberAtom, { TReadOnlyNumberAtom } from '../../model/NumberAtom.js';
import shred from '../../shred.js';
import ShredFluent from '../../ShredFluent.js';

export default class ParticleCountsAccessibleListNode extends AccessibleListNode {
  public constructor( atom: TReadOnlyNumberAtom | NumberAtom, visibleProperty: TReadOnlyProperty<boolean> = new Property<boolean>( true ) ) {

    super( [
      ShredFluent.a11y.particleCounts.accessibleListNode.protons.createProperty( {
        count: atom.protonCountProperty
      } ),
      ShredFluent.a11y.particleCounts.accessibleListNode.neutrons.createProperty( {
        count: atom.neutronCountProperty
      } ),
      ShredFluent.a11y.particleCounts.accessibleListNode.electrons.createProperty( {
        count: atom.electronCountProperty
      } )
    ], { visibleProperty: visibleProperty } );
  }
}

shred.register( 'ParticleCountsAccessibleListNode', ParticleCountsAccessibleListNode );