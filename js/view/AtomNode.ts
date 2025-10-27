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
import { equalsEpsilon } from '../../../dot/js/util/equalsEpsilon.js';
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
import Particle, { ParticleType } from '../model/Particle.js';
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
const DISTANCE_TESTING_TOLERANCE = 1e-6;

// This constant exists for error checking.  We should probably never need more layers than this, but if we do, this
// value can be adjusted.
const MAX_NUMBER_OF_PARTICLE_LAYERS = 20;

export const ElectronShellDepictionValues = [ 'shells', 'cloud' ] as const;
export type ElectronShellDepiction = typeof ElectronShellDepictionValues[number];
export type FocusUpdateDirection = 'forward' | 'backward';

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

  public readonly electronCloud: ElectronCloudView;
  private readonly electronShellDepictionProperty: TReadOnlyProperty<ElectronShellDepiction>;
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
    this.electronShellDepictionProperty = options.electronShellDepictionProperty;

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
    this.electronCloud = new ElectronCloudView( atom, modelViewTransform, {
      tandem: options.tandem.createTandem( 'electronCloud' )
    } );
    this.addChild( this.electronCloud );

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
      this.electronCloud.visible = depiction === 'cloud';
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
      new Vector2( atom.outerElectronShellRadius * 1.15, 0 ).rotated( Math.PI * 0.35 ) ) );

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

    // Set up listeners that will update the alt-input state of the particles as conditions in the atom and view change.
    const updateParticleViewAltInputState = this.updateParticleViewAltInputState.bind( this );
    atom.particleCountProperty.lazyLink( updateParticleViewAltInputState );
    options.electronShellDepictionProperty.lazyLink( updateParticleViewAltInputState );
    const particleArrays = [ atom.protons, atom.neutrons, atom.electrons ];
    particleArrays.forEach( particleArray => {
      particleArray.addItemAddedListener(
        particle => particle.animationEndedEmitter.addListener( updateParticleViewAltInputState )
      );
      particleArray.addItemRemovedListener(
        particle => particle.animationEndedEmitter.removeListener( updateParticleViewAltInputState )
      );
    } );

    // Create the disposal function.
    this.disposeAtomNode = () => {

      this.electronCloud.dispose();

      if ( countListener ) {
        atom.electronCountProperty.unlink( countListener );
        atom.neutronCountProperty.unlink( countListener );
        atom.protonCountProperty.unlink( countListener );
      }

      options.electronShellDepictionProperty.unlink( updateElectronShellDepictionVisibility );
      options.electronShellDepictionProperty.unlink( updateParticleViewAltInputState );
      atom.protonCountProperty.unlink( updateElementName );
      options.showElementNameProperty.unlink( updateElementNameVisibility );
      atom.protonCountProperty.unlink( updateIonIndicator );
      atom.electronCountProperty.unlink( updateIonIndicator );
      options.showNeutralOrIonProperty.unlink( updateIonIndicatorVisibility );
      atom.protonCountProperty.unlink( updateStabilityIndicator );
      atom.neutronCountProperty.unlink( updateStabilityIndicator );
      options.showStableOrUnstableProperty.unlink( updateStabilityIndicatorVisibility );
      atom.particleCountProperty.unlink( updateParticleViewAltInputState );
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
  public addParticleView( particleView: ParticleView, setFocused = false ): void {
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

    // Set focus to the particle if requested.
    setFocused && particleView.focus();
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
  private getParticleView( particle: Particle ): ParticleView | null {
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

  /**
   * Get all ParticleViews that are children of this AtomNode.
   */
  private getAllParticleViews(): ParticleView[] {
    const particleViews: ParticleView[] = [];
    for ( const particleLayer of this.particleLayers ) {
      for ( const child of particleLayer.children ) {
        if ( child instanceof ParticleView ) {
          particleViews.push( child );
        }
      }
    }
    return particleViews;
  }

  /**
   * Update the PDOM visibility and focusability of the particles that comprise the atom based on the current model and
   * view state.  The main things we are trying to accomplish here are:
   * 1.  Make sure that at least one particle in the atom is focusable, so that the tab order has something to land on.
   * 2.  Make sure that only one particle is focusable at a time so that there is a single tab stop for the atom.
   * 3.  Make sure that only a small number of particles are PDOM visible at a time, so that the PDOM is not
   *     overwhelming.  There should be at max one proton, one neutron, and one electron from each shell visible in the
   *     PDOM, plus the particle being dragged.
   */
  private updateParticleViewAltInputState(): void {

    // Get a list of all particle views that are currently children of this node.
    const allParticleViews = this.getAllParticleViews();

    // Extract the particle views that are for protons.
    const protonViews = allParticleViews.filter( pv => pv.particle.type === 'proton' );

    // Find out whether there is a currently focused proton.
    const focusedProtonView = protonViews.find( pv => pv.focused );

    // If there is a focused proton that is in the atom, then we don't need to do anything further for protons.
    // If there isn't, and there are proton views present, we need to make one of them PDOM visible.
    let otherPdomVisibleProtonView: ParticleView | null = null;
    if ( !focusedProtonView || !this.atom.protons.includes( focusedProtonView.particle ) ) {

      // Get the proton view that is closest to the center of the atom, and make it PDOM visible.
      otherPdomVisibleProtonView = this.getFirstFocusParticleView( 'proton' );
    }

    // Update the PDOM visibility for the proton views.
    protonViews.forEach( protonView => {
      protonView.pdomVisible = protonView === focusedProtonView ||
                               protonView === otherPdomVisibleProtonView;
    } );

    // Repeat the process for the neutrons
    const neutronViews = allParticleViews.filter( nv => nv.particle.type === 'neutron' );
    const focusedNeutronView = neutronViews.find( nv => nv.focused );
    let otherPdomVisibleNeutronView: ParticleView | null = null;
    if ( !focusedNeutronView || !this.atom.neutrons.includes( focusedNeutronView.particle ) ) {
      otherPdomVisibleNeutronView = this.getFirstFocusParticleView( 'neutron' );
    }
    neutronViews.forEach( neutronView => {
      neutronView.pdomVisible = neutronView === focusedNeutronView ||
                                neutronView === otherPdomVisibleNeutronView;
    } );

    // electrons
    if ( this.electronShellDepictionProperty.value === 'shells' ) {

      // Get a list of all electrons currently in the inner shell.
      const innerShellElectrons = this.atom.electrons.filter( e => this.getElectronShellNumber( e ) === 0 );

      // Get the views associated with the inner shell electrons.
      const innerShellElectronViews = allParticleViews.filter( pv => innerShellElectrons.includes( pv.particle ) );

      // Find out whether there is a currently focused inner shell electron.
      const focusedInnerShellElectronView = innerShellElectronViews.find( e => e.focused );

      // If there is a focused inner shell electron that is in the atom, then we don't need to do anything further for
      // inner shell electrons.  Otherwise, we need to make sure that one inner shell electron is PDOM visible.
      let otherPdomVisibleInnerShellElectronView: ParticleView | null = null;
      if ( !focusedInnerShellElectronView || !this.atom.electrons.includes( focusedInnerShellElectronView.particle ) ) {

        // For consistent behavior, sort these by closest to the top of the atom.
        innerShellElectronViews.sort(
          ( ev1, ev2 ) => ev1.particle.destinationProperty.value.y - ev2.particle.destinationProperty.value.y
        );

        otherPdomVisibleInnerShellElectronView = innerShellElectronViews[ 0 ];
      }

      // Update the PDOM visibility for the inner shell electron views.
      innerShellElectronViews.forEach( electronView => {
        electronView.pdomVisible = electronView === focusedInnerShellElectronView ||
                                   electronView === otherPdomVisibleInnerShellElectronView;
      } );

      // Repeat the process for the outer shell electrons.
      const outerShellElectrons = this.atom.electrons.filter( e => this.getElectronShellNumber( e ) === 1 );
      const outerShellElectronViews = allParticleViews.filter( pv => outerShellElectrons.includes( pv.particle ) );
      const focusedOuterShellElectronView = outerShellElectronViews.find( e => e.focused );
      let otherPdomVisibleOuterShellElectronView: ParticleView | null = null;
      if ( !focusedOuterShellElectronView || !this.atom.electrons.includes( focusedOuterShellElectronView.particle ) ) {
        outerShellElectronViews.sort(
          ( ev1, ev2 ) => ev1.particle.destinationProperty.value.y - ev2.particle.destinationProperty.value.y
        );
        otherPdomVisibleOuterShellElectronView = outerShellElectronViews[ 0 ];
      }
      outerShellElectronViews.forEach( electronView => {
        electronView.pdomVisible = electronView === focusedOuterShellElectronView ||
                                   electronView === otherPdomVisibleOuterShellElectronView;
      } );

      // Make sure the electron cloud is not PDOM visible.
      this.electronCloud.pdomVisible = false;
    }
    else {

      // The electrons are currently being represented as a cloud.  The electrons won't show up in the PDOM since they
      // are made invisible by other portions of the code, so we don't need to worry about them here.  We do need to
      // set the PDOM visibility of the electron cloud.
      this.electronCloud.pdomVisible = this.atom.electrons.length > 0;
    }

    // If there is at least one particle in the atom, then something should be focusable so that the tab order has
    // something to land on.  Make sure that this is the case.
    const focusedParticle = allParticleViews.find( pv => pv.focused );
    if ( allParticleViews.length > 0 && !focusedParticle ) {
      const focusableParticleViews = allParticleViews.filter( pv => pv.focusable );
      const pdomVisibleParticleViews = allParticleViews.filter( pv => pv.pdomVisible );
      if ( !( focusableParticleViews.length === 1 && pdomVisibleParticleViews.includes( focusableParticleViews[ 0 ] ) ) ) {
        for ( const particleType of [ 'proton', 'neutron', 'electron' ] as ParticleType[] ) {
          const focusableParticleView = this.getFirstFocusParticleView( particleType );
          if ( focusableParticleView ) {
            focusableParticleView.focusable = true;
            this.makeAllOtherParticleViewsNotFocusable( focusableParticleView );
            break;
          }
        }
      }
    }
  }

  /**
   * Override this function so that clients don't use it directly.
   */
  public override addChild( node: Node, isComposite?: boolean ): this {
    affirm( !( node instanceof ParticleView ), 'Use addParticleView to add ParticleViews' );
    return super.addChild( node, isComposite );
  }

  /**
   * Override this function so that clients don't use it directly.
   */
  public override removeChild( node: Node, isComposite?: boolean ): this {
    affirm( !( node instanceof ParticleView ), 'Use removeParticleView to remove ParticleViews' );
    return super.removeChild( node, isComposite );
  }

  /**
   * Get the first particle view in the atom of the specified type that should receive focus.  This should be based on
   * its proximity to the center of the atom and, if two particles are at the same distance, then the one that is
   * furthest in front (lowest zLayerProperty value).
   */
  private getFirstFocusParticleView( particleType: ParticleType ): ParticleView | null {

    // Get all particles of the specified type.
    const particles = particleType === 'proton' ? this.atom.protons :
                      particleType === 'neutron' ? this.atom.neutrons :
                      particleType === 'electron' ? this.atom.electrons : [];

    if ( particles.length === 0 ) {
      return null;
    }

    // Sort the particles based on distance to the center of the atom, and then by zLayerProperty value.
    const atomCenter = this.atom.positionProperty.value;
    const sortedParticles = [ ...particles ].sort( ( a, b ) => {
      const aDistance = a.positionProperty.value.distance( atomCenter );
      const bDistance = b.positionProperty.value.distance( atomCenter );
      if ( aDistance !== bDistance ) {
        return aDistance - bDistance;
      }
      else {
        return a.zLayerProperty.value - b.zLayerProperty.value;
      }
    } );

    // Get the ParticleView for the first particle in the sorted list.
    return this.getParticleView( sortedParticles[ 0 ] );
  }

  /**
   * Get the shell number (0 for inner, 1 for outer) for the provided electron.  If the electron is not in the atom,
   * or if it is not in either shell, -1 is returned.
   */
  private getElectronShellNumber( electron: Particle ): number {
    affirm( electron.type === 'electron', 'The provided particle must be an electron' );
    let electronShellNumber = -1;
    if ( this.atom.electrons.includes( electron ) ) {
      const distance = electron.destinationProperty.value.distance( this.atom.positionProperty.value );
      if ( equalsEpsilon( distance, this.atom.innerElectronShellRadius, DISTANCE_TESTING_TOLERANCE ) ) {
        electronShellNumber = 0;
      }
      else if ( equalsEpsilon( distance, this.atom.outerElectronShellRadius, DISTANCE_TESTING_TOLERANCE ) ) {
        electronShellNumber = 1;
      }
      else {

        // The electron is not currently at either the inner or outer radius, which means that it has probably just been
        // added to the atom.  In this case, we essentially need to deduce the shell it is headed for based on the
        // number of electrons already present.
        electronShellNumber = this.atom.electrons.length <= 2 ? 0 : 1;
      }
    }
    return electronShellNumber;
  }

  /**
   * Update which particle in the atom has focus based on the current particle that has focus and the direction to move.
   * This is for alt-input support.  If no node is supplied, then the focus will be set to the first available particle
   * in the atom.
   */
  public shiftParticleFocus( currentlyFocusedNode: ParticleView | ElectronCloudView | null,
                             direction: FocusUpdateDirection ): void {

    affirm(
      currentlyFocusedNode === null || currentlyFocusedNode.focused,
      'The provided particle view or electron cloud must have focus for this to work.'
    );

    // This array will be populated with the nodes that are eligible to receive focus, in the order in which they
    // should receive focus.
    const focusOrder: ( ParticleView | ElectronCloudView )[] = [];

    let particleType: ParticleType | null;
    if ( currentlyFocusedNode ) {
      if ( currentlyFocusedNode instanceof ParticleView ) {
        particleType = currentlyFocusedNode.particle.type;
      }
      else {

        // The provided node must be the electron cloud.
        particleType = 'electron';
      }
    }
    else {
      particleType = null;
    }

    if ( currentlyFocusedNode && particleType === 'proton' ) {
      focusOrder.push( currentlyFocusedNode );
    }
    else {
      const firstFocusableProtonView = this.getFirstFocusParticleView( 'proton' );
      if ( firstFocusableProtonView ) {
        focusOrder.push( firstFocusableProtonView );
      }
    }

    if ( currentlyFocusedNode && particleType === 'neutron' ) {
      focusOrder.push( currentlyFocusedNode );
    }
    else {
      const firstFocusableNeutronView = this.getFirstFocusParticleView( 'neutron' );
      if ( firstFocusableNeutronView ) {
        focusOrder.push( firstFocusableNeutronView );
      }
    }

    if ( this.atom.electrons.length > 0 ) {
      if ( this.electronShellDepictionProperty.value === 'cloud' ) {

        // We are in cloud mode, so add the cloud to the focus order.
        focusOrder.push( this.electronCloud );
      }
      else {

        let electronShellNumber = -1;
        if ( particleType === 'electron' ) {
          electronShellNumber = this.getElectronShellNumber( ( currentlyFocusedNode as ParticleView ).particle );
        }

        // Define a couple of closure functions that will help with adding electrons to the focus order.
        const addInnerElectronToFocusOrder = () => {
          const electronsInInnerShell = [ ...this.atom.electrons ].filter( e =>
            this.getElectronShellNumber( e ) === 0
          );
          if ( electronsInInnerShell.length > 0 ) {
            const innerShellElectron = this.getParticleView( electronsInInnerShell[ 0 ] );
            affirm( innerShellElectron, 'Missing ParticleView for electron in inner shell' );
            focusOrder.push( innerShellElectron );
          }
        };
        const addOuterElectronToFocusOrder = () => {
          const electronsInOuterShell = [ ...this.atom.electrons ].filter( electron =>
            this.getElectronShellNumber( electron ) === 1
          );
          if ( electronsInOuterShell.length > 0 ) {
            const outerShellElectron = this.getParticleView( electronsInOuterShell[ 0 ] );
            affirm( outerShellElectron, 'Missing ParticleView for electron in outer shell' );
            focusOrder.push( outerShellElectron );
          }
        };

        if ( electronShellNumber === -1 ) {

          // The provided particle is not an electron, so add one electron from each shell, inner first.
          addInnerElectronToFocusOrder();
          addOuterElectronToFocusOrder();
        }
        else if ( currentlyFocusedNode && electronShellNumber === 0 ) {

          // The provided particle is an electron in the inner shell, so add it first, then add an electron from the
          // outer shell if there is one.
          focusOrder.push( currentlyFocusedNode );
          addOuterElectronToFocusOrder();
        }
        else {

          // The provided particle is an electron in the outer shell, so add one from the inner shell first, then add
          // this one.
          addInnerElectronToFocusOrder();
          currentlyFocusedNode && focusOrder.push( currentlyFocusedNode );
        }
      }
    }

    // If there is something available in the atom to shift focus to, do so.
    if ( focusOrder.length > 0 ) {
      const currentIndex = currentlyFocusedNode === null ?
                           focusOrder.length - 1 :
                           focusOrder.indexOf( currentlyFocusedNode );
      let newIndex;
      if ( direction === 'forward' ) {
        newIndex = ( currentIndex + 1 ) % focusOrder.length;
      }
      else {
        newIndex = ( currentIndex - 1 + focusOrder.length ) % focusOrder.length;
      }

      // Set focus to the new node.
      const focusedParticleView = focusOrder[ newIndex ];
      focusedParticleView.pdomVisible = true;
      focusedParticleView.focusable = true;
      focusedParticleView.focus();

      // For every other particle node in the atom, set focusable to false so there is only one focusable particle.
      this.makeAllOtherParticleViewsNotFocusable( focusedParticleView );
    }

    // Update the PDOM visibility of the particles in the atom.
    this.updateParticleViewAltInputState();
  }

  public makeAllOtherParticleViewsNotFocusable( focusedParticleView: ParticleView | ElectronCloudView ): void {
    this.getAllParticleViews().forEach( particleView => {
      if ( particleView !== focusedParticleView ) {
        particleView.focusable = false;
      }
    } );
  }

  public override dispose(): void {
    this.disposeAtomNode();
    super.dispose();
  }

}

shred.register( 'AtomNode', AtomNode );
export default AtomNode;