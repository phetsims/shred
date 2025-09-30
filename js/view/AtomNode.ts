// Copyright 2014-2025, University of Colorado Boulder

/**
 * View representation of the atom. Mostly, this is responsible for displaying and updating the labels, since the atom
 * itself is represented by particles, which take care of themselves in the view.
 *
 * @author John Blanco
 */

import DynamicProperty from '../../../axon/js/DynamicProperty.js';
import Multilink from '../../../axon/js/Multilink.js';
import Property from '../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Shape from '../../../kite/js/Shape.js';
import affirm from '../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import GroupHighlightPath from '../../../scenery/js/accessibility/GroupHighlightPath.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Text from '../../../scenery/js/nodes/Text.js';
import Tandem from '../../../tandem/js/Tandem.js';
import AtomIdentifier from '../AtomIdentifier.js';
import Particle from '../model/Particle.js';
import ParticleAtom from '../model/ParticleAtom.js';
import shred from '../shred.js';
import ShredColors from '../ShredColors.js';
import ShredStrings from '../ShredStrings.js';
import ElectronCloudView from './ElectronCloudView.js';
import ElectronShellView from './ElectronShellView.js';
import ParticleView from './ParticleView.js';

const minusSignIonStringProperty = ShredStrings.minusSignIonStringProperty;
const neutralAtomStringProperty = ShredStrings.neutralAtomStringProperty;
const positiveSignIonStringProperty = ShredStrings.positiveSignIonStringProperty;
const stableStringProperty = ShredStrings.stableStringProperty;
const unstableStringProperty = ShredStrings.unstableStringProperty;

// constants
const ELEMENT_NAME_FONT_SIZE = 22;
const ION_FONT_SIZE = 20;
const INITIAL_NUMBER_OF_PARTICLE_LAYERS = 8;

// This constant exists for error checking.  We should probably never need more layers than this, but if we do, this
// value can be adjusted.
const MAX_NUMBER_OF_PARTICLE_LAYERS = 20;

export const ElectronShellDepictionValues = [ 'shells', 'cloud' ] as const;
export type ElectronShellDepiction = typeof ElectronShellDepictionValues[number];

type SelfOptions = {
  showCenterX?: boolean;
  showElementNameProperty?: TReadOnlyProperty<boolean>;
  showNeutralOrIonProperty?: TReadOnlyProperty<boolean>;
  showStableOrUnstableProperty?: TReadOnlyProperty<boolean>;
  electronShellDepictionProperty?: TReadOnlyProperty<ElectronShellDepiction>;
};

export type AtomNodeOptions = SelfOptions & NodeOptions;

type NumberToVoidFunction = ( value: number ) => void;

class AtomNode extends Node {
  private readonly atom: ParticleAtom;

  private particleLayers: Node[] = [];

  // This text can be hidden if protons=0 or if the option is set to hide it.
  private readonly elementNameText: Text;

  private readonly ionIndicatorText: Text;
  private readonly stabilityIndicatorText: Text;
  private readonly disposeAtomNode: VoidFunction;

  // Map of zLayer listeners for nucleons, so that they can be removed when the nucleon is removed.
  private readonly zLayerListeners: Map<ParticleView, NumberToVoidFunction> = new Map<ParticleView, NumberToVoidFunction>();

