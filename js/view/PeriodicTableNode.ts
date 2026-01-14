// Copyright 2015-2026, University of Colorado Boulder

/**
 * Scenery node that defines a periodic table of the elements.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TProperty, { isTProperty } from '../../../axon/js/TProperty.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../dot/js/Vector2.js';
import affirm from '../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../phet-core/js/optionize.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import HighlightFromNode from '../../../scenery/js/accessibility/HighlightFromNode.js';
import ParallelDOM, { PDOMValueType } from '../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import HotkeyData from '../../../scenery/js/input/HotkeyData.js';
import { OneKeyStroke } from '../../../scenery/js/input/KeyDescriptor.js';
import KeyboardListener from '../../../scenery/js/listeners/KeyboardListener.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import LinearGradient from '../../../scenery/js/util/LinearGradient.js';
import TColor from '../../../scenery/js/util/TColor.js';
import Tandem from '../../../tandem/js/Tandem.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';
import ShredFluent from '../ShredFluent.js';
import PeriodicTableCell, { CellColor } from './PeriodicTableCell.js';

// constants
const ENABLED_CELL_COLOR = ShredConstants.DISPLAY_PANEL_BACKGROUND_COLOR;
const DISABLED_CELL_COLOR = '#EEEEEE';
const SELECTED_CELL_COLOR = '#FA8072'; //salmon
const MAX_PROTON_COUNT = 118;

// 2D array that defines the table structure.
const POPULATED_CELLS = [
  [ 0, 17 ],
  [ 0, 1, 12, 13, 14, 15, 16, 17 ],
  [ 0, 1, 12, 13, 14, 15, 16, 17 ],
  [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ],
  [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ],
  [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ],
  [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ]
];

type SelfOptions = {

  // Atomic number of the heaviest element that should be interactive. If 0, the table is non-interactive.
  interactiveMax?: number;

  cellDimension?: number;
  showLabels?: boolean;
  strokeHighlightWidth?: number;
  strokeHighlightColor?: TColor;
  labelTextHighlightFill?: TColor;
  enabledCellColor?: TColor | LinearGradient;
  disabledCellColor?: TColor;
  selectedCellColor?: TColor;

  // Accessibility
  cellAriaRoleDescription?: PDOMValueType;

  // This flag controls whether the full context response or a shortened version is provided when the periodic table is
  // activated.  The is generally used to provide the longer version once per level, and the shorter version thereafter.
  provideFullActivationContextResponseProperty?: null | TProperty<boolean>;
};

export type PeriodicTableNodeOptions = SelfOptions & NodeOptions;

class PeriodicTableNode extends Node {

  // the cells of the table
  private readonly cells: PeriodicTableCell[] = [];

  // disposal function
  private readonly disposePeriodicTableNode: VoidFunction;

  /**
   * @param protonCountProperty - Atomic number (i.e. number of protons) that defines which element is currently
   *                              highlighted.  This may or may not be changed by this table, depending on the
   *                              interactiveMax option.
   * @param providedOptions
   */
  public constructor( protonCountProperty: TReadOnlyProperty<number> | TProperty<number>,
                      providedOptions?: PeriodicTableNodeOptions ) {

    const options = optionize<PeriodicTableNodeOptions, SelfOptions, NodeOptions>()( {
      interactiveMax: 0, // atomic number of the heaviest element that should be interactive
      cellDimension: 25,
      showLabels: true,
      strokeHighlightWidth: 2,
      strokeHighlightColor: PhetColorScheme.RED_COLORBLIND,
      labelTextHighlightFill: 'black',
      enabledCellColor: ENABLED_CELL_COLOR,
      disabledCellColor: DISABLED_CELL_COLOR,
      selectedCellColor: SELECTED_CELL_COLOR,
      cellAriaRoleDescription: null,
      groupFocusHighlight: true,
      accessibleHeading: ShredFluent.a11y.periodicTableNode.accessibleHeadingStringProperty,
      descriptionContent: ShredFluent.a11y.periodicTableNode.descriptionContentStringProperty,
      provideFullActivationContextResponseProperty: null
    }, providedOptions );

    affirm( options.interactiveMax === 0 || isTProperty<number>( protonCountProperty ),
      'If the table is at all interactive, protonCountProperty should be settable'
    );

    super( options );

    const isTableInteractive = options.interactiveMax > 0;

    // Create a Node just for the accessibleHelpText, so that it can be placed in the correct location in the DOM.
    // Then, we forward the help text from this Node to the helpTextNode, so that when it is set here,
    const helpTextNode = new Node();
    this.addChild( helpTextNode );
    ParallelDOM.forwardHelpText( this, helpTextNode );

    let protonCount = 1;
    for ( let i = 0; i < POPULATED_CELLS.length; i++ ) {
      const populatedCellsInRow = POPULATED_CELLS[ i ];

      const cellColor: CellColor = {
        enabled: options.enabledCellColor,
        disabled: options.disabledCellColor,
        selected: options.selectedCellColor
      };
      for ( let j = 0; j < populatedCellsInRow.length; j++ ) {

        // If this cell is supposed to be interactive the atomic number property will need to be provided to it.
        let settableAtomicNumberProperty: TProperty<number> | null = null;
        if ( protonCount <= options.interactiveMax ) {
          affirm( isTProperty<number>( protonCountProperty ),
            'If you\'re using options.interactiveMax, protonCountProperty should be settable' );
          settableAtomicNumberProperty = protonCountProperty;
        }

        const cell = new PeriodicTableCell( protonCount, cellColor, {
          protonCountProperty: settableAtomicNumberProperty,
          showLabels: options.showLabels,
          strokeHighlightWidth: options.strokeHighlightWidth,
          strokeHighlightColor: options.strokeHighlightColor,
          labelTextHighlightFill: options.labelTextHighlightFill,
          length: options.cellDimension,
          tandem: Tandem.OPT_OUT,

          accessibleVisible: false,
          accessibleName: AtomIdentifier.getSpokenSymbol( protonCount, true )
        } );
        cell.focusHighlight = new HighlightFromNode( cell );
        cell.translation = new Vector2( populatedCellsInRow[ j ] * options.cellDimension, i * options.cellDimension );
        this.addChild( cell );
        this.cells.push( cell );
        protonCount++;

        // Because of the lanthanides and actinides groups (separate from the rest of the periodic table and not shown
        // in the sim), we need to adjust the element index to ignore those groups.
        if ( protonCount === 58 ) {

          // When the element index is 58, it corresponds to Cerium (Ce), which is the start of the lanthanides,
          // it should jump to 72, which is Hafnium (Hf), back on the main table.
          protonCount = 72;
        }
        if ( protonCount === 90 ) {

          // When the element index is 90, it corresponds to Thorium (Th), which is the start of the actinides,
          // it should jump to 104, which is Rutherfordium (Rf), back on the main table.
          protonCount = 104;
        }
      }
    }

    // Highlight the cell that corresponds to the atom.
    let highlightedCell: PeriodicTableCell | null = null;
    const updateHighlightedCell = ( protonCount: number ) => {
      if ( highlightedCell !== null ) {
        highlightedCell.setHighlighted( false );
        highlightedCell.accessibleVisible = false;
      }
      if ( protonCount !== 0 ) {
        const elementIndex = PeriodicTableNode.protonCountToElementIndex( protonCount );
        highlightedCell = this.cells[ elementIndex ];
        highlightedCell.moveToFront();
        highlightedCell.setHighlighted( true );

        // If table is not interactive, do not display any accessibility for the interactive cell.
        if ( isTableInteractive ) {
          highlightedCell.accessibleVisible = true;
          highlightedCell.focus();
        }
      }
    };
    protonCountProperty.link( updateHighlightedCell );

    this.disposePeriodicTableNode = () => {
      this.children.forEach( node => node.dispose() );
      protonCountProperty.hasListener( updateHighlightedCell ) && protonCountProperty.unlink( updateHighlightedCell );
      this.cells.forEach( cell => { !cell.isDisposed && cell.dispose();} );
    };

    // If this table is interactive at all, add keyboard navigation and accessible PDOM structure for screen readers.
    if ( isTableInteractive ) {

      affirm(
        isTProperty<number>( protonCountProperty ),
        'If the table is interactive, protonCountProperty should be settable'
      );

      // Add a keyboard listener that will allow users to navigate the table with arrow keys.
      this.addInputListener( new KeyboardListener<OneKeyStroke[]>( {
        keyStringProperties: PeriodicTableNode.NAVIGATION_HOTKEY_DATA.keyStringProperties,
        fire: ( event, keysPressed ) => {
          if ( protonCountProperty.value === 0 ) {

            // Nothing is selected, so set it to Hydrogen regardless of what key was pressed.
            protonCountProperty.value = 1;
          }
          else {
            if ( keysPressed === 'arrowRight' || keysPressed === 'd' ) {
              protonCountProperty.value = PeriodicTableNode.move( protonCountProperty.value, +1, 0 );
            }
            else if ( keysPressed === 'arrowLeft' || keysPressed === 'a' ) {
              protonCountProperty.value = PeriodicTableNode.move( protonCountProperty.value, -1, 0 );
            }
            else if ( keysPressed === 'arrowDown' || keysPressed === 's' ) {
              protonCountProperty.value = PeriodicTableNode.move( protonCountProperty.value, 0, +1 );
            }
            else if ( keysPressed === 'arrowUp' || keysPressed === 'w' ) {
              protonCountProperty.value = PeriodicTableNode.move( protonCountProperty.value, 0, -1 );
            }
          }
        }
      } ) );

      // An accessible button that will either focus the currently highlighted cell or set the selection to the first
      // one in the table, i.e. hydrogen.  This is for a11y and does not affect visual interaction.
      const interactiveButtonNode = new Node( {
        tagName: 'button',
        accessibleName: ShredFluent.a11y.periodicTableNode.interactiveButton.accessibleNameStringProperty,
        accessibleHelpText: ShredFluent.a11y.periodicTableNode.interactiveButton.accessibleHelpTextStringProperty
      } );
      this.addChild( interactiveButtonNode );

      // The accessible Node has no bounds, so this highlights the entire table when it has focus.
      interactiveButtonNode.focusHighlight = new HighlightFromNode( this );

      // When the button is "clicked" (pressed Enter or Space), either focus the currently highlighted cell, or
      // select Hydrogen if nothing is selected.
      interactiveButtonNode.addInputListener( new KeyboardListener( {
        fireOnClick: true,
        fire: () => {
          if ( protonCountProperty.value === 0 ) {

            // Nothing is selected, so set it to Hydrogen regardless of what key was pressed.
            protonCountProperty.value = 1;

            let contextResponse = ShredFluent.a11y.periodicTableNode.interactiveButton.accessibleContextResponse.activationStringProperty.value;
            if ( options.provideFullActivationContextResponseProperty ) {
              if ( options.provideFullActivationContextResponseProperty.value ) {
                contextResponse += ' ' + ShredFluent.a11y.periodicTableNode.interactiveButton.accessibleContextResponse.selectionStringProperty.value;

                // Consume the flag so that full response is only provided once until reset.
                options.provideFullActivationContextResponseProperty.value = false;
              }
            }
            else {

              // If no flag is provided, always give the full response.
              contextResponse += ' ' + ShredFluent.a11y.periodicTableNode.interactiveButton.accessibleContextResponse.selectionStringProperty.value;
            }

            this.addAccessibleContextResponse( contextResponse );
          }
          else {
            highlightedCell && highlightedCell.focus();
          }
        }
      } ) );
    }
  }

  public override dispose(): void {
    this.disposePeriodicTableNode();
    super.dispose();
  }

  /**
   * Moves around the periodic table based on dx and dy values. When moving horizontally we go to elementIndex + dx,
   * then back to protonCount. When moving vertically, we need to find the coordinates above or below, find element
   * index, and then back to protonCount.
   */
  private static move( protonCount: number, dx: number, dy: number ): number {
    if ( dx !== 0 && protonCount + dx > 0 && protonCount + dx <= MAX_PROTON_COUNT ) {
      protonCount = PeriodicTableNode.elementIndexToProtonCount( PeriodicTableNode.protonCountToElementIndex( protonCount ) + dx );
    }
    if ( dy !== 0 ) {
      const currentCoordinates = PeriodicTableNode.protonCountToCoordinates( protonCount );
      const proposedNewCoordinates = new Vector2( currentCoordinates.x + dx, currentCoordinates.y + dy );

      if ( proposedNewCoordinates.y >= 0 && proposedNewCoordinates.y < POPULATED_CELLS.length &&
           POPULATED_CELLS[ proposedNewCoordinates.y ].includes( currentCoordinates.x )
      ) {
        protonCount = PeriodicTableNode.coordinatesToProtonCount( proposedNewCoordinates );
      }
    }
    return protonCount;
  }

  /**
   * Coordinate transformation utility functions: We use 3 identifications of an element:
   * 1) protonCount: number of protons, from 1 to 118
   * 2) elementIndex: index of the element in the periodic table ignoring lanthanides and actinides,
   *    sequential from 0 to 87
   * 3) coordinates: (x,y) coordinates in the periodic table grid
   *
   * In order to navigate the table with arrow keys, we need to be able to convert between these identifications.
   */

  public static protonCountToCoordinates( protonCount: number ): Vector2 {
    const elementIndex = PeriodicTableNode.protonCountToElementIndex( protonCount );
    return PeriodicTableNode.elementIndexToCoordinates( elementIndex );
  }

  private static coordinatesToProtonCount( coordinates: Vector2 ): number {
    const elementIndex = PeriodicTableNode.coordinatesToElementIndex( coordinates );
    return PeriodicTableNode.elementIndexToProtonCount( elementIndex );
  }

  private static protonCountToElementIndex( protonCount: number ): number {
    affirm( protonCount > 0 && protonCount <= MAX_PROTON_COUNT, 'protonCount must be between 1 and 118' );
    let elementIndex = protonCount - 1;

    // adjust for lanthanides and actinides
    if ( protonCount >= 72 ) {
      elementIndex -= 14;
    }
    if ( protonCount >= 104 && protonCount <= MAX_PROTON_COUNT ) {
      elementIndex -= 14;
    }
    return elementIndex;
  }

  private static elementIndexToProtonCount( elementIndex: number ): number {
    let protonCount = elementIndex + 1;

    // adjust for lanthanides and actinides
    if ( protonCount >= 58 ) {
      protonCount += 14;
    }
    if ( protonCount >= 90 ) {
      protonCount += 14;
    }
    return protonCount;
  }

  private static elementIndexToCoordinates( elementIndex: number ): Vector2 {
    let row = 0;
    let column = 0;

    for ( let i = 0; i < elementIndex; i++ ) {
      column++;
      if ( POPULATED_CELLS[ row ].length === column ) {
        row++;
        column = 0;
      }
    }

    return new Vector2( POPULATED_CELLS[ row ][ column ], row );
  }

  private static coordinatesToElementIndex( coordinates: Vector2 ): number {
    let elementIndex = 0;
    for ( let i = 0; i < coordinates.y; i++ ) {
      elementIndex += POPULATED_CELLS[ i ].length;
    }
    for ( let j = 0; j < POPULATED_CELLS[ coordinates.y ].length; j++ ) {
      if ( POPULATED_CELLS[ coordinates.y ][ j ] === coordinates.x ) {
        elementIndex += j;
        break;
      }
    }
    return elementIndex;
  }

  public static readonly NAVIGATION_HOTKEY_DATA = new HotkeyData( {
    keys: [ 'arrowRight', 'arrowLeft', 'arrowDown', 'arrowUp', 'w', 'a', 's', 'd' ],
    keyboardHelpDialogLabelStringProperty: ShredFluent.a11y.periodicTableNode.keyboardHelpDialog.selectChemicalSymbolStringProperty,
    repoName: shred.name
  } );
}

shred.register( 'PeriodicTableNode', PeriodicTableNode );
export default PeriodicTableNode;