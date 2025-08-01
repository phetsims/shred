// Copyright 2014-2025, University of Colorado Boulder

/**
 * View representation of the atom. Mostly, this is responsible for displaying and updating the labels, since the atom
 * itself is represented by particles, which take care of themselves in the view.
 *
 * @author John Blanco
 */

import DynamicProperty from '../../../axon/js/DynamicProperty.js';
import Multilink from '../../../axon/js/Multilink.js';
import Property from '../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Shape from '../../../kite/js/Shape.js';
import optionize from '../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Text from '../../../scenery/js/nodes/Text.js';
import Tandem from '../../../tandem/js/Tandem.js';
import AtomIdentifier from '../AtomIdentifier.js';
import ParticleAtom from '../model/ParticleAtom.js';
import shred from '../shred.js';
import ShredColors from '../ShredColors.js';
import ShredStrings from '../ShredStrings.js';
import ElectronCloudView from './ElectronCloudView.js';
import ElectronShellView from './ElectronShellView.js';

const minusSignIonStringProperty = ShredStrings.minusSignIonStringProperty;
const neutralAtomStringProperty = ShredStrings.neutralAtomStringProperty;
const positiveSignIonStringProperty = ShredStrings.positiveSignIonStringProperty;
const stableStringProperty = ShredStrings.stableStringProperty;
const unstableStringProperty = ShredStrings.unstableStringProperty;

// constants
const ELEMENT_NAME_FONT_SIZE = 22;
const ION_FONT_SIZE = 20;

export const electronShellDepictionValues = [ 'orbits', 'cloud' ] as const;
export type ElectronShellDepiction = typeof electronShellDepictionValues[number];

type SelfOptions = {
  showCenterX?: boolean;
  showElementNameProperty?: TReadOnlyProperty<boolean>;
  showNeutralOrIonProperty?: TReadOnlyProperty<boolean>;
  showStableOrUnstableProperty?: TReadOnlyProperty<boolean>;
  electronShellDepictionProperty?: TReadOnlyProperty<ElectronShellDepiction>;
};

type AtomNodeOptions = SelfOptions & NodeOptions;

class AtomNode extends Node {
  private readonly atom: ParticleAtom;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly elementNameText: Text;
  private readonly ionIndicatorText: Text;
  private readonly stabilityIndicatorText: Text;
  private readonly disposeAtomNode: VoidFunction;