  /**
   * @param atom - Model that represents the atom, including particle positions
   * @param modelViewTransform - Model-View transform
   * @param providedOptions
   */
  public constructor( atom: ParticleAtom, modelViewTransform: ModelViewTransform2, providedOptions?: AtomNodeOptions ) {
    const options = optionize<AtomNodeOptions, SelfOptions, NodeOptions>()( {
      showCenterX: true,
      showElementNameProperty: new Property( true ),
      showNeutralOrIonProperty: new Property( true ),
      showStableOrUnstableProperty: new Property( true ),
      electronShellDepictionProperty: new Property( 'shells' ),
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super();

    this.atom = atom;

    // Create the X where the nucleus goes.
    let countListener: VoidFunction | null = null;
    let atomCenterMarker: Path | null = null;
    if ( options.showCenterX ) {
      const sizeInPixels = modelViewTransform.modelToViewDeltaX( 20 );
      const center = modelViewTransform.modelToViewPosition( atom.positionProperty.get() );
      const centerMarker = new Shape();
      centerMarker.moveTo( center.x - sizeInPixels / 2, center.y - sizeInPixels / 2 );
      centerMarker.lineTo( center.x + sizeInPixels / 2, center.y + sizeInPixels / 2 );
      centerMarker.moveTo( center.x - sizeInPixels / 2, center.y + sizeInPixels / 2 );
      centerMarker.lineTo( center.x + sizeInPixels / 2, center.y - sizeInPixels / 2 );
      atomCenterMarker = new Path( centerMarker, {
        stroke: ShredColors.centerXColorProperty,
        lineWidth: 5,
        pickable: false
      } );
      this.addChild( atomCenterMarker );

      // Make the marker invisible if any nucleons are present.
      countListener = () => {
        atomCenterMarker!.visible = atom.getWeight() === 0;
      };
      atom.electronCountProperty.link( countListener );
      atom.neutronCountProperty.link( countListener );
      atom.protonCountProperty.link( countListener );
    }

    // Add the electron shells and cloud.
    const electronShell = new ElectronShellView( atom, modelViewTransform );
    this.addChild( electronShell );
    const electronCloud = new ElectronCloudView( atom, modelViewTransform, {
      tandem: options.tandem.createTandem( 'electronCloud' )
    } );
    this.addChild( electronCloud );

    // Current string properties for the symbol text and element caption
    const currentElementStringProperty = new Property( AtomIdentifier.getName( 0 ) );
    const elementDynamicStringProperty = new DynamicProperty( currentElementStringProperty );

    // Create the textual readout for the element name.
    this.elementNameText = new Text( '', {
      font: new PhetFont( ELEMENT_NAME_FONT_SIZE ),
      fill: ShredColors.positiveColorProperty,
      pickable: false,
      maxWidth: 100
    } );

    this.addChild( this.elementNameText );

    // For color contrast issues, we set different positions for the element name text depending on the depiction.
    const updateTextPosition = () => {
      const heightPerElectron = 5;
      const electrons = atom.electronCountProperty.value;
      const initialHeight = atom.innerElectronShellRadius * 0.60;

      // In orbit mode, the text height does not change
      const positionInShellsDepiction = modelViewTransform.modelToViewPosition(
        atom.positionProperty.get().plus( new Vector2( 0, initialHeight ) )
      );

      // In cloud mode, the text height changes based on the number of electrons.
      const positionInCloudDepiction = modelViewTransform.modelToViewPosition(
        atom.positionProperty.get().plus( new Vector2( 0, initialHeight + heightPerElectron * electrons ) )
      );

      this.elementNameText.center = options.electronShellDepictionProperty.value === 'shells' ?
                                    positionInShellsDepiction : positionInCloudDepiction;
    };

    const updateElectronShellDepictionVisibility = ( depiction: ElectronShellDepiction ) => {
      electronShell.visible = depiction === 'shells';
      electronCloud.visible = depiction === 'cloud';

      updateTextPosition();
    };
    options.electronShellDepictionProperty.link( updateElectronShellDepictionVisibility );

    // Define the update function for the element name.
    const updateElementName = () => {
      const protonCount = this.atom.protonCountProperty.get();

      if ( protonCount > 0 ) {
        // Update the string property for the element caption.
        const elementNameProperty = AtomIdentifier.getName( protonCount );
        currentElementStringProperty.value = elementNameProperty;
        this.elementNameText.string = elementNameProperty.value;
      }
      else {
        this.elementNameText.string = '';
      }

      updateTextPosition();
    };
    updateElementName(); // Do the initial update.

    // Hook up update listeners.
    atom.particleCountProperty.link( updateElementName );

    // Updating the element if the element string property changes.
    elementDynamicStringProperty.link( updateElementName );

    const updateElementNameVisibility = ( visible: boolean ) => {
      this.elementNameText.visible = visible;
    };
    options.showElementNameProperty.link( updateElementNameVisibility );

    const ionIndicatorTextTranslation = modelViewTransform.modelToViewPosition( atom.positionProperty.get().plus(
      new Vector2( atom.outerElectronShellRadius * 1.05, 0 ).rotated( Math.PI * 0.3 ) ) );

    // Create the textual readout for the ion indicator, set by trial and error.
    this.ionIndicatorText = new Text( '', {
      font: new PhetFont( ION_FONT_SIZE ),
      fill: 'black',
      translation: ionIndicatorTextTranslation,
      pickable: false,
      maxWidth: 150
    } );
    this.addChild( this.ionIndicatorText );

    // Define the update function for the ion indicator.
    const updateIonIndicator = () => {
      if ( this.atom.protonCountProperty.get() > 0 ) {
        const charge = this.atom.getCharge();
        if ( charge < 0 ) {
          this.ionIndicatorText.string = minusSignIonStringProperty.value;
          this.ionIndicatorText.fill = 'blue';
        }
        else if ( charge > 0 ) {
          this.ionIndicatorText.string = positiveSignIonStringProperty.value;
          this.ionIndicatorText.fill = ShredColors.positiveColorProperty;
        }
        else {
          this.ionIndicatorText.string = neutralAtomStringProperty.value;
          this.ionIndicatorText.fill = 'black';
        }
      }
      else {
        this.ionIndicatorText.string = '';
        this.ionIndicatorText.fill = 'black';
      }
    };
    updateIonIndicator(); // Do the initial update.

    Multilink.lazyMultilink(
      [
        minusSignIonStringProperty,
        positiveSignIonStringProperty,
        neutralAtomStringProperty
      ],
      updateIonIndicator
    );

    atom.protonCountProperty.link( updateIonIndicator );
    atom.electronCountProperty.link( updateIonIndicator );
    const updateIonIndicatorVisibility = ( visible: boolean ) => {
      this.ionIndicatorText.visible = visible;
    };
    options.showNeutralOrIonProperty.link( updateIonIndicatorVisibility );

    // Create the textual readout for the stability indicator.
    const stabilityIndicatorTextCenterPos = modelViewTransform.modelToViewPosition( atom.positionProperty.get().plus(
      new Vector2( 0, -atom.innerElectronShellRadius * 0.60 ) ) );

    this.stabilityIndicatorText = new Text( '', {
      font: new PhetFont( 20 ),
      fill: 'black',
      center: stabilityIndicatorTextCenterPos,
      pickable: false,
      maxWidth: modelViewTransform.modelToViewDeltaX( atom.innerElectronShellRadius * 1.4 )
    } );
    this.addChild( this.stabilityIndicatorText );

    // Define the update function for the stability indicator.
    const updateStabilityIndicator = () => {
      if ( this.atom.protonCountProperty.get() > 0 ) {
        if ( AtomIdentifier.isStable( this.atom.protonCountProperty.get(), this.atom.neutronCountProperty.get() ) ) {
          this.stabilityIndicatorText.string = stableStringProperty.value;
        }
        else {
          this.stabilityIndicatorText.string = unstableStringProperty.value;
        }
      }
      else {
        this.stabilityIndicatorText.string = '';
      }
      this.stabilityIndicatorText.center = stabilityIndicatorTextCenterPos;
    };
    updateStabilityIndicator(); // Do initial update.

    Multilink.lazyMultilink(
      [
        stableStringProperty,
        unstableStringProperty
      ],
      updateStabilityIndicator
    );

    // Add the layers where the particle views will reside.  The lower the index number, the closer to the front.
    // Layer 0 is the front layer, and is reserved for particles that are being dragged and electrons.  The other layers
    // are used for the nucleons to create the depth effect.
    _.times( INITIAL_NUMBER_OF_PARTICLE_LAYERS, () => {
      const nucleonLayer = new Node();
      this.particleLayers.push( nucleonLayer );
      this.addChild( nucleonLayer );
    } );
    this.particleLayers.reverse(); // Set up the nucleon layers so that layer 0 is in front.

    // Add the listeners that control the label content and visibility.
    atom.protonCountProperty.link( updateStabilityIndicator );
    atom.neutronCountProperty.link( updateStabilityIndicator );
    const updateStabilityIndicatorVisibility = ( visible: boolean ) => {
      this.stabilityIndicatorText.visible = visible;
    };
    options.showStableOrUnstableProperty.link( updateStabilityIndicatorVisibility );

    this.disposeAtomNode = () => {

      electronCloud.dispose();

      if ( countListener ) {
        atom.electronCountProperty.unlink( countListener );
        atom.neutronCountProperty.unlink( countListener );
        atom.protonCountProperty.unlink( countListener );
      }

      options.electronShellDepictionProperty.unlink( updateElectronShellDepictionVisibility );
      atom.protonCountProperty.unlink( updateElementName );
      options.showElementNameProperty.unlink( updateElementNameVisibility );
      atom.protonCountProperty.unlink( updateIonIndicator );
      atom.electronCountProperty.unlink( updateIonIndicator );
      options.showNeutralOrIonProperty.unlink( updateIonIndicatorVisibility );
      atom.protonCountProperty.unlink( updateStabilityIndicator );
      atom.neutronCountProperty.unlink( updateStabilityIndicator );
      options.showStableOrUnstableProperty.unlink( updateStabilityIndicatorVisibility );
      atomCenterMarker && atomCenterMarker.dispose();
      electronShell.dispose();
      this.elementNameText.dispose();
      this.ionIndicatorText.dispose();
      this.stabilityIndicatorText.dispose();
    };

    this.mutate( options );

    // Add the model as a linked element so that it can be easily navigated to in the phet-io tree.
    this.addLinkedElement( this.atom );

    this.groupFocusHighlight = new GroupHighlightPath(
      new Shape().circle(
        modelViewTransform.modelToViewPosition( atom.positionProperty.value ),
        modelViewTransform.modelToViewDeltaX( atom.outerElectronShellRadius * 1.1 )
      )
    );
  }

  /**
   * Add a particle view to this atom view, placing it in the appropriate layer based on its type and zLayerProperty.
   */
  public addParticleView( particleView: ParticleView ): void {
    if ( particleView.particle.type === 'electron' ) {

      // Electrons always go in the front layer.
      this.particleLayers[ 0 ].addChild( particleView );
    }
    else {

      // Define a listener that will adjust the layer of the particle view when its zLayerProperty changes.
      const zLayerListener = ( layerIndex: number ) => {

        affirm( layerIndex < MAX_NUMBER_OF_PARTICLE_LAYERS, 'This seems like an excessive number of layers.' );

        // Track whether the particle is focused so that we can maintain focus when changing layers.
        let particleHasFocus = false;

        // If the particle is currently a child, remove it from its current layer.
        this.particleLayers.forEach( particleLayer => {
          if ( particleLayer.children.includes( particleView ) ) {
            if ( particleView.focused ) {
              particleHasFocus = true;
            }
            particleLayer.removeChild( particleView );
          }
        } );

        // If there are not enough layers, add more.
        while ( layerIndex >= this.particleLayers.length ) {
          const newLayer = new Node();
          this.particleLayers.push( newLayer );
          this.addChild( newLayer );
          newLayer.moveToBack();
        }

        // Add the particle to the correct layer.
        this.particleLayers[ layerIndex ].addChild( particleView );

        // If the particle had focus, restore it.
        if ( particleHasFocus ) {
          particleView.focus();
        }
      };

      // Hook up the lister, which will also do the initial placement.
      particleView.particle.zLayerProperty.link( zLayerListener );

      // Add this listener to a Map so that we can remove it when the particle is removed.
      this.zLayerListeners.set( particleView, zLayerListener );
    }
  }

  /**
   * Remove a particle view from this atom view.
   */
  public removeParticleView( particleView: ParticleView ): void {

    // Remove the particle view from whichever layer it is in.
    let listenerFound = false;
    this.particleLayers.forEach( particleLayer => {
      if ( particleLayer.children.includes( particleView ) ) {
        particleLayer.removeChild( particleView );
        listenerFound = true;
      }
    } );

    affirm( listenerFound, 'The particle view is not a child of this node.' );

    if ( particleView.particle.type !== 'electron' ) {

      // Remove the zLayer listener.
      const zLayerListener = this.zLayerListeners.get( particleView );
      affirm( zLayerListener, 'There should be a zLayer listener for this particle view.' );
      particleView.particle.zLayerProperty.unlink( zLayerListener );
      this.zLayerListeners.delete( particleView );
    }
  }

  /**
   * Get the ParticleView for a given particle, or null if it is not found.
   */
  public getParticleView( particle: Particle ): ParticleView | null {
    let particleView: ParticleView | null = null;
    for ( const particleLayer of this.particleLayers ) {
      for ( const child of particleLayer.children ) {
        if ( child instanceof ParticleView && child.particle === particle ) {
          particleView = child;
        }
      }
    }
    return particleView;
  }

  public override addChild( node: Node, isComposite?: boolean ): this {
    affirm( !( node instanceof ParticleView ), 'Use addParticleView to add ParticleViews' );
    return super.addChild( node, isComposite );
  }

  public override removeChild( node: Node, isComposite?: boolean ): this {
    affirm( !( node instanceof ParticleView ), 'Use removeParticleView to remove ParticleViews' );
    return super.removeChild( node, isComposite );
  }

  public override dispose(): void {
    this.disposeAtomNode();
    super.dispose();
  }
}

shred.register( 'AtomNode', AtomNode );
export default AtomNode;