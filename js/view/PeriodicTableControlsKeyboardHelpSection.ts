// Copyright 2025-2026, University of Colorado Boulder

/**
 * PeriodicTableControlsKeyboardHelpSection is the keyboard-help section that describes how to interact with
 * PeriodicTableNode.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import KeyboardHelpSection, { KeyboardHelpSectionOptions } from '../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import shred from '../shred.js';
import ShredFluent from '../ShredFluent.js';
import PeriodicTableNode from './PeriodicTableNode.js';

export default class PeriodicTableControlsKeyboardHelpSection extends KeyboardHelpSection {

  public constructor( providedOptions?: KeyboardHelpSectionOptions ) {
    super(
      ShredFluent.a11y.periodicTableNode.keyboardHelpDialog.navigationStringProperty,
      [ KeyboardHelpSectionRow.fromHotkeyData( PeriodicTableNode.NAVIGATION_HOTKEY_DATA ) ],
      providedOptions
    );
  }
}

shred.register( 'PeriodicTableControlsKeyboardHelpSection', PeriodicTableControlsKeyboardHelpSection );