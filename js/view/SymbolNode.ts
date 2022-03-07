// Copyright 2022, University of Colorado Boulder

/**
 * Scenery node that represents an atomic symbol, meaning that it shows the symbol text, the proton count, and the
 * atomic number. It also optionally shows the charge.
 *
 * @author John Blanco
 * @author Luisa Vargas
 */

import shred from '../shred.js';
import { Node, NodeOptions, Rectangle, Text } from '../../../scenery/js/imports.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Vector2 from '../../../dot/js/Vector2.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import AtomIdentifier from '../AtomIdentifier.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import ShredConstants from '../ShredConstants.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import Tandem from '../../../tandem/js/Tandem.js';
import optionize from '../../../phet-core/js/optionize.js';

// types
type SelfOptions = { chargeProperty?: NumberProperty | null };
type SymbolNodeOptions = SelfOptions & NodeOptions;

// constants
const SYMBOL_BOX_WIDTH = 275; // In screen coords, which are roughly pixels.
const SYMBOL_BOX_HEIGHT = 325; // In screen coords, which are roughly pixels.
const NUMBER_FONT = new PhetFont( 70 );
const NUMBER_INSET = 20; // In screen coords, which are roughly pixels.

class SymbolNode extends Node {

  constructor( protonCountProperty: NumberProperty | DerivedProperty<number, [ protonCount: number ]>,
               massNumberProperty: DerivedProperty<number, [ protonCount: number, neutronCount: number ]>,
               providedOptions: SymbolNodeOptions
  ) {

    const options = optionize<SymbolNodeOptions, SelfOptions, NodeOptions>( {
      chargeProperty: null,
      tandem: Tandem.REQUIRED // TODO: How to support phet-brand and sub-instrumented components?
    }, providedOptions );

    super( options );

    // Add the bounding box, which is also the root node for everything else
    // that comprises this node.
    const boundingBox = new Rectangle( 0, 0, SYMBOL_BOX_WIDTH, SYMBOL_BOX_HEIGHT, 0, 0, {
      stroke: 'black',
      lineWidth: 2,
      fill: 'white'
      // tandem: options.tandem.createTandem( 'boundingBox' )
    } );
    this.addChild( boundingBox );

    // Add the symbol text.
    const symbolText = new Text( '', {
      font: new PhetFont( 150 ),
      fill: 'black',
      center: new Vector2( SYMBOL_BOX_WIDTH / 2, SYMBOL_BOX_HEIGHT / 2 )
      // tandem: options.tandem.createTandem( 'symbolText' )
    } );

    // Add the listener to update the symbol text.
    const textCenter = new Vector2( SYMBOL_BOX_WIDTH / 2, SYMBOL_BOX_HEIGHT / 2 );
    protonCountProperty.link( protonCount => {
      const symbol = AtomIdentifier.getSymbol( protonCount );
      symbolText.text = protonCount > 0 ? symbol : '';
      symbolText.center = textCenter;
    } );
    boundingBox.addChild( symbolText );

    // Add the proton count display.
    const protonCountDisplay = new Text( '0', {
      font: NUMBER_FONT,
      fill: PhetColorScheme.RED_COLORBLIND
      // tandem: options.tandem.createTandem( 'atomicNumberDisplay' )
    } );
    boundingBox.addChild( protonCountDisplay );

    // Add the listener to update the proton count.
    protonCountProperty.link( protonCount => {
      protonCountDisplay.text = protonCount;
      protonCountDisplay.left = NUMBER_INSET;
      protonCountDisplay.bottom = SYMBOL_BOX_HEIGHT - NUMBER_INSET;
    } );

    // Add the mass number display.
    const massNumberDisplay = new Text( '0', {
      font: NUMBER_FONT,
      fill: 'black'
      // tandem: options.tandem.createTandem( 'massNumberDisplay' )
    } );
    boundingBox.addChild( massNumberDisplay );

    // Add the listener to update the mass number.
    massNumberProperty.link( massNumber => {
      massNumberDisplay.text = massNumber;
      massNumberDisplay.left = NUMBER_INSET;
      massNumberDisplay.top = NUMBER_INSET;
    } );

    if ( options.chargeProperty ) {

      // Add the charge display.
      const chargeDisplay = new Text( '0', {
        font: NUMBER_FONT,
        fill: 'black'
        // tandem: options.tandem.createTandem( 'chargeDisplay' )
      } );
      boundingBox.addChild( chargeDisplay );

      // Add the listener to update the charge.
      options.chargeProperty.link( charge => {
        chargeDisplay.text = ( charge > 0 ? '+' : '' ) + charge;
        chargeDisplay.fill = ShredConstants.CHARGE_TEXT_COLOR( charge );
        chargeDisplay.right = SYMBOL_BOX_WIDTH - NUMBER_INSET;
        chargeDisplay.top = NUMBER_INSET;
      } );

    }
  }
}

shred.register( 'SymbolNode', SymbolNode );
export default SymbolNode;