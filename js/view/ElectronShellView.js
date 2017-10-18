// Copyright 2014-2015, University of Colorado Boulder

/**
 * Node that represents the electron shells, aka "orbits", in the view.
 *
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Input = require( 'SCENERY/input/Input' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var shred = require( 'SHRED/shred' );
  var Tandem = require( 'TANDEM/Tandem' );

  // constants
  var LINE_DASH = [ 4, 5 ];

  /**
   * @param {ParticleAtom} atom
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} options
   * @constructor
   */
  function ElectronShellView( atom, modelViewTransform, options ) {
    var self = this;
    options = _.extend( {
        tandem: Tandem.tandemRequired()
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

    var outerRing = new Circle( modelViewTransform.modelToViewDeltaX( atom.outerElectronShellRadius ), {
      stroke: 'blue',
      lineWidth: 1.5,
      lineDash: LINE_DASH,
      translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } ),
      pickable: false,
      tandem: options.tandem.createTandem( 'outerRing' ),

      // a11y
      tagName: 'div',
      ariaRole: 'option',
      accessibleLabel: 'Outer Electron Ring'
    } );

    var innerRing = new Circle( modelViewTransform.modelToViewDeltaX( atom.innerElectronShellRadius ), {
      stroke: 'blue',
      lineWidth: 1.5,
      lineDash: LINE_DASH,
      translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } ),
      pickable: false,
      tandem: options.tandem.createTandem( 'innerRing' ),

      //a11y
      tagName: 'div',
      ariaRole: 'option',
      accessibleLabel: 'Inner Electron Ring'
    } );

    // a11y - an invisible node that allows the nucleus to be highlighted.
    var centerOption = new Node( {

      // a11y
      tagName: 'div',
      ariaRole: 'option',
      accessibleLabel: 'Nucleus'
    } );

    // a11y - to focus around the actual nucleus, will change in size when the particles in the nucleus change
    var nucleusFocusHighlight = new Circle( atom.nucleusRadius, {
      lineWidth: 2,
      stroke: 'red',
      translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } )
    } );

    // a11y - to focus around the outer shell
    var electronOuterFocusHighlight = new Circle( atom.outerElectronShellRadius, {
      lineWidth: 2,
      stroke: 'red',
      translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } )
    } );

    // a11y - to focus around the inner shell
    var electronInnerFocusHighlight = new Circle( atom.innerElectronShellRadius, {
      lineWidth: 2,
      stroke: 'red',
      translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } )
    } );

    var selectValueProperty = new Property( 'none' );

    // Link the property's value to change the focus highlight outlining the different particle placement possibilities.
    selectValueProperty.lazyLink( function( newValue ) {
      switch( newValue ) {
        case ( centerOption.accessibleId ):
          self.setFocusHighlight( electronOuterFocusHighlight );
          break;
        case ( innerRing.accessibleId ):
          self.setFocusHighlight( electronInnerFocusHighlight );
          break;
        case ( outerRing.accessibleId ):
          self.setFocusHighlight( nucleusFocusHighlight );
          break;
        default:
          throw new Error( 'You tried to set the selectValueProperty to an unsupported value.' );
      }
    } );

    // a11y - set the selectProperty when the arrow keys change the html select menu's value.
    var optionNodes = [ centerOption, innerRing, outerRing ];
    var currentIndex = 0;
    this.addAccessibleInputListener( {
      keydown: function( event ) {
        if ( event.keyCode === Input.KEY_DOWN_ARROW || event.keyCode === Input.KEY_RIGHT_ARROW ) {
          currentIndex = ( currentIndex + 1 ) % optionNodes.length;
        }
        else if ( event.keyCode === Input.KEY_UP_ARROW || event.keyCode === Input.KEY_LEFT_ARROW ) {
          currentIndex = currentIndex - 1;
          if ( currentIndex < 0 ) { currentIndex = optionNodes.length - 1; }
        }

        var nextElementId = optionNodes[ currentIndex ].accessibleId;
        self.setAccessibleAttribute( 'aria-activedescendant', nextElementId );
        selectValueProperty.set( nextElementId );
      }
    } );

    // add each node to the view
    optionNodes.forEach( function( node ) { self.addChild( node ); } );

    // whenever a nucleon is added or removed, change the highlight radius
    Property.multilink( [ atom.protonCountProperty, atom.neutronCountProperty ], function( protonCount, neutronCount ) {

      // TODO: Is there another way to link to the changing nucleus configuration
      atom.reconfigureNucleus();
      var radiusOffset = atom.nucleusRadius === 0 ? 0 : 4;
      nucleusFocusHighlight.radius = atom.nucleusRadius + radiusOffset;
    } );

    // @private called by dispose
    this.disposeElectronShellView = function() {
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
