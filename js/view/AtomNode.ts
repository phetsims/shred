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
import isResettingAllProperty from '../../../scenery-phet/js/isResettingAllProperty.js';
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
    const particleArrays = [ atom.protons, atom.neutrons, atom.electrons ];
    particleArrays.forEach( particleArray => {
      particleArray.addItemAddedListener(
        particle => particle.animationEndedEmitter.addListener( updateParticleViewAltInputState )
      );
      particleArray.addItemRemovedListener(
        particle => particle.animationEndedEmitter.removeListener( updateParticleViewAltInputState )
      );
    } );

    // Set up a listener that will shift focusability between electrons and the electron cloud when the depiction
    // changes.
    options.electronShellDepictionProperty.lazyLink( electronShellDepiction => {
      if ( electronShellDepiction === 'shells' ) {
        if ( this.electronCloud.focusable ) {

          // The cloud is currently focusable, so we need to transfer focusability to an electron.  Choose using the
          // same method as in updateParticleViewAltInputState.
          const innerShellElectrons = atom.electrons.filter( e => this.getElectronShellNumber( e ) === 0 );
          innerShellElectrons.sort( ( e1, e2 ) => e2.destinationProperty.value.x - e1.destinationProperty.value.x );
          const firstElectronView = this.getParticleView( innerShellElectrons[ 0 ] );
          affirm(
            firstElectronView || isResettingAllProperty.value,
            'There should be at least one electron view if the cloud is focusable (except maybe during reset).'
          );
          if ( firstElectronView ) {
            firstElectronView.focusable = true;
          }
          this.electronCloud.focusable = false;
        }

        // Make sure individual electrons are not PDOM visible.
        this.getAllParticleViews().forEach( pv => {
          if ( pv.particle.type === 'electron' ) {
            pv.pdomVisible = false;
          }
        } );
      }
      else {

        // The depiction is now cloud, so if any electrons are focusable, transfer focusability to the cloud.
        const focusableElectronViews = this.getAllParticleViews().filter(
          pv => pv.particle.type === 'electron' && pv.focusable
        );
        if ( focusableElectronViews.length > 0 ) {

          // One or more electrons are currently focusable, so we need to transfer focusability to the cloud.
          this.electronCloud.focusable = true;
          focusableElectronViews.forEach( ev => {
            ev.focusable = false;
          } );
        }
      }
      this.updateParticleViewAltInputState();
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

    this.updateParticleViewAltInputState();
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
  public updateParticleViewAltInputState(): void {

    // Get a list of all particle views that are currently children of this node.  This will potentially include
    // particle views whose particles are not currently in the atom if they are being dragged.
    const allParticleViews = this.getAllParticleViews();

    // If there is a focused particle that is currently being dragged, make sure it's the only thing that is focusable.
    const focusedAndDraggingParticleView = allParticleViews.find( pv => pv.focused && pv.particle.isDraggingProperty.value );
    if ( focusedAndDraggingParticleView ) {
      this.makeAllOtherParticleViewsNotFocusable( focusedAndDraggingParticleView );
    }

    const nucleonSortingFunction = ( p1: Particle, p2: Particle ) => {
      const atomCenter = this.atom.positionProperty.value;
      const p1Distance = p1.positionProperty.value.distance( atomCenter );
      const p2Distance = p2.positionProperty.value.distance( atomCenter );
      return p1Distance - p2Distance;
    };

    // Handle PDOM visibility for the nucleons (i.e. protons and neutrons).
    const nucleonTypes = [ 'proton', 'neutron' ] as ParticleType[];
    nucleonTypes.forEach( nucleonType => {
      const nucleonViews = allParticleViews.filter(
        pv => pv.particle.type === nucleonType && this.atom.containsParticle( pv.particle )
      );
      const numberOfPdomVisibleNucleonViews = nucleonViews.filter( pv => pv.pdomVisible ).length;
      if ( nucleonViews.length > 0 && numberOfPdomVisibleNucleonViews !== 1 ) {

        // The most common case for this is that a nucleon was just added so now there are two visible.  In that case,
        // keep only the one that has focus visible in the PDOM.
        const focusedNucleonView = nucleonViews.find( pv => pv.focused );
        if ( numberOfPdomVisibleNucleonViews === 2 && focusedNucleonView ) {
          const unfocusedNucleonView = nucleonViews.find( pv => !pv.focused );
          affirm( unfocusedNucleonView, 'There should be an unfocused nucleon view' );
          unfocusedNucleonView.pdomVisible = false;
        }
        else {
          const particles = nucleonType === 'proton' ? this.atom.protons : this.atom.neutrons;
          const sortedParticles = [ ...particles ].sort( nucleonSortingFunction );
          const particleView = this.getParticleView( sortedParticles[ 0 ] );
          affirm( particleView, 'There should be a particle view for this nucleon' );
          nucleonViews.forEach( pv => {
            pv.pdomVisible = pv === particleView;
          } );
        }
      }
    } );

    // Handle PDOM visibility for the electrons.
    if ( this.electronShellDepictionProperty.value === 'shells' ) {

      // For each of the electron shells, make sure that only one electron in that shell is PDOM visible, but take care
      // to prefer the focused electron if there is one.
      const electronShellNumbers = [ 0, 1 ];
      electronShellNumbers.forEach( shellNumber => {
        const electronViewsInShell = allParticleViews.filter(
          pv => pv.particle.type === 'electron' &&
                this.atom.containsParticle( pv.particle ) &&
                this.getElectronShellNumber( pv.particle ) === shellNumber
        );
        const numberOfPdomVisibleElectronViews = electronViewsInShell.filter( pv => pv.pdomVisible ).length;
        if ( electronViewsInShell.length > 0 && numberOfPdomVisibleElectronViews !== 1 ) {

          // Sort the electrons by their X position, but if any of them is focused, that trumps everything.
          electronViewsInShell.sort( ( ev1, ev2 ) => {
            if ( ev1.focused || ev1.focusable ) {
              return -1;
            }
            else if ( ev2.focused || ev2.focusable ) {
              return 1;
            }
            else {
              return ev2.particle.destinationProperty.value.x - ev1.particle.destinationProperty.value.x;
            }
          } );

          electronViewsInShell.forEach( ( ev, index ) => {
            ev.pdomVisible = index === 0;
          } );
        }
      } );

      // Make sure the electron cloud is not PDOM visible.
      this.electronCloud.pdomVisible = false;
    }
    else {

      // The electrons are currently being represented as a cloud.  The individual electron views won't show up in the
      // PDOM since they are made invisible by other portions of the code, so we don't need to worry about them here.
      // We *do* need to set the PDOM visibility of the electron cloud.
      this.electronCloud.pdomVisible = this.atom.electrons.length > 0;
    }

    // Update the focusable state of the particle views and electron cloud.
    if ( !focusedAndDraggingParticleView ) {

      // Make a list of all particle views that are currently visible in the PDOM.
      const pdomVisibleParticleViews = allParticleViews.filter( pv => pv.pdomVisible );

      // Of these, are any currently focusable?
      const focusableParticleViews = pdomVisibleParticleViews.filter( pv => pv.focusable );

      // Count the number of focusable nodes, potentially including the electron cloud.
      const numberOfFocusableNodes = focusableParticleViews.length + ( this.electronCloud.focusable ? 1 : 0 );

      // Only one of these things should be focusable at a time.
      if ( this.atom.particleCountProperty.value > 0 && numberOfFocusableNodes !== 1 ) {

        // Decide which Node should be focusable based on designed priority.
        const particleNodesInPriorityOrder: Node[] = [];
        const protonView = pdomVisibleParticleViews.find( pv => pv.particle.type === 'proton' );
        protonView && particleNodesInPriorityOrder.push( protonView );
        const neutronView = pdomVisibleParticleViews.find( pv => pv.particle.type === 'neutron' );
        neutronView && particleNodesInPriorityOrder.push( neutronView );
        if ( this.electronShellDepictionProperty.value === 'shells' ) {
          const innerShellElectronView = pdomVisibleParticleViews.find(
            pv => pv.particle.type === 'electron' && this.getElectronShellNumber( pv.particle ) === 0
          );
          innerShellElectronView && particleNodesInPriorityOrder.push( innerShellElectronView );
          const outerShellElectronView = pdomVisibleParticleViews.find(
            pv => pv.particle.type === 'electron' && this.getElectronShellNumber( pv.particle ) === 1
          );
          outerShellElectronView && particleNodesInPriorityOrder.push( outerShellElectronView );
        }
        else {
          if ( this.electronCloud.pdomVisible ) {
            particleNodesInPriorityOrder.push( this.electronCloud );
          }
        }

        if ( particleNodesInPriorityOrder.length > 0 ) {

          // If any of these nodes currently has the focus, leave it focusable, i.e. to force it to be defocused.
          let nodeToBeFocusable;
          const currentlyFocusedNodes = particleNodesInPriorityOrder.filter( node => node.focused );
          affirm( currentlyFocusedNodes.length <= 1, 'There should not be more than one currently focused node.' );
          if ( currentlyFocusedNodes.length === 1 ) {
            nodeToBeFocusable = currentlyFocusedNodes[ 0 ];
          }
          else {
            nodeToBeFocusable = particleNodesInPriorityOrder[ 0 ];
          }

          // Make only the selected node focusable.
          const allPotentiallyFocusableNodes = [ ...pdomVisibleParticleViews, this.electronCloud ];
          allPotentiallyFocusableNodes.forEach( node => {
            node.focusable = node === nodeToBeFocusable;
          } );
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

  /**
   * Set all particle views that are currently children of this atom node, including the electron cloud, to be not
   * focusable, except for the provided one.
   */
  public makeAllOtherParticleViewsNotFocusable( focusedParticleView: ParticleView | ElectronCloudView ): void {
    this.getAllParticleViews().forEach( particleView => {
      if ( particleView !== focusedParticleView ) {
        particleView.focusable = false;
      }
    } );
    if ( this.electronCloud !== focusedParticleView ) {
      this.electronCloud.focusable = false;
    }
  }

  public override dispose(): void {
    this.disposeAtomNode();
    super.dispose();
  }

}

shred.register( 'AtomNode', AtomNode );
export default AtomNode;