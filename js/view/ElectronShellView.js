// Copyright 2014-2020, University of Colorado Boulder

/**
 * Node that represents the electron shells, aka "orbits", in the view.
 *
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import merge from '../../../phet-core/js/merge.js';
import KeyboardUtils from '../../../scenery/js/accessibility/KeyboardUtils.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';

// constants
const LINE_DASH = [ 4, 5 ];

// options for the focus highlight, these will be cycled through with the arrow keys
const FOCUS_HIGHLIGHTS = [ 'CENTER_OPTION', 'INNER_RING', 'OUTER_RING' ];

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
      translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } ),
      pickable: false,
      tandem: options.tandem.createTandem( 'outerRing' ),

      // pdom
      tagName: 'div',
      ariaRole: 'option',
      innerContent: 'Outer Electron Ring'
    } );

    const innerRing = new Circle( modelViewTransform.modelToViewDeltaX( atom.innerElectronShellRadius ), {
      stroke: 'blue',
      lineWidth: 1.5,
      lineDash: LINE_DASH,
      translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } ),
      pickable: false,
      tandem: options.tandem.createTandem( 'innerRing' ),

      //a11y
      tagName: 'div',
      ariaRole: 'option',
      innerContent: 'Inner Electron Ring'
    } );

    // pdom - an invisible node that allows the nucleus to be highlighted.
    const centerOption = new Node( {

      // pdom
      tagName: 'div',
      ariaRole: 'option',
      innerContent: 'Nucleus'
    } );

    // pdom - to focus around the actual nucleus, will change in size when the particles in the nucleus change
    const nucleusFocusHighlight = new Circle( atom.nucleusRadius, {
      lineWidth: 2,
      stroke: 'red',
      translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } )
    } );

    // pdom - to focus around the outer shell
    const electronOuterFocusHighlight = new Circle( atom.outerElectronShellRadius, {
      lineWidth: 2,
      stroke: 'red',
      translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } )
    } );

    // pdom - to focus around the inner shell
    const electronInnerFocusHighlight = new Circle( atom.innerElectronShellRadius, {
      lineWidth: 2,
      stroke: 'red',
      translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } )
    } );

    const selectValueProperty = new Property( 'none' );

    // Link the property's value to change the focus highlight outlining the different particle placement possibilities.
    selectValueProperty.lazyLink( newValue => {
      switch( newValue ) {
        case ( FOCUS_HIGHLIGHTS[ 0 ] ):
          this.setFocusHighlight( electronOuterFocusHighlight );
          break;
        case ( FOCUS_HIGHLIGHTS[ 1 ] ):
          this.setFocusHighlight( electronInnerFocusHighlight );
          break;
        case ( FOCUS_HIGHLIGHTS[ 2 ] ):
          this.setFocusHighlight( nucleusFocusHighlight );
          break;
        default:
          throw new Error( 'You tried to set the selectValueProperty to an unsupported value.' );
      }
    } );

    // pdom - set the selectProperty when the arrow keys change the html select menu's value.
    const optionNodes = [ centerOption, innerRing, outerRing ];
    let currentIndex = 0;
    const keyListener = {
      keydown: event => {
        const domEvent = event.domEvent;

        if ( domEvent.keyCode === KeyboardUtils.KEY_DOWN_ARROW || domEvent.keyCode === KeyboardUtils.KEY_RIGHT_ARROW ) {
          currentIndex = ( currentIndex + 1 ) % optionNodes.length;
        }
        else if ( domEvent.keyCode === KeyboardUtils.KEY_UP_ARROW || domEvent.keyCode === KeyboardUtils.KEY_LEFT_ARROW ) {
          currentIndex = currentIndex - 1;
          if ( currentIndex < 0 ) { currentIndex = optionNodes.length - 1; }
        }

        // TODO: The requested design for a11y was to use the aria-activedescendant attribute to update the
        // active node without changing focus. As of this writing, that isn't supported by scenery, but may be in the
        // future.  When it is, this should be updated.  See https://github.com/phetsims/shred/issues/26.
        // this.setAccessibleAttribute( 'aria-activedescendant', nextElementId );
        const nextElementId = FOCUS_HIGHLIGHTS[ currentIndex ];
        selectValueProperty.set( nextElementId );
      }
    };
    this.addInputListener( keyListener );

    // add each node to the view
    optionNodes.forEach( node => this.addChild( node ) );

    // whenever a nucleon is added or removed, update the configuration of the nucleus and the highlight radius
    Property.multilink( [ atom.protonCountProperty, atom.neutronCountProperty ], () => {
      atom.reconfigureNucleus();
      const radiusOffset = atom.nucleusRadius === 0 ? 0 : 4;
      nucleusFocusHighlight.radius = atom.nucleusRadius + radiusOffset;
    } );

    // @private called by dispose
    this.disposeElectronShellView = () => {
      this.removeInputListener( keyListener );
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