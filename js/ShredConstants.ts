// Copyright 2014-2020, University of Colorado Boulder

/**
 * Shared constants used in various places in both 'Build an Atom' and 'Isotopes and Atomic Mass'.
 *
 * @author John Blanco
 */

import Bounds2 from '../../dot/js/Bounds2.js';
import PhetColorScheme from '../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import shred from './shred.js';

const ShredConstants = {

  LAYOUT_BOUNDS: new Bounds2( 0, 0, 768, 464 ),

  // Sizes of the various particles.
  NUCLEON_RADIUS: 10, // In screen coordinates, which are roughly pixels.
  ELECTRON_RADIUS: 8, // In screen coordinates, which are roughly pixels.

  // Placing this variable here will remove dependency on BuildAnAtom in shred repository. Max number of electrons
  // for ElectronCloudView.
  MAX_ELECTRONS: 10,

  // Background color used on several displays.
  DISPLAY_PANEL_BACKGROUND_COLOR: 'rgb( 254, 255, 153 )',

  // Font used in accordion box titles throughout the sim.
  ACCORDION_BOX_TITLE_FONT: new PhetFont( 16 ),

  ACCORDION_BOX_TITLE_MAX_WIDTH: 225, // empirically determined

  // Function for choosing text color based on charge value.
  CHARGE_TEXT_COLOR: function( charge ) {
    return charge > 0 ? PhetColorScheme.RED_COLORBLIND : charge < 0 ? 'blue' : 'black';
  },

  // Names of the various game levels.
  LEVEL_NAMES: [ 'periodic-table-game', 'mass-and-charge-game', 'symbol-game', 'advanced-symbol-game' ],

  // Level name to level number converter.
  MAP_LEVEL_NAME_TO_NUMBER: function( levelName ) { return this.LEVEL_NAMES.indexOf( levelName ); }
};
shred.register( 'ShredConstants', ShredConstants );
export default ShredConstants;