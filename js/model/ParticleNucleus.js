// Copyright 2014-2020, University of Colorado Boulder

/**
 * A model element that represents an atom that is comprised of a set of modeled subatomic particles. This model element
 * manages the positions and motion of all particles that are a part of the atom.
 *
 * @author John Blanco
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../axon/js/DerivedPropertyIO.js';
import ObservableArray from '../../../axon/js/ObservableArray.js';
import ObservableArrayIO from '../../../axon/js/ObservableArrayIO.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Vector2Property from '../../../dot/js/Vector2Property.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import PhetioObject from '../../../tandem/js/PhetioObject.js';
import Tandem from '../../../tandem/js/Tandem.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';
import AtomIdentifier from '../AtomIdentifier.js';
import shred from '../shred.js';
import ShredConstants from '../ShredConstants.js';
import ParticleAtomIO from './ParticleAtomIO.js';
import ParticleIO from './ParticleIO.js';

// constants
const NUM_PROTON_POSITIONS = 10;
const NUM_NEUTRON_POSITIONS = 12;

/**
 * @param {Object} [options]
 * @constructor
 */
function ParticleNucleus( options ) {

  const self = this;

  options = merge( {
    innerElectronShellRadius: 85,
    outerElectronShellRadius: 130,
    nucleonRadius: ShredConstants.NUCLEON_RADIUS,
    tandem: Tandem.REQUIRED,
    phetioType: ParticleAtomIO
  }, options );

  PhetioObject.call( this, options );

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
  this.protons = new ObservableArray( {
    // tandem: options.tandem.createTandem( 'protons' ),
    phetioType: ObservableArrayIO( ParticleIO )
  } );
  this.neutrons = new ObservableArray( {
    // tandem: options.tandem.createTandem( 'neutrons' ),
    phetioType: ObservableArrayIO( ParticleIO )
  } );

  // @public (read-only) - derived properties based on the number of particles present in the atom
  // These are DerivedProperties in support of phet-io. We need to have the lengthProperty of ObservableArray instrumented.
  // TODO: implement this correctly, see https://github.com/phetsims/shred/issues/25
  // NOTE: Changing these may break some wrapper code, so be sure to check.
  this.protonCountProperty = new DerivedProperty(
    [ this.protons.lengthProperty ],
    function( length ) {
      return length;
    },
    {
      tandem: options.tandem.createTandem( 'protonCountProperty' ),
      numberType: 'Integer',
      phetioType: DerivedPropertyIO( NumberIO )
    }
  );
  this.neutronCountProperty = new DerivedProperty(
    [ this.neutrons.lengthProperty ],
    function( length ) {
      return length;
    },
    {
      tandem: options.tandem.createTandem( 'neutronCountProperty' ),
      numberType: 'Integer',
      phetioType: DerivedPropertyIO( NumberIO )
    }
  );
  this.massNumberProperty = new DerivedProperty(
    [ this.protonCountProperty, this.neutronCountProperty ],
    function( protonCount, neutronCount ) {
      return protonCount + neutronCount;
    },
    {
      tandem: options.tandem.createTandem( 'massNumberProperty' ),
      numberType: 'Integer',
      phetioType: DerivedPropertyIO( NumberIO )
    }
  );
  this.particleCountProperty = new DerivedProperty(
    [ this.protonCountProperty, this.neutronCountProperty ],
    function( protonCount, neutronCount ) {
      return protonCount + neutronCount;
    },
    {
      tandem: options.tandem.createTandem( 'particleCountProperty' ),
      numberType: 'Integer',
      phetioType: DerivedPropertyIO( NumberIO )
    }
  );

  // Make shell radii publicly accessible.changed and electronorbitallength
  this.innerElectronShellRadius = options.innerElectronShellRadius; // @public
  this.outerElectronShellRadius = options.outerElectronShellRadius; // @public

  // Set the default nucleon add/remove mode.  Valid values are 'proximal' and 'random'.
  this.nucleonAddMode = 'proximal'; // @private

  // Initialize the positions where a nucleon can be placed.
  this.protonShellPositions = new Array( NUM_PROTON_POSITIONS ); // @private
  this.neutronShellPositions = new Array( NUM_NEUTRON_POSITIONS ); // @private

  const numSlotsInLowerProton = 2;
  let x0 = -95;//assuming 20 is length from center X
  for ( let i = 0; i < numSlotsInLowerProton; i++ ) {
    this.protonShellPositions[ i ] = {
      proton: null,
      position: new Vector2( x0, -110 )
    };
    x0 += 20;
  }
  const numSlotsInMiddleProton = 6;
  let x1 = -135.5;//assuming 20 is length from center X
  for ( let i = 0; i < numSlotsInMiddleProton; i++ ) {
    this.protonShellPositions[ i + 2 ] = {
      proton: null,
      position: new Vector2( x1, -30 )
    };
    x1 += 20;
  }
  const numSlotsInUpperProton = 2;
  let x2 = -135.5;//assuming 20 is length from center X
  for ( let i = 0; i < numSlotsInUpperProton; i++ ) {
    this.protonShellPositions[ i + 8 ] = {
      proton: null,
      position: new Vector2( x2, 50 )
    };
    x2 += 20;
  }

  const numSlotsInLowerNeutron = 2;
  let x3 = 75;//assuming 20 is length from center X
  for ( let i = 0; i < numSlotsInLowerNeutron; i++ ) {
    this.neutronShellPositions[ i ] = {
      neutron: null,
      position: new Vector2( x3, -110 )
    };
    x3 += 20;
  }
  const numSlotsInMiddleNeutron = 6;
  let x4 = 34.5;//assuming 20 is length from center X
  for ( let i = 0; i < numSlotsInMiddleNeutron; i++ ) {
    this.neutronShellPositions[ i + 2 ] = {
      neutron: null,
      position: new Vector2( x4, -30 )
    };
    x4 += 20;
  }
  const numSlotsInUpperNeutron = 4;
  let x5 = 34.5;//assuming 20 is length from center X
  for ( let i = 0; i < numSlotsInUpperNeutron; i++ ) {
    this.neutronShellPositions[ i + 8 ] = {
      neutron: null,
      position: new Vector2( x5, 50 )
    };
    x5 += 20;
  }

  // When a proton is removed, clear the corresponding shell position.
  this.protons.addItemRemovedListener( function( proton ) {
    self.protonShellPositions.forEach( function( protonShellPosition ) {
      if ( protonShellPosition.proton === proton ) {
        protonShellPosition.proton = null;
        //thing to if a lower energy level proton removed, move a proton from upper energy level down here
        if ( protonShellPosition.position.y === -110 || protonShellPosition.position.y === -30 ) {
          // An inner-shell proton was removed.  If there are protons in the outer shell, move one of them in.
          let occupiedOuterShellPositions;
          if ( protonShellPosition.position.y === -110 ) {
            occupiedOuterShellPositions = _.filter( self.protonShellPositions, function( protonShellPosition ) {
              return ( protonShellPosition.proton !== null && protonShellPosition.position.y > -110 );
            } );
          }
          else {
            occupiedOuterShellPositions = _.filter( self.protonShellPositions, function( protonShellPosition ) {
              return ( protonShellPosition.proton !== null && protonShellPosition.position.y > -30 );
            } );
          }
          //return proton in outer shell (if one exists) closest to inner shell
          occupiedOuterShellPositions = _.sortBy( occupiedOuterShellPositions, function( occupiedShellPosition ) {
            return occupiedShellPosition.position.distance( protonShellPosition.position );
          } );
          if ( occupiedOuterShellPositions.length > 0 ) {
            // Move outer proton to inner spot.
            protonShellPosition.proton = occupiedOuterShellPositions[ 0 ].proton;
            occupiedOuterShellPositions[ 0 ].proton = null;
            protonShellPosition.proton.destinationProperty.set( protonShellPosition.position );
            if ( occupiedOuterShellPositions[ 0 ].position.y === -30 ) {
              let occupiedUpperShellPositions = _.filter( self.protonShellPositions, function( protonShellPosition ) {
                return ( protonShellPosition.proton !== null && protonShellPosition.position.y > -30 );
              } );
              occupiedUpperShellPositions = _.sortBy( occupiedUpperShellPositions, function( occupiedShellPosition ) {
                return occupiedShellPosition.position.distance( protonShellPosition.proton.positionProperty.get() );
              } );
              if ( occupiedUpperShellPositions.length > 0 ) {
                var destination = protonShellPosition.proton.positionProperty.get();
                self.protonShellPositions.forEach( function( secondProtonShellPosition ) {
                  if ( secondProtonShellPosition.position.distance( occupiedUpperShellPositions[ 0 ].position ) === 0 ) {
                    occupiedOuterShellPositions[ 0 ].proton = occupiedUpperShellPositions[ 0 ].proton;
                    secondProtonShellPosition.proton = occupiedUpperShellPositions[ 0 ].proton;
                    secondProtonShellPosition.proton.destinationProperty.set( destination );
                    occupiedUpperShellPositions[ 0 ].proton = null;
                  }
                } );
              }
            }
          }
        }
      }
    } );
  } );

  // When a neutron is removed, clear the corresponding shell position.
  this.neutrons.addItemRemovedListener( function( neutron ) {
    self.neutronShellPositions.forEach( function( neutronShellPosition ) {
      if ( neutronShellPosition.neutron === neutron ) {
        neutronShellPosition.neutron = null;
        //thing to if a lower energy level neutron removed, move a neutron from upper energy level down here
        if ( neutronShellPosition.position.y === -110 || neutronShellPosition.position.y === -30 ) {
          // An inner-shell neutron was removed.  If there are neutrons in the outer shell, move one of them in.
          let occupiedOuterShellPositions;
          if ( neutronShellPosition.position.y === -110 ) {
            occupiedOuterShellPositions = _.filter( self.neutronShellPositions, function( neutronShellPosition ) {
              return ( neutronShellPosition.neutron !== null && neutronShellPosition.position.y > -110 );
            } );
          }
          else {
            occupiedOuterShellPositions = _.filter( self.neutronShellPositions, function( neutronShellPosition ) {
              return ( neutronShellPosition.neutron !== null && neutronShellPosition.position.y > -30 );
            } );
          }
          //return neutron in outer shell (if one exists) closest to inner shell
          occupiedOuterShellPositions = _.sortBy( occupiedOuterShellPositions, function( occupiedShellPosition ) {
            return occupiedShellPosition.position.distance( neutronShellPosition.position );
          } );
          if ( occupiedOuterShellPositions.length > 0 ) {
            // Move outer neutron to inner spot.
            neutronShellPosition.neutron = occupiedOuterShellPositions[ 0 ].neutron;
            occupiedOuterShellPositions[ 0 ].neutron = null;
            neutronShellPosition.neutron.destinationProperty.set( neutronShellPosition.position );
            if ( occupiedOuterShellPositions[ 0 ].position.y === -30 ) {
              let occupiedUpperShellPositions = _.filter( self.neutronShellPositions, function( neutronShellPosition ) {
                return ( neutronShellPosition.neutron !== null && neutronShellPosition.position.y > -30 );
              } );
              occupiedUpperShellPositions = _.sortBy( occupiedUpperShellPositions, function( occupiedShellPosition ) {
                return occupiedShellPosition.position.distance( neutronShellPosition.neutron.positionProperty.get() );
              } );
              if ( occupiedUpperShellPositions.length > 0 ) {
                var destination = neutronShellPosition.neutron.positionProperty.get();
                self.neutronShellPositions.forEach( function( secondNeutronShellPosition ) {
                  if ( secondNeutronShellPosition.position.distance( occupiedUpperShellPositions[ 0 ].position ) === 0 ) {
                    occupiedOuterShellPositions[ 0 ].neutron = occupiedUpperShellPositions[ 0 ].neutron;
                    secondNeutronShellPosition.neutron = occupiedUpperShellPositions[ 0 ].neutron;
                    secondNeutronShellPosition.neutron.destinationProperty.set( destination );
                    occupiedUpperShellPositions[ 0 ].neutron = null;
                  }
                } );
              }
            }
          }
        }
      }
    } );
  } );
}

