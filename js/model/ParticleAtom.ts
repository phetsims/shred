// Copyright 2014-2024, University of Colorado Boulder

/**
 * A model element that represents an atom that is composed of a set of modeled subatomic particles. This model element
 * manages the positions and motion of all particles that are a part of the atom.
 *
 * @author John Blanco
 */

import createObservableArray, { ObservableArray } from '../../../axon/js/createObservableArray.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import TProperty from '../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../dot/js/dotRandom.js';
import LinearFunction from '../../../dot/js/LinearFunction.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Vector2Property from '../../../dot/js/Vector2Property.js';
import arrayRemove from '../../../phet-core/js/arrayRemove.js';
import optionize from '../../../phet-core/js/optionize.js';
import { Color } from '../../../scenery/js/imports.js';
import PhetioObject, { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';
import Tandem from '../../../tandem/js/Tandem.js';
import ArrayIO from '../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../tandem/js/types/IOType.js';
import NullableIO from '../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';
import ReferenceIO from '../../../tandem/js/types/ReferenceIO.js';
import Animation from '../../../twixt/js/Animation.js';
import Easing from '../../../twixt/js/Easing.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';
import Utils from '../Utils.js';
import Particle, { PARTICLE_COLORS, ParticleTypeString } from './Particle.js';

// constants
const NUM_ELECTRON_POSITIONS = 10; // first two electron shells, i.e. 2 + 8

// helper function for retrieving the tandem for a particle
const ParticleReferenceIO = ReferenceIO( Particle.ParticleIO );
const NullableParticleReferenceIO = NullableIO( ReferenceIO( Particle.ParticleIO ) );

type SelfOptions = {
  innerElectronShellRadius?: number;
  outerElectronShellRadius?: number;
  nucleonRadius?: number;
};

type ElectronAddMode = 'proximal' | 'random';
type ElectronShellPosition = {
  electron: Particle | null;
  position: Vector2;
};

export type ParticleAtomOptions = SelfOptions & PhetioObjectOptions;

class ParticleAtom extends PhetioObject {
  private readonly nucleonRadius: number;
  public readonly positionProperty: TProperty<Vector2>;
  public readonly nucleusOffsetProperty: TProperty<Vector2>;
  public readonly protons: ObservableArray<Particle>;
  public readonly neutrons: ObservableArray<Particle>;
  public readonly electrons: ObservableArray<Particle>;

  // array of all live animations
  private readonly liveAnimations: ObservableArray<Animation>;

  // individual count properties for each particle type
  public readonly protonCountProperty: TProperty<number>;
  public readonly neutronCountProperty: TProperty<number>;
  public readonly electronCountProperty: TProperty<number>;

  // derived properties based on the number of particles present in the atom
  public readonly chargeProperty: TReadOnlyProperty<number>;
  public readonly massNumberProperty: ReadOnlyProperty<number>;
  public readonly particleCountProperty: TReadOnlyProperty<number>;
  public readonly innerElectronShellRadius: number;
  public readonly outerElectronShellRadius: number;

  // Set the default electron add/remove mode.
  private readonly electronAddMode: ElectronAddMode = 'proximal';
  private electronShellPositions: ElectronShellPosition[];

  public constructor( providedOptions?: ParticleAtomOptions ) {

    const options = optionize<ParticleAtomOptions, SelfOptions, PhetioObjectOptions>()( {
      innerElectronShellRadius: 85,
      outerElectronShellRadius: 130,
      nucleonRadius: ShredConstants.NUCLEON_RADIUS,
      tandem: Tandem.REQUIRED,
      phetioType: ParticleAtom.ParticleAtomIO
    }, providedOptions );

    super( options );

    this.nucleonRadius = options.nucleonRadius;

    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      valueComparisonStrategy: 'equalsFunction',
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );
    this.nucleusOffsetProperty = new Vector2Property( Vector2.ZERO, {
      valueComparisonStrategy: 'equalsFunction',
      tandem: options.tandem.createTandem( 'nucleusOffsetProperty' )
    } );

    this.protons = createObservableArray( {
      // tandem: options.tandem.createTandem( 'protons' ),
      phetioType: createObservableArray.ObservableArrayIO( Particle.ParticleIO ),
      lengthPropertyOptions: {
        hasListenerOrderDependencies: true // needed in BAN, see https://github.com/phetsims/build-a-nucleus/issues/105
      }
    } );
    this.neutrons = createObservableArray( {
      // tandem: options.tandem.createTandem( 'neutrons' ),
      phetioType: createObservableArray.ObservableArrayIO( Particle.ParticleIO ),
      lengthPropertyOptions: {
        hasListenerOrderDependencies: true // needed in BAN, see https://github.com/phetsims/build-a-nucleus/issues/105
      }
    } );
    this.electrons = createObservableArray( {
      // tandem: options.tandem.createTandem( 'electrons' ),
      phetioType: createObservableArray.ObservableArrayIO( Particle.ParticleIO )
    } );

    this.liveAnimations = createObservableArray();

    this.liveAnimations.addItemAddedListener( animation => {
      animation.endedEmitter.addListener( () => {
        this.liveAnimations.includes( animation ) && this.liveAnimations.remove( animation );
      } );
    } );

    this.liveAnimations.addItemRemovedListener( animation => {
      animation.stop();
    } );

    this.protonCountProperty = this.protons.lengthProperty;
    this.neutronCountProperty = this.neutrons.lengthProperty;
    this.electronCountProperty = this.electrons.lengthProperty;

    this.chargeProperty = new DerivedProperty(
      [ this.protonCountProperty, this.electronCountProperty ],
      ( ( protonCount, electronCount ) => {
        return protonCount - electronCount;
      } ), {
        tandem: options.tandem.createTandem( 'chargeProperty' ),
        phetioValueType: NumberIO
      }
    );
    this.massNumberProperty = new DerivedProperty(
      [ this.protonCountProperty, this.neutronCountProperty ],
      ( ( protonCount, neutronCount ) => {
        return protonCount + neutronCount;
      } ), {
        tandem: options.tandem.createTandem( 'massNumberProperty' ),
        phetioValueType: NumberIO
      }
    );
    this.particleCountProperty = new DerivedProperty(
      [ this.protonCountProperty, this.neutronCountProperty, this.electronCountProperty ],
      ( ( protonCount, neutronCount, electronCount ) => {
        return protonCount + neutronCount + electronCount;
      } ), {
        tandem: options.tandem.createTandem( 'particleCountProperty' ),
        phetioValueType: NumberIO
      }
    );

    // Make shell radii publicly accessible.
    this.innerElectronShellRadius = options.innerElectronShellRadius;
    this.outerElectronShellRadius = options.outerElectronShellRadius;

    // Initialize the positions where an electron can be placed.
    this.electronShellPositions = new Array( NUM_ELECTRON_POSITIONS );
    this.electronShellPositions[ 0 ] = {
      electron: null,
      position: new Vector2( this.innerElectronShellRadius, 0 )
    };
    this.electronShellPositions[ 1 ] = {
      electron: null,
      position: new Vector2( -this.innerElectronShellRadius, 0 )
    };
    const numSlotsInOuterShell = 8;

    // Stagger inner and outer electron shell positions, tweaked a bit for better interaction with labels.
    let angle = Math.PI / numSlotsInOuterShell * 1.2;
    for ( let i = 0; i < numSlotsInOuterShell; i++ ) {
      this.electronShellPositions[ i + 2 ] = {
        electron: null,
        position: new Vector2(
          Math.cos( angle ) * this.outerElectronShellRadius,
          Math.sin( angle ) * this.outerElectronShellRadius
        )
      };
      angle += 2 * Math.PI / numSlotsInOuterShell;
    }

    // When an electron is removed, clear the corresponding shell position.
    this.electrons.addItemRemovedListener( electron => {
      this.electronShellPositions.forEach( electronShellPosition => {
        if ( electronShellPosition.electron === electron ) {
          electronShellPosition.electron = null;
          if ( Math.abs( electronShellPosition.position.magnitude - this.innerElectronShellRadius ) < 1E-5 ) {

            // An inner-shell electron was removed.  If there are electrons in the outer shell, move one of them in.
            let occupiedOuterShellPositions = _.filter( this.electronShellPositions, electronShellPosition => {
              return ( electronShellPosition.electron !== null &&
                       Utils.roughlyEqual( electronShellPosition.position.magnitude,
                         this.outerElectronShellRadius,
                         1E-5
                       )
              );
            } );
            occupiedOuterShellPositions = _.sortBy( occupiedOuterShellPositions, occupiedShellPosition => {
              return occupiedShellPosition.position.distance( electronShellPosition.position );
            } );
            if ( occupiedOuterShellPositions.length > 0 ) {
              // Move outer electron to inner spot.
              electronShellPosition.electron = occupiedOuterShellPositions[ 0 ].electron;
              occupiedOuterShellPositions[ 0 ].electron = null;
              electronShellPosition.electron!.destinationProperty.set( electronShellPosition.position );
            }
          }
        }
      } );
    } );

    // Utility function to translate all particles.
    const translateParticle = function( particle: Particle, translation: Vector2 ) {
      if ( particle.positionProperty.get().equals( particle.destinationProperty.get() ) ) {
        particle.setPositionAndDestination( particle.positionProperty.get().plus( translation ) );
      }
      else {
        // Particle is moving, only change the destination.
        particle.destinationProperty.set( particle.destinationProperty.get().plus( translation ) );
      }
    };

    // When the nucleus offset changes, update all nucleon positions.
    this.nucleusOffsetProperty.link( ( newOffset, oldOffset ) => {
      const translation = oldOffset === null ? Vector2.ZERO : newOffset.minus( oldOffset );
      this.protons.forEach( particle => {
        translateParticle( particle, translation );
      } );
      this.neutrons.forEach( particle => {
        translateParticle( particle, translation );
      } );
    } );

    // When the particle position changes, update all nucleon positions.  This is to be used in Isotopes and Atomic
    // Mass when a particle gets moved to sit at the correct spot on the scale.
    this.positionProperty.link( ( newOffset, oldOffset ) => {
      const translation = oldOffset === null ? Vector2.ZERO : newOffset.minus( oldOffset );
      this.protons.forEach( particle => {
        translateParticle( particle, translation );
      } );
      this.neutrons.forEach( particle => {
        translateParticle( particle, translation );
      } );
    } );
  }

  public override dispose(): void {

    this.particleCountProperty.dispose();
    this.massNumberProperty.dispose();
    this.chargeProperty.dispose();
    this.positionProperty.dispose();
    this.nucleusOffsetProperty.dispose();

    this.protons.dispose();
    this.neutrons.dispose();
    this.electrons.dispose();

    super.dispose();
  }

  /**
   * Test that this particle atom contains a particular particle.
   */
  public containsParticle( particle: Particle ): boolean {
    return this.protons.includes( particle ) ||
           this.neutrons.includes( particle ) ||
           this.electrons.includes( particle );
  }

  /**
   * Add a particle to the atom.
   */
  public addParticle( particle: Particle ): void {

    // In phet-io mode we can end up with attempts being made to add the same particle twice when state is being set, so
    // test for that case and bail if needed.
    if ( Tandem.PHET_IO_ENABLED && this.containsParticle( particle ) ) {

      // Looks like someone beat us to it.
      return;
    }

    if ( particle.type === 'proton' || particle.type === 'neutron' ) {

      // Create a listener that will be called when this particle is removed.
      const nucleonRemovedListener = ( userControlled: boolean ) => {
        if ( userControlled && particleArray.includes( particle ) ) {
          particleArray.remove( particle );
          this.reconfigureNucleus();
          particle.zLayerProperty.set( 0 );
          particle.userControlledProperty.unlink( nucleonRemovedListener );
          particle.particleAtomRemovalListener = null;
        }
      };
      particle.userControlledProperty.lazyLink( nucleonRemovedListener );

      // Attach the listener to the particle so that it can be unlinked when the particle is removed.
      particle.particleAtomRemovalListener = nucleonRemovedListener;

      // Add the particle and update the counts.
      const particleArray = particle.type === 'proton' ? this.protons : this.neutrons;
      particleArray.push( particle );
      this.reconfigureNucleus();
    }
    else if ( particle.type === 'electron' ) {
      this.electrons.push( particle );

      // Find an open position in the electron shell.
      const openPositions = this.electronShellPositions.filter( electronPosition => {
        return ( electronPosition.electron === null );
      } );
      let sortedOpenPositions;
      if ( this.electronAddMode === 'proximal' ) {
        sortedOpenPositions = openPositions.sort( ( p1, p2 ) => {

          // Sort first by distance to particle.
          return ( particle.positionProperty.get().distance( p1.position ) -
                   particle.positionProperty.get().distance( p2.position ) );
        } );
      }
      else {
        sortedOpenPositions = dotRandom.shuffle( openPositions );
      }

      // Put the inner shell positions in front.
      sortedOpenPositions = sortedOpenPositions.sort( ( p1, p2 ) => {
        return ( this.positionProperty.get().distance( p1.position ) -
                 this.positionProperty.get().distance( p2.position ) );
      } );

      assert && assert( sortedOpenPositions.length > 0, 'No open positions found for electrons' );
      sortedOpenPositions[ 0 ].electron = particle;
      particle.destinationProperty.set( sortedOpenPositions[ 0 ].position );

      // Listen for removal of the electron and handle it.
      const electronRemovedListener = ( userControlled: boolean ) => {
        if ( userControlled && this.electrons.includes( particle ) ) {
          this.electrons.remove( particle );
          particle.zLayerProperty.set( 0 );
          particle.userControlledProperty.unlink( electronRemovedListener );
          particle.particleAtomRemovalListener = null;
        }
      };
      particle.userControlledProperty.lazyLink( electronRemovedListener );

      // Set the listener as an attribute of the particle to aid unlinking in some cases.
      particle.particleAtomRemovalListener = electronRemovedListener;

    }
    else {
      assert && assert( false, 'Unexpected particle type ' + particle.type );
    }
  }

  /**
   * Remove the specified particle from this particle atom.
   */
  public removeParticle( particle: Particle ): void {

    if ( this.protons.includes( particle ) ) {
      this.protons.remove( particle );
    }
    else if ( this.neutrons.includes( particle ) ) {
      this.neutrons.remove( particle );
    }
    else if ( this.electrons.includes( particle ) ) {
      this.electrons.remove( particle );
    }
    else {
      throw new Error( 'Attempt to remove particle that is not in this particle atom.' );
    }
    assert && assert( typeof particle.particleAtomRemovalListener === 'function',
      'No particle removal listener attached to particle.'
    );
    particle.userControlledProperty.unlink( particle.particleAtomRemovalListener! );

    particle.particleAtomRemovalListener = null;
  }

  /**
   * Extract an arbitrary instance of the specified particle, assuming one exists.
   */
  public extractParticle( particleType: ParticleTypeString ): Particle {
    let particle: Particle | null = null;
    switch( particleType ) {
      case 'proton':
        if ( this.protons.length > 0 ) {
          particle = this.protons.get( this.protons.length - 1 );
        }
        break;

      case 'neutron':
        if ( this.neutrons.length > 0 ) {
          particle = this.neutrons.get( this.neutrons.length - 1 );
        }
        break;

      case 'electron':
        if ( this.electrons.length > 0 ) {
          particle = this.electrons.get( this.electrons.length - 1 );
        }
        break;

      default:
        throw new Error( 'Attempt to remove unknown particle type.' );
    }

    if ( particle !== null ) {
      this.removeParticle( particle );
    }

    assert && assert( particle !== null, 'There should be a particle of the provided type if asking for one' );
    return particle!;
  }

  public extractParticleClosestToCenter( particleType: ParticleTypeString ): Particle {
    let particle: Particle | null = null;
    switch( particleType ) {
      case 'proton':
        if ( this.protons.length > 0 ) {
          particle = _.sortBy( [ ...this.protons ], proton =>
            proton.positionProperty.value.distance( this.positionProperty.value ) )[ 0 ];
        }
        break;

      case 'neutron':
        if ( this.neutrons.length > 0 ) {
          particle = _.sortBy( [ ...this.neutrons ], neutron =>
            neutron.positionProperty.value.distance( this.positionProperty.value ) )[ 0 ];
        }
        break;

      case 'electron':
        if ( this.electrons.length > 0 ) {
          particle = _.sortBy( [ ...this.electrons ], electron =>
            electron.positionProperty.value.distance( this.positionProperty.value ) )[ 0 ];
        }
        break;

      default:
        throw new Error( 'Attempt to remove unknown particle type.' );
    }

    if ( particle !== null ) {
      this.removeParticle( particle );
    }

    return particle!;
  }

  /**
   * Remove all the particles but don't reconfigure the nucleus as they go. This makes it a quicker operation.
   */
  public clear(): void {
    const protons = [ ...this.protons ];
    protons.forEach( particle => { this.removeParticle( particle ); } );
    const neutrons = [ ...this.neutrons ];
    neutrons.forEach( particle => { this.removeParticle( particle ); } );
    const electrons = [ ...this.electrons ];
    electrons.forEach( particle => { this.removeParticle( particle ); } );

    this.liveAnimations.clear();
  }

  /**
   * Move all the particles to their destinations. This is generally used when animation is not desired.
   */
  public moveAllParticlesToDestination(): void {
    this.protons.forEach( p => { p.moveImmediatelyToDestination(); } );
    this.neutrons.forEach( p => { p.moveImmediatelyToDestination(); } );
    this.electrons.forEach( p => { p.moveImmediatelyToDestination(); } );
  }

  public getWeight(): number {
    return this.protonCountProperty.get() + this.neutronCountProperty.get();
  }

  public getCharge(): number {
    return this.protonCountProperty.get() - this.electronCountProperty.get();
  }

  public getIsotopeAtomicMass(): number {
    return AtomIdentifier.getIsotopeAtomicMass( this.protonCountProperty.get(), this.neutronCountProperty.get() );
  }

  public reconfigureNucleus(): void {

    // Convenience variables.
    const centerX = this.positionProperty.get().x + this.nucleusOffsetProperty.get().x;
    const centerY = this.positionProperty.get().y + this.nucleusOffsetProperty.get().y;
    const nucleonRadius = this.nucleonRadius;
    let angle;
    let distFromCenter;

    // Create an array of interspersed protons and neutrons for configuring.
    const nucleons = [];
    let protonIndex = 0;
    let neutronIndex = 0;
    const neutronsPerProton = this.neutrons.length / this.protons.length;
    let neutronsToAdd = 0;
    while ( nucleons.length < this.neutrons.length + this.protons.length ) {
      neutronsToAdd += neutronsPerProton;
      while ( neutronsToAdd >= 1 && neutronIndex < this.neutrons.length ) {
        nucleons.push( this.neutrons.get( neutronIndex++ ) );
        neutronsToAdd -= 1;
      }
      if ( protonIndex < this.protons.length ) {
        nucleons.push( this.protons.get( protonIndex++ ) );
      }
    }

    if ( nucleons.length === 1 ) {

      // There is only one nucleon present, so place it in the center of the atom.
      nucleons[ 0 ].destinationProperty.set( new Vector2( centerX, centerY ) );
      nucleons[ 0 ].zLayerProperty.set( 0 );
    }
    else if ( nucleons.length === 2 ) {

      // Two nucleons - place them side by side with their meeting point in the center.
      angle = 0.2 * 2 * Math.PI; // Angle arbitrarily chosen.
      nucleons[ 0 ].destinationProperty.set( new Vector2( centerX + nucleonRadius * Math.cos( angle ),
        centerY + nucleonRadius * Math.sin( angle ) ) );
      nucleons[ 0 ].zLayerProperty.set( 0 );
      nucleons[ 1 ].destinationProperty.set( new Vector2( centerX - nucleonRadius * Math.cos( angle ),
        centerY - nucleonRadius * Math.sin( angle ) ) );
      nucleons[ 1 ].zLayerProperty.set( 0 );
    }
    else if ( nucleons.length === 3 ) {

      // Three nucleons - form a triangle where they all touch.
      angle = 0.7 * 2 * Math.PI; // Angle arbitrarily chosen.
      distFromCenter = nucleonRadius * 1.155;
      nucleons[ 0 ].destinationProperty.set( new Vector2( centerX + distFromCenter * Math.cos( angle ),
        centerY + distFromCenter * Math.sin( angle ) ) );
      nucleons[ 0 ].zLayerProperty.set( 0 );
      nucleons[ 1 ].destinationProperty.set( new Vector2( centerX + distFromCenter * Math.cos( angle + 2 * Math.PI / 3 ),
        centerY + distFromCenter * Math.sin( angle + 2 * Math.PI / 3 ) ) );
      nucleons[ 1 ].zLayerProperty.set( 0 );
      nucleons[ 2 ].destinationProperty.set( new Vector2( centerX + distFromCenter * Math.cos( angle + 4 * Math.PI / 3 ),
        centerY + distFromCenter * Math.sin( angle + 4 * Math.PI / 3 ) ) );
      nucleons[ 2 ].zLayerProperty.set( 0 );
    }
    else if ( nucleons.length === 4 ) {

      // Four nucleons - make a sort of diamond shape with some overlap.
      angle = 1.4 * 2 * Math.PI; // Angle arbitrarily chosen.
      nucleons[ 0 ].destinationProperty.set( new Vector2( centerX + nucleonRadius * Math.cos( angle ),
        centerY + nucleonRadius * Math.sin( angle ) ) );
      nucleons[ 0 ].zLayerProperty.set( 0 );
      nucleons[ 2 ].destinationProperty.set( new Vector2( centerX - nucleonRadius * Math.cos( angle ),
        centerY - nucleonRadius * Math.sin( angle ) ) );
      nucleons[ 2 ].zLayerProperty.set( 0 );
      distFromCenter = nucleonRadius * 2 * Math.cos( Math.PI / 3 );
      nucleons[ 1 ].destinationProperty.set( new Vector2( centerX + distFromCenter * Math.cos( angle + Math.PI / 2 ),
        centerY + distFromCenter * Math.sin( angle + Math.PI / 2 ) ) );
      nucleons[ 1 ].zLayerProperty.set( 1 );
      nucleons[ 3 ].destinationProperty.set( new Vector2( centerX - distFromCenter * Math.cos( angle + Math.PI / 2 ),
        centerY - distFromCenter * Math.sin( angle + Math.PI / 2 ) ) );
      nucleons[ 3 ].zLayerProperty.set( 1 );
    }
    else if ( nucleons.length >= 5 ) {

      // This is a generalized algorithm that should work for five or more nucleons.
      let placementRadius = 0;
      let numAtThisRadius = 1;
      let level = 0;
      let placementAngle = 0;
      let placementAngleDelta = 0;

      // Scale correction for the next placement radius, linear map determined empirically. As the nucleon size
      // increases, we want the scale factor and change in placement radius to decrease since larger nucleons are
      // easier to see with larger area. Map values determined in cases which use a wide range in number of nucleons
      // and in cases where the nucleon radius scaled from 3 to 10 (in screen coordinates - roughly pixels).
      const radiusA = 3;
      const radiusB = 10;
      const scaleFactorA = 2.4;
      const scaleFactorB = 1.35;

      const scaleFunction = new LinearFunction( radiusA, radiusB, scaleFactorA, scaleFactorB, !!this.nucleonRadius );
      const scaleFactor = scaleFunction.evaluate( this.nucleonRadius );

      for ( let i = 0; i < nucleons.length; i++ ) {
        nucleons[ i ].destinationProperty.set( new Vector2( centerX + placementRadius * Math.cos( placementAngle ),
          centerY + placementRadius * Math.sin( placementAngle ) ) );
        nucleons[ i ].zLayerProperty.set( level );
        numAtThisRadius--;
        if ( numAtThisRadius > 0 ) {

          // Stay at the same radius and update the placement angle.
          placementAngle += placementAngleDelta;
        }
        else {

          // Move out to the next radius.
          level++;
          placementRadius += nucleonRadius * scaleFactor / level;
          placementAngle += 2 * Math.PI * 0.2 + level * Math.PI; // Arbitrary value chosen based on looks.
          numAtThisRadius = Math.floor( placementRadius * Math.PI / nucleonRadius );
          placementAngleDelta = 2 * Math.PI / numAtThisRadius;
        }
      }
    }
  }

  /**
   * Change the nucleon type of the provided particle to the other nucleon type.
   */
  public changeNucleonType( particle: Particle, onChangeComplete: VoidFunction ): void {
    assert && assert( this.containsParticle( particle ), 'ParticleAtom does not contain this particle ' + particle.id );
    assert && assert( particle.type === 'proton' || particle.type === 'neutron', 'Particle type must be a proton or a neutron.' );

    const isParticleTypeProton = particle.type === 'proton';
    const oldParticleArray = isParticleTypeProton ? this.protons : this.neutrons;
    const newParticleArray = isParticleTypeProton ? this.neutrons : this.protons;

    const newParticleType: ParticleTypeString = isParticleTypeProton ? 'neutron' : 'proton';
    particle.typeProperty.value = newParticleType;

    const particleType = particle.typeProperty.value;

    assert && assert( particleType === 'proton' || particleType === 'neutron',
      'can only change type between protons and neutrons' );

    const startingColor = particle.colorProperty.value;
    const targetColor = PARTICLE_COLORS[ newParticleType ];

    const colorChangeAnimation = new Animation( {
      from: 0,
      to: 1,
      setValue: indexValue => { particle.colorProperty.value = Color.interpolateRGBA( startingColor, targetColor, indexValue ); },
      duration: 0.5,
      easing: Easing.LINEAR
    } );

    this.liveAnimations.push( colorChangeAnimation );

    // Disable input when the particle is changing colors, see https://github.com/phetsims/build-a-nucleus/issues/115.
    particle.inputEnabledProperty.value = false;

    colorChangeAnimation.finishEmitter.addListener( () => {
      !particle.isDisposed && particle.inputEnabledProperty.set( true );
      onChangeComplete();
    } );
    colorChangeAnimation.start();

    // Defer the massNumberProperty links until the particle arrays are correct so the nucleus does not reconfigure.
    const wasDeferred = this.massNumberProperty.isDeferred;
    this.massNumberProperty.setDeferred( true );

    // Add to the new one first in case there is a listener that causes the particleAtom to be cleared, https://github.com/phetsims/build-a-nucleus/issues/115
    newParticleArray.push( particle );
    arrayRemove( oldParticleArray, particle );

    !wasDeferred && this.massNumberProperty.setDeferred( false ); // No need to fire listeners because the mass never changed

    assert && assert( newParticleArray.lengthProperty.value === newParticleArray.length,
      'deferring hackary above should not produce an inconsistent state' );

    assert && assert( this.containsParticle( particle ), `ParticleAtom should contain particle:${particle.id} after changing nucleon` );
  }

  // This function was only created to support flexibility in the "numberAtom" parameter for PeriodicTableNode, use carefully.
  public setSubAtomicParticleCount( protonCount: number, neutronCount: number, electronCount: number ): void {
    this.clear();
    for ( let i = 0; i < protonCount; i++ ) {
      this.addParticle( new Particle( 'proton' ) );
    }
    for ( let i = 0; i < neutronCount; i++ ) {
      this.addParticle( new Particle( 'neutron' ) );
    }
    for ( let i = 0; i < electronCount; i++ ) {
      this.addParticle( new Particle( 'electron' ) );
    }
  }

  // clear all liveAnimations
  public clearAnimations(): void {
    this.liveAnimations.clear();
  }

  // Move all particles in this atom to their destination immediately (interrupting their animations if applicable)
  public moveAllToDestination(): void {
    const moveImmediately = ( particle: Particle ) => particle.moveImmediatelyToDestination();
    this.protons.forEach( moveImmediately );
    this.neutrons.forEach( moveImmediately );
    this.electrons.forEach( moveImmediately );
  }

  public static ParticleAtomIO = new IOType( 'ParticleAtomIO', {
    valueType: ParticleAtom,
    documentation: 'A model of an atom that tracks and arranges the subatomic particles, i.e. protons, neutrons, ' +
                   'and electrons, of which it is comprised.  When particles are added, they are moved into the ' +
                   'appropriate places.  This object also keeps track of things like atomic number, mass number, and ' +
                   'charge.',
    toStateObject: ( particleAtom: ParticleAtom ) => ( {

      // an array of all the particles currently contained within the particle atom
      residentParticleIDs: particleAtom.protons.map( x => ParticleReferenceIO.toStateObject( x ) )
        .concat( particleAtom.neutrons.map( x => ParticleReferenceIO.toStateObject( x ) ) )
        .concat( particleAtom.electrons.map( x => ParticleReferenceIO.toStateObject( x ) ) ),

      // an ordered array that tracks which electron, if any, is in each shell position
      electronShellOccupantIDs: particleAtom.electronShellPositions.map( e => e.electron ).map( x => NullableParticleReferenceIO.toStateObject( x ) )
    } ),
    stateSchema: {
      residentParticleIDs: ArrayIO( ParticleReferenceIO ),
      electronShellOccupantIDs: ArrayIO( NullableParticleReferenceIO )
    },
    applyState: ( particleAtom, stateObject ) => {

      // Remove all the particles from the observable arrays.
      particleAtom.clear();

      const deserializedState = {
        residentParticles: stateObject.residentParticleIDs.map( x => ParticleReferenceIO.fromStateObject( x ) ),
        electronShellOccupants: stateObject.electronShellOccupantIDs.map( x => NullableParticleReferenceIO.fromStateObject( x ) )
      };

      // Add back the particles.
      deserializedState.residentParticles.forEach( ( value: Particle ) => { particleAtom.addParticle( value ); } );

      // Set the electron shell occupancy state.
      deserializedState.electronShellOccupants.forEach( ( electron: Particle, index: number ) => {
        particleAtom.electronShellPositions[ index ].electron = electron;
      } );
    }
  } );
}

shred.register( 'ParticleAtom', ParticleAtom );
export default ParticleAtom;