// Copyright 2014-2020, University of Colorado Boulder

/**
 * Node that represents the nucleon shells, aka straight horizontal lines above the buckets, in the view.
 *
 * @author John Blanco
 * @author Luisa Vargas
 */

import Property from '../../../axon/js/Property.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import KeyboardUtils from '../../../scenery/js/accessibility/KeyboardUtils.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Shape from '../../../kite/js/Shape.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';

// options for the focus highlight, these will be cycled through with the arrow keys
const FOCUS_HIGHLIGHTS = [ 'CENTER_OPTION', 'INNER_RING', 'OUTER_RING' ];

/**
 * @param {ParticleNucleus} atom
 * @param {ModelViewTransform2} modelViewTransform
 * @param {Object} [options]
 * @constructor
 */
function NucleonShellView( atom, modelViewTransform, options ) {
  const self = this;
  options = merge( {
      tandem: Tandem.REQUIRED
    },
    options
  );

  // Call super constructor.
  Node.call( this, {
    pickable: false,
    tandem: options.tandem,

    // pdom
    tagName: 'div',
    ariaRole: 'listbox',
    focusable: true
  } );

  // colors of the lines as each shell fills up to match the color of the nucleon
  self.protonColor = [
    'black', '#7a3100', '#FF6600',
    '#291000', '#522100', '#7a3100', '#ad4500', '#d45500', '#FF6600',
    '#1a0a00', '#301300' ];

  self.neutronColor = [
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
  selectValueProperty.lazyLink( function( newValue ) {
    switch( newValue ) {
      case ( FOCUS_HIGHLIGHTS[ 0 ] ):
        self.setFocusHighlight( electronOuterFocusHighlight );
        break;
      case ( FOCUS_HIGHLIGHTS[ 1 ] ):
        self.setFocusHighlight( electronInnerFocusHighlight );
        break;
      case ( FOCUS_HIGHLIGHTS[ 2 ] ):
        self.setFocusHighlight( nucleusFocusHighlight );
        break;
      default:
        throw new Error( 'You tried to set the selectValueProperty to an unsupported value.' );
    }
  } );

  // pdom - set the selectProperty when the arrow keys change the html select menu's value.
  const optionNodes = [ centerOption, this.lowerProton, this.middleProton, this.upperProton, this.lowerNeutron, this.middleNeutron, this.upperNeutron ];
  let currentIndex = 0;
  const keyListener = {
    keydown: function( event ) {
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
  optionNodes.forEach( function( node ) { self.addChild( node ); } );

  Property.multilink( [ atom.protonCountProperty ], function() {
    if ( atom.protonCountProperty.value <= 2 ) {
      self.lowerProton.stroke = self.protonColor[ atom.protonCountProperty.value ];
      self.middleProton.stroke = 'black';
      self.upperProton.stroke = 'black';
    }
    else if ( atom.protonCountProperty.value <= 8 ) {
      self.middleProton.stroke = self.protonColor[ atom.protonCountProperty.value ];
      self.upperProton.stroke = 'black';
    }
    else {
      self.upperProton.stroke = self.protonColor[ atom.protonCountProperty.value ];
    }
  } );

  Property.multilink( [ atom.neutronCountProperty ], function() {
    if ( atom.neutronCountProperty.value <= 2 ) {
      self.lowerNeutron.stroke = self.neutronColor[ atom.neutronCountProperty.value ];
      self.middleNeutron.stroke = 'black';
      self.upperNeutron.stroke = 'black';
    }
    else if ( atom.neutronCountProperty.value <= 8 ) {
      self.middleNeutron.stroke = self.neutronColor[ atom.neutronCountProperty.value ];
      self.upperNeutron.stroke = 'black';
    }
    else {
      self.upperNeutron.stroke = self.neutronColor[ atom.neutronCountProperty.value ];
    }
  } );

  // @private called by dispose
  this.disposeNucleonShellView = function() {
    self.removeInputListener( keyListener );
    self.lowerProton.dispose();
    self.middleProton.dispose();
    self.upperProton.dispose();
    self.lowerNeutron.dispose();
    self.middleNeutron.dispose();
    self.upperNeutron.dispose();
  };
}

shred.register( 'NucleonShellView', NucleonShellView );

// Inherit from Node.
inherit( Node, NucleonShellView, {

  dispose: function() {
    this.disposeNucleonShellView();

    Node.prototype.dispose.call( this );
  }
} );

export default NucleonShellView;