shred.register( 'ParticleNucleus', ParticleNucleus );

inherit( PhetioObject, ParticleNucleus, {

  dispose: function() {

    this.particleCountProperty.dispose();
    this.massNumberProperty.dispose();
    this.chargeProperty.dispose();

    // These should be disposed after because they are dependencies to the above DerivedProperties
    this.protonCountProperty.dispose();
    this.neutronCountProperty.dispose();

    this.positionProperty.dispose();
    this.nucleusOffsetProperty.dispose();

    // @private - particle collections
    this.protons.dispose();
    this.neutrons.dispose();

    PhetioObject.prototype.dispose.call( this );
  },

  /**
   * test this this particle atom contains a particular particle
   * @param {Particle} particle
   * @returns {boolean}
   * @private
   */
  containsParticle: function( particle ) {
    return this.protons.includes( particle ) ||
           this.neutrons.includes( particle );
  },

  /**
   * Add a particle to the atom.
   * @param {Particle} particle
   * @public
   */
  addParticle: function( particle ) {

    // in phet-io mode, we can end up with attempts being made to add the same particle twice when state is being
    // set, so test for that case and bail if needed
    if ( Tandem.PHET_IO_ENABLED && this.containsParticle( particle ) ) {
      // looks like someone beat us to it
      return;
    }

    const self = this;
    if ( particle.type === 'proton' ) {
      this.protons.push( particle );

      // Find an open position in the proton shell.
      const openPositions = this.protonShellPositions.filter( function( protonPosition ) {
        return ( protonPosition.proton === null );
      } );
      let sortedOpenPositions;
      if ( this.nucleonAddMode === 'proximal' ) {
        sortedOpenPositions = openPositions.sort( function( p1, p2 ) {
          // Sort first by distance to particle.
          return ( particle.positionProperty.get().distance( p1.position ) -
                   particle.positionProperty.get().distance( p2.position ) );
        } );
      }
      else {
        sortedOpenPositions = phet.joist.random.shuffle( openPositions );
      }

      // Put the inner shell positions in front.
      const innerSortedOpenPositions = sortedOpenPositions.sort( function( p1, p2 ) {
        return ( p1.position.y - p2.position.y );
      } );

      assert && assert( innerSortedOpenPositions.length > 0, 'No open positions found for protons' );
      innerSortedOpenPositions[ 0 ].proton = particle;
      particle.destinationProperty.set( innerSortedOpenPositions[ 0 ].position );

      // Listen for removal of the proton and handle it.
      var protonRemovedListener = function( userControlled ) {
        if ( userControlled && self.protons.includes( particle ) ) {
          self.protons.remove( particle );
          particle.zLayerProperty.set( 0 );
          particle.userControlledProperty.unlink( protonRemovedListener );
          delete particle.particleAtomRemovalListener;
        }
      };
      particle.userControlledProperty.lazyLink( protonRemovedListener );

      // Set the listener as an attribute of the particle to aid unlinking in some cases.
      particle.particleAtomRemovalListener = protonRemovedListener;
    }
    else if ( particle.type === 'neutron' ) {
      this.neutrons.push( particle );

      // Find an open position in the neutron shell.
      const openPositions = this.neutronShellPositions.filter( function( neutronPosition ) {
        return ( neutronPosition.neutron === null );
      } );
      let sortedOpenPositions;
      if ( this.nucleonAddMode === 'proximal' ) {
        sortedOpenPositions = openPositions.sort( function( p1, p2 ) {
          // Sort first by distance to particle.
          return ( particle.positionProperty.get().distance( p1.position ) -
                   particle.positionProperty.get().distance( p2.position ) );
        } );
      }
      else {
        sortedOpenPositions = phet.joist.random.shuffle( openPositions );
      }

      // Put the inner shell positions in front.
      const innerSortedOpenPositions = sortedOpenPositions.sort( function( p1, p2 ) {
        return ( p1.position.y - p2.position.y );
      } );

      assert && assert( innerSortedOpenPositions.length > 0, 'No open positions found for neutrons' );
      innerSortedOpenPositions[ 0 ].neutron = particle;
      particle.destinationProperty.set( innerSortedOpenPositions[ 0 ].position );

      // Listen for removal of the neutron and handle it.
      var neutronRemovedListener = function( userControlled ) {
        if ( userControlled && self.neutrons.includes( particle ) ) {
          self.neutrons.remove( particle );
          particle.zLayerProperty.set( 0 );
          particle.userControlledProperty.unlink( neutronRemovedListener );
          delete particle.particleAtomRemovalListener;
        }
      };
      particle.userControlledProperty.lazyLink( neutronRemovedListener );

      // Set the listener as an attribute of the particle to aid unlinking in some cases.
      particle.particleAtomRemovalListener = neutronRemovedListener;
    }
    else {
      throw new Error( 'Unexpected particle type.' );
    }
  },

  /**
   * Remove the specified particle from this particle atom.
   * @param {Particle} particle
   * @public
   */
  removeParticle: function( particle ) {

    if ( this.protons.includes( particle ) ) {
      this.protons.remove( particle );
    }
    else if ( this.neutrons.includes( particle ) ) {
      this.neutrons.remove( particle );
    }
    else {
      throw new Error( 'Attempt to remove particle that is not in this particle atom.' );
    }
    assert && assert( typeof ( particle.particleAtomRemovalListener ) === 'function',
      'No particle removal listener attached to particle.' );
    particle.userControlledProperty.unlink( particle.particleAtomRemovalListener );

    delete particle.particleAtomRemovalListener;
  },

  /**
   * Extract an arbitrary instance of the specified particle, assuming one exists.
   * @param {string} particleType
   * @returns {Particle} particle
   * @public
   */
  extractParticle: function( particleType ) {
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

      default:
        throw new Error( 'Attempt to remove unknown particle type.' );
    }

    if ( particle !== null ) {
      this.removeParticle( particle );
    }

    return particle;
  },

  /**
   * Remove all the particles but don't reconfigure the nucleus as they go. This makes it a quicker operation.
   * @public
   */
  clear: function() {
    const self = this;
    this.protons.forEach( function( particle ) { self.removeParticle( particle ); } );
    this.neutrons.forEach( function( particle ) { self.removeParticle( particle ); } );
  },

  /**
   * Move all the particles to their destinations. This is generally used when animation is not desired.
   * @public
   */
  moveAllParticlesToDestination: function() {
    this.protons.forEach( function( p ) { p.moveImmediatelyToDestination(); } );
    this.neutrons.forEach( function( p ) { p.moveImmediatelyToDestination(); } );
  },

  // @public
  getWeight: function() {
    return this.protonCountProperty.get() + this.neutronCountProperty.get();
  },

  // @public
  getIsotopeAtomicMass: function() {
    return AtomIdentifier.getIsotopeAtomicMass( this.protonCountProperty.get(), this.neutronCountProperty.get() );
  }
} );

export default ParticleNucleus;