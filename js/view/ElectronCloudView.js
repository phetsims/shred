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
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var ShredConstants = require( 'SHRED/ShredConstants' );
  var shred = require( 'SHRED/shred' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {ParticleAtom} atom
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function ElectronCloudView( atom, modelViewTransform ) {

    // Call super constructor.
    Node.call( this, { cursor: 'pointer' } );
    var self = this;

    var electronCloud = new Circle( modelViewTransform.modelToViewDeltaX( atom.outerElectronShellRadius ), {
        fill: 'pink',
        translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } )
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
    this.addInputListener( new SimpleDragHandler( {
      activeParticle: null,
      start: function( event, trail ) {
        // Note: The following transform works, but it is a bit obscure, and relies on the topology of the scene graph.
        // JB, SR, and JO discussed potentially better ways to do it. If this code is leveraged, revisit this line for
        // potential improvement.
        var positionInModelSpace = modelViewTransform.viewToModelPosition(
          self.getParents()[ 0 ].globalToLocalPoint( event.pointer.point ) );

        var electron = atom.extractParticle( 'electron' );
        if ( electron !== null ) {
          electron.userControlled = true;
          electron.setPositionAndDestination( positionInModelSpace );
          self.extractedElectron = electron;
        }
      },
      translate: function( translationParams ) {
        if ( self.extractedElectron !== null ) {
          self.extractedElectron.setPositionAndDestination(
            self.extractedElectron.position.plus( modelViewTransform.viewToModelDelta( translationParams.delta ) ) );
        }
      },
      end: function( event ) {
        if ( self.extractedElectron !== null ) {
          self.extractedElectron.userControlled = false;
        }
      }
    } ) );

    this.electronCloudViewDispose = function() {
      atom.electrons.lengthProperty.unlink( updateElectronCloud );
    };
  }

  shred.register( 'ElectronCloudView', ElectronCloudView );

  // Inherit from Node.
  return inherit( Node, ElectronCloudView, {
    // @public
    dispose: function(){
      this.electronCloudViewDispose();
    }
  } );
} );
