// Copyright 2021, University of Colorado Boulder

/**
 * X shape node that represents a non-existant nuclide cell.
 * @author John Blanco
 * @author Aadish Gupta
 * @author Luisa Vargas
 */

import Shape from '../../../kite/js/Shape.js';
import merge from '../../../phet-core/js/merge.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';

class NuclideChartX extends Rectangle {
  /**
   * @param {number} proton - Proton number of the non-existant nuclide, aka cell, this X shape represents
   * @param {number} neutron - Neutron number of the non-existant nuclide, aka cell, this X shape represents
   * @param {string} color - Color to be used for the X shape
   * @param {Object} [options]
   */
  constructor( proton, neutron, color, options ) {
    options = merge( {
      tandem: Tandem.REQUIRED
      //phetioEventType: EventType.USER
    }, options );

    super( 0, 0, 0, 0, 0, 0, {
      stroke: 'black',
      lineWidth: 0,
      fill: 'black',
      cursor: null,
      tandem: options.tandem,
      phetioType: options.phetioType
    } ); // Call super constructor.

    this.options = options;
    this.protonNumber = proton;
    this.neutronNumber = neutron;
    this.type = 'xLabel';

    const xLabel = new Shape();
    xLabel.moveTo( ( 25 * neutron ), ( 11 - proton ) * 25 );
    xLabel.lineTo( ( 25 * neutron ) + 25, ( 10 - proton ) * 25 );
    xLabel.moveTo( ( 25 * neutron ), ( 10 - proton ) * 25 );
    xLabel.lineTo( ( 25 * neutron ) + 25, ( 11 - proton ) * 25 );
    this.xLabelObject = new Path( xLabel, {
      stroke: color,
      lineWidth: 6,
      pickable: false,
      tandem: options.tandem.createTandem( 'xLabel' ),
      phetioType: options.phetioType
    } );
    this.addChild( this.xLabelObject );

    // @private called by dispose
    this.disposeNuclideChartX = function() {
      this.xLabelObject.dispose();
    };
  }

  /**
   * @public
   */
  dispose() {
    this.disposeNuclideChartX();
  }
}

shred.register( 'NuclideChartX', NuclideChartX );

export default NuclideChartX;