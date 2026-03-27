// Copyright 2023-2026, University of Colorado Boulder

/**
 * Node that holds the ParticleView's from ParticleAtom. Rearranges particles in different node layers using z-indexing.
 * This also has a blue electron cloud around it, and supports an empty atom display too.
 *
 * @author Luisa Vargas
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Multilink from '../../../axon/js/Multilink.js';
import LinearFunction from '../../../dot/js/LinearFunction.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import optionize from '../../../phet-core/js/optionize.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import Color from '../../../scenery/js/util/Color.js';
import RadialGradient from '../../../scenery/js/util/RadialGradient.js';
import AtomInfoUtils from '../AtomInfoUtils.js';
import Particle from '../model/Particle.js';
import ParticleAtom from '../model/ParticleAtom.js';
import ShredColors from '../ShredColors.js';
import ShredConstants from '../ShredConstants.js';
import ParticleView from './ParticleView.js';

// Empirically determined, from the ElectronCloudView radius.
const MIN_ELECTRON_CLOUD_RADIUS = 42.5;

// Default gradient function using ShredColors.electronColorProperty.
const DEFAULT_ELECTRON_CLOUD_FILL_GRADIENT = ( radius: number ): RadialGradient => {
  return new RadialGradient( 0, 0, 0, 0, 0, radius )
    .addColorStop( 0, ShredColors.electronColorProperty.value.withAlpha( 1 ) )
    .addColorStop( 0.9, ShredColors.electronColorProperty.value.withAlpha( 0 ) );
};

type SelfOptions = {
  numberOfNucleonLayers?: number;
  particleRadius?: number;
  electronCloudFillGradient?: ( radius: number ) => RadialGradient;
  showElectronCloud?: boolean;
  protonNumberRange?: Range;
};

export type ParticleAtomNodeOptions = SelfOptions & NodeOptions;

export default class ParticleAtomNode extends Node {

  // Public to set its visibility.
  public readonly electronCloud: Circle;

  // Public to set its visibility and for positioning.
  public readonly emptyAtomCircle: Circle;

  private readonly nucleonLayers: Node[];
  private readonly atomCenter: Vector2;
  private readonly protonNumberRange: Range;
  private readonly electronCloudFillGradient: ( radius: number ) => RadialGradient;

  public constructor( particleAtom: ParticleAtom, atomCenter: Vector2, providedOptions?: ParticleAtomNodeOptions ) {

    const options = optionize<ParticleAtomNodeOptions, SelfOptions, NodeOptions>()( {
      numberOfNucleonLayers: 22,
      particleRadius: ShredConstants.NUCLEON_RADIUS,
      electronCloudFillGradient: DEFAULT_ELECTRON_CLOUD_FILL_GRADIENT,
      showElectronCloud: true,
      protonNumberRange: new Range( 0, 118 )
    }, providedOptions );

    // Add the nucleonLayers.
    const nucleonLayers: Node[] = [];
    _.times( options.numberOfNucleonLayers, () => {
      const nucleonLayer = new Node();
      nucleonLayers.push( nucleonLayer );
    } );

    // Create and add the electron cloud.
    const electronCloud = new Circle( {
      radius: MIN_ELECTRON_CLOUD_RADIUS,
      fill: options.electronCloudFillGradient( MIN_ELECTRON_CLOUD_RADIUS ),
      visible: options.showElectronCloud
    } );
    electronCloud.center = atomCenter;

    // Create and add the dashed empty circle at the center.
    const lineWidth = 1;
    const emptyAtomCircle = new Circle( {
      radius: options.particleRadius - lineWidth,
      stroke: Color.GRAY,
      lineDash: [ 2, 2 ],
      lineWidth: lineWidth
    } );
    emptyAtomCircle.center = atomCenter;

    options.children = [ emptyAtomCircle, electronCloud, ...nucleonLayers ];

    super( options );

    this.nucleonLayers = nucleonLayers;
    this.nucleonLayers.reverse(); // Set up the nucleon layers so that layer 0 is in front.

    this.atomCenter = atomCenter;
    this.protonNumberRange = options.protonNumberRange;
    this.electronCloud = electronCloud;
    this.emptyAtomCircle = emptyAtomCircle;
    this.electronCloudFillGradient = options.electronCloudFillGradient;

    // Only show the emptyAtomCircle when there are zero nucleons.
    Multilink.multilink( [ particleAtom.protonCountProperty, particleAtom.neutronCountProperty ],
      ( protonNumber: number, neutronNumber: number ) => {
        this.emptyAtomCircle.visible = ( protonNumber + neutronNumber ) === 0;
      } );
  }

  /**
   * Add ParticleView for a given particle to the correct nucleonLayer.
   */
  public addParticleView( particle: Particle, particleView: ParticleView ): void {
    this.nucleonLayers[ particle.zLayerProperty.get() ].addChild( particleView );

    // Add a listener that adjusts a nucleon's z-order layering.
    particle.zLayerProperty.link( zLayer => {
      assert && assert(
        this.nucleonLayers.length > zLayer,
        'zLayer for nucleon exceeds number of layers, max number may need increasing.'
      );

      // Determine whether nucleon view is on the correct layer.
      let onCorrectLayer = false;
      const nucleonLayersChildren = this.nucleonLayers[ zLayer ].getChildren() as ParticleView[];
      nucleonLayersChildren.forEach( particleView => {
        if ( particleView.particle === particle ) {
          onCorrectLayer = true;
        }
      } );

      if ( !onCorrectLayer ) {

        // Remove particle view from its current layer.
        let particleView: ParticleView | null = null;
        for ( let layerIndex = 0; layerIndex < this.nucleonLayers.length && particleView === null; layerIndex++ ) {
          for ( let childIndex = 0; childIndex < this.nucleonLayers[ layerIndex ].children.length; childIndex++ ) {
            const nucleonLayersChildren = this.nucleonLayers[ layerIndex ].getChildren() as ParticleView[];
            if ( nucleonLayersChildren[ childIndex ].particle === particle ) {
              particleView = nucleonLayersChildren[ childIndex ];
              this.nucleonLayers[ layerIndex ].removeChildAt( childIndex );
              break;
            }
          }
        }

        // Add the particle view to its new layer.
        assert && assert( particleView, 'Particle view not found during relayering' );
        this.nucleonLayers[ zLayer ].addChild( particleView! );
      }
    } );
  }

  /**
   * This method increases the value of the smaller radius values and decreases the value of the larger ones.
   * This effectively reduces the range of radii values used.
   *
   * minChangedRadius and maxChangedRadius define the way in which an input value is increased or decreased. These values
   * can be adjusted as needed to make the cloud size appear as desired.
   */
  private static reduceRadiusRange( value: number, minShellRadius: number, maxShellRadius: number,
                                    minChangedRadius: number, maxChangedRadius: number ): number {
    const compressionFunction =
      new LinearFunction( minShellRadius, maxShellRadius, minChangedRadius, maxChangedRadius );
    return compressionFunction.evaluate( value );
  }

  /**
   * Maps a number of electrons to a diameter in screen coordinates for the electron shell. This mapping function is
   * based on the real size relationships between the various atoms, but has some tweakable parameters to reduce the
   * range and scale to provide values that are usable for our needs on the canvas.
   */
  private getElectronShellDiameter( numElectrons: number, minChangedRadius: number, maxChangedRadius: number ): number {
    const maxElectrons = this.protonNumberRange.max;
    const atomicRadius = AtomInfoUtils.getAtomicRadius( numElectrons );
    if ( atomicRadius ) {
      return ParticleAtomNode.reduceRadiusRange( atomicRadius, this.protonNumberRange.min + 1, maxElectrons,
        minChangedRadius, maxChangedRadius );
    }
    else {
      assert && assert( numElectrons <= maxElectrons, `Atom has more than supported number of electrons, ${numElectrons}` );
      return 0;
    }
  }

  /**
   * Update size of electron cloud based on protonNumber since the nuclides created are neutral, meaning the number of
   * electrons is the same as the number of protons.
   */
  public updateCloudSize( protonNumber: number, factor: number, minChangedRadius: number, maxChangedRadius: number ): void {
    if ( protonNumber === 0 ) {
      this.electronCloud.radius = 1E-5; // arbitrary non-zero value
      this.electronCloud.fill = 'transparent';
    }
    else {
      const radius = this.atomCenter.x
                     - ( this.getElectronShellDiameter( protonNumber, minChangedRadius, maxChangedRadius ) / 2 );
      this.electronCloud.radius = radius * factor;
      this.electronCloud.fill = this.electronCloudFillGradient( radius * factor );
    }
  }
}
