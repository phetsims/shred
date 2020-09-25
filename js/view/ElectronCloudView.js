// Copyright 2014-2020, University of Colorado Boulder

/**
 * Node that represents the electron shell in an atom as a "cloud" that grows and shrinks depending on the number of
 * electrons that it contains.  This has also been referred to as the "Schrodinger model" representation.
 *
 * @author John Blanco
 */

import merge from '../../../phet-core/js/merge.js';
import SimpleDragHandler from '../../../scenery/js/input/SimpleDragHandler.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import RadialGradient from '../../../scenery/js/util/RadialGradient.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';

// constants
const DEFAULT_RADIUS = 50; // in pm, chosen as an arbitrary value that is close to the "real" values that are used

class ElectronCloudView extends Circle {

  /**
   * @param {ParticleAtom} atom
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( atom, modelViewTransform, options ) {

    options = merge( { tandem: Tandem.REQUIRED }, options );

    super( DEFAULT_RADIUS, {
        cursor: 'pointer',
        fill: 'pink',
        translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } )
      }
    );

    // Function that updates the size of the cloud based on the number of electrons.
    const update = numElectrons => {
      if ( numElectrons === 0 ) {
        this.radius = 1E-5; // Arbitrary non-zero value.
        this.fill = 'transparent';
      }
      else {
        const minRadius = modelViewTransform.modelToViewDeltaX( atom.innerElectronShellRadius ) * 0.5;
        const maxRadius = modelViewTransform.modelToViewDeltaX( atom.outerElectronShellRadius );
        const radius = minRadius + ( ( maxRadius - minRadius ) / ShredConstants.MAX_ELECTRONS ) * numElectrons;
        this.radius = radius;
        this.fill = new RadialGradient( 0, 0, 0, 0, 0, radius )
          .addColorStop( 0, 'rgba( 0, 0, 255, 200 )' )
          .addColorStop( 0.9, 'rgba( 0, 0, 255, 0 )' );
      }
    };
    update( atom.electrons.length );

    // Update the cloud size as electrons come and go.
    atom.electrons.lengthProperty.link( update );

    // If the user clicks on the cloud, extract an electron.
    this.extractedElectron = null; // @private
    const simpleDragHandler = new SimpleDragHandler( {
      start: event => {

        // Note: The following transform works, but it is a bit obscure, and relies on the topology of the scene graph.
        // JB, SR, and JO discussed potentially better ways to do it. If this code is leveraged, revisit this line for
        // potential improvement.
        const positionInModelSpace = modelViewTransform.viewToModelPosition(
          this.getParents()[ 0 ].globalToLocalPoint( event.pointer.point )
        );

        const electron = atom.extractParticle( 'electron' );
        if ( electron !== null ) {
          electron.userControlledProperty.set( true );
          electron.setPositionAndDestination( positionInModelSpace );
          this.extractedElectron = electron;
        }
      },
      translate: translationParams => {
        if ( this.extractedElectron !== null ) {
          this.extractedElectron.setPositionAndDestination(
            this.extractedElectron.positionProperty.get().plus(
              modelViewTransform.viewToModelDelta( translationParams.delta ) ) );
        }
      },
      end: () => {
        if ( this.extractedElectron !== null ) {
          this.extractedElectron.userControlledProperty.set( false );
        }
      },
      tandem: options.tandem.createTandem( 'dragHandler' )
    } );
    this.addInputListener( simpleDragHandler );

    // @private called by dispose
    this.disposeElectronCloudView = () => {
      atom.electrons.lengthProperty.unlink( update );
      simpleDragHandler.dispose();
    };

    this.mutate( options );
  }

  // @public
  dispose() {
    this.disposeElectronCloudView();
    Circle.prototype.dispose.call( this );
  }
}

shred.register( 'ElectronCloudView', ElectronCloudView );
export default ElectronCloudView;