// Copyright 2014-2019, University of Colorado Boulder

/**
 * Node that represents the electron shell in an atom as a "cloud" that grows and shrinks depending on the number of
 * electrons that it contains.  This has also been referred to as the "Schroedinger model" representation.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const RadialGradient = require( 'SCENERY/util/RadialGradient' );
  const shred = require( 'SHRED/shred' );
  const ShredConstants = require( 'SHRED/ShredConstants' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {ParticleAtom} atom
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} options
   * @constructor
   */
  function ElectronCloudView( atom, modelViewTransform, options ) {

    const self = this;
    options = merge( { tandem: Tandem.REQUIRED }, options );

    Circle.call( this, {
        cursor: 'pointer',
        fill: 'pink',
        translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } )
      }
    );

    // Function that updates the size of the cloud based on the number of electrons.
    const update = function( numElectrons ) {
      if ( numElectrons === 0 ) {
        self.radius = 1E-5; // Arbitrary non-zero value.
        self.fill = 'transparent';
      }
      else {
        const minRadius = modelViewTransform.modelToViewDeltaX( atom.innerElectronShellRadius ) * 0.5;
        const maxRadius = modelViewTransform.modelToViewDeltaX( atom.outerElectronShellRadius );
        const radius = minRadius + ( ( maxRadius - minRadius ) / ShredConstants.MAX_ELECTRONS ) * numElectrons;
        self.radius = radius;
        self.fill = new RadialGradient( 0, 0, 0, 0, 0, radius )
          .addColorStop( 0, 'rgba( 0, 0, 255, 200 )' )
          .addColorStop( 0.9, 'rgba( 0, 0, 255, 0 )' );
      }
    };
    update( atom.electrons.length );

    // Update the cloud size as electrons come and go.
    atom.electrons.lengthProperty.link( update );

    // If the user clicks on the cloud, extract an electron.
    this.extractedElectron = null; // @private
    const simpleDragHandler = new SimpleDragHandler( {
      activeParticle: null,
      start: function( event, trail ) {

        // Note: The following transform works, but it is a bit obscure, and relies on the topology of the scene graph.
        // JB, SR, and JO discussed potentially better ways to do it. If this code is leveraged, revisit this line for
        // potential improvement.
        const positionInModelSpace = modelViewTransform.viewToModelPosition(
          self.getParents()[ 0 ].globalToLocalPoint( event.pointer.point )
        );

        const electron = atom.extractParticle( 'electron' );
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
      tandem: options.tandem.createTandem( 'dragHandler' )
    } );
    this.addInputListener( simpleDragHandler );

    // @private called by dispose
    this.disposeElectronCloudView = function() {
      atom.electrons.lengthProperty.unlink( update );
      simpleDragHandler.dispose();
    };

    this.mutate( options );
  }

  shred.register( 'ElectronCloudView', ElectronCloudView );

  return inherit( Circle, ElectronCloudView, {

    // @public
    dispose: function() {
      this.disposeElectronCloudView();
      Circle.prototype.dispose.call( this );
    }
  } );
} );
