// Copyright 2022-2025, University of Colorado Boulder

/**
 * Node that represents an atomic symbol, meaning that it shows the symbol text, the proton count, and the
 * atomic number. It also optionally shows the charge.
 *
 * @author John Blanco
 * @author Luisa Vargas
 */

import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../dot/js/Vector2.js';
import optionize from '../../../phet-core/js/optionize.js';
import MathSymbols from '../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../scenery/js/nodes/Text.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shred from '../shred.js';
import ShredColors from '../ShredColors.js';
import ShredConstants from '../ShredConstants.js';

// types
type SelfOptions = {
  netChargeProperty?: TReadOnlyProperty<number> | null;
};
export type SymbolNodeOptions = SelfOptions & NodeOptions;

// constants
const SYMBOL_BOX_WIDTH = 275; // In screen coords, which are roughly pixels.
const SYMBOL_BOX_HEIGHT = 325; // In screen coords, which are roughly pixels.
const NUMBER_FONT = new PhetFont( 70 );
const NUMBER_INSET = 20; // In screen coords, which are roughly pixels.

class SymbolNode extends Node {
  protected readonly massNumberDisplay: Text;
  protected readonly netChargeDisplay: Text | undefined;
  protected readonly boundingBox: Rectangle;
  protected readonly symbolText: Text;

  public constructor( protonCountProperty: TReadOnlyProperty<number>,
                      massNumberProperty: TReadOnlyProperty<number>,
                      providedOptions?: SymbolNodeOptions ) {

    const options = optionize<SymbolNodeOptions, SelfOptions, NodeOptions>()( {
      netChargeProperty: null
    }, providedOptions );

    super( options );

    // Add the bounding box, which is also the root node for everything else
    // that comprises this node.
    this.boundingBox = new Rectangle( 0, 0, SYMBOL_BOX_WIDTH, SYMBOL_BOX_HEIGHT, 0, 0, {
      stroke: 'black',
      lineWidth: 2,
      fill: 'white'
    } );
    this.addChild( this.boundingBox );

    // Add the symbol text.
    this.symbolText = new Text( '', {
      font: new PhetFont( 150 ),
      fill: 'black',
      center: new Vector2( SYMBOL_BOX_WIDTH / 2, SYMBOL_BOX_HEIGHT / 2 )
    } );

    // Add the listener to update the symbol text.
    const textCenter = new Vector2( SYMBOL_BOX_WIDTH / 2, SYMBOL_BOX_HEIGHT / 2 );
    protonCountProperty.link( protonCount => {
      const symbol = AtomIdentifier.getSymbol( protonCount );
      this.symbolText.string = protonCount > 0 ? symbol : '-';
    } );

    // Don't center in the above listener, in case subtypes want to change the symbol.
    this.symbolText.stringProperty.link( () => {
      this.symbolText.center = textCenter;
    } );
    this.boundingBox.addChild( this.symbolText );

    // Add the proton count display.
    const protonCountDisplay = new Text( '0', {
      font: NUMBER_FONT,
      fill: ShredColors.positiveColorProperty
    } );
    this.boundingBox.addChild( protonCountDisplay );

    // Add the listener to update the proton count.
    protonCountProperty.link( protonCount => {
      protonCountDisplay.string = protonCount;
      protonCountDisplay.left = NUMBER_INSET;
      protonCountDisplay.bottom = SYMBOL_BOX_HEIGHT - NUMBER_INSET;
    } );

    // Add the mass number display.
    this.massNumberDisplay = new Text( '0', {
      font: NUMBER_FONT,
      fill: 'black'
    } );
    this.boundingBox.addChild( this.massNumberDisplay );

    // Add the listener to update the mass number.
    massNumberProperty.link( massNumber => {
      this.massNumberDisplay.string = massNumber;
      this.massNumberDisplay.left = NUMBER_INSET;
      this.massNumberDisplay.top = NUMBER_INSET;
    } );

    if ( options.netChargeProperty ) {

      // Add the charge display.
      this.netChargeDisplay = new Text( '0', {
        font: NUMBER_FONT,
        fill: 'black'
      } );
      this.boundingBox.addChild( this.netChargeDisplay );

      // Add the listener to update the charge.
      options.netChargeProperty.link( charge => {
        const chargeSign = charge > 0 ? MathSymbols.PLUS : charge < 0 ? MathSymbols.MINUS : '';
        this.netChargeDisplay!.string = `${Math.abs( charge )}${chargeSign}`;
        this.netChargeDisplay!.fill = ShredConstants.CHARGE_TEXT_COLOR( charge );
        this.netChargeDisplay!.right = SYMBOL_BOX_WIDTH - NUMBER_INSET;
        this.netChargeDisplay!.top = NUMBER_INSET;
      } );

    }
  }
}

shred.register( 'SymbolNode', SymbolNode );
export default SymbolNode;