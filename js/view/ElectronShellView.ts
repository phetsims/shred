// Copyright 2014-2022, University of Colorado Boulder

/**
 * Node that represents the electron shells, aka "orbits", in the view.
 *
 * @author John Blanco
 */

import Vector2 from '../../../dot/js/Vector2.js';
import merge from '../../../phet-core/js/merge.js';
import { Circle, Node } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';

// constants
const LINE_DASH = [ 4, 5 ];

class ElectronShellView extends Node {

  /**
   * @param {ParticleAtom} atom
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( atom, modelViewTransform, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

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

    // @private called by dispose
    this.disposeElectronShellView = () => {
      outerRing.dispose();
      innerRing.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeElectronShellView();
    super.dispose();
  }
}

shred.register( 'ElectronShellView', ElectronShellView );
export default ElectronShellView;