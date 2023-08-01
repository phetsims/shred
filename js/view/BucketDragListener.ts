// Copyright 2015-2021, University of Colorado Boulder

/**
 * A drag listener specifically tailored for the particle buckets. This listener extracts a particle from a bucket and
 * manages it as though the user had clicked directly on the particle. This exists to make it easier for the users to
 * get particles out of the buckets when using a touch-based device.
 *
 * @author John Blanco
 */

import merge from '../../../phet-core/js/merge.js';
import { DragListener } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';

class BucketDragListener extends DragListener {

  /**
   * @param {Bucket} bucket
   * @param {BucketFront} bucketView
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @constructor
   */
  constructor( bucket, bucketView, modelViewTransform, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // closure for converting a point in local coordinate frame to model coordinates
    const localViewToModel = point => {

      // Note: The following transform works, but it is a bit obscure, and relies on the topology of the scene graph.
      // JB, SR, and JO discussed potentially better ways to do it but didn't come up with anything at the time. If
      // this code is leveraged, this transform should be revisited for potential improvement.
      return modelViewTransform.viewToModelPosition(
        bucketView.getParents()[ 0 ].globalToLocalPoint( point )
      );
    };

    let activeParticle = null;
    const inputListenerOptions = {
      tandem: options.tandem,
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
    };

    super( inputListenerOptions );
  }
}

shred.register( 'BucketDragListener', BucketDragListener );
export default BucketDragListener;