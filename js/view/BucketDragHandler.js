// Copyright 2015, University of Colorado Boulder

/**
 * A drag handler specifically tailored for the particle buckets. This handler extracts a particle from a bucket and
 * manages it as though the user had clicked directly on the particle. This exists to make it easier for the users to
 * get particles out of the buckets when using a touch-based device.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var shred = require( 'SHRED/shred' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Bucket} bucket
   * @param {BucketFront} bucketView
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} options
   * @constructor
   */
  function BucketDragHandler( bucket, bucketView, modelViewTransform, options ) {
    options = _.extend( {
      tandem: Tandem.tandemRequired()
    }, options );

    var activeParticle = null;
    var inputListenerOptions = {
      tandem: options.tandem,
      start: function( event, trail ) {
        // Note: The following transform works, but it is a bit obscure, and relies on the topology of the scene graph.
        // JB, SR, and JO discussed potentially better ways to do it. If this code is leveraged, revisit this line for
        // potential improvement.
        var positionInModelSpace = modelViewTransform.viewToModelPosition(
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
      }
    };
    SimpleDragHandler.call( this, inputListenerOptions ); // Call super constructor.
  }

  // Inherit from base class.
  shred.register( 'BucketDragHandler', BucketDragHandler );
  return inherit( SimpleDragHandler, BucketDragHandler );
} );
