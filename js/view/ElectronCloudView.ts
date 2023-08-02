// Copyright 2014-2023, University of Colorado Boulder

/**
 * Node that represents the electron shell in an atom as a "cloud" that grows and shrinks depending on the number of
 * electrons that it contains.  This has also been referred to as the "Schrodinger model" representation.
 *
 * @author John Blanco
 */

import { Circle, CircleOptions, DragListener, RadialGradient } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';
import ParticleAtom from '../model/ParticleAtom.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Particle from '../model/Particle.js';

// constants
const DEFAULT_RADIUS = 50; // in pm, chosen as an arbitrary value that is close to the "real" values that are used
type ElectronCloudViewOptions = CircleOptions;

class ElectronCloudView extends Circle {
  private extractedElectron: Particle | null;
  private readonly disposeElectronCloudView: VoidFunction;


  public constructor( atom: ParticleAtom, modelViewTransform: ModelViewTransform2, providedOptions?: ElectronCloudViewOptions ) {
    const options = optionize<ElectronCloudViewOptions, EmptySelfOptions, CircleOptions>()( {
      cursor: 'pointer',
      fill: 'pink',
      tandem: Tandem.REQUIRED
    }, providedOptions );

    assert && assert( options.translation === undefined, 'ElectronCloudView sets translation' );
    options.translation = modelViewTransform.modelToViewPosition( Vector2.ZERO );

    super( DEFAULT_RADIUS, options );

    // Function that updates the size of the cloud based on the number of electrons.
    const update = ( numElectrons: number ) => {
      if ( numElectrons === 0 ) {
        this.radius = 1E-5; // arbitrary non-zero value
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

    // closure for converting a point in local coordinate frame to model coordinates
    const localViewToModel = ( point: Vector2 ) => {

      // Note: The following transform works, but it is a bit obscure, and relies on the topology of the scene graph.
      // JB, SR, and JO discussed potentially better ways to do it but didn't come up with anything at the time. If
      // this code is leveraged, this transform should be revisited for potential improvement.
      return modelViewTransform.viewToModelPosition(
        this.getParents()[ 0 ].globalToLocalPoint( point )
      );
    };

    // If the user clicks on the cloud, extract an electron.
    this.extractedElectron = null;
    const dragListener = new DragListener( {
      start: event => {

        const positionInModelSpace = localViewToModel( event.pointer.point );

        const electron = atom.extractParticle( 'electron' );
        if ( electron !== null ) {
          electron.userControlledProperty.set( true );
          electron.setPositionAndDestination( positionInModelSpace );
          this.extractedElectron = electron;
        }
      },
      drag: event => {
        if ( this.extractedElectron !== null ) {
          this.extractedElectron.setPositionAndDestination( localViewToModel( event.pointer.point ) );
        }
      },
      end: () => {
        if ( this.extractedElectron !== null ) {
          this.extractedElectron.userControlledProperty.set( false );
          this.extractedElectron = null;
        }
      },
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    this.disposeElectronCloudView = () => {
      atom.electrons.lengthProperty.unlink( update );
      dragListener.dispose();
    };
  }

  public override dispose(): void {
    this.disposeElectronCloudView();
    super.dispose();
  }
}

shred.register( 'ElectronCloudView', ElectronCloudView );
export default ElectronCloudView;