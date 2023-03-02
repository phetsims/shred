// Copyright 2022-2023, University of Colorado Boulder

/**
 * Node that represents an atomic symbol, meaning that it shows the symbol text, the proton count, and the
 * atomic number. It also optionally shows the charge.
 *
 * @author John Blanco
 * @author Luisa Vargas
 */

import shred from '../shred.js';
import { Node, NodeOptions, Rectangle, TColor, Text } from '../../../scenery/js/imports.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Vector2 from '../../../dot/js/Vector2.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import AtomIdentifier from '../AtomIdentifier.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import ShredConstants from '../ShredConstants.js';
import Tandem from '../../../tandem/js/Tandem.js';
import optionize from '../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';

// types
type SelfOptions = {
  chargeProperty?: NumberProperty | null;
  fill?: TColor;
  symbolTextFill?: TColor;
  protonCountDisplayFill?: TColor;
  massNumberDisplayFill?: TColor;
};
type SymbolNodeOptions = SelfOptions & NodeOptions;

// constants
const SYMBOL_BOX_WIDTH = 275; // In screen coords, which are roughly pixels.
const SYMBOL_BOX_HEIGHT = 325; // In screen coords, which are roughly pixels.
const NUMBER_FONT = new PhetFont( 70 );
const NUMBER_INSET = 20; // In screen coords, which are roughly pixels.

class SymbolNode extends Node {
  protected readonly massNumberDisplay: Text;
  protected readonly chargeDisplay: Text | undefined;
  protected readonly boundingBox: Rectangle;
  private readonly symbolText: Text;

  public constructor( protonCountProperty: NumberProperty | TReadOnlyProperty<number>,
               massNumberProperty: TReadOnlyProperty<number>,
               providedOptions: SymbolNodeOptions
  ) {

    const options = optionize<SymbolNodeOptions, SelfOptions, NodeOptions>()( {
      chargeProperty: null,
      fill: 'white',
      symbolTextFill: 'black',
      protonCountDisplayFill: PhetColorScheme.RED_COLORBLIND,
      massNumberDisplayFill: 'black',
      tandem: Tandem.REQUIRED // TODO: How to support phet-brand and sub-instrumented components? This applies to all the commented out tandems
    }, providedOptions );

    super( options );

    // Add the bounding box, which is also the root node for everything else
    // that comprises this node.
    this.boundingBox = new Rectangle( 0, 0, SYMBOL_BOX_WIDTH, SYMBOL_BOX_HEIGHT, 0, 0, {
      stroke: 'black',
      lineWidth: 2,
      fill: options.fill
      // tandem: options.tandem.createTandem( 'boundingBox' )
    } );
    this.addChild( this.boundingBox );

    // Add the symbol text.
    this.symbolText = new Text( '', {
      font: new PhetFont( 150 ),
      fill: options.symbolTextFill,
      center: new Vector2( SYMBOL_BOX_WIDTH / 2, SYMBOL_BOX_HEIGHT / 2 )
      // tandem: options.tandem.createTandem( 'symbolText' )
    } );

    // Add the listener to update the symbol text.
    const textCenter = new Vector2( SYMBOL_BOX_WIDTH / 2, SYMBOL_BOX_HEIGHT / 2 );
    protonCountProperty.link( protonCount => {
      const symbol = AtomIdentifier.getSymbol( protonCount );
      this.symbolText.string = protonCount > 0 ? symbol : '-';
      this.symbolText.center = textCenter;
    } );
    this.boundingBox.addChild( this.symbolText );

    // Add the proton count display.
    const protonCountDisplay = new Text( '0', {
      font: NUMBER_FONT,
      fill: options.protonCountDisplayFill
      // tandem: options.tandem.createTandem( 'atomicNumberDisplay' )
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
      fill: options.massNumberDisplayFill
      // tandem: options.tandem.createTandem( 'massNumberDisplay' )
    } );
    this.boundingBox.addChild( this.massNumberDisplay );

    // Add the listener to update the mass number.
    massNumberProperty.link( massNumber => {
      this.massNumberDisplay.string = massNumber;
      this.massNumberDisplay.left = NUMBER_INSET;
      this.massNumberDisplay.top = NUMBER_INSET;
    } );

    if ( options.chargeProperty ) {

      // Add the charge display.
      this.chargeDisplay = new Text( '0', {
        font: NUMBER_FONT,
        fill: 'black'
        // tandem: options.tandem.createTandem( 'chargeDisplay' )
      } );
      this.boundingBox.addChild( this.chargeDisplay );

      // Add the listener to update the charge.
      options.chargeProperty.link( charge => {
        this.chargeDisplay!.string = ( charge > 0 ? '+' : '' ) + charge;
        this.chargeDisplay!.fill = ShredConstants.CHARGE_TEXT_COLOR( charge );
        this.chargeDisplay!.right = SYMBOL_BOX_WIDTH - NUMBER_INSET;
        this.chargeDisplay!.top = NUMBER_INSET;
      } );

    }
  }

  /**
   * Set the fill color of the bounding box of the symbol node.
   */
  public setFillColor( fill: TColor ): void {
    this.boundingBox.fill = fill;
  }

  /**
   * Set the color of the symbol text.
   */
  public setSymbolTextColor( fill: TColor ): void {
    this.symbolText.fill = fill;
  }
}

shred.register( 'SymbolNode', SymbolNode );
export default SymbolNode;