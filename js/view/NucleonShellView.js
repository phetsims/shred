// Copyright 2021, University of Colorado Boulder

/**
 * Node that represents the nucleon shells, aka straight horizontal lines above the buckets, in the view.
 *
 * @author John Blanco
 * @author Luisa Vargas
 */

import Property from '../../../axon/js/Property.js';
import Shape from '../../../kite/js/Shape.js';
import merge from '../../../phet-core/js/merge.js';
import KeyboardUtils from '../../../scenery/js/accessibility/KeyboardUtils.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';

// options for the focus highlight, these will be cycled through with the arrow keys
const FOCUS_HIGHLIGHTS = [ 'CENTER_OPTION', 'INNER_RING', 'OUTER_RING' ];

class NucleonShellView extends Node {
  /**
   * @param {ParticleNucleus} atom
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( atom, modelViewTransform, options ) {
    options = merge( {
        tandem: Tandem.REQUIRED
      },
      options
    );

    // Call super constructor.
    super( {
      pickable: false,
      tandem: options.tandem,

      // pdom
      tagName: 'div',
      ariaRole: 'listbox',
      focusable: true
    } );

    // colors of the lines as each shell fills up to match the color of the nucleon
    this.protonColor = [
      'black', '#7a3100', '#FF6600',
      '#291000', '#522100', '#7a3100', '#ad4500', '#d45500', '#FF6600',
      '#1a0a00', '#301300' ];

    this.neutronColor = [
      'black', '#575757', '#ababab',
      '#1a1919', '#3b3a3a', '#575757', '#7d7c7c', '#8c8b8b', '#ababab',
      '#121212', '#242323', '#333232', '#454444'
    ];

    const lowerProtonShape = new Shape();
    lowerProtonShape.moveTo( 70, 330 );
    lowerProtonShape.lineTo( 121, 330 );
    this.lowerProton = new Path( lowerProtonShape, {
      stroke: 'black',
      lineWidth: 3,
      pickable: false,
      tandem: options.tandem.createTandem( 'lowerProton' ),

      // pdom
      tagName: 'div',
      ariaRole: 'option',
      innerContent: 'Lower Proton Energy Level'
    } );

    const middleProtonShape = new Shape();
    middleProtonShape.moveTo( 27.5, 250 );
    middleProtonShape.lineTo( 162.5, 250 );
    this.middleProton = new Path( middleProtonShape, {
      stroke: 'black',
      lineWidth: 3,
      pickable: false,
      tandem: options.tandem.createTandem( 'middleProton' ),

      // pdom
      tagName: 'div',
      ariaRole: 'option',
      innerContent: 'Middle Proton Energy Level'
    } );

    const upperProtonShape = new Shape();
    upperProtonShape.moveTo( 27.5, 170 );
    upperProtonShape.lineTo( 162.5, 170 );
    this.upperProton = new Path( upperProtonShape, {
      stroke: 'black',
      lineWidth: 3,
      pickable: false,
      tandem: options.tandem.createTandem( 'upperProton' ),

      // pdom
      tagName: 'div',
      ariaRole: 'option',
      innerContent: 'Upper Proton Energy Level'
    } );

    const lowerNeutronShape = new Shape();
    lowerNeutronShape.moveTo( 240, 330 );
    lowerNeutronShape.lineTo( 291, 330 );
    this.lowerNeutron = new Path( lowerNeutronShape, {
      stroke: 'black',
      lineWidth: 3,
      pickable: false,
      tandem: options.tandem.createTandem( 'lowerNeutron' ),

      // pdom
      tagName: 'div',
      ariaRole: 'option',
      innerContent: 'Lower Neutron Energy Level'
    } );

    const middleNeutronShape = new Shape();
    middleNeutronShape.moveTo( 197.5, 250 );
    middleNeutronShape.lineTo( 332.5, 250 );
    this.middleNeutron = new Path( middleNeutronShape, {
      stroke: 'black',
      lineWidth: 3,
      pickable: false,
      tandem: options.tandem.createTandem( 'middleNeutron' ),

      // pdom
      tagName: 'div',
      ariaRole: 'option',
      innerContent: 'Middle Neutron Energy Level'
    } );

    const upperNeutronShape = new Shape();
    upperNeutronShape.moveTo( 197.5, 170 );
    upperNeutronShape.lineTo( 332.5, 170 );
    this.upperNeutron = new Path( upperNeutronShape, {
      stroke: 'black',
      lineWidth: 3,
      pickable: false,
      tandem: options.tandem.createTandem( 'upperNeutron' ),

      // pdom
      tagName: 'div',
      ariaRole: 'option',
      innerContent: 'Upper Neutron Energy Level'
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
    const optionNodes = [ centerOption, this.lowerProton, this.middleProton, this.upperProton, this.lowerNeutron, this.middleNeutron, this.upperNeutron ];
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
        // self.setAccessibleAttribute( 'aria-activedescendant', nextElementId );
        const nextElementId = FOCUS_HIGHLIGHTS[ currentIndex ];
        selectValueProperty.set( nextElementId );
      }
    };
    this.addInputListener( keyListener );

    // add each node to the view
    optionNodes.forEach( node => { this.addChild( node ); } );

    Property.multilink( [ atom.protonCountProperty ], () => {
      if ( atom.protonCountProperty.value <= 2 ) {
        this.lowerProton.stroke = this.protonColor[ atom.protonCountProperty.value ];
        this.middleProton.stroke = 'black';
        this.upperProton.stroke = 'black';
      }
      else if ( atom.protonCountProperty.value <= 8 ) {
        this.middleProton.stroke = this.protonColor[ atom.protonCountProperty.value ];
        this.upperProton.stroke = 'black';
      }
      else {
        this.upperProton.stroke = this.protonColor[ atom.protonCountProperty.value ];
      }
    } );

    Property.multilink( [ atom.neutronCountProperty ], () => {
      if ( atom.neutronCountProperty.value <= 2 ) {
        this.lowerNeutron.stroke = this.neutronColor[ atom.neutronCountProperty.value ];
        this.middleNeutron.stroke = 'black';
        this.upperNeutron.stroke = 'black';
      }
      else if ( atom.neutronCountProperty.value <= 8 ) {
        this.middleNeutron.stroke = this.neutronColor[ atom.neutronCountProperty.value ];
        this.upperNeutron.stroke = 'black';
      }
      else {
        this.upperNeutron.stroke = this.neutronColor[ atom.neutronCountProperty.value ];
      }
    } );

    // @private called by dispose
    this.disposeNucleonShellView = () => {
      this.removeInputListener( keyListener );
      this.lowerProton.dispose();
      this.middleProton.dispose();
      this.upperProton.dispose();
      this.lowerNeutron.dispose();
      this.middleNeutron.dispose();
      this.upperNeutron.dispose();
    };
  }

  /**
   * @public
   */
  dispose() {
    this.disposeNucleonShellView();

    super.dispose();
  }
}

shred.register( 'NucleonShellView', NucleonShellView );

// Inherit from Node.
export default NucleonShellView;