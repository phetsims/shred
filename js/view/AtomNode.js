// Copyright 2014-2023, University of Colorado Boulder

/**
 * View representation of the atom. Mostly, this is responsible for displaying and updating the labels, since the atom
 * itself is represented by particles, which take care of themselves in the view.
 *
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Vector2 from '../../../dot/js/Vector2.js';
import { Shape } from '../../../kite/js/imports.js';
import merge from '../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { Node, Path, Text } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shred from '../shred.js';
import ShredStrings from '../ShredStrings.js';
import ElectronCloudView from './ElectronCloudView.js';
import ElectronShellView from './ElectronShellView.js';

const minusSignIonString = ShredStrings.minusSignIon;
const neutralAtomString = ShredStrings.neutralAtom;
const positiveSignIonString = ShredStrings.positiveSignIon;
const stableString = ShredStrings.stable;
const unstableString = ShredStrings.unstable;

// constants
const ELEMENT_NAME_FONT_SIZE = 22;

class AtomNode extends Node {

  /**
   * @param {ParticleAtom} particleAtom Model that represents the atom, including particle positions
   * @param {ModelViewTransform2} modelViewTransform Model-View transform
   * @param {Object} [options]
   */
  constructor( particleAtom, modelViewTransform, options ) {

    options = merge( {
        showCenterX: true,
        showElementNameProperty: new Property( true ),
        showNeutralOrIonProperty: new Property( true ),
        showStableOrUnstableProperty: new Property( true ),
        electronShellDepictionProperty: new Property( 'orbits' ),
        tandem: Tandem.REQUIRED
      },
      options
    );

    super();

    // @private
    this.atom = particleAtom;
    this.modelViewTransform = modelViewTransform;

    // Create the X where the nucleus goes.
    let countListener = null;
    let atomCenterMarker = null;
    if ( options.showCenterX ) {
      const sizeInPixels = modelViewTransform.modelToViewDeltaX( 20 );
      const center = modelViewTransform.modelToViewPosition( particleAtom.positionProperty.get() );
      const centerMarker = new Shape();
      centerMarker.moveTo( center.x - sizeInPixels / 2, center.y - sizeInPixels / 2 );
      centerMarker.lineTo( center.x + sizeInPixels / 2, center.y + sizeInPixels / 2 );
      centerMarker.moveTo( center.x - sizeInPixels / 2, center.y + sizeInPixels / 2 );
      centerMarker.lineTo( center.x + sizeInPixels / 2, center.y - sizeInPixels / 2 );
      atomCenterMarker = new Path( centerMarker, {
        stroke: 'orange',
        lineWidth: 5,
        pickable: false,
        tandem: options.tandem.createTandem( 'atomCenterMarker' )
      } );
      this.addChild( atomCenterMarker );

      // Make the marker invisible if any nucleons are present.
      countListener = () => {
        atomCenterMarker.visible = particleAtom.getWeight() === 0;
      };
      particleAtom.electronCountProperty.link( countListener );
      particleAtom.neutronCountProperty.link( countListener );
      particleAtom.protonCountProperty.link( countListener );
    }

    // Add the electron shells and cloud.
    const electronShell = new ElectronShellView( particleAtom, modelViewTransform, {
      tandem: options.tandem.createTandem( 'electronShell' )
    } );
    this.addChild( electronShell );
    const electronCloud = new ElectronCloudView( particleAtom, modelViewTransform, {
      tandem: options.tandem.createTandem( 'electronCloud' )
    } );
    this.addChild( electronCloud );

    const updateElectronShellDepictionVisibility = depiction => {
      electronShell.visible = depiction === 'orbits';
      electronCloud.visible = depiction === 'cloud';
    };
    options.electronShellDepictionProperty.link( updateElectronShellDepictionVisibility );

    const elementNameTextCenterPos = modelViewTransform.modelToViewPosition(
      particleAtom.positionProperty.get().plus( new Vector2( 0, particleAtom.innerElectronShellRadius * 0.60 ) )
    );

    // @private - Create the textual readout for the element name.
    this.elementNameText = new Text( '', {
      font: new PhetFont( ELEMENT_NAME_FONT_SIZE ),
      fill: PhetColorScheme.RED_COLORBLIND,
      center: elementNameTextCenterPos,
      pickable: false,
      tandem: options.tandem.createTandem( 'elementNameText' )
    } );
    this.addChild( this.elementNameText );

    // Define the update function for the element name.
    const updateElementName = () => {
      let name = AtomIdentifier.getName( this.atom.protonCountProperty.get() );
      if ( name.length === 0 ) {
        name = '';
      }
      this.elementNameText.string = name;
      this.elementNameText.setScaleMagnitude( 1 );
      const maxLabelWidth = modelViewTransform.modelToViewDeltaX( particleAtom.innerElectronShellRadius * 1.4 );
      this.elementNameText.setScaleMagnitude( Math.min( maxLabelWidth / this.elementNameText.width, 1 ) );
      this.elementNameText.center = elementNameTextCenterPos;
    };
    updateElementName(); // Do the initial update.

    // Hook up update listeners.
    particleAtom.protonCountProperty.link( updateElementName );

    const updateElementNameVisibility = visible => {
      this.elementNameText.visible = visible;
    };
    options.showElementNameProperty.link( updateElementNameVisibility );

    const ionIndicatorTextTranslation = modelViewTransform.modelToViewPosition( particleAtom.positionProperty.get().plus(
      new Vector2( particleAtom.outerElectronShellRadius * 1.05, 0 ).rotated( Math.PI * 0.3 ) ) );

    // @private - Create the textual readout for the ion indicator, set by trial and error.
    this.ionIndicatorText = new Text( '', {
      font: new PhetFont( 20 ),
      fill: 'black',
      translation: ionIndicatorTextTranslation,
      pickable: false,
      maxWidth: 150,
      tandem: options.tandem.createTandem( 'ionIndicatorText' )
    } );
    this.addChild( this.ionIndicatorText );

    // Define the update function for the ion indicator.
    const updateIonIndicator = () => {
      if ( this.atom.protonCountProperty.get() > 0 ) {
        const charge = this.atom.getCharge();
        if ( charge < 0 ) {
          this.ionIndicatorText.string = minusSignIonString;
          this.ionIndicatorText.fill = 'blue';
        }
        else if ( charge > 0 ) {
          this.ionIndicatorText.string = positiveSignIonString;
          this.ionIndicatorText.fill = PhetColorScheme.RED_COLORBLIND;
        }
        else {
          this.ionIndicatorText.string = neutralAtomString;
          this.ionIndicatorText.fill = 'black';
        }
      }
      else {
        this.ionIndicatorText.string = '';
        this.ionIndicatorText.fill = 'black';
      }
    };
    updateIonIndicator(); // Do the initial update.

    particleAtom.protonCountProperty.link( updateIonIndicator );
    particleAtom.electronCountProperty.link( updateIonIndicator );
    const updateIonIndicatorVisibility = visible => {
      this.ionIndicatorText.visible = visible;
    };
    options.showNeutralOrIonProperty.link( updateIonIndicatorVisibility );

    // Create the textual readout for the stability indicator.
    const stabilityIndicatorTextCenterPos = modelViewTransform.modelToViewPosition( particleAtom.positionProperty.get().plus(
      new Vector2( 0, -particleAtom.innerElectronShellRadius * 0.60 ) ) );

    // @private
    this.stabilityIndicatorText = new Text( '', {
      font: new PhetFont( 20 ),
      fill: 'black',
      center: stabilityIndicatorTextCenterPos,
      pickable: false,
      maxWidth: modelViewTransform.modelToViewDeltaX( particleAtom.innerElectronShellRadius * 1.4 ),
      tandem: options.tandem.createTandem( 'stabilityIndicatorText' )
    } );
    this.addChild( this.stabilityIndicatorText );

    // Define the update function for the stability indicator.
    const updateStabilityIndicator = () => {
      if ( this.atom.protonCountProperty.get() > 0 ) {
        if ( AtomIdentifier.isStable( this.atom.protonCountProperty.get(), this.atom.neutronCountProperty.get() ) ) {
          this.stabilityIndicatorText.string = stableString;
        }
        else {
          this.stabilityIndicatorText.string = unstableString;
        }
      }
      else {
        this.stabilityIndicatorText.string = '';
      }
      this.stabilityIndicatorText.center = stabilityIndicatorTextCenterPos;
    };
    updateStabilityIndicator(); // Do initial update.

    // Add the listeners that control the label content and visibility.
    particleAtom.protonCountProperty.link( updateStabilityIndicator );
    particleAtom.neutronCountProperty.link( updateStabilityIndicator );
    const updateStabilityIndicatorVisibility = visible => {
      this.stabilityIndicatorText.visible = visible;
    };
    options.showStableOrUnstableProperty.link( updateStabilityIndicatorVisibility );

    // @private
    this.disposeAtomNode = () => {

      electronCloud.dispose();

      if ( countListener ) {
        particleAtom.electronCountProperty.unlink( countListener );
        particleAtom.neutronCountProperty.unlink( countListener );
        particleAtom.protonCountProperty.unlink( countListener );
      }

      options.electronShellDepictionProperty.unlink( updateElectronShellDepictionVisibility );
      particleAtom.protonCountProperty.unlink( updateElementName );
      options.showElementNameProperty.unlink( updateElementNameVisibility );
      particleAtom.protonCountProperty.unlink( updateIonIndicator );
      particleAtom.electronCountProperty.unlink( updateIonIndicator );
      options.showNeutralOrIonProperty.unlink( updateIonIndicatorVisibility );
      particleAtom.protonCountProperty.unlink( updateStabilityIndicator );
      particleAtom.neutronCountProperty.unlink( updateStabilityIndicator );
      options.showStableOrUnstableProperty.unlink( updateStabilityIndicatorVisibility );
      atomCenterMarker && atomCenterMarker.dispose();
      electronShell.dispose();
      this.elementNameText.dispose();
      this.ionIndicatorText.dispose();
      this.stabilityIndicatorText.dispose();
    };

    this.mutate( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeAtomNode();
    super.dispose();
  }
}

shred.register( 'AtomNode', AtomNode );
export default AtomNode;