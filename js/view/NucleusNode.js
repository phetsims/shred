// Copyright 2021, University of Colorado Boulder

/**
 * View representation of the atom. Mostly, this is responsible for displaying and updating the labels, since the atom
 * itself is represented by particles, which take care of themselves in the view.
 *
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import buildAnAtomStrings from '../../../build-an-atom/js/buildAnAtomStrings.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Shape from '../../../kite/js/Shape.js';
import merge from '../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Text from '../../../scenery/js/nodes/Text.js';
import Tandem from '../../../tandem/js/Tandem.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shred from '../shred.js';
import NucleonShellView from './NucleonShellView.js';

const stableString = buildAnAtomStrings.stable;
const unstableString = buildAnAtomStrings.unstable;

// constants
const ELEMENT_NAME_FONT_SIZE = 22;

class NucleusNode extends Node {
  /**
   * @param {ParticleNucleus} particleAtom Model that represents the atom, including particle positions
   * @param {ModelViewTransform2} modelViewTransform Model-View transform
   * @param {Object} [options]
   */
  constructor( particleAtom, modelViewTransform, options ) {

    //changed showCenterX to false
    options = merge( {
        showCenterX: false,
        showElementNameProperty: new Property( true ),
        showStableOrUnstableProperty: new Property( true ),
        electronShellDepictionProperty: new Property( 'orbits' ),
        tandem: Tandem.REQUIRED
      },
      options
    );

    super(); // Call super constructor.

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
      countListener = () => { atomCenterMarker.visible = particleAtom.getWeight() === 0; };
      particleAtom.electronCountProperty.link( countListener );
      particleAtom.neutronCountProperty.link( countListener );
      particleAtom.protonCountProperty.link( countListener );
    }

    // Add the nucleus shells and cloud.
    const nucleonOrbital = new NucleonShellView( particleAtom, modelViewTransform, {
      tandem: options.tandem.createTandem( 'nucleonOrbital' )
    } );
    this.addChild( nucleonOrbital );
    const updateElectronShellDepictionVisibility = depiction => {
      nucleonOrbital.visible = depiction === 'orbits';
    };
    options.electronShellDepictionProperty.link( updateElectronShellDepictionVisibility );

    const elementNameCenterPos = modelViewTransform.modelToViewPosition(
      particleAtom.positionProperty.get().plus( new Vector2( -80, particleAtom.outerElectronShellRadius * 1.2 ) )
    );

    // @private - Create the textual readout for the element name.
    this.elementName = new Text( '', {
      font: new PhetFont( ELEMENT_NAME_FONT_SIZE ),
      fill: PhetColorScheme.RED_COLORBLIND,
      center: elementNameCenterPos,
      pickable: false,
      tandem: options.tandem.createTandem( 'elementName' )
    } );
    this.addChild( this.elementName );

    // Define the update function for the element name.
    const updateElementName = () => {
      let name = AtomIdentifier.getName( this.atom.protonCountProperty.get() );
      if ( name.length === 0 ) {
        name = '';
      }
      this.elementName.text = name;
      this.elementName.setScaleMagnitude( 1 );
      const maxLabelWidth = modelViewTransform.modelToViewDeltaX( particleAtom.innerElectronShellRadius * 1.4 );
      this.elementName.setScaleMagnitude( Math.min( maxLabelWidth / this.elementName.width, 1 ) );
      this.elementName.center = elementNameCenterPos;
    };
    updateElementName(); // Do the initial update.

    // Hook up update listeners.
    particleAtom.protonCountProperty.link( updateElementName );

    const updateElementNameVisibility = visible => {
      this.elementName.visible = visible;
    };
    options.showElementNameProperty.link( updateElementNameVisibility );

    // Create the textual readout for the stability indicator.
    const stabilityIndicatorCenterPos = modelViewTransform.modelToViewPosition( particleAtom.positionProperty.get().plus(
      new Vector2( -80, particleAtom.innerElectronShellRadius * 1.4 ) ) );//moved stable/unstable higher

    // @private
    this.stabilityIndicator = new Text( '', {
      font: new PhetFont( 20 ),
      fill: 'black',
      center: stabilityIndicatorCenterPos,
      pickable: false,
      maxWidth: modelViewTransform.modelToViewDeltaX( particleAtom.innerElectronShellRadius * 1.4 ),
      tandem: options.tandem.createTandem( 'stabilityIndicator' )
    } );
    this.addChild( this.stabilityIndicator );

    // Define the update function for the stability indicator.
    const updateStabilityIndicator = () => {
      if ( this.atom.protonCountProperty.get() > 0 ) {
        if ( AtomIdentifier.isStable( this.atom.protonCountProperty.get(), this.atom.neutronCountProperty.get() ) ) {
          this.stabilityIndicator.text = stableString;
        }
        else {
          this.stabilityIndicator.text = unstableString;
        }
      }
      else {
        this.stabilityIndicator.text = '';
      }
      this.stabilityIndicator.center = stabilityIndicatorCenterPos;
    };
    updateStabilityIndicator(); // Do initial update.

    // Add the listeners that control the label content and visibility.
    particleAtom.protonCountProperty.link( updateStabilityIndicator );
    particleAtom.neutronCountProperty.link( updateStabilityIndicator );
    const updateStabilityIndicatorVisibility = visible => {
      this.stabilityIndicator.visible = visible;
    };
    options.showStableOrUnstableProperty.link( updateStabilityIndicatorVisibility );

    // @private
    this.disposeNucleusNode = function() {
      if ( options.showCenterX ) {
        particleAtom.electronCountProperty.unlink( countListener );
        particleAtom.neutronCountProperty.unlink( countListener );
        particleAtom.protonCountProperty.unlink( countListener );
      }
      options.electronShellDepictionProperty.unlink( updateElectronShellDepictionVisibility );
      particleAtom.protonCountProperty.unlink( updateElementName );
      options.showElementNameProperty.unlink( updateElementNameVisibility );
      particleAtom.protonCountProperty.unlink( updateStabilityIndicator );
      particleAtom.neutronCountProperty.unlink( updateStabilityIndicator );
      options.showStableOrUnstableProperty.unlink( updateStabilityIndicatorVisibility );
      atomCenterMarker && atomCenterMarker.dispose();
      nucleonOrbital.dispose();
      this.elementName.dispose();
      this.ionIndicator.dispose();
      this.stabilityIndicator.dispose();
    };

    this.mutate( options );
  }


  //@public
  dispose() {
    this.disposeNucleusNode();
    super.dispose();
  }
}

shred.register( 'NucleusNode', NucleusNode );

export default NucleusNode;