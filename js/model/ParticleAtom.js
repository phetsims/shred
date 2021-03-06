// Copyright 2014-2020, University of Colorado Boulder

/**
 * A model element that represents an atom that is comprised of a set of modeled subatomic particles. This model element
 * manages the positions and motion of all particles that are a part of the atom.
 *
 * @author John Blanco
 */

import createObservableArray from '../../../axon/js/createObservableArray.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import dotRandom from '../../../dot/js/dotRandom.js';
import LinearFunction from '../../../dot/js/LinearFunction.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Vector2Property from '../../../dot/js/Vector2Property.js';
import merge from '../../../phet-core/js/merge.js';
import PhetioObject from '../../../tandem/js/PhetioObject.js';
import Tandem from '../../../tandem/js/Tandem.js';
import IOType from '../../../tandem/js/types/IOType.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';
import Utils from '../Utils.js';
import Particle from './Particle.js';

// constants
const NUM_ELECTRON_POSITIONS = 10; // first two electron shells, i.e. 2 + 8

class ParticleAtom extends PhetioObject {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      innerElectronShellRadius: 85,
      outerElectronShellRadius: 130,
      nucleonRadius: ShredConstants.NUCLEON_RADIUS,
      tandem: Tandem.REQUIRED,
      phetioType: ParticleAtom.ParticleAtomIO
    }, options );

    super( options );

    this.nucleonRadius = options.nucleonRadius; // @private

    // @public (read-only) - radius of the nucleus in view coordinates, which is rougly pixels
    this.nucleusRadius = 0;

    // @public
    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      useDeepEquality: true,
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );
    this.nucleusOffsetProperty = new Vector2Property( Vector2.ZERO, {
      useDeepEquality: true,
      tandem: options.tandem.createTandem( 'nucleusOffsetProperty' )
    } );

    // @private - particle collections
    this.protons = createObservableArray( {
      // tandem: options.tandem.createTandem( 'protons' ),
      phetioType: createObservableArray.ObservableArrayIO( Particle.ParticleIO )
    } );
    this.neutrons = createObservableArray( {
      // tandem: options.tandem.createTandem( 'neutrons' ),
      phetioType: createObservableArray.ObservableArrayIO( Particle.ParticleIO )
    } );
    this.electrons = createObservableArray( {
      // tandem: options.tandem.createTandem( 'electrons' ),
      phetioType: createObservableArray.ObservableArrayIO( Particle.ParticleIO )
    } );

    // @public (read-only) - derived properties based on the number of particles present in the atom
    // These are DerivedProperties in support of phet-io. We need to have the lengthProperty of ObservableArrayDef
    // instrumented.
    // TODO: implement this correctly, see https://github.com/phetsims/shred/issues/25
    // NOTE: Changing these may break some wrapper code, so be sure to check.
    this.protonCountProperty = new DerivedProperty(
      [ this.protons.lengthProperty ],
      ( length => {
        return length;
      } ),
      {
        tandem: options.tandem.createTandem( 'protonCountProperty' ),
        numberType: 'Integer',
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      }
    );
    this.neutronCountProperty = new DerivedProperty(
      [ this.neutrons.lengthProperty ],
      ( length => {
        return length;
      } ),
      {
        tandem: options.tandem.createTandem( 'neutronCountProperty' ),
        numberType: 'Integer',
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      }
    );
    this.electronCountProperty = new DerivedProperty(
      [ this.electrons.lengthProperty ],
      ( length => {
        return length;
      } ),
      {
        tandem: options.tandem.createTandem( 'electronCountProperty' ),
        numberType: 'Integer',
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      }
    );
    this.chargeProperty = new DerivedProperty(
      [ this.protonCountProperty, this.electronCountProperty ],
      ( ( protonCount, electronCount ) => {
        return protonCount - electronCount;
      } ),
      {
        tandem: options.tandem.createTandem( 'chargeProperty' ),
        numberType: 'Integer',
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      }
    );
    this.massNumberProperty = new DerivedProperty(
      [ this.protonCountProperty, this.neutronCountProperty ],
      ( ( protonCount, neutronCount ) => {
        return protonCount + neutronCount;
      } ),
      {
        tandem: options.tandem.createTandem( 'massNumberProperty' ),
        numberType: 'Integer',
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      }
    );
    this.particleCountProperty = new DerivedProperty(
      [ this.protonCountProperty, this.neutronCountProperty, this.electronCountProperty ],
      ( ( protonCount, neutronCount, electronCount ) => {
        return protonCount + neutronCount + electronCount;
      } ),
      {
        tandem: options.tandem.createTandem( 'particleCountProperty' ),
        numberType: 'Integer',
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      }
    );

    // Make shell radii publicly accessible.
    this.innerElectronShellRadius = options.innerElectronShellRadius; // @public
    this.outerElectronShellRadius = options.outerElectronShellRadius; // @public

    // Set the default electron add/remove mode.  Valid values are 'proximal' and 'random'.
    this.electronAddMode = 'proximal'; // @private

    // Initialize the positions where an electron can be placed.
    this.electronShellPositions = new Array( NUM_ELECTRON_POSITIONS ); // @private
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
    const self = this;
    this.electrons.addItemRemovedListener( electron => {
      self.electronShellPositions.forEach( electronShellPosition => {
        if ( electronShellPosition.electron === electron ) {
          electronShellPosition.electron = null;
          if ( Math.abs( electronShellPosition.position.magnitude - self.innerElectronShellRadius ) < 1E-5 ) {

            // An inner-shell electron was removed.  If there are electrons in the outer shell, move one of them in.
            let occupiedOuterShellPositions = _.filter( self.electronShellPositions, electronShellPosition => {
              return ( electronShellPosition.electron !== null &&
                       Utils.roughlyEqual( electronShellPosition.position.magnitude,
                         self.outerElectronShellRadius,
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
              electronShellPosition.electron.destinationProperty.set( electronShellPosition.position );
            }
          }
        }
      } );
    } );

    // Utility function to translate all particles.
    const translateParticle = function( particle, translation ) {
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

  /**
   * @public
   * @override
   */
  dispose() {

    this.particleCountProperty.dispose();
    this.massNumberProperty.dispose();
    this.chargeProperty.dispose();

    // These should be disposed after because they are dependencies to the above DerivedProperties
    this.protonCountProperty.dispose();
    this.neutronCountProperty.dispose();
    this.electronCountProperty.dispose();

    this.positionProperty.dispose();
    this.nucleusOffsetProperty.dispose();

    // @private - particle collections
    this.protons.dispose();
    this.neutrons.dispose();
    this.electrons.dispose();

    super.dispose();
  }

  /**
   * test this this particle atom contains a particular particle
   * @param {Particle} particle
   * @returns {boolean}
   * @private
   */
  containsParticle( particle ) {
    return this.protons.includes( particle ) ||
           this.neutrons.includes( particle ) ||
           this.electrons.includes( particle );
  }

  /**
   * Add a particle to the atom.
   * @param {Particle} particle
   * @public
   */
  addParticle( particle ) {

    // in phet-io mode, we can end up with attempts being made to add the same particle twice when state is being
    // set, so test for that case and bail if needed
    if ( Tandem.PHET_IO_ENABLED && this.containsParticle( particle ) ) {
      // looks like someone beat us to it
      return;
    }

    const self = this;
    if ( particle.type === 'proton' || particle.type === 'neutron' ) {

      // create a listener that will be called when this particle is removed
      const nucleonRemovedListener = function( userControlled ) {
        if ( userControlled && particleArray.includes( particle ) ) {
          particleArray.remove( particle );
          self.reconfigureNucleus();
          particle.zLayerProperty.set( 0 );
          particle.userControlledProperty.unlink( nucleonRemovedListener );
          delete particle.particleAtomRemovalListener;
        }
      };
      particle.userControlledProperty.lazyLink( nucleonRemovedListener );

      // Attach the listener to the particle so that it can be unlinked when the particle is removed.
      particle.particleAtomRemovalListener = nucleonRemovedListener;

      // add the particle and update the counts
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
        return ( self.positionProperty.get().distance( p1.position ) -
                 self.positionProperty.get().distance( p2.position ) );
      } );

      assert && assert( sortedOpenPositions.length > 0, 'No open positions found for electrons' );
      sortedOpenPositions[ 0 ].electron = particle;
      particle.destinationProperty.set( sortedOpenPositions[ 0 ].position );

      // Listen for removal of the electron and handle it.
      const electronRemovedListener = function( userControlled ) {
        if ( userControlled && self.electrons.includes( particle ) ) {
          self.electrons.remove( particle );
          particle.zLayerProperty.set( 0 );
          particle.userControlledProperty.unlink( electronRemovedListener );
          delete particle.particleAtomRemovalListener;
        }
      };
      particle.userControlledProperty.lazyLink( electronRemovedListener );

      // Set the listener as an attribute of the particle to aid unlinking in some cases.
      particle.particleAtomRemovalListener = electronRemovedListener;

    }
    else {
      throw new Error( 'Unexpected particle type.' );
    }
  }

  /**
   * Remove the specified particle from this particle atom.
   * @param {Particle} particle
   * @public
   */
  removeParticle( particle ) {

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
    assert && assert( typeof ( particle.particleAtomRemovalListener ) === 'function',
      'No particle removal listener attached to particle.' );
    particle.userControlledProperty.unlink( particle.particleAtomRemovalListener );

    delete particle.particleAtomRemovalListener;
  }

  /**
   * Extract an arbitrary instance of the specified particle, assuming one exists.
   * @param {string} particleType
   * @returns {Particle} particle
   * @public
   */
  extractParticle( particleType ) {
    let particle = null;
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

    return particle;
  }

  /**
   * Remove all the particles but don't reconfigure the nucleus as they go. This makes it a quicker operation.
   * @public
   */
  clear() {
    const protons = [ ...this.protons ];
    protons.forEach( particle => { this.removeParticle( particle ); } );
    const neutrons = [ ...this.neutrons ];
    neutrons.forEach( particle => { this.removeParticle( particle ); } );
    const electrons = [ ...this.electrons ];
    electrons.forEach( particle => { this.removeParticle( particle ); } );
  }

  /**
   * Move all the particles to their destinations. This is generally used when animation is not desired.
   * @public
   */
  moveAllParticlesToDestination() {
    this.protons.forEach( p => { p.moveImmediatelyToDestination(); } );
    this.neutrons.forEach( p => { p.moveImmediatelyToDestination(); } );
    this.electrons.forEach( p => { p.moveImmediatelyToDestination(); } );
  }

  // @public
  getWeight() {
    return this.protonCountProperty.get() + this.neutronCountProperty.get();
  }

  // @public
  getCharge() {
    return this.protonCountProperty.get() - this.electronCountProperty.get();
  }

  // @public
  getIsotopeAtomicMass() {
    return AtomIdentifier.getIsotopeAtomicMass( this.protonCountProperty.get(), this.neutronCountProperty.get() );
  }

  // @public
  reconfigureNucleus() {

    // Convenience variables.
    const centerX = this.positionProperty.get().x + this.nucleusOffsetProperty.get().x;
    const centerY = this.positionProperty.get().y + this.nucleusOffsetProperty.get().y;
    const nucleonRadius = this.nucleonRadius;
    let angle;
    let distFromCenter;
    let nucleusRadius = nucleonRadius;

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
      nucleusRadius = this.nucleonRadius;

      // There is only one nucleon present, so place it in the center of the atom.
      nucleons[ 0 ].destinationProperty.set( new Vector2( centerX, centerY ) );
      nucleons[ 0 ].zLayerProperty.set( 0 );
    }
    else if ( nucleons.length === 2 ) {
      nucleusRadius = this.nucleonRadius * 2;

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

      nucleusRadius = distFromCenter + nucleonRadius;
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

      nucleusRadius = distFromCenter + nucleonRadius;
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
      const scaleFunction = LinearFunction( radiusA, radiusB, scaleFactorA, scaleFactorB, this.nucleonRadius );
      const scaleFactor = scaleFunction( this.nucleonRadius );

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

      // the total radius is the center is the final placement radius plus the nucleon radius
      nucleusRadius = placementRadius + this.nucleonRadius;
    }

    this.nucleusRadius = nucleusRadius;
  }
}

