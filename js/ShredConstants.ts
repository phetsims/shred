// Copyright 2014-2025, University of Colorado Boulder

/**
 * Shared constants used in various places in both 'Build an Atom' and 'Isotopes and Atomic Mass'.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../dot/js/Vector2.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import TColor from '../../scenery/js/util/TColor.js';
import { PARTICLE_COLORS } from './model/Particle.js';
import shred from './shred.js';

const ShredConstants = {

  // Sizes of the various particles.
  NUCLEON_RADIUS: 10, // In screen coordinates, which are roughly pixels.
  ELECTRON_RADIUS: 8, // In screen coordinates, which are roughly pixels.

  DEFAULT_PARTICLE_SPEED: 200, // In screen coordinate units per second.

  // Placing this variable here will remove dependency on BuildAnAtom in shred repository. Max number of electrons
  // for ElectronCloudView.
  MAX_ELECTRONS: 10,

  // Background color used on several displays.
  DISPLAY_PANEL_BACKGROUND_COLOR: 'rgb( 254, 255, 153 )',

  // Font used in accordion box titles throughout the sim.
  ACCORDION_BOX_TITLE_FONT: new PhetFont( 16 ),

  ACCORDION_BOX_TITLE_MAX_WIDTH: 225, // empirically determined

  // Function for choosing text color based on charge value.
  CHARGE_TEXT_COLOR: function( charge: number ): TColor {
    return charge > 0 ? PARTICLE_COLORS.proton : charge < 0 ? 'blue' : 'black';
  },

  // an offset used by alt-input to position particles just below the nucleus
  BELOW_NUCLEUS_OFFSET: new Vector2( 0, -40 )
};
shred.register( 'ShredConstants', ShredConstants );
export default ShredConstants;