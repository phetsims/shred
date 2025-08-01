// Copyright 2014-2025, University of Colorado Boulder

/**
 * Type that represents a subatomic particle in the view.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import stepTimer from '../../../axon/js/stepTimer.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Shape from '../../../kite/js/Shape.js';
import { combineOptions, optionize4 } from '../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import AccessibleDraggableOptions from '../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import SoundDragListener, { SoundDragListenerOptions } from '../../../scenery-phet/js/SoundDragListener.js';
import SoundKeyboardDragListener, { SoundKeyboardDragListenerOptions } from '../../../scenery-phet/js/SoundKeyboardDragListener.js';
import { PressListenerEvent } from '../../../scenery/js/listeners/PressListener.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import Tandem from '../../../tandem/js/Tandem.js';
import Particle from '../model/Particle.js';
import shred from '../shred.js';
import IsotopeNode, { IsotopeNodeOptions } from './IsotopeNode.js';
import ParticleNode from './ParticleNode.js';

type SelfOptions = {
  dragBounds?: Bounds2;
  touchOffset?: Vector2 | null; // null to opt out of an offset

  // Options specific to the isotope node, if the particle is an isotope.
  isotopeNodeOptions?: IsotopeNodeOptions;
};

export type ParticleViewOptions = SelfOptions & NodeOptions;

class ParticleView extends Node {
  public readonly particle: Particle;
  private readonly dragListener: SoundDragListener;
  private readonly disposeParticleView: VoidFunction;

  public constructor( particle: Particle,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions?: ParticleViewOptions ) {

    const options = optionize4<ParticleViewOptions, SelfOptions, NodeOptions>()(
      {},
      AccessibleDraggableOptions,
      {
        dragBounds: Bounds2.EVERYTHING,
        tandem: Tandem.REQUIRED,
        touchOffset: null,
        isotopeNodeOptions: {},

        // TODO: Should add correct a11yName! https://github.com/phetsims/build-an-atom/issues/256
        innerContent: 'div'
      },
      providedOptions
    );

    super();

    this.particle = particle;

    // Add the particle representation.
    let particleNode;

    if ( particle.type === 'isotope' ) {
      const isotopeNodeOptions = combineOptions<IsotopeNodeOptions>( {
        tandem: options.tandem.createTandem( 'particleNode' ),
        phetioVisiblePropertyInstrumented: false
      }, options.isotopeNodeOptions );
      particleNode = new IsotopeNode(
        particle,
        modelViewTransform.modelToViewDeltaX( particle.radius ),
        isotopeNodeOptions
      );
    }
    else {
      particleNode = new ParticleNode(
        particle.type,
        modelViewTransform.modelToViewDeltaX( particle.radius ),
        {
          typeProperty: particle.typeProperty,
          colorProperty: particle.colorProperty,
          tandem: Tandem.OPT_OUT,
          phetioVisiblePropertyInstrumented: false
        }
      );
    }
    this.addChild( particleNode );

    particle.inputEnabledProperty.link( inputEnabled => {
      this.inputEnabled = inputEnabled;
    } );

    // Listen to the model position and update.
    const updateParticlePosition = ( position: Vector2 ) => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    };
    particle.positionProperty.link( updateParticlePosition );

    const dragListenerOptions = {
      positionProperty: particle.destinationProperty,
      applyOffset: false,
      transform: modelViewTransform,
      dragBoundsProperty: options.dragBounds ? new Property( options.dragBounds ) : null,
      start: () => {

        // If there is an animation in progress, cancel it by setting the destination to the current position.
        if ( !particle.positionProperty.get().equals( particle.destinationProperty.get() ) ) {
          particle.destinationProperty.set( particle.positionProperty.get() );
        }
      },

      drag: () => {

        // Once the particle is being dragged, set a value indicating that the particle is user controlled.
        this.particle.isDraggingProperty.set( true );

        // Because the destination property is what is being set by the drag listener, we need to tell the particle to
        // go immediately to its destination when a drag occurs.
        this.particle.moveImmediatelyToDestination();
      }
    };

    // add a drag listener
    this.dragListener = new SoundDragListener( combineOptions<SoundDragListenerOptions>(
      {
        tandem: options.tandem.createTandem( 'dragListener' ),

        // Offset the position a little if this is a touch pointer so that the finger doesn't cover the particle.
        offsetPosition: ( viewPoint, dragListener ) => {
          return options.touchOffset && dragListener.pointer.isTouchLike() ? options.touchOffset : Vector2.ZERO;
        },

        end: () => {
          this.particle.isDraggingProperty.set( false );
        }
      },
      dragListenerOptions
    ) );
    this.addInputListener( this.dragListener );

    const keyboardDragListener = new SoundKeyboardDragListener(
      combineOptions<SoundKeyboardDragListenerOptions>( {
        tandem: options.tandem.createTandem( 'keyboardDragListener' ),
        positionProperty: particle.positionProperty,
        transform: modelViewTransform,
        dragSpeed: 200,
        shiftDragSpeed: 50,

        // Add a timeout before dropping the particle for better UX.
        end: () => {
          stepTimer.setTimeout( () => {
            this.particle.isDraggingProperty.set( false );
          }, 500 );
        }
      }, dragListenerOptions ) );
    this.addInputListener( keyboardDragListener );

    this.particle.isDraggingProperty.link( isDragging => {
      if ( isDragging && !this.isFocused() ) {
        this.focus(); // focus the particle view when it is being dragged

        // Move the particle to the front of whatever layer it is on so that it is not obscured by other particles.
        this.moveToFront();
      }
    } );

    this.mutate( options );

    this.disposeParticleView = function() {
      particle.positionProperty.unlink( updateParticlePosition );
      particleNode.dispose();
      this.dragListener.dispose();
      keyboardDragListener.dispose();
    };

    this.focusHighlight = Shape.circle( this.particle.radius * 1.5 );
  }

  public override dispose(): void {
    this.disposeParticleView();
    super.dispose();
  }

  public startSyntheticDrag( event: PressListenerEvent ): void {

    // forward this Node as the target of the drag because the creator Node may be default target otherwise
    this.dragListener.press( event, this );
  }
}

shred.register( 'ParticleView', ParticleView );
export default ParticleView;