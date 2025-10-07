// Copyright 2015-2025, University of Colorado Boulder

/**
 * A drag listener specifically tailored for the particle buckets. This listener extracts a particle from a bucket and
 * manages it as though the user had clicked directly on the particle. This exists to make it easier for the users to
 * get particles out of the buckets when using a touch-based device.
 *
 * @author John Blanco
 */

import Vector2 from '../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import SphereBucket from '../../../phetcommon/js/model/SphereBucket.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import BucketFront from '../../../scenery-phet/js/bucket/BucketFront.js';
import SoundDragListener, { SoundDragListenerOptions } from '../../../scenery-phet/js/SoundDragListener.js';
import nullSoundPlayer from '../../../tambo/js/nullSoundPlayer.js';
import sharedSoundPlayers from '../../../tambo/js/sharedSoundPlayers.js';
import Particle from '../model/Particle.js';
import shred from '../shred.js';
import ShredStrings from '../ShredStrings.js';

type SelfOptions = EmptySelfOptions;
type BucketDragListenerOptions = SelfOptions & SoundDragListenerOptions;

class BucketDragListener extends SoundDragListener {

  public constructor( bucket: SphereBucket<Particle>,
                      bucketView: BucketFront,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions?: BucketDragListenerOptions ) {

    // closure for converting a point in local coordinate frame to model coordinates
    const localViewToModel = ( point: Vector2 ) => {

      // Note: The following transform works, but it is a bit obscure, and relies on the topology of the scene graph.
      // JB, SR, and JO discussed potentially better ways to do it but didn't come up with anything at the time. If
      // this code is leveraged, this transform should be revisited for potential improvement.
      return modelViewTransform.viewToModelPosition(
        bucketView.getParents()[ 0 ].globalToLocalPoint( point )
      );
    };

    let activeParticle: Particle | null = null;

    // sound players for grab and release
    const grabSoundPlayer = providedOptions?.grabSoundPlayer ?? sharedSoundPlayers.get( 'grab' );
    const releaseSoundPlayer = providedOptions?.releaseSoundPlayer ?? sharedSoundPlayers.get( 'release' );

    const options = optionize<BucketDragListenerOptions, SelfOptions, SoundDragListenerOptions>()( {
      start: event => {

        const positionInModelSpace = localViewToModel( event.pointer.point );

        activeParticle = bucket.extractClosestParticle( positionInModelSpace );
        if ( activeParticle !== null ) {
          activeParticle.isDraggingProperty.value = true;
          grabSoundPlayer.play();
          activeParticle.setPositionAndDestination( positionInModelSpace );
        }

        bucketView.addAccessibleObjectResponse( ShredStrings.a11y.buckets.grabbedStringProperty );
      },

      drag: ( event, listener ) => {
        if ( activeParticle !== null ) {

          // Adjust the position if an offset was provided.
          const eventPoint = event.pointer.point.copy();
          if ( options && options.offsetPosition ) {
            eventPoint.add( options.offsetPosition( eventPoint, listener ) );
          }
          activeParticle.setPositionAndDestination( localViewToModel( eventPoint ) );
        }
      },

      end: () => {
        if ( activeParticle !== null ) {
          activeParticle.isDraggingProperty.set( false );
          activeParticle = null;
          releaseSoundPlayer.play();
        }
        bucketView.addAccessibleObjectResponse( ShredStrings.a11y.buckets.releasedStringProperty );
      },

      // By default, the grab and release sounds are played on every press and release, but that isn't exactly what we
      // want here, because we don't want a sound if there are no particles in the bucket to be grabbed.  So here we
      // effectively disable the default sounds and play our own elsewhere in this file.
      grabSoundPlayer: nullSoundPlayer,
      releaseSoundPlayer: nullSoundPlayer
    }, providedOptions );

    super( options );
  }
}

shred.register( 'BucketDragListener', BucketDragListener );
export default BucketDragListener;