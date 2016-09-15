// Copyright 2014-2015, University of Colorado Boulder

/**
 * View representation of the atom. Mostly, this is responsible for displaying and updating the labels, since the atom
 * itself is represented by particles, which take care of themselves in the view.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AtomIdentifier = require( 'SHRED/AtomIdentifier' );
  var ElectronCloudView = require( 'SHRED/view/ElectronCloudView' );
  var ElectronShellView = require( 'SHRED/view/ElectronShellView' );
  var IsotopeElectronCloudView = require( 'SHRED/view/IsotopeElectronCloudView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var shred = require( 'SHRED/shred' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var minusSignIonString = require( 'string!SHRED/minusSignIon' );
  var neutralAtomString = require( 'string!SHRED/neutralAtom' );
  var positiveSignIonString = require( 'string!SHRED/positiveSignIon' );
  var stableString = require( 'string!SHRED/stable' );
  var unstableString = require( 'string!SHRED/unstable' );

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
        electronShellDepictionProperty: new Property( 'orbits' )
      },
      options
    );

    Node.call( this, options ); // Call super constructor.
    var self = this;

    // @private
    this.atom = particleAtom;
    this.modelViewTransform = modelViewTransform;

    // Create the X where the nucleus goes.
    if ( options.showCenterX ) {
      var sizeInPixels = modelViewTransform.modelToViewDeltaX( 20 );
      var center = modelViewTransform.modelToViewPosition( particleAtom.position );
      var centerMarker = new Shape();
      centerMarker.moveTo( center.x - sizeInPixels / 2, center.y - sizeInPixels / 2 );
      centerMarker.lineTo( center.x + sizeInPixels / 2, center.y + sizeInPixels / 2 );
      centerMarker.moveTo( center.x - sizeInPixels / 2, center.y + sizeInPixels / 2 );
      centerMarker.lineTo( center.x + sizeInPixels / 2, center.y - sizeInPixels / 2 );
      var atomCenterMarker = new Path( centerMarker, {
        stroke: 'orange',
        lineWidth: 5,
        pickable: false
      } );
      this.addChild( atomCenterMarker );

      // Make the marker invisible if any nucleons are present.
      var listener = function() { atomCenterMarker.visible = particleAtom.getWeight() === 0; };
      particleAtom.electrons.lengthProperty.link( listener );
      particleAtom.neutrons.lengthProperty.link( listener );
      particleAtom.protons.lengthProperty.link( listener );
    }

    // Add the electron shells and cloud.
    var electronShell = new ElectronShellView( particleAtom, modelViewTransform );
    this.addChild( electronShell );
    var electronCloud = new ElectronCloudView( particleAtom, modelViewTransform );
    this.addChild( electronCloud );
    var isotopeElectronCloud = new IsotopeElectronCloudView( particleAtom, modelViewTransform );
    this.addChild( isotopeElectronCloud );

    var updateElectronShellDepictionVisiblity = function( depiction ) {
      electronShell.visible = depiction === 'orbits';
      electronCloud.visible = depiction === 'cloud';
      isotopeElectronCloud.visible = depiction === 'isotopeCloud';
    };
    options.electronShellDepictionProperty.link( updateElectronShellDepictionVisiblity );

    var elementNameCenterPos = modelViewTransform.modelToViewPosition( particleAtom.position.plus(
      new Vector2( 0, particleAtom.innerElectronShellRadius * 0.60 ) ) );

    // @private - Create the textual readout for the element name.
    this.elementName = new Text( '', {
      font: new PhetFont( ELEMENT_NAME_FONT_SIZE ),
      fill: PhetColorScheme.RED_COLORBLIND,
      center: elementNameCenterPos,
      pickable: false
    } );
    this.addChild( this.elementName );

    // Define the update function for the element name.
    var updateElementName = function() {
      var name = AtomIdentifier.getName( self.atom.protons.length );
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
    particleAtom.protons.lengthProperty.link( updateElementName );

    var updateElementNameVisibility = function( visible ) {
      self.elementName.visible = visible;
    };
    options.showElementNameProperty.link( updateElementNameVisibility );

    var ionIndicatorTranslation = modelViewTransform.modelToViewPosition( particleAtom.position.plus(
      new Vector2( particleAtom.outerElectronShellRadius * 1.05, 0 ).rotated( Math.PI * 0.3 ) ) );

    // @private - Create the textual readout for the ion indicator, set by trial and error.
    this.ionIndicator = new Text( '', {
      font: new PhetFont( 20 ),
      fill: 'black',
      translation: ionIndicatorTranslation,
      pickable: false,
      maxWidth: 150
    } );
    this.addChild( this.ionIndicator );

    // Define the update function for the ion indicator.
    var updateIonIndicator = function() {
      if ( self.atom.protons.length > 0 ) {
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

    particleAtom.protons.lengthProperty.link( updateIonIndicator );
    particleAtom.electrons.lengthProperty.link( updateIonIndicator );
    var updateIonIndicatorVisibility = function( visible ) {
      self.ionIndicator.visible = visible;
    };
    options.showNeutralOrIonProperty.link( updateIonIndicatorVisibility );

    // Create the textual readout for the stability indicator.
    var stabilityIndicatorCenterPos = modelViewTransform.modelToViewPosition( particleAtom.position.plus(
      new Vector2( 0, -particleAtom.innerElectronShellRadius * 0.60 ) ) );

    // @private
    this.stabilityIndicator = new Text( '', {
      font: new PhetFont( 20 ),
      fill: 'black',
      center: stabilityIndicatorCenterPos,
      pickable: false,
      maxWidth: modelViewTransform.modelToViewDeltaX( particleAtom.innerElectronShellRadius * 1.4 )
    } );
    this.addChild( this.stabilityIndicator );

    // Define the update function for the stability indicator.
    var updateStabilityIndicator = function() {
      if ( self.atom.protons.length > 0 ) {
        if ( AtomIdentifier.isStable( self.atom.protons.length, self.atom.neutrons.length ) ) {
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
    particleAtom.protons.lengthProperty.link( updateStabilityIndicator );
    particleAtom.neutrons.lengthProperty.link( updateStabilityIndicator );
    var updateStabilityIndicatorVisibility = function( visible ) {
      self.stabilityIndicator.visible = visible;
    };
    options.showStableOrUnstableProperty.link( updateStabilityIndicatorVisibility );

    this.atomNodeDispose = function(){
      electronCloud.dispose();
      isotopeElectronCloud.dispose();
      if ( options.showCenterX ) {
        particleAtom.electrons.lengthProperty.unlink( listener );
        particleAtom.neutrons.lengthProperty.unlink( listener );
        particleAtom.protons.lengthProperty.unlink( listener );
      }

      options.electronShellDepictionProperty.unlink( updateElectronShellDepictionVisiblity );
      particleAtom.protons.lengthProperty.unlink( updateElementName );
      options.showElementNameProperty.unlink( updateElementNameVisibility );
      particleAtom.protons.lengthProperty.unlink( updateIonIndicator );
      particleAtom.electrons.lengthProperty.unlink( updateIonIndicator );
      options.showNeutralOrIonProperty.unlink( updateIonIndicatorVisibility );
      particleAtom.protons.lengthProperty.unlink( updateStabilityIndicator );
      particleAtom.neutrons.lengthProperty.unlink( updateStabilityIndicator );
      options.showStableOrUnstableProperty.unlink( updateStabilityIndicatorVisibility );

    };
  }

  shred.register( 'AtomNode', AtomNode );

  // Inherit from Node.
  return inherit( Node, AtomNode, {
    //@public
    dispose: function(){
      this.atomNodeDispose();
    }

  } );
} );