// helper function for retrieving the tandem for a particle
// TODO: Should this use ReferenceIO?  See https://github.com/phetsims/tandem/issues/215
const getParticleTandemID = particle => particle.tandem.phetioID;

ParticleAtom.ParticleAtomIO = new IOType( 'ParticleAtomIO', {
  valueType: ParticleAtom,
  documentation: 'A model of an atom that tracks and arranges the subatomic particles, i.e. protons, neutrons, ' +
                 'and electrons, of which it is comprised.  When particles are added, they are moved into the ' +
                 'appropriate places.  This object also keeps track of things like atomic number, mass number, and ' +
                 'charge.',
  toStateObject: particleAtom => ( {

    // an array of all the particles currently contained within the particle atom
    residentParticleIDs: particleAtom.protons.map( getParticleTandemID )
      .concat( particleAtom.neutrons.map( getParticleTandemID ) )
      .concat( particleAtom.electrons.map( getParticleTandemID ) ),

    // an ordered array that tracks which electron, if any, is in each shell position
    electronShellOccupantIDs: particleAtom.electronShellPositions.map( electronShellPosition => {
      return electronShellPosition.electron ? getParticleTandemID( electronShellPosition.electron ) : null;
    } )
  } ),
  applyState: ( particleAtom, stateObject ) => {

    // remove all the particles from the observable arrays
    particleAtom.clear();

    const deserializedState = {
      residentParticles: stateObject.residentParticleIDs.map( tandemID => {
        return phet.phetio.phetioEngine.getPhetioObject( tandemID );
      } ),
      electronShellOccupants: stateObject.electronShellOccupantIDs.map( tandemID => {
        return tandemID ? phet.phetio.phetioEngine.getPhetioObject( tandemID ) : null;
      } )
    };

    // add back the particles
    deserializedState.residentParticles.forEach( value => { particleAtom.addParticle( value ); } );

    // set the electron shell occupancy state
    deserializedState.electronShellOccupants.forEach( ( electron, index ) => {
      particleAtom.electronShellPositions[ index ].electron = electron;
    } );
  }
} );

shred.register( 'ParticleAtom', ParticleAtom );
export default ParticleAtom;