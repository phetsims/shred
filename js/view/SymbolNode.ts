// Copyright 2022-2025, University of Colorado Boulder

/**
 * Node that represents an atomic symbol, meaning that it shows the symbol text, the proton count, and the atomic
 * number. It also optionally shows the charge.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Multilink, { UnknownMultilink } from '../../../axon/js/Multilink.js';
import Property from '../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../dot/js/Vector2.js';
import affirm from '../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../phet-core/js/optionize.js';
import MathSymbols from '../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../scenery/js/nodes/Text.js';
import AtomIdentifier from '../AtomIdentifier.js';
import { ChargeNotation } from '../model/ChargeNotation.js';
import shred from '../shred.js';
import ShredColors from '../ShredColors.js';
import ShredConstants from '../ShredConstants.js';

// types
type SelfOptions = {

  // controls whether charge is displayed and defines the value if so; if null or undefined, charge is not displayed
  chargeProperty?: TReadOnlyProperty<number> | null;

  // controls how charge is displayed, if chargeProperty is provided
  chargeNotationProperty?: TReadOnlyProperty<ChargeNotation> | null;
};
export type SymbolNodeOptions = SelfOptions & NodeOptions;

// constants
const SYMBOL_BOX_WIDTH = 275; // In screen coords, which are roughly pixels.
const SYMBOL_BOX_HEIGHT = 325; // In screen coords, which are roughly pixels.
const NUMBER_FONT = new PhetFont( 70 );
const NUMBER_INSET = 20; // In screen coords, which are roughly pixels.

class SymbolNode extends Node {
  protected readonly massNumberDisplay: Text;
  protected readonly chargeDisplay: Text | undefined;
  protected readonly boundingBox: Rectangle;
  protected readonly symbolText: Text;
  private disposeSymbolNode: () => void;

  public constructor( protonCountProperty: TReadOnlyProperty<number>,
                      massNumberProperty: TReadOnlyProperty<number>,
                      providedOptions?: SymbolNodeOptions ) {

    const options = optionize<SymbolNodeOptions, SelfOptions, NodeOptions>()( {
      chargeProperty: null,
      chargeNotationProperty: null
    }, providedOptions );

    super( options );

    // Add the bounding box, which is also the root node for everything else that comprises this node.
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
    const updateSymbolText = ( protonCount: number ) => {
      const symbol = AtomIdentifier.getSymbol( protonCount );
      this.symbolText.string = protonCount > 0 ? symbol : '-';
    };
    protonCountProperty.link( updateSymbolText );

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
    const updateProtonNumber = ( protonCount: number ) => {
      protonCountDisplay.string = protonCount.toString();
      protonCountDisplay.left = NUMBER_INSET;
      protonCountDisplay.bottom = SYMBOL_BOX_HEIGHT - NUMBER_INSET;
    };
    protonCountProperty.link( updateProtonNumber );

    // Add the mass number display.
    this.massNumberDisplay = new Text( '0', {
      font: NUMBER_FONT,
      fill: 'black'
    } );
    this.boundingBox.addChild( this.massNumberDisplay );

    // Add the listener to update the mass number.
    const updateMassNumber = ( massNumber: number ) => {
      this.massNumberDisplay.string = massNumber.toString();
      this.massNumberDisplay.left = NUMBER_INSET;
      this.massNumberDisplay.top = NUMBER_INSET;
    };
    massNumberProperty.link( updateMassNumber );

    // If the options dictate, add the charge display.
    let updateChargeDisplay: null | UnknownMultilink = null;
    if ( options.chargeProperty ) {

      // Add the charge display.
      this.chargeDisplay = new Text( '0', {
        font: NUMBER_FONT,
        fill: 'black'
      } );
      this.boundingBox.addChild( this.chargeDisplay );

      // Make sure that we have a value for chargeNotationsProperty.
      const chargeNotationProperty = options.chargeNotationProperty || new Property<ChargeNotation>( 'signLast' );

      // Add the listener to update the charge.
      updateChargeDisplay = Multilink.multilink(
        [ options.chargeProperty, chargeNotationProperty ],
        ( charge, chargeNotation ) => {
          affirm( this.chargeDisplay, 'this.chargeDisplay should be defined here' );
          const chargeSign = charge > 0 ? MathSymbols.PLUS : charge < 0 ? MathSymbols.MINUS : '';
          this.chargeDisplay.string = chargeNotation === 'signFirst' ?
                                      `${chargeSign}${Math.abs( charge )}` :
                                      `${Math.abs( charge )}${chargeSign}`;
          this.chargeDisplay.fill = ShredConstants.CHARGE_TEXT_COLOR( charge );
          this.chargeDisplay.right = SYMBOL_BOX_WIDTH - NUMBER_INSET;
          this.chargeDisplay.top = NUMBER_INSET;
        }
      );
    }
    else {

      // Verify that chargeNotationsProperty was not provided if chargeProperty was not provided.
      affirm(
        options.chargeNotationProperty === null,
        'chargeNotationsProperty should not be provided if chargeProperty is not provided'
      );
    }

    this.disposeSymbolNode = () => {
      protonCountProperty.unlink( updateSymbolText );
      protonCountProperty.unlink( updateProtonNumber );
      massNumberProperty.unlink( updateMassNumber );
      if ( updateChargeDisplay ) {
        Multilink.unmultilink( updateChargeDisplay );
      }
    };
  }

  public override dispose(): void {
    super.dispose();
  }
}

shred.register( 'SymbolNode', SymbolNode );
export default SymbolNode;