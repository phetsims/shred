// Copyright 2014-2019, University of Colorado Boulder

/**
 * View representation of the atom. Mostly, this is responsible for displaying and updating the labels, since the atom
 * itself is represented by particles, which take care of themselves in the view.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const AtomIdentifier = require( 'SHRED/AtomIdentifier' );
  const ElectronCloudView = require( 'SHRED/view/ElectronCloudView' );
  const ElectronShellView = require( 'SHRED/view/ElectronShellView' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );
  const shred = require( 'SHRED/shred' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const minusSignIonString = require( 'string!SHRED/minusSignIon' );
  const neutralAtomString = require( 'string!SHRED/neutralAtom' );
  const positiveSignIonString = require( 'string!SHRED/positiveSignIon' );
  const stableString = require( 'string!SHRED/stable' );
  const unstableString = require( 'string!SHRED/unstable' );

  // constants
  var ELEMENT_NAME_FONT_SIZE = 22;

  /**
   * @param {ParticleAtom} particleAtom Model that represents the atom, including particle positions
   * @param {ModelViewTransform2} modelViewTransform Model-View transform
   * @param {Object} [options]
   * @constructor
   */
  function AtomNode( particleAtom, modelViewTransform, options ) {

    options = _.extend( {
        showCenterX: true,
        showElementNameProperty: new Property( true ),
        showNeutralOrIonProperty: new Property( true ),
        showStableOrUnstableProperty: new Property( true ),
        electronShellDepictionProperty: new Property( 'orbits' ),
        tandem: Tandem.required
      },
      options
    );

    Node.call( this ); // Call super constructor.
    var self = this;

    // @private
    this.atom = particleAtom;
    this.modelViewTransform = modelViewTransform;

    // Create the X where the nucleus goes.
    if ( options.showCenterX ) {
      var sizeInPixels = modelViewTransform.modelToViewDeltaX( 20 );
      var center = modelViewTransform.modelToViewPosition( particleAtom.positionProperty.get() );
      var centerMarker = new Shape();
      centerMarker.moveTo( center.x - sizeInPixels / 2, center.y - sizeInPixels / 2 );
      centerMarker.lineTo( center.x + sizeInPixels / 2, center.y + sizeInPixels / 2 );
      centerMarker.moveTo( center.x - sizeInPixels / 2, center.y + sizeInPixels / 2 );
      centerMarker.lineTo( center.x + sizeInPixels / 2, center.y - sizeInPixels / 2 );
      var atomCenterMarker = new Path( centerMarker, {
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

    // Add the electron shells and cloud.
    var electronShell = new ElectronShellView( particleAtom, modelViewTransform, {
      tandem: options.tandem.createTandem( 'electronShell' )
    } );
    this.addChild( electronShell );
    var electronCloud = new ElectronCloudView( particleAtom, modelViewTransform, {
      tandem: options.tandem.createTandem( 'electronCloud' )
    } );
    this.addChild( electronCloud );

    var updateElectronShellDepictionVisibility = function( depiction ) {
      electronShell.visible = depiction === 'orbits';
      electronCloud.visible = depiction === 'cloud';
    };
    options.electronShellDepictionProperty.link( updateElectronShellDepictionVisibility );

    var elementNameCenterPos = modelViewTransform.modelToViewPosition(
      particleAtom.positionProperty.get().plus( new Vector2( 0, particleAtom.innerElectronShellRadius * 0.60 ) )
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
    var updateElementName = function() {
      var name = AtomIdentifier.getName( self.atom.protonCountProperty.get() );
      if ( name.length === 0 ) {
        name = '';
      }
      self.elementName.text = name;
      self.elementName.setScaleMagnitude( 1 );
      var maxLabelWidth = modelViewTransform.modelToViewDeltaX( particleAtom.innerElectronShellRadius * 1.4 );
      self.elementName.setScaleMagnitude( Math.min( maxLabelWidth / self.elementName.width, 1 ) );
      self.elementName.center = elementNameCenterPos;
    };
    updateElementName(); // Do the initial update.

    // Hook up update listeners.
    particleAtom.protonCountProperty.link( updateElementName );

    var updateElementNameVisibility = function( visible ) {
      self.elementName.visible = visible;
    };
    options.showElementNameProperty.link( updateElementNameVisibility );

    var ionIndicatorTranslation = modelViewTransform.modelToViewPosition( particleAtom.positionProperty.get().plus(
      new Vector2( particleAtom.outerElectronShellRadius * 1.05, 0 ).rotated( Math.PI * 0.3 ) ) );

    // @private - Create the textual readout for the ion indicator, set by trial and error.
    this.ionIndicator = new Text( '', {
      font: new PhetFont( 20 ),
      fill: 'black',
      translation: ionIndicatorTranslation,
      pickable: false,
      maxWidth: 150,
      tandem: options.tandem.createTandem( 'ionIndicator' )
    } );
    this.addChild( this.ionIndicator );

    // Define the update function for the ion indicator.
    var updateIonIndicator = function() {
      if ( self.atom.protonCountProperty.get() > 0 ) {
        var charge = self.atom.getCharge();
        if ( charge < 0 ) {
          self.ionIndicator.text = minusSignIonString;
          self.ionIndicator.fill = 'blue';
        }
        else if ( charge > 0 ) {
          self.ionIndicator.text = positiveSignIonString;
          self.ionIndicator.fill = PhetColorScheme.RED_COLORBLIND;
        }
        else {
          self.ionIndicator.text = neutralAtomString;
          self.ionIndicator.fill = 'black';
        }
      }
      else {
        self.ionIndicator.text = '';
        self.ionIndicator.fill = 'black';
      }
    };
    updateIonIndicator(); // Do the initial update.

    particleAtom.protonCountProperty.link( updateIonIndicator );
    particleAtom.electronCountProperty.link( updateIonIndicator );
    var updateIonIndicatorVisibility = function( visible ) {
      self.ionIndicator.visible = visible;
    };
    options.showNeutralOrIonProperty.link( updateIonIndicatorVisibility );

    // Create the textual readout for the stability indicator.
    var stabilityIndicatorCenterPos = modelViewTransform.modelToViewPosition( particleAtom.positionProperty.get().plus(
      new Vector2( 0, -particleAtom.innerElectronShellRadius * 0.60 ) ) );

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
    var updateStabilityIndicator = function() {
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
    var updateStabilityIndicatorVisibility = function( visible ) {
      self.stabilityIndicator.visible = visible;
    };
    options.showStableOrUnstableProperty.link( updateStabilityIndicatorVisibility );

    // @private
    this.disposeAtomNode = function() {
      electronCloud.dispose();
      if ( options.showCenterX ) {
        particleAtom.electronCountProperty.unlink( listener );
        particleAtom.neutronCountProperty.unlink( listener );
        particleAtom.protonCountProperty.unlink( listener );
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
      atomCenterMarker.dispose();
      electronShell.dispose();
      this.elementName.dispose();
      this.ionIndicator.dispose();
      this.stabilityIndicator.dispose();
    };

    this.mutate( options );
  }

  shred.register( 'AtomNode', AtomNode );

  return inherit( Node, AtomNode, {

    //@public
    dispose: function() {
      this.disposeAtomNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );