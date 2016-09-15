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
  var TandemDragHandler = require( 'TANDEM/scenery/input/TandemDragHandler' );
  var Tandem = require( 'TANDEM/Tandem' );

  function getParticleNode( particle, modelViewTransform ) {
    var particleNode;
    if ( particle.type === 'Isotope' ) {
      particleNode = new IsotopeNode( particle, modelViewTransform.modelToViewDeltaX( particle.radius ),
        { showLabel: particle.showLabel } );
    }
    else {
      particleNode = new ParticleNode( particle.type, modelViewTransform.modelToViewDeltaX( particle.radius ) );
    }
    return particleNode;

  }

  /**
   *
   * @param {Particle} particle
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @constructor
   */
  function ParticleView( particle, modelViewTransform, options ) {

    options = _.extend( {
      tandem: null
    }, options );

    Tandem.validateOptions( options ); // The tandem is required when brand==='phet-io'
    
    Node.call( this ); // Call super constructor.
    var self = this;

    // Set up fields.
    this.particle = particle; // @public
    this.modelViewTransform = modelViewTransform; // @private

    // Add the particle representation.
    this.addChild( getParticleNode( particle, modelViewTransform ) );

    // Listen to the model position and update.
    var updateParticlePosition = function( position ) {
      self.translation = self.modelViewTransform.modelToViewPosition( position );
    };
    particle.positionProperty.link( updateParticlePosition );

    // Add a drag handler
    this.addInputListener( new TandemDragHandler( {
      tandem: options.tandem ? options.tandem.createTandem( 'inputListener' ) : null,

      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,

      // Handler that moves the particle in model space.
      translate: function( translationParams ) {
        particle.setPositionAndDestination(
          particle.position.plus( modelViewTransform.viewToModelDelta( translationParams.delta ) )
        );
        return translationParams.position;
      },
      start: function( event, trail ) {
        self.particle.userControlled = true;
      },
      end: function( event, trail ) {
        self.particle.userControlled = false;
      }
    } ) );
    this.mutate( options );

    this.particleViewDispose = function(){
      particle.positionProperty.unlink( updateParticlePosition );
    };
  }

  shred.register( 'ParticleView', ParticleView );
  // Inherit from Node.
  return inherit( Node, ParticleView, {
    dispose: function(){
      this.particleViewDispose();
    }
  } );
} );
