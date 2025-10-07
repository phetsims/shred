// Copyright 2014-2025, University of Colorado Boulder

/**
 * Node that represents the electron shells in the view.
 *
 * @author John Blanco
 */

import Vector2 from '../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import ParticleAtom from '../model/ParticleAtom.js';
import shred from '../shred.js';

// constants
const LINE_DASH = [ 4, 5 ];

class ElectronShellView extends Node {
  private readonly disposeElectronShellView: VoidFunction;

  public constructor( atom: ParticleAtom, modelViewTransform: ModelViewTransform2, providedOptions?: NodeOptions ) {

    const options = optionize<NodeOptions, EmptySelfOptions, NodeOptions>()( {
      pickable: false
    }, providedOptions );

    super( options );

    const outerRing = new Circle( modelViewTransform.modelToViewDeltaX( atom.outerElectronShellRadius ), {
      stroke: 'blue',
      lineWidth: 1.5,
      lineDash: LINE_DASH,
      translation: modelViewTransform.modelToViewPosition( Vector2.ZERO ),
      pickable: false
    } );
    this.addChild( outerRing );

    const innerRing = new Circle( modelViewTransform.modelToViewDeltaX( atom.innerElectronShellRadius ), {
      stroke: 'blue',
      lineWidth: 1.5,
      lineDash: LINE_DASH,
      translation: modelViewTransform.modelToViewPosition( Vector2.ZERO ),
      pickable: false
    } );
    this.addChild( innerRing );

    this.disposeElectronShellView = () => {
      outerRing.dispose();
      innerRing.dispose();
    };
  }

  public override dispose(): void {
    this.disposeElectronShellView();
    super.dispose();
  }
}

shred.register( 'ElectronShellView', ElectronShellView );
export default ElectronShellView;