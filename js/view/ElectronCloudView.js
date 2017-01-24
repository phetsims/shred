// Copyright 2014-2015, University of Colorado Boulder

/**
 * Node that represents the electron shell in an atom as a "cloud" that grows
 * and shrinks depending on the number of electrons that it contains.  This
 * has also been referred to as the "Schroedinger model" representation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var ShredConstants = require( 'SHRED/ShredConstants' );
  var shred = require( 'SHRED/shred' );
  var Tandem = require( 'TANDEM/Tandem' );
  var TandemCircle = require( 'TANDEM/scenery/nodes/TandemCircle' );
  var TandemSimpleDragHandler = require( 'TANDEM/scenery/input/TandemSimpleDragHandler' );
  var TandemNode = require( 'TANDEM/scenery/nodes/TandemNode' );

  /**
   * @param {ParticleAtom} atom
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} options
   * @constructor
   */
  function ElectronCloudView( atom, modelViewTransform, options ) {

    options = _.extend( {
        tandem: Tandem.tandemRequired()
      },
      options
    );

    Tandem.validateOptions( options ); // The tandem is required when brand==='phet-io'

    // Call super constructor.
    TandemNode.call( this, { cursor: 'pointer', tandem: options.tandem } );
    var self = this;

    var electronCloud = new TandemCircle( modelViewTransform.modelToViewDeltaX( atom.outerElectronShellRadius ), {
        fill: 'pink',
      translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } ),
      tandem: options.tandem.createTandem( 'electronCloud' )
      }
    );
    this.addChild( electronCloud );

    // Function that updates the size of the cloud based on the number of electrons.
    var updateElectronCloud = function( numElectrons ) {
      if ( numElectrons === 0 ) {
        electronCloud.radius = 1E-5; // Arbitrary non-zero value.
        electronCloud.fill = 'transparent';
      }
      else {
        var minRadius = modelViewTransform.modelToViewDeltaX( atom.innerElectronShellRadius ) * 0.5;
        var maxRadius = modelViewTransform.modelToViewDeltaX( atom.outerElectronShellRadius );
        var radius = minRadius + ( ( maxRadius - minRadius ) / ShredConstants.MAX_ELECTRONS ) * numElectrons;
        electronCloud.radius = radius;
        electronCloud.fill = new RadialGradient( 0, 0, 0, 0, 0, radius )
          .addColorStop( 0, 'rgba( 0, 0, 255, 200 )' )
          .addColorStop( 0.9, 'rgba( 0, 0, 255, 0 )' );
      }
    };
    updateElectronCloud( atom.electrons.length );

    // Update the cloud size as electrons come and go.
    atom.electrons.lengthProperty.link( updateElectronCloud );

    // If the user clicks on the cloud, extract an electron.
    this.extractedElectron = null; // @private
    this.addInputListener( new TandemSimpleDragHandler( {
      activeParticle: null,
      start: function( event, trail ) {

        // Note: The following transform works, but it is a bit obscure, and relies on the topology of the scene graph.
        // JB, SR, and JO discussed potentially better ways to do it. If this code is leveraged, revisit this line for
        // potential improvement.
        var positionInModelSpace = modelViewTransform.viewToModelPosition(
          self.getParents()[ 0 ].globalToLocalPoint( event.pointer.point )
        );

        var electron = atom.extractParticle( 'electron' );
        if ( electron !== null ) {
          electron.userControlledProperty.set( true );
          electron.setPositionAndDestination( positionInModelSpace );
          self.extractedElectron = electron;
        }
      },
      translate: function( translationParams ) {
        if ( self.extractedElectron !== null ) {
          self.extractedElectron.setPositionAndDestination(
            self.extractedElectron.positionProperty.get().plus(
              modelViewTransform.viewToModelDelta( translationParams.delta ) ) );
        }
      },
      end: function( event ) {
        if ( self.extractedElectron !== null ) {
          self.extractedElectron.userControlledProperty.set( false );
        }
      },
      tandem: options.tandem.createTandem( 'dragHandler' ),
    } ) );

    this.disposeElectronCloudView = function() {
      atom.electrons.lengthProperty.unlink( updateElectronCloud );
      options.tandem && options.tandem.removeInstance( this );
    };
  }

  shred.register( 'ElectronCloudView', ElectronCloudView );

  // Inherit from TandemNode.
  return inherit( TandemNode, ElectronCloudView, {
    // @public
    dispose: function() {
      this.disposeElectronCloudView();
    }
  } );
} );
