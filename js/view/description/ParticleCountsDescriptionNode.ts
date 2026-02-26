// Copyright 2025-2026, University of Colorado Boulder
/**
 * A Node with accessible descriptions for information on the particle counts panel.
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

export default class ParticleCountsDescriptionNode extends Node {
  public constructor( atom: TReadOnlyNumberAtom | NumberAtom, visibleProperty: TReadOnlyProperty<boolean> = new Property<boolean>( true ) ) {

    super( {
      accessibleHeading: ShredFluent.a11y.particleCountsDescriptionNode.accessibleHeadingStringProperty,
      accessibleTemplate: AccessibleList.createTemplateProperty( {
        listItems: [
          ShredFluent.a11y.particleCountsDescriptionNode.protons.createProperty( {
            count: atom.protonCountProperty
          } ),
          ShredFluent.a11y.particleCountsDescriptionNode.neutrons.createProperty( {
            count: atom.neutronCountProperty
          } ),
          ShredFluent.a11y.particleCountsDescriptionNode.electrons.createProperty( {
            count: atom.electronCountProperty
          } )
        ],
        visibleProperty: visibleProperty
      } )
    } );
  }
}

shred.register( 'ParticleCountsDescriptionNode', ParticleCountsDescriptionNode );