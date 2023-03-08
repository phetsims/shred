// Copyright 2014-2023, University of Colorado Boulder

/**
 * Type that represents a sub-atomic particle in the view.
 */

import Property from '../../../axon/js/Property.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import merge from '../../../phet-core/js/merge.js';
import { DragListener, Node } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';
import IsotopeNode from './IsotopeNode.js';
import ParticleNode from './ParticleNode.js';

class ParticleView extends Node {

  /**
   * @param {Particle} particle
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( particle, modelViewTransform, options ) {

    options = merge( {
      dragBounds: Bounds2.EVERYTHING,
      tandem: Tandem.REQUIRED,

      // {BooleanProperty|null} - if provided, this is used to set the particle node into and out of high contrast mode
      highContrastProperty: null
    }, options );

    super();

    this.particle = particle; // @public

    // Add the particle representation.
    const particleNode = createParticleNode(
      particle,
      modelViewTransform,
      options.highContrastProperty,
      options.tandem.createTandem( 'particleNode' )
    );
    this.addChild( particleNode );

    particle.inputEnabledProperty.link( inputEnabled => {
      this.inputEnabled = inputEnabled;
    } );

    // Listen to the model position and update.
    const updateParticlePosition = position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    };
    particle.positionProperty.link( updateParticlePosition );

    // add a drag listener
    this.dragListener = new DragListener( {

      positionProperty: particle.destinationProperty,
      transform: modelViewTransform,
      dragBoundsProperty: options.dragBounds ? new Property( options.dragBounds ) : null,
      tandem: options.tandem.createTandem( 'dragListener' ),

      start: () => {
        this.particle.userControlledProperty.set( true );

        // if there is an animation in progress, cancel it be setting the destination to the position
        if ( !particle.positionProperty.get().equals( particle.destinationProperty.get() ) ) {
          particle.destinationProperty.set( particle.positionProperty.get() );
        }
      },

      drag: () => {

        // Because the destination property is what is being set by the drag listener, we need to tell the particle to
        // go immediately to its destination when a drag occurs.
        this.particle.moveImmediatelyToDestination();
      },

      end: () => {
        this.particle.userControlledProperty.set( false );

        if ( !this.isDisposed ) {
          particle.dragEndedEmitter.emit( particle );
        }
      }
    } );
    this.addInputListener( this.dragListener );

    this.mutate( options );

    // @private called by dispose
    this.disposeParticleView = function() {
      particle.positionProperty.unlink( updateParticlePosition );
      particleNode.dispose();
      this.dragListener.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeParticleView();
    super.dispose();
  }

  /**
   * @public
   * @param {PressListenerEvent} event
   */
  startSyntheticDrag( event ) {
    this.dragListener.press( event );
  }
}

/**
 * Creates the proper view for a particle.
 * @param {Particle} particle
 * @param {ModelViewTransform2} modelViewTransform
 * @param {BooleanProperty|null} highContrastProperty
 * @param {Tandem} tandem
 * @returns {Node}
 */
function createParticleNode( particle, modelViewTransform, highContrastProperty, tandem ) {
  let particleNode;
  if ( particle.type === 'Isotope' ) {
    particleNode = new IsotopeNode(
      particle,
      modelViewTransform.modelToViewDeltaX( particle.radiusProperty.get() ),
      { showLabel: particle.showLabel, tandem: tandem }
    );
  }
  else {
    particleNode = new ParticleNode(
      particle.type,
      modelViewTransform.modelToViewDeltaX( particle.radiusProperty.get() ),
      {
        highContrastProperty: highContrastProperty,
        typeProperty: particle.typeProperty,
        colorGradientIndexNumberProperty: particle.colorGradientIndexNumberProperty,
        tandem: tandem
      }
    );
  }
  return particleNode;
}

shred.register( 'ParticleView', ParticleView );
export default ParticleView;