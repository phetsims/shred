// Copyright 2014-2023, University of Colorado Boulder

/**
 * Node that represents the electron shells, aka "orbits", in the view.
 *
 * @author John Blanco
 */

import Vector2 from '../../../dot/js/Vector2.js';
import { Circle, Node, NodeOptions } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';
import ParticleAtom from '../model/ParticleAtom.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';

// constants
const LINE_DASH = [ 4, 5 ];

class ElectronShellView extends Node {
  private readonly disposeElectronShellView: () => void;

  public constructor( atom: ParticleAtom, modelViewTransform: ModelViewTransform2, providedOptions?: NodeOptions ) {
    const options = optionize<NodeOptions, EmptySelfOptions, NodeOptions>()( {
      tandem: Tandem.REQUIRED

    }, providedOptions );

    super( {
      pickable: false,

      // phet-io
      tandem: options.tandem,

      // pdom
      tagName: 'div',
      ariaRole: 'listbox',
      focusable: true
    } );

    const outerRing = new Circle( modelViewTransform.modelToViewDeltaX( atom.outerElectronShellRadius ), {
      stroke: 'blue',
      lineWidth: 1.5,
      lineDash: LINE_DASH,
      translation: modelViewTransform.modelToViewPosition( Vector2.ZERO ),
      pickable: false,
      tandem: options.tandem.createTandem( 'outerRing' ),

      // pdom
      tagName: 'div',
      ariaRole: 'option',
      innerContent: 'Outer Electron Ring'
    } );
    this.addChild( outerRing );

    const innerRing = new Circle( modelViewTransform.modelToViewDeltaX( atom.innerElectronShellRadius ), {
      stroke: 'blue',
      lineWidth: 1.5,
      lineDash: LINE_DASH,
      translation: modelViewTransform.modelToViewPosition( Vector2.ZERO ),
      pickable: false,
      tandem: options.tandem.createTandem( 'innerRing' ),

      //a11y
      tagName: 'div',
      ariaRole: 'option',
      innerContent: 'Inner Electron Ring'
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