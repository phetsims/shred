// Copyright 2015-2025, University of Colorado Boulder

/**
 * Scenery node that defines a single cell in a periodic table.
 * @author John Blanco
 * @author Aadish Gupta
 */

import optionize from '../../../phet-core/js/optionize.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import FireListener from '../../../scenery/js/listeners/FireListener.js';
import Rectangle, { RectangleOptions } from '../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../scenery/js/util/LinearGradient.js';
import TColor from '../../../scenery/js/util/TColor.js';
import AtomIdentifier from '../AtomIdentifier.js';
import NumberAtom from '../model/NumberAtom.js';
import shred from '../shred.js';

// constants
const NOMINAL_CELL_DIMENSION = 25;
const NOMINAL_FONT_SIZE = 14;

type SelfOptions = {
  length?: number; // Width and height of cell (cells are square).
  showLabels?: boolean;
  strokeHighlightWidth?: number;
  strokeHighlightColor?: TColor;
  labelTextHighlightFill?: TColor; // fill of label text when highlighted

  // If provided, this atom will be set when the cell is pressed.
  settableAtom?: NumberAtom | null;
};
type PeriodicTableCellOptions = SelfOptions & RectangleOptions;
export type CellColor = {
  enabled: TColor | LinearGradient;
  disabled: TColor;
  selected: TColor;
};

class PeriodicTableCell extends Rectangle {
  private readonly disposePeriodicTableCell: VoidFunction;
  private readonly strokeHighlightColor: TColor;
  private readonly strokeHighlightWidth: number;
  private readonly showLabels: boolean;
  private readonly labelTextHighlightFill: TColor;
  private readonly normalFill: TColor | LinearGradient;
  private readonly highlightedFill: TColor;
  private readonly labelText: Text | null;

  /**
   * @param atomicNumber - Atomic number of atom represented by this cell.
   * @param cellColor - Color to be used for selected enabled and disabled cell
   * @param providedOptions
   */
  public constructor( atomicNumber: number,
                      cellColor: CellColor,
                      providedOptions?: PeriodicTableCellOptions ) {

    const options = optionize<PeriodicTableCellOptions, SelfOptions, RectangleOptions>()( {
      length: 25, //Width and height of cell (cells are square).
      showLabels: true,
      strokeHighlightWidth: 2,
      strokeHighlightColor: PhetColorScheme.RED_COLORBLIND,
      labelTextHighlightFill: 'black', // fill of label text when highlighted
      settableAtom: null
    }, providedOptions );

    const normalFill = options.settableAtom ? cellColor.enabled : cellColor.disabled;

    super( 0, 0, options.length, options.length, 0, 0, {
      stroke: 'black',
      lineWidth: 1,
      fill: normalFill,
      cursor: options.settableAtom ? 'pointer' : null
    } );

    this.strokeHighlightColor = options.strokeHighlightColor;
    this.strokeHighlightWidth = options.strokeHighlightWidth;
    this.showLabels = options.showLabels;
    this.labelTextHighlightFill = options.labelTextHighlightFill;
    this.normalFill = normalFill;
    this.highlightedFill = cellColor.selected;
    this.labelText = null;
    if ( options.showLabels ) {
      this.labelText = new Text( AtomIdentifier.getSymbol( atomicNumber ), {
        font: new PhetFont( NOMINAL_FONT_SIZE * ( options.length / NOMINAL_CELL_DIMENSION ) ),
        center: this.center,
        maxWidth: options.length - 5
      } );
      this.addChild( this.labelText );
    }

    // If interactive, add a listener to set the atom when this cell is pressed.
    let buttonListener: FireListener | null = null; // scope for disposal
    if ( options.settableAtom ) {
      buttonListener = new FireListener( {
        tandem: options.tandem && options.tandem.createTandem( 'fireListener' ),
        fire: () => options.settableAtom!.setSubAtomicParticleCount(
          atomicNumber,
          AtomIdentifier.getNumNeutronsInMostCommonIsotope( atomicNumber ),
          atomicNumber
        )
      } );
      this.addInputListener( buttonListener );
    }

    this.disposePeriodicTableCell = () => {
      this.labelText && this.labelText.dispose();
      buttonListener && buttonListener.dispose();
    };
  }

  public setHighlighted( highlighted: boolean ): void {
    this.fill = highlighted ? this.highlightedFill : this.normalFill;
    this.stroke = highlighted ? this.strokeHighlightColor : 'black';
    this.lineWidth = highlighted ? this.strokeHighlightWidth : 1;
    if ( this.showLabels ) {
      this.labelText!.fontWeight = highlighted ? 'bold' : 'normal';
      this.labelText!.fill = highlighted ? this.labelTextHighlightFill : 'black';
    }
  }

  public override dispose(): void {
    this.disposePeriodicTableCell();
    super.dispose();
  }
}

shred.register( 'PeriodicTableCell', PeriodicTableCell );
export default PeriodicTableCell;