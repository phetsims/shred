// Copyright 2014-2020, University of Colorado Boulder

/**
 * View representation of the atom. Mostly, this is responsible for displaying and updating the labels, since the atom
 * itself is represented by particles, which take care of themselves in the view.
 *
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Shape from '../../../kite/js/Shape.js';
import inherit from '../../../phet-core/js/inherit.js';
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
import buildAnAtomStrings from '../../../build-an-atom/js/buildAnAtomStrings.js';

const stableString = buildAnAtomStrings.stable;
const unstableString = buildAnAtomStrings.unstable;

// constants
const ELEMENT_NAME_FONT_SIZE = 22;

/**
 * @param {ParticleNucleus} particleAtom Model that represents the atom, including particle positions
 * @param {ModelViewTransform2} modelViewTransform Model-View transform
 * @param {Object} [options]
 * @constructor
 */
function NucleusNode( particleAtom, modelViewTransform, options ) {

  //changed showCenterX to false
  options = merge( {
      showCenterX: false,
      showElementNameProperty: new Property( true ),
      showStableOrUnstableProperty: new Property( true ),
      electronShellDepictionProperty: new Property( 'orbitals' ),
      tandem: Tandem.REQUIRED
    },
    options
  );

  Node.call( this ); // Call super constructor.
  const self = this;

  // @private
  this.atom = particleAtom;
  this.modelViewTransform = modelViewTransform;

  // Create the X where the nucleus goes.
  if ( options.showCenterX ) {
    const sizeInPixels = modelViewTransform.modelToViewDeltaX( 20 );
    const center = modelViewTransform.modelToViewPosition( particleAtom.positionProperty.get() );
    const centerMarker = new Shape();
    centerMarker.moveTo( center.x - sizeInPixels / 2, center.y - sizeInPixels / 2 );
    centerMarker.lineTo( center.x + sizeInPixels / 2, center.y + sizeInPixels / 2 );
    centerMarker.moveTo( center.x - sizeInPixels / 2, center.y + sizeInPixels / 2 );
    centerMarker.lineTo( center.x + sizeInPixels / 2, center.y - sizeInPixels / 2 );
    const atomCenterMarker = new Path( centerMarker, {
      stroke: 'orange',
      lineWidth: 5,
      pickable: false,
      tandem: options.tandem.createTandem( 'atomCenterMarker' )
    } );
    this.addChild( atomCenterMarker );

    // Make the marker invisible if any nucleons are present.
    var listener = function() { atomCenterMarker.visible = particleAtom.getWeight() === 0; };
    particleAtom.electronCountProperty.link( listener );
    particleAtom.neutronCountProperty.link( listener );
    particleAtom.protonCountProperty.link( listener );
  }

  // Add the nucleus shells and cloud.
  const nucleonOrbital = new NucleonShellView( particleAtom, modelViewTransform, {
    tandem: options.tandem.createTandem( 'nucleonOrbital' )
  } );
  this.addChild( nucleonOrbital );
  const updateElectronShellDepictionVisibility = function( depiction ) {
    nucleonOrbital.visible = depiction === 'orbitals';
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
  const updateElementName = function() {
    let name = AtomIdentifier.getName( self.atom.protonCountProperty.get() );
    if ( name.length === 0 ) {
      name = '';
    }
    self.elementName.text = name;
    self.elementName.setScaleMagnitude( 1 );
    const maxLabelWidth = modelViewTransform.modelToViewDeltaX( particleAtom.innerElectronShellRadius * 1.4 );
    self.elementName.setScaleMagnitude( Math.min( maxLabelWidth / self.elementName.width, 1 ) );
    self.elementName.center = elementNameCenterPos;
  };
  updateElementName(); // Do the initial update.

  // Hook up update listeners.
  particleAtom.protonCountProperty.link( updateElementName );

  const updateElementNameVisibility = function( visible ) {
    self.elementName.visible = visible;
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
  const updateStabilityIndicator = function() {
    if ( self.atom.protonCountProperty.get() > 0 ) {
      if ( AtomIdentifier.isStable( self.atom.protonCountProperty.get(), self.atom.neutronCountProperty.get() ) ) {
        self.stabilityIndicator.text = stableString;
      }
      else {
        self.stabilityIndicator.text = unstableString;
      }
    }
    else {
      self.stabilityIndicator.text = '';
    }
    self.stabilityIndicator.center = stabilityIndicatorCenterPos;
  };
  updateStabilityIndicator(); // Do initial update.

  // Add the listeners that control the label content and visibility.
  particleAtom.protonCountProperty.link( updateStabilityIndicator );
  particleAtom.neutronCountProperty.link( updateStabilityIndicator );
  const updateStabilityIndicatorVisibility = function( visible ) {
    self.stabilityIndicator.visible = visible;
  };
  options.showStableOrUnstableProperty.link( updateStabilityIndicatorVisibility );

  // @private
  this.disposeNucleusNode = function() {
    if ( options.showCenterX ) {
      particleAtom.electronCountProperty.unlink( listener );
      particleAtom.neutronCountProperty.unlink( listener );
      particleAtom.protonCountProperty.unlink( listener );
    }
    options.electronShellDepictionProperty.unlink( updateElectronShellDepictionVisibility );
    particleAtom.protonCountProperty.unlink( updateElementName );
    options.showElementNameProperty.unlink( updateElementNameVisibility );
    particleAtom.protonCountProperty.unlink( updateStabilityIndicator );
    particleAtom.neutronCountProperty.unlink( updateStabilityIndicator );
    options.showStableOrUnstableProperty.unlink( updateStabilityIndicatorVisibility );
    atomCenterMarker.dispose();
    nucleonOrbital.dispose();
    this.elementName.dispose();
    this.ionIndicator.dispose();
    this.stabilityIndicator.dispose();
  };

  this.mutate( options );
}

shred.register( 'NucleusNode', NucleusNode );

inherit( Node, NucleusNode, {

  //@public
  dispose: function() {
    this.disposeNucleusNode();
    Node.prototype.dispose.call( this );
  }
} );

export default NucleusNode;