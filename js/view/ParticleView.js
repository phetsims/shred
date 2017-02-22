// Copyright 2014-2015, University of Colorado Boulder

/**
 * Type that represents a sub-atomic particle in the view.
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var IsotopeNode = require( 'SHRED/view/IsotopeNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ParticleNode = require( 'SHRED/view/ParticleNode' );
  var shred = require( 'SHRED/shred' );
  var TandemSimpleDragHandler = require( 'TANDEM/scenery/input/TandemSimpleDragHandler' );
  var Tandem = require( 'TANDEM/Tandem' );

  function createParticleNode( particle, modelViewTransform, tandem ) {
    var particleNode;
    if ( particle.typeProperty.get() === 'Isotope' ) {
      particleNode = new IsotopeNode(
        particle,
        modelViewTransform.modelToViewDeltaX( particle.radiusProperty.get() ),
        { showLabel: particle.showLabel, tandem: tandem }
      );
    }
    else {
      particleNode = new ParticleNode(
        particle.typeProperty.get(),
        modelViewTransform.modelToViewDeltaX( particle.radiusProperty.get() ),
        { tandem: tandem }
      );
    }
    return particleNode;
  }

  /**
   * @param {Particle} particle
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @constructor
   */
  function ParticleView( particle, modelViewTransform, options ) {

    options = _.extend( {
      tandem: Tandem.tandemRequired()
    }, options );

    Node.call( this ); // Call super constructor.
    var self = this;

    // Set up fields.
    this.particle = particle; // @public
    this.modelViewTransform = modelViewTransform; // @private

    // Add the particle representation.
    this.addChild( createParticleNode(
      particle,
      modelViewTransform,
      options.tandem.createTandem( 'particleRepresentation' )
    ) );

    // Listen to the model position and update.
    var updateParticlePosition = function( position ) {
      self.translation = self.modelViewTransform.modelToViewPosition( position );
    };
    particle.positionProperty.link( updateParticlePosition );

    // Add a drag handler
    this.addInputListener( new TandemSimpleDragHandler( {
      tandem: options.tandem ? options.tandem.createTandem( 'inputListener' ) : null,

      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,

      // Handler that moves the particle in model space.
      translate: function( translationParams ) {
        particle.setPositionAndDestination(
          particle.positionProperty.get().plus( modelViewTransform.viewToModelDelta( translationParams.delta ) )
        );
        return translationParams.position;
      },
      start: function( event, trail ) {
        self.particle.userControlledProperty.set( true );
      },
      end: function( event, trail ) {
        self.particle.userControlledProperty.set( false );
      }
    } ) );
    this.mutate( options );

    // @private
    this.disposeParticleView = function(){
      particle.positionProperty.unlink( updateParticlePosition );
    };
  }

  shred.register( 'ParticleView', ParticleView );
  // Inherit from Node.
  return inherit( Node, ParticleView, {
    dispose: function(){
      this.disposeParticleView();
    }
  } );
} );
