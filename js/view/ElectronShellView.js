// Copyright 2014-2019, University of Colorado Boulder

/**
 * Node that represents the electron shells, aka "orbits", in the view.
 *
 * @author John Blanco
 */

define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const inherit = require( 'PHET_CORE/inherit' );
  const KeyboardUtils = require( 'SCENERY/accessibility/KeyboardUtils' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const shred = require( 'SHRED/shred' );
  const Tandem = require( 'TANDEM/Tandem' );

  // constants
  const LINE_DASH = [ 4, 5 ];

  // options for the focus highlight, these will be cycled through with the arrow keys
  const FOCUS_HIGHLIGHTS = [ 'CENTER_OPTION', 'INNER_RING', 'OUTER_RING' ];

  /**
   * @param {ParticleAtom} atom
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} options
   * @constructor
   */
  function ElectronShellView( atom, modelViewTransform, options ) {
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

      // a11y
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

      // a11y
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

    // a11y - an invisible node that allows the nucleus to be highlighted.
    const centerOption = new Node( {

      // a11y
      tagName: 'div',
      ariaRole: 'option',
      innerContent: 'Nucleus'
    } );

    // a11y - to focus around the actual nucleus, will change in size when the particles in the nucleus change
    const nucleusFocusHighlight = new Circle( atom.nucleusRadius, {
      lineWidth: 2,
      stroke: 'red',
      translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } )
    } );

    // a11y - to focus around the outer shell
    const electronOuterFocusHighlight = new Circle( atom.outerElectronShellRadius, {
      lineWidth: 2,
      stroke: 'red',
      translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } )
    } );

    // a11y - to focus around the inner shell
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

    // a11y - set the selectProperty when the arrow keys change the html select menu's value.
    const optionNodes = [ centerOption, innerRing, outerRing ];
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
        // active node without changing focus. That currently isn't supported by scenery, but may be in the future.
        // See https://github.com/phetsims/build-an-atom/issues/194 and
        // https://github.com/phetsims/scenery/issues/873
        // self.setAccessibleAttribute( 'aria-activedescendant', nextElementId );
        const nextElementId = FOCUS_HIGHLIGHTS[ currentIndex ];
        selectValueProperty.set( nextElementId );
      }
    };
    this.addInputListener( keyListener );

    // add each node to the view
    optionNodes.forEach( function( node ) { self.addChild( node ); } );

    // whenever a nucleon is added or removed, update the configuration of the nucleus and the highlight radius
    Property.multilink( [ atom.protonCountProperty, atom.neutronCountProperty ], function() {
      atom.reconfigureNucleus();
      const radiusOffset = atom.nucleusRadius === 0 ? 0 : 4;
      nucleusFocusHighlight.radius = atom.nucleusRadius + radiusOffset;
    } );

    // @private called by dispose
    this.disposeElectronShellView = function() {
      self.removeInputListener( keyListener );
      outerRing.dispose();
      innerRing.dispose();
    };
  }

  shred.register( 'ElectronShellView', ElectronShellView );

  // Inherit from Node.
  return inherit( Node, ElectronShellView, {

    dispose: function() {
      this.disposeElectronShellView();

      Node.prototype.dispose.call( this );
    }
  } );
} );
