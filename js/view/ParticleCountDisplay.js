// Copyright 2014-2022, University of Colorado Boulder

/**
 * A node that presents a graphical representation of an atom's configuration. It looks somewhat like a bar graph that
 * grows to the right except that the "bars" are actually lines of particles.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */

import merge from '../../../phet-core/js/merge.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { Node, Rectangle, Text } from '../../../scenery/js/imports.js';
import Panel from '../../../sun/js/Panel.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';
import ShredStrings from '../ShredStrings.js';
import ParticleNode from './ParticleNode.js';

const electronsColonString = ShredStrings.electronsColon;
const neutronsColonString = ShredStrings.neutronsColon;
const protonsColonString = ShredStrings.protonsColon;

// constants
const TITLE_MAX_WIDTH_PROPORTION = 1 / 3;
const MIN_VERTICAL_SPACING = 16; // Empirically Determined
const LABEL_FONT = new PhetFont( 12 );

class ParticleCountDisplay extends Panel {

  /**
   * @param {NumberAtom} numberAtom Model representation of the atom
   * @param {number} maxParticles The maximum number of particles to display
   * @param {number} maxWidth The maximum width that this display should reach
   * @param {Object} [options]
   */
  constructor( numberAtom, maxParticles, maxWidth, options ) {

    options = merge( {
      fill: ShredConstants.DISPLAY_PANEL_BACKGROUND_COLOR,
      cornerRadius: 5,
      pickable: false,
      tandem: Tandem.REQUIRED
    }, options );

    const panelContents = new Node();

    const protonTitle = new Text( protonsColonString, {
      font: LABEL_FONT,
      tandem: options.tandem.createTandem( 'protonTitleText' )
    } );
    panelContents.addChild( protonTitle );
    const neutronTitle = new Text( neutronsColonString, {
      font: LABEL_FONT,
      tandem: options.tandem.createTandem( 'neutronTitleText' )
    } );
    panelContents.addChild( neutronTitle );
    const electronTitle = new Text( electronsColonString, {
      font: LABEL_FONT,
      tandem: options.tandem.createTandem( 'electronTitleText' )
    } );
    panelContents.addChild( electronTitle );

    // Scale the title if more than allowed proportion width
    const maxAllowableLabelWidth = maxWidth * TITLE_MAX_WIDTH_PROPORTION;
    protonTitle.maxWidth = maxAllowableLabelWidth;
    electronTitle.maxWidth = maxAllowableLabelWidth;
    neutronTitle.maxWidth = maxAllowableLabelWidth;

    // Lay out the labels.
    const maxLabelWidth = Math.max( Math.max( protonTitle.width, neutronTitle.width ), electronTitle.width );
    protonTitle.right = maxLabelWidth;
    protonTitle.top = 0;
    neutronTitle.right = maxLabelWidth;
    neutronTitle.bottom = protonTitle.bottom + Math.max( neutronTitle.height, MIN_VERTICAL_SPACING );
    electronTitle.right = maxLabelWidth;
    electronTitle.bottom = neutronTitle.bottom + Math.max( electronTitle.height, MIN_VERTICAL_SPACING );

    // Figure out the sizes of the particles and the inter-particle spacing based on the max width.
    const totalParticleSpace = maxWidth - protonTitle.right - 10;
    const nucleonRadius = totalParticleSpace / ( ( maxParticles * 2 ) + ( maxParticles - 1 ) + 2 );
    const electronRadius = nucleonRadius * 0.6; // Arbitrarily chosen.
    const interParticleSpacing = nucleonRadius * 3;

    // Add an invisible spacer that will keep the control panel at a min width.
    const spacer = new Rectangle( maxLabelWidth, 0, interParticleSpacing * 3, 1 );

    // Add the layer where the particles will live.
    const particleLayer = new Node( { children: [ spacer ] } );
    panelContents.addChild( particleLayer );

    // stored ParticleNode instances that are positioned correctly, so we just have to add/remove the
    // changed ones (faster than full rebuild)
    const protons = [];
    const neutrons = [];
    const electrons = [];

    // counts of the displayed number of particles
    let protonDisplayCount = 0;
    let neutronDisplayCount = 0;
    let electronDisplayCount = 0;

    // increase the particle count by 1, and return the currently displayed quantity array
    function incrementParticleCount( array, currentQuantity, particleType, radius, startX, startY ) {
      const newIndex = currentQuantity;
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

    // decrease the particle count by 1, and return the currently displayed quantity array
    function decrementParticleCount( array, currentQuantity ) {
      currentQuantity -= 1;
      particleLayer.removeChild( array[ currentQuantity ] );
      array.splice( currentQuantity, 1 );
      return currentQuantity;
    }

    // Function that updates that displayed particles.
    const updateParticles = function( atom ) {
      // feel free to refactor this, although we'd need to get a passable reference to the counts
      // (that's why there is duplication now)
      while ( atom.protonCountProperty.get() > protonDisplayCount ) {
        protonDisplayCount = incrementParticleCount(
          protons,
          protonDisplayCount,
          'proton',
          nucleonRadius,
          protonTitle.right + interParticleSpacing,
          protonTitle.center.y
        );
      }
      while ( atom.protonCountProperty.get() < protonDisplayCount ) {
        protonDisplayCount = decrementParticleCount( protons, protonDisplayCount );
      }

      while ( atom.neutronCountProperty.get() > neutronDisplayCount ) {
        neutronDisplayCount = incrementParticleCount(
          neutrons,
          neutronDisplayCount,
          'neutron',
          nucleonRadius,
          neutronTitle.right + interParticleSpacing, neutronTitle.center.y
        );
      }
      while ( atom.neutronCountProperty.get() < neutronDisplayCount ) {
        neutronDisplayCount = decrementParticleCount( neutrons, neutronDisplayCount );
      }

      while ( atom.electronCountProperty.get() > electronDisplayCount ) {
        electronDisplayCount = incrementParticleCount(
          electrons,
          electronDisplayCount,
          'electron',
          electronRadius,
          electronTitle.right + interParticleSpacing, electronTitle.center.y
        );
      }
      while ( atom.electronCountProperty.get() < electronDisplayCount ) {
        electronDisplayCount = decrementParticleCount( electrons, electronDisplayCount );
      }
    };

    // Hook up the update function.
    numberAtom.particleCountProperty.link( () => {
      updateParticles( numberAtom );
    } );

    // Initial update.
    updateParticles( numberAtom );

    super( panelContents, options );
  }
}

shred.register( 'ParticleCountDisplay', ParticleCountDisplay );
export default ParticleCountDisplay;