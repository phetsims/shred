// Copyright 2014-2015, University of Colorado Boulder

/**
 * Node that represents the electron shells, aka "orbits", in the view.
 *
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var shred = require( 'SHRED/shred' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );

  // constants
  var LINE_DASH = [ 4, 5 ];

  // Must be strings because html attributes are strings?
  var PARTICLE_PLACEMENTS = {
    CENTER: '0',
    INNER: '1',
    OUTER: '2'
  };

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
      tagName: 'select',
      prependLabel: true,
      accessibleLabel: 'Particle Placement Options'
    } );
    this.setAccessibleAttribute( 'style', 'visibility: none;' );

    var outerRing = new Circle( modelViewTransform.modelToViewDeltaX( atom.outerElectronShellRadius ), {
      stroke: 'blue',
      lineWidth: 1.5,
      lineDash: LINE_DASH,
      translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } ),
      pickable: false,
      tandem: options.tandem.createTandem( 'outerRing' ),

      // a11y
      tagName: 'option',
      accessibleLabel: 'Outer Electron Ring'
    } );
    outerRing.setAccessibleAttribute( 'value', PARTICLE_PLACEMENTS.OUTER );
    this.addChild( outerRing );

    var innerRing = new Circle( modelViewTransform.modelToViewDeltaX( atom.innerElectronShellRadius ), {
      stroke: 'blue',
      lineWidth: 1.5,
      lineDash: LINE_DASH,
      translation: modelViewTransform.modelToViewPosition( { x: 0, y: 0 } ),
      pickable: false,
      tandem: options.tandem.createTandem( 'innerRing' ),

      //a11y
      tagName: 'option',
      accessibleLabel: 'Inner Electron Ring'
    } );
    innerRing.setAccessibleAttribute( 'value', PARTICLE_PLACEMENTS.INNER );
    this.addChild( innerRing );

    // a11y - an invisible node that allows the nucleus to be highlighted.
    var centerOption = new Node( {

      // a11y
      tagName: 'option',
      accessibleLabel: 'Nucleus'
    } );
    centerOption.setAccessibleAttribute( 'value', PARTICLE_PLACEMENTS.CENTER );
    this.addChild( centerOption );


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
        case (PARTICLE_PLACEMENTS.OUTER):
          self.setFocusHighlight( electronOuterFocusHighlight );
          break;
        case (PARTICLE_PLACEMENTS.INNER):
          self.setFocusHighlight( electronInnerFocusHighlight );
          break;
        case (PARTICLE_PLACEMENTS.CENTER):
          self.setFocusHighlight( nucleusFocusHighlight );
          break;
        default:
          throw new Error( 'You tried to set the selectValueProperty to an unsupported value.' );
      }
    } );

    // a11y - set the selectProperty when the arrow keys change the html select menu's value.
    this.addAccessibleInputListener( {
      input: function() {
        selectValueProperty.set( self.inputValue );
      }
    } );


    // whenever a nucleon is added or removed, change the highlight radius
    Property.multilink( [ atom.protonCountProperty, atom.neutronCountProperty ], function( protonCount, neutronCount ) {

      // TODO: Is there another way to link to the changing nucleus configuration
      atom.reconfigureNucleus();
      var radiusOffset = atom.nucleusRadius === 0 ? 0 : 4;
      nucleusFocusHighlight.radius = atom.nucleusRadius + radiusOffset;
    } );
  }

  shred.register( 'ElectronShellView', ElectronShellView );

  // Inherit from Node.
  return inherit( Node, ElectronShellView );
} );
