// Copyright 2025, University of Colorado Boulder
/**
 * AccessibleListNode that displays the information on the particle counts panel.
 *
 * @author Agustín Vallejo
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import AccessibleListNode from '../../../../scenery-phet/js/accessibility/AccessibleListNode.js';
import NumberAtom, { TReadOnlyNumberAtom } from '../../model/NumberAtom.js';
import shred from '../../shred.js';
import ShredStrings from '../../ShredStrings.js';

export default class ParticleCountsAccessibleListNode extends AccessibleListNode {
  public constructor( atom: TReadOnlyNumberAtom | NumberAtom, visibleProperty: TReadOnlyProperty<boolean> = new Property<boolean>( true ) ) {

    const protonCountListItemProperty = new DerivedStringProperty(
      [
        atom.protonCountProperty,
        ShredStrings.a11y.particleCounts.accessibleListNode.protonsStringProperty
      ],
      ( protonCount: number, protonCountPattern: string ) => {
        return StringUtils.fillIn( protonCountPattern, { value: protonCount } );
      } );

    const neutronCountListItemProperty = new DerivedStringProperty(
      [
        atom.neutronCountProperty,
        ShredStrings.a11y.particleCounts.accessibleListNode.neutronsStringProperty
      ],
      ( neutronCount: number, neutronCountPattern: string ) => {
        return StringUtils.fillIn( neutronCountPattern, { value: neutronCount } );
      } );

    const electronCountListItemProperty = new DerivedStringProperty(
      [
        atom.electronCountProperty,
        ShredStrings.a11y.particleCounts.accessibleListNode.electronsStringProperty
      ],
      ( electronCount: number, electronCountPattern: string ) => {
        return StringUtils.fillIn( electronCountPattern, { value: electronCount } );
      } );


    super( [
      protonCountListItemProperty,
      neutronCountListItemProperty,
      electronCountListItemProperty
    ], { visibleProperty: visibleProperty } );
  }
}

shred.register( 'ParticleCountsAccessibleListNode', ParticleCountsAccessibleListNode );