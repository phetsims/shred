// Copyright 2014-2015, University of Colorado Boulder

/**
 * A node that presents a graphical representation of an atom's configuration. It looks somewhat like a bar graph that
 * grows to the right except that the "bars" are actually lines of particles.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var ParticleNode = require( 'SHRED/view/ParticleNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ShredConstants = require( 'SHRED/ShredConstants' );
  var shred = require( 'SHRED/shred' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Tandem = require( 'TANDEM/Tandem' );

  // strings
  var protonsColonString = require( 'string!SHRED/protonsColon' );
  var neutronsColonString = require( 'string!SHRED/neutronsColon' );
  var electronsColonString = require( 'string!SHRED/electronsColon' );

  // constants
  var TITLE_MAX_WIDTH_PROPORTION = 1 / 3;
  var MIN_VERTICAL_SPACING = 16; // Empirically Determined

  /**
   * @param {NumberAtom} numberAtom Model representation of the atom
   * @param {number} maxParticles The maximum number of particles to display
   * @param {number} maxWidth The maximum width that this display should reach
   * @param {Object} [options]
   * @constructor
   */
  function ParticleCountDisplay( numberAtom, maxParticles, maxWidth, options ) {

    options = _.extend( {
      fill: ShredConstants.DISPLAY_PANEL_BACKGROUND_COLOR,
      cornerRadius: 5,
      pickable: false,
      tandem: Tandem.createDefaultTandem( 'particleCountDisplay' )
    }, options );

    var panelContents = new Node();

    var labelOptions = { font: new PhetFont( 12 ) };
    var protonTitle = new Text( protonsColonString, labelOptions );
    panelContents.addChild( protonTitle );
    var neutronTitle = new Text( neutronsColonString, labelOptions );
    panelContents.addChild( neutronTitle );
    var electronTitle = new Text( electronsColonString, labelOptions );
    panelContents.addChild( electronTitle );

    // Scale the title if more than allowed proportion width
    var maxAllowableLabelWidth = maxWidth * TITLE_MAX_WIDTH_PROPORTION;
    protonTitle.maxWidth = maxAllowableLabelWidth;
    electronTitle.maxWidth = maxAllowableLabelWidth;
    neutronTitle.maxWidth = maxAllowableLabelWidth;

    // Lay out the labels.
    var maxLabelWidth = Math.max( Math.max( protonTitle.width, neutronTitle.width ), electronTitle.width );
    protonTitle.right = maxLabelWidth;
    protonTitle.top = 0;
    neutronTitle.right = maxLabelWidth;
    neutronTitle.bottom = protonTitle.bottom + Math.max( neutronTitle.height, MIN_VERTICAL_SPACING );
    electronTitle.right = maxLabelWidth;
    electronTitle.bottom = neutronTitle.bottom + Math.max( electronTitle.height, MIN_VERTICAL_SPACING );

    // Figure out the sizes of the particles and the inter-particle
    // spacing based on the max width.
    var totalParticleSpace = maxWidth - protonTitle.right - 10;
    var nucleonRadius = totalParticleSpace / ( (maxParticles * 2) + ( maxParticles - 1) + 2);
    var electronRadius = nucleonRadius * 0.6; // Arbitrarily chosen.
    var interParticleSpacing = nucleonRadius * 3;

    // Add an invisible spacer that will keep the control panel at a min width.
    var spacer = new Rectangle( maxLabelWidth, 0, interParticleSpacing * 3, 1 );

    // Add the layer where the particles will live.
    var particleLayer = new Node( { children: [ spacer ] } );
    panelContents.addChild( particleLayer );

    // stored ParticleNode instances that are positioned correctly, so we just have to add/remove the
    // changed ones (faster than full rebuild)
    var protons = [];
    var neutrons = [];
    var electrons = [];

    // counts of the displayed number of particles
    var protonDisplayCount = 0;
    var neutronDisplayCount = 0;
    var electronDisplayCount = 0;

    // increase the particle count by 1, and return the currently displayed quantity array should be
    // protons, neutrons, or electrons
    function incrementParticle( array, currentQuantity, particleType, radius, startX, startY ) {
      var newIndex = currentQuantity;
      if ( newIndex === array.length ) {
        // we need to create a new particle
        array.push( new ParticleNode( particleType, radius, {
          x: startX + newIndex * interParticleSpacing,
          y: startY
        } ) );
      }
      particleLayer.addChild( array[ newIndex ] );
      currentQuantity += 1;
      return currentQuantity;
    }

    // decrease the particle count by 1, and return the currently displayed quantity. array should be
    // protons, neutrons, or electrons
    function decrementParticle( array, currentQuantity ) {
      currentQuantity -= 1;
      particleLayer.removeChild( array[ currentQuantity ] );
      array.splice( currentQuantity, 1 );
      return currentQuantity;
    }

    // Function that updates that displayed particles.
    var updateParticles = function( atom ) {
      // feel free to refactor this, although we'd need to get a passable reference to the counts
      // (that's why there is duplication now)
      while ( atom.protonCountProperty.get() > protonDisplayCount ) {
        protonDisplayCount = incrementParticle( protons, protonDisplayCount, 'proton', nucleonRadius,
          protonTitle.right + interParticleSpacing, protonTitle.center.y );
      }
      while ( atom.protonCountProperty.get() < protonDisplayCount ) {
        protonDisplayCount = decrementParticle( protons, protonDisplayCount );
      }

      while ( atom.neutronCountProperty.get() > neutronDisplayCount ) {
        neutronDisplayCount = incrementParticle( neutrons, neutronDisplayCount, 'neutron', nucleonRadius,
          neutronTitle.right + interParticleSpacing, neutronTitle.center.y );
      }
      while ( atom.neutronCountProperty.get() < neutronDisplayCount ) {
        neutronDisplayCount = decrementParticle( neutrons, neutronDisplayCount );
      }

      while ( atom.electronCountProperty.get() > electronDisplayCount ) {
        electronDisplayCount = incrementParticle( electrons, electronDisplayCount, 'electron', electronRadius,
          electronTitle.right + interParticleSpacing, electronTitle.center.y );
      }
      while ( atom.electronCountProperty.get() < electronDisplayCount ) {
        electronDisplayCount = decrementParticle( electrons, electronDisplayCount );
      }
    };

    // Hook up the update function.
    numberAtom.particleCountProperty.link( function() {
      updateParticles( numberAtom );
    } );

    // Initial update.
    updateParticles( numberAtom );

    Panel.call( this, panelContents, options );
  }

  shred.register( 'ParticleCountDisplay', ParticleCountDisplay );

  return inherit( Panel, ParticleCountDisplay );
} );