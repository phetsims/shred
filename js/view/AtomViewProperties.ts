// Copyright 2025, University of Colorado Boulder

/**
 * View-specific Properties for how the atom is displayed.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Property from '../../../axon/js/Property.js';
import optionize from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';
import { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';
import StringUnionIO from '../../../tandem/js/types/StringUnionIO.js';
import { ElectronShellDepiction, ElectronShellDepictionValues } from './AtomNode.js';

type SelfOptions = {
  elementNameVisibleInitialValue?: boolean;
  neutralAtomOrIonVisibleInitialValue?: boolean;
  nuclearStabilityVisibleInitialValue?: boolean;
  electronModelInitialValue?: ElectronShellDepiction;
};
type AtomViewPropertiesOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class AtomViewProperties {

  // Properties that control the visibility of labels in the view.
  public readonly elementNameVisibleProperty: BooleanProperty;
  public readonly neutralAtomOrIonVisibleProperty: BooleanProperty;
  public readonly nuclearStabilityVisibleProperty: BooleanProperty;

  // Property that controls the depiction of electron shells in the view, either particles or as a cloud.
  public readonly electronModelProperty: Property<ElectronShellDepiction>;

  public constructor( providedOptions: AtomViewPropertiesOptions ) {

    const options = optionize<AtomViewPropertiesOptions, SelfOptions, PhetioObjectOptions>()( {
      elementNameVisibleInitialValue: true,
      neutralAtomOrIonVisibleInitialValue: true,
      nuclearStabilityVisibleInitialValue: false,
      electronModelInitialValue: 'shells'
    }, providedOptions );

    this.elementNameVisibleProperty = new BooleanProperty( options.elementNameVisibleInitialValue, {
      tandem: options.tandem.createTandem( 'elementNameVisibleProperty' ),
      phetioFeatured: true
    } );
    this.neutralAtomOrIonVisibleProperty = new BooleanProperty( options.neutralAtomOrIonVisibleInitialValue, {
      tandem: options.tandem.createTandem( 'neutralAtomOrIonVisibleProperty' ),
      phetioFeatured: true
    } );
    this.nuclearStabilityVisibleProperty = new BooleanProperty( options.nuclearStabilityVisibleInitialValue, {
      tandem: options.tandem.createTandem( 'nuclearStabilityVisibleProperty' ),
      phetioFeatured: true
    } );
    this.electronModelProperty = new Property<ElectronShellDepiction>( options.electronModelInitialValue, {
      tandem: options.tandem.createTandem( 'electronModelProperty' ),
      phetioValueType: StringUnionIO( ElectronShellDepictionValues ),
      validValues: ElectronShellDepictionValues,
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.elementNameVisibleProperty.reset();
    this.neutralAtomOrIonVisibleProperty.reset();
    this.nuclearStabilityVisibleProperty.reset();
    this.electronModelProperty.reset();
  }

  public dispose(): void {
    this.elementNameVisibleProperty.dispose();
    this.neutralAtomOrIonVisibleProperty.dispose();
    this.nuclearStabilityVisibleProperty.dispose();
    this.electronModelProperty.dispose();
  }

  // A configuration with all labels turned off, and electron shells depicted as shells.
  public static everythingOffAtomViewProperties = new AtomViewProperties( {
    elementNameVisibleInitialValue: false,
    neutralAtomOrIonVisibleInitialValue: false,
    nuclearStabilityVisibleInitialValue: false,
    electronModelInitialValue: 'shells',
    tandem: Tandem.OPT_OUT
  } );
}

shred.register( 'AtomViewProperties', AtomViewProperties );

export default AtomViewProperties;