  /**
   * @param atom Model that represents the atom, including particle positions
   * @param modelViewTransform Model-View transform
   * @param providedOptions
   */
  public constructor( atom: ParticleAtom, modelViewTransform: ModelViewTransform2, providedOptions?: AtomNodeOptions ) {
    const options = optionize<AtomNodeOptions, SelfOptions, NodeOptions>()( {
      showCenterX: true,
      showElementNameProperty: new Property( true ),
      showNeutralOrIonProperty: new Property( true ),
      showStableOrUnstableProperty: new Property( true ),
      electronShellDepictionProperty: new Property( 'orbits' ),
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super();

    this.atom = atom;
    this.modelViewTransform = modelViewTransform;

    // Create the X where the nucleus goes.
    let countListener: VoidFunction | null = null;
    let atomCenterMarker: Path | null = null;
    if ( options.showCenterX ) {
      const sizeInPixels = modelViewTransform.modelToViewDeltaX( 20 );
      const center = modelViewTransform.modelToViewPosition( atom.positionProperty.get() );
      const centerMarker = new Shape();
      centerMarker.moveTo( center.x - sizeInPixels / 2, center.y - sizeInPixels / 2 );
      centerMarker.lineTo( center.x + sizeInPixels / 2, center.y + sizeInPixels / 2 );
      centerMarker.moveTo( center.x - sizeInPixels / 2, center.y + sizeInPixels / 2 );
      centerMarker.lineTo( center.x + sizeInPixels / 2, center.y - sizeInPixels / 2 );
      atomCenterMarker = new Path( centerMarker, {
        stroke: ShredColors.centerXColorProperty,
        lineWidth: 5,
        pickable: false,
        tandem: options.tandem.createTandem( 'atomCenterMarker' ),
        visiblePropertyOptions: {
          phetioReadOnly: true
        }
      } );
      this.addChild( atomCenterMarker );

      // Make the marker invisible if any nucleons are present.
      countListener = () => {
        atomCenterMarker!.visible = atom.getWeight() === 0;
      };
      atom.electronCountProperty.link( countListener );
      atom.neutronCountProperty.link( countListener );
      atom.protonCountProperty.link( countListener );
    }

    // Add the electron shells and cloud.
    const electronShell = new ElectronShellView( atom, modelViewTransform );
    this.addChild( electronShell );
    const electronCloud = new ElectronCloudView( atom, modelViewTransform, {
      tandem: options.tandem.createTandem( 'electronCloud' )
    } );
    this.addChild( electronCloud );

    // Current string properties for the symbol text and element caption
    // const symbolStringProperty = new Property<string>( AtomIdentifier.getSymbol( 0 ) );
    const currentElementStringProperty = new Property( AtomIdentifier.getName( 0 ) );
    const elementDynamicStringProperty = new DynamicProperty( currentElementStringProperty );

    // Create the textual readout for the element name.
    this.elementNameText = new Text( '', {
      font: new PhetFont( ELEMENT_NAME_FONT_SIZE ),
      fill: ShredColors.positiveColorProperty,
      pickable: false,
      maxWidth: 100
    } );

    this.addChild( this.elementNameText );

    // For color contrast issues, we set different positions for the element name text depending on the depiction.
    const updateTextPosition = () => {
      const heightPerNucleon = 0.5;
      // We start with one nucleon less for the position in both depictions to be equal at the start.
      const nucleons = atom.particleCountProperty.value - atom.electronCountProperty.value - 1;

      const heightPerElectron = 5;
      const electrons = atom.electronCountProperty.value;
      const initialHeight = atom.innerElectronShellRadius * 0.60;

      const positionInOrbitsDepiction = modelViewTransform.modelToViewPosition(
        atom.positionProperty.get().plus( new Vector2( 0, initialHeight + heightPerNucleon * nucleons ) )
      );

      const positionInCloudDepiction = modelViewTransform.modelToViewPosition(
        atom.positionProperty.get().plus( new Vector2( 0, initialHeight + heightPerElectron * electrons ) )
      );


      this.elementNameText.center = options.electronShellDepictionProperty.value === 'orbits' ?
                                    positionInOrbitsDepiction : positionInCloudDepiction;
    };

    const updateElectronShellDepictionVisibility = ( depiction: ElectronShellDepiction ) => {
      electronShell.visible = depiction === 'orbits';
      electronCloud.visible = depiction === 'cloud';

      updateTextPosition();
    };
    options.electronShellDepictionProperty.link( updateElectronShellDepictionVisibility );

    // Define the update function for the element name.
    const updateElementName = () => {
      const protonCount = this.atom.protonCountProperty.get();

      if ( protonCount > 0 ) {
        // Update the string property for the element caption.
        const elementNameProperty = AtomIdentifier.getName( protonCount );
        currentElementStringProperty.value = elementNameProperty;
        this.elementNameText.string = elementNameProperty.value;
      }
      else {
        this.elementNameText.string = '';
      }

      updateTextPosition();
    };
    updateElementName(); // Do the initial update.

    // Hook up update listeners.
    atom.particleCountProperty.link( updateElementName );

    // Updating the element if the element string property changes.
    elementDynamicStringProperty.link( updateElementName );

    const updateElementNameVisibility = ( visible: boolean ) => {
      this.elementNameText.visible = visible;
    };
    options.showElementNameProperty.link( updateElementNameVisibility );

    const ionIndicatorTextTranslation = modelViewTransform.modelToViewPosition( atom.positionProperty.get().plus(
      new Vector2( atom.outerElectronShellRadius * 1.05, 0 ).rotated( Math.PI * 0.3 ) ) );

    // Create the textual readout for the ion indicator, set by trial and error.
    this.ionIndicatorText = new Text( '', {
      font: new PhetFont( ION_FONT_SIZE ),
      fill: 'black',
      translation: ionIndicatorTextTranslation,
      pickable: false,
      maxWidth: 150
    } );
    this.addChild( this.ionIndicatorText );

    // Define the update function for the ion indicator.
    const updateIonIndicator = () => {
      if ( this.atom.protonCountProperty.get() > 0 ) {
        const charge = this.atom.getCharge();
        if ( charge < 0 ) {
          this.ionIndicatorText.string = minusSignIonStringProperty.value;
          this.ionIndicatorText.fill = 'blue';
        }
        else if ( charge > 0 ) {
          this.ionIndicatorText.string = positiveSignIonStringProperty.value;
          this.ionIndicatorText.fill = ShredColors.positiveColorProperty;
        }
        else {
          this.ionIndicatorText.string = neutralAtomStringProperty.value;
          this.ionIndicatorText.fill = 'black';
        }
      }
      else {
        this.ionIndicatorText.string = '';
        this.ionIndicatorText.fill = 'black';
      }
    };
    updateIonIndicator(); // Do the initial update.

    Multilink.lazyMultilink(
      [
        minusSignIonStringProperty,
        positiveSignIonStringProperty,
        neutralAtomStringProperty
      ],
      updateIonIndicator
    );

    atom.protonCountProperty.link( updateIonIndicator );
    atom.electronCountProperty.link( updateIonIndicator );
    const updateIonIndicatorVisibility = ( visible: boolean ) => {
      this.ionIndicatorText.visible = visible;
    };
    options.showNeutralOrIonProperty.link( updateIonIndicatorVisibility );

    // Create the textual readout for the stability indicator.
    const stabilityIndicatorTextCenterPos = modelViewTransform.modelToViewPosition( atom.positionProperty.get().plus(
      new Vector2( 0, -atom.innerElectronShellRadius * 0.60 ) ) );

    this.stabilityIndicatorText = new Text( '', {
      font: new PhetFont( 20 ),
      fill: 'black',
      center: stabilityIndicatorTextCenterPos,
      pickable: false,
      maxWidth: modelViewTransform.modelToViewDeltaX( atom.innerElectronShellRadius * 1.4 )
    } );
    this.addChild( this.stabilityIndicatorText );

    // Define the update function for the stability indicator.
    const updateStabilityIndicator = () => {
      if ( this.atom.protonCountProperty.get() > 0 ) {
        if ( AtomIdentifier.isStable( this.atom.protonCountProperty.get(), this.atom.neutronCountProperty.get() ) ) {
          this.stabilityIndicatorText.string = stableStringProperty.value;
        }
        else {
          this.stabilityIndicatorText.string = unstableStringProperty.value;
        }
      }
      else {
        this.stabilityIndicatorText.string = '';
      }
      this.stabilityIndicatorText.center = stabilityIndicatorTextCenterPos;
    };
    updateStabilityIndicator(); // Do initial update.


    Multilink.lazyMultilink(
      [
        stableStringProperty,
        unstableStringProperty
      ],
      updateStabilityIndicator
    );

    // Add the listeners that control the label content and visibility.
    atom.protonCountProperty.link( updateStabilityIndicator );
    atom.neutronCountProperty.link( updateStabilityIndicator );
    const updateStabilityIndicatorVisibility = ( visible: boolean ) => {
      this.stabilityIndicatorText.visible = visible;
    };
    options.showStableOrUnstableProperty.link( updateStabilityIndicatorVisibility );

    this.disposeAtomNode = () => {

      electronCloud.dispose();

      if ( countListener ) {
        atom.electronCountProperty.unlink( countListener );
        atom.neutronCountProperty.unlink( countListener );
        atom.protonCountProperty.unlink( countListener );
      }

      options.electronShellDepictionProperty.unlink( updateElectronShellDepictionVisibility );
      atom.protonCountProperty.unlink( updateElementName );
      options.showElementNameProperty.unlink( updateElementNameVisibility );
      atom.protonCountProperty.unlink( updateIonIndicator );
      atom.electronCountProperty.unlink( updateIonIndicator );
      options.showNeutralOrIonProperty.unlink( updateIonIndicatorVisibility );
      atom.protonCountProperty.unlink( updateStabilityIndicator );
      atom.neutronCountProperty.unlink( updateStabilityIndicator );
      options.showStableOrUnstableProperty.unlink( updateStabilityIndicatorVisibility );
      atomCenterMarker && atomCenterMarker.dispose();
      electronShell.dispose();
      this.elementNameText.dispose();
      this.ionIndicatorText.dispose();
      this.stabilityIndicatorText.dispose();
    };

    this.mutate( options );

    // Add the model as a linked element so that it can be easily navigated to in the phet-io tree.
    this.addLinkedElement( this.atom );
  }

  public override dispose(): void {
    this.disposeAtomNode();
    super.dispose();
  }
}

shred.register( 'AtomNode', AtomNode );
export default AtomNode;