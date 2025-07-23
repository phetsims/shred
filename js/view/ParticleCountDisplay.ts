// Copyright 2014-2025, University of Colorado Boulder

/**
 * A node that presents a graphical representation of an atom's configuration. It looks somewhat like a bar graph that
 * grows to the right except that the "bars" are actually lines of particles.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */

import optionize from '../../../phet-core/js/optionize.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import AlignGroup from '../../../scenery/js/layout/constraints/AlignGroup.js';
import HBox from '../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Text, { TextOptions } from '../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../sun/js/Panel.js';
import Tandem from '../../../tandem/js/Tandem.js';
import { TNumberAtom, TReadOnlyNumberAtom } from '../model/NumberAtom.js';
import { ParticleTypeString } from '../model/Particle.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';
import ShredStrings from '../ShredStrings.js';
import ParticleNode from './ParticleNode.js';

// constants
const TEXT_OPTIONS: TextOptions = { font: new PhetFont( 12 ), maxWidth: 100 };
const HORIZONTAL_SPACING = 5;

type SelfOptions = {
  maxParticles?: number;
};

type ParticleCountDisplayOptions = SelfOptions & PanelOptions;

class ParticleCountDisplay extends Panel {
  public constructor(
    numberAtom: TNumberAtom | TReadOnlyNumberAtom,
    providedTandem: Tandem,
    providedOptions?: ParticleCountDisplayOptions
  ) {

    const tandem = providedTandem.createTandem( 'ParticleCountDisplay' );

    const options = optionize<ParticleCountDisplayOptions, SelfOptions, PanelOptions>()( {
      fill: ShredConstants.DISPLAY_PANEL_BACKGROUND_COLOR,
      cornerRadius: 5,
      maxParticles: 13,
      pickable: false,
      tandem: tandem,
      phetioFeatured: true
    }, providedOptions );

    // Create label Text nodes, with an AlignGroup so their right edges align
    const titleAlignGroup = new AlignGroup( { matchVertical: true } );
    const protonTitleText = new Text( ShredStrings.protonsColonStringProperty, TEXT_OPTIONS );
    const neutronTitleText = new Text( ShredStrings.neutronsColonStringProperty, TEXT_OPTIONS );
    const electronTitleText = new Text( ShredStrings.electronsColonStringProperty, TEXT_OPTIONS );

    const nucleonRadius = 5; // Determined empirically
    const electronRadius = nucleonRadius * 0.6;
    const interParticleSpacing = nucleonRadius;
    const radiusDiff = nucleonRadius - electronRadius;


    // Arrays to hold ParticleNode instances
    const protons: ParticleNode[] = [];
    const neutrons: ParticleNode[] = [];
    const electrons: ParticleNode[] = [];

    // HBoxes for each row
    const protonBar = new HBox( { spacing: interParticleSpacing } );
    const neutronBar = new HBox( { spacing: interParticleSpacing } );
    const electronBar = new HBox( { spacing: interParticleSpacing, xMargin: radiusDiff } );

    // HBoxes for label + bar, the label is part of the AlignGroup with a right alignment
    const protonRow = new HBox( {
      children: [ titleAlignGroup.createBox( protonTitleText, { xAlign: 'right' } ), protonBar ],
      spacing: HORIZONTAL_SPACING,
      align: 'center'
    } );
    const neutronRow = new HBox( {
      children: [ titleAlignGroup.createBox( neutronTitleText, { xAlign: 'right' } ), neutronBar ],
      spacing: HORIZONTAL_SPACING,
      align: 'center'
    } );
    const electronRow = new HBox( {
      children: [ titleAlignGroup.createBox( electronTitleText, { xAlign: 'right' } ), electronBar ],
      spacing: HORIZONTAL_SPACING,
      align: 'center'
    } );

    // VBox for all rows
    const panelContents = new VBox( {
      children: [ protonRow, neutronRow, electronRow ],
      spacing: 5,
      align: 'left'
    } );

    // Display counts
    let protonDisplayCount = 0;
    let neutronDisplayCount = 0;
    let electronDisplayCount = 0;

    // Helper functions
    function incrementParticleCount( array: ParticleNode[], bar: HBox, currentQuantity: number, particleType: ParticleTypeString, radius: number ): number {
      const newIndex = currentQuantity;
      if ( newIndex === array.length && newIndex < options.maxParticles ) {
        array.push( new ParticleNode( particleType, radius ) );
      }
      bar.addChild( array[ newIndex ] );
      return currentQuantity + 1;
    }

    function decrementParticleCount( array: ParticleNode[], bar: HBox, currentQuantity: number ): number {
      currentQuantity -= 1;
      bar.removeChild( array[ currentQuantity ] );
      array.splice( currentQuantity, 1 );
      return currentQuantity;
    }

    // Update function
    const updateParticles = ( atom: TNumberAtom | TReadOnlyNumberAtom ): void => {
      while ( atom.protonCountProperty.get() > protonDisplayCount ) {
        protonDisplayCount = incrementParticleCount( protons, protonBar, protonDisplayCount, 'proton', nucleonRadius );
      }
      while ( atom.protonCountProperty.get() < protonDisplayCount ) {
        protonDisplayCount = decrementParticleCount( protons, protonBar, protonDisplayCount );
      }

      while ( atom.neutronCountProperty.get() > neutronDisplayCount ) {
        neutronDisplayCount = incrementParticleCount( neutrons, neutronBar, neutronDisplayCount, 'neutron', nucleonRadius );
      }
      while ( atom.neutronCountProperty.get() < neutronDisplayCount ) {
        neutronDisplayCount = decrementParticleCount( neutrons, neutronBar, neutronDisplayCount );
      }

      while ( atom.electronCountProperty.get() > electronDisplayCount ) {
        electronDisplayCount = incrementParticleCount( electrons, electronBar, electronDisplayCount, 'electron', electronRadius );
      }
      while ( atom.electronCountProperty.get() < electronDisplayCount ) {
        electronDisplayCount = decrementParticleCount( electrons, electronBar, electronDisplayCount );
      }
    };

    numberAtom.particleCountProperty.link( () => {
      updateParticles( numberAtom );
    } );

    updateParticles( numberAtom );

    super( panelContents, options );
  }
}

shred.register( 'ParticleCountDisplay', ParticleCountDisplay );
export default ParticleCountDisplay;