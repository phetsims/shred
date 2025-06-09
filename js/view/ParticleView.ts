// Copyright 2014-2025, University of Colorado Boulder

/**
 * Type that represents a subatomic particle in the view.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Property from '../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Shape from '../../../kite/js/Shape.js';
import optionize, { combineOptions } from '../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import SoundDragListener, { SoundDragListenerOptions } from '../../../scenery-phet/js/SoundDragListener.js';
import SoundKeyboardDragListener, { SoundKeyboardDragListenerOptions } from '../../../scenery-phet/js/SoundKeyboardDragListener.js';
import InteractiveHighlighting from '../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import { PressListenerEvent } from '../../../scenery/js/listeners/PressListener.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import Tandem from '../../../tandem/js/Tandem.js';
import Particle from '../model/Particle.js';
import shred from '../shred.js';
import IsotopeNode from './IsotopeNode.js';
import ParticleNode from './ParticleNode.js';

type SelfOptions = {
  dragBounds?: Bounds2;
  highContrastProperty?: TReadOnlyProperty<boolean>;
  touchOffset?: Vector2 | null; // null to opt out of an offset
};

export type ParticleViewOptions = SelfOptions & NodeOptions;

class ParticleView extends InteractiveHighlighting( Node ) {
  public readonly particle: Particle;
  private readonly dragListener: SoundDragListener;
  private readonly disposeParticleView: VoidFunction;

  public constructor( particle: Particle, modelViewTransform: ModelViewTransform2, providedOptions?: ParticleViewOptions ) {

    const ownsHighContrastProperty = providedOptions && !providedOptions.highContrastProperty;

    const options = optionize<ParticleViewOptions, SelfOptions, NodeOptions>()( {
      dragBounds: Bounds2.EVERYTHING,
      tandem: Tandem.REQUIRED,

      touchOffset: null,

      // {BooleanProperty|null} - if provided, this is used to set the particle node into and out of high contrast mode
      highContrastProperty: new BooleanProperty( false )
    }, providedOptions );

    super();

    this.particle = particle;

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
    const updateParticlePosition = ( position: Vector2 ) => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    };
    particle.positionProperty.link( updateParticlePosition );

    const dragListenerOptions = {
      positionProperty: particle.destinationProperty,
      transform: modelViewTransform,
      dragBoundsProperty: options.dragBounds ? new Property( options.dragBounds ) : null
    };

    // add a drag listener
    this.dragListener = new SoundDragListener(
      combineOptions<SoundDragListenerOptions>( {
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
        },

        // Offset the position a little if this is a touch pointer so that the finger doesn't cover the particle.
        offsetPosition: ( viewPoint, dragListener ) => {
          return options.touchOffset && dragListener.pointer.isTouchLike() ? options.touchOffset : Vector2.ZERO;
        }
      }, dragListenerOptions ) );
    this.addInputListener( this.dragListener );

    const keyboardDragListener = new SoundKeyboardDragListener(
      combineOptions<SoundKeyboardDragListenerOptions>( {
        tandem: options.tandem.createTandem( 'keyboardDragListener' )
      }, dragListenerOptions ) );
    this.addInputListener( keyboardDragListener );

    this.mutate( options );

    this.disposeParticleView = function() {
      ownsHighContrastProperty && options.highContrastProperty.dispose();
      particle.positionProperty.unlink( updateParticlePosition );
      particleNode.dispose();
      this.dragListener.dispose();
      keyboardDragListener.dispose();
    };

    this.interactiveHighlight = Shape.circle( this.particle.radiusProperty.value * 1.5 );
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

/**
 * Creates the proper view for a particle.
 */
function createParticleNode( particle: Particle, modelViewTransform: ModelViewTransform2,
                             highContrastProperty: TReadOnlyProperty<boolean>, tandem: Tandem ): Node {
  let particleNode;
  if ( particle.type === 'Isotope' ) {
    particleNode = new IsotopeNode(
      particle,
      modelViewTransform.modelToViewDeltaX( particle.radiusProperty.get() ), {
        // showLabel: particle.showLabel, // TODO https://github.com/phetsims/shred/issues/41 When converting to TypeScript, this was flagged because Particle.showLabel doesn't exist.
        tandem: tandem
      }
    );
  }
  else {
    particleNode = new ParticleNode(
      particle.type,
      modelViewTransform.modelToViewDeltaX( particle.radiusProperty.get() ),
      {
        highContrastProperty: highContrastProperty,
        typeProperty: particle.typeProperty,
        colorProperty: particle.colorProperty,
        tandem: tandem
      }
    );
  }
  return particleNode;
}

shred.register( 'ParticleView', ParticleView );
export default ParticleView;