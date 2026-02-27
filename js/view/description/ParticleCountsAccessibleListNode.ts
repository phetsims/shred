// Copyright 2025, University of Colorado Boulder
/**
 * AccessibleListNode that displays the information on the particle counts panel.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import AccessibleList from '../../../../scenery-phet/js/accessibility/AccessibleList.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import NumberAtom, { TReadOnlyNumberAtom } from '../../model/NumberAtom.js';
import shred from '../../shred.js';
import ShredFluent from '../../ShredFluent.js';

export default class ParticleCountsAccessibleListNode extends Node {
  public constructor( atom: TReadOnlyNumberAtom | NumberAtom, visibleProperty: TReadOnlyProperty<boolean> = new Property<boolean>( true ) ) {

    super( {
      accessibleTemplate: AccessibleList.createTemplate( {
        listItems: [
          ShredFluent.a11y.particleCounts.accessibleListNode.protons.createProperty( {
            count: atom.protonCountProperty
          } ),
          ShredFluent.a11y.particleCounts.accessibleListNode.neutrons.createProperty( {
            count: atom.neutronCountProperty
          } ),
          ShredFluent.a11y.particleCounts.accessibleListNode.electrons.createProperty( {
            count: atom.electronCountProperty
          } )
        ],
        visibleProperty: visibleProperty
      } )
    } );
  }
}

shred.register( 'ParticleCountsAccessibleListNode', ParticleCountsAccessibleListNode );