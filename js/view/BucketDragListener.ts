// Copyright 2015-2023, University of Colorado Boulder

/**
 * A drag listener specifically tailored for the particle buckets. This listener extracts a particle from a bucket and
 * manages it as though the user had clicked directly on the particle. This exists to make it easier for the users to
 * get particles out of the buckets when using a touch-based device.
 *
 * @author John Blanco
 */

import { DragListener, DragListenerOptions } from '../../../scenery/js/imports.js';
import shred from '../shred.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import BucketFront from '../../../scenery-phet/js/bucket/BucketFront.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../dot/js/Vector2.js';
import SphereBucket from '../../../phetcommon/js/model/SphereBucket.js';
import Particle from '../model/Particle.js';

class BucketDragListener extends DragListener {

  public constructor( bucket: SphereBucket, bucketView: BucketFront, modelViewTransform: ModelViewTransform2,
                      options?: DragListenerOptions<BucketDragListener> ) {

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

    super( combineOptions<DragListenerOptions<BucketDragListener>>( {
      start: event => {

        const positionInModelSpace = localViewToModel( event.pointer.point );

        activeParticle = bucket.extractClosestParticle( positionInModelSpace );
        if ( activeParticle !== null ) {
          activeParticle.setPositionAndDestination( positionInModelSpace );
        }
      },

      drag: event => {
        if ( activeParticle !== null ) {
          activeParticle.setPositionAndDestination( localViewToModel( event.pointer.point ) );
        }
      },

      end: () => {
        if ( activeParticle !== null ) {
          activeParticle.userControlledProperty.set( false );
          activeParticle = null;
        }
      }
    }, options ) );
  }
}

shred.register( 'BucketDragListener', BucketDragListener );
export default BucketDragListener;