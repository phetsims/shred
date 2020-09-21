// Copyright 2015-2020, University of Colorado Boulder

/**
 * A drag listener specifically tailored for the particle buckets. This listener extracts a particle from a bucket and
 * manages it as though the user had clicked directly on the particle. This exists to make it easier for the users to
 * get particles out of the buckets when using a touch-based device.
 *
 * @author John Blanco
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import DragListener from '../../../scenery/js/listeners/DragListener.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';

/**
 * @param {Bucket} bucket
 * @param {BucketFront} bucketView
 * @param {ModelViewTransform2} modelViewTransform
 * @param {Object} [options]
 * @constructor
 */
function BucketDragListener( bucket, bucketView, modelViewTransform, options ) {
  options = merge( {
    tandem: Tandem.REQUIRED
  }, options );

  let activeParticle = null;

  const dragListenerOptions = {
    start: function( event, trail ) {
      // Note: The following transform works, but it is a bit obscure, and relies on the topology of the scene graph.
      // JB, SR, and JO discussed potentially better ways to do it. If this code is leveraged, revisit this line for
      // potential improvement.
      const positionInModelSpace = modelViewTransform.viewToModelPosition(
        bucketView.getParents()[ 0 ].globalToLocalPoint( event.pointer.point )
      );

      activeParticle = bucket.extractClosestParticle( positionInModelSpace );
      if ( activeParticle !== null ) {
        activeParticle.setPositionAndDestination( positionInModelSpace );
      }
    },
    translate: function( translationParams ) {
      if ( activeParticle !== null ) {
        activeParticle.setPositionAndDestination( activeParticle.positionProperty.get().plus(
          modelViewTransform.viewToModelDelta( translationParams.delta ) ) );
      }
    },
    end: function( event ) {
      if ( activeParticle !== null ) {
        activeParticle.userControlledProperty.set( false );
      }
    },
    tandem: options.tandem
  };

  DragListener.call( this, dragListenerOptions );
}

shred.register( 'BucketDragListener', BucketDragListener );
inherit( DragListener, BucketDragListener );
export default BucketDragListener;