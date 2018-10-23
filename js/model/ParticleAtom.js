// Copyright 2014-2015, University of Colorado Boulder

/**
 * A model element that represents an atom that is comprised of a set of modeled subatomic particles. This model element
 * manages the positions and motion of all particles that are a part of the atom.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AtomIdentifier = require( 'SHRED/AtomIdentifier' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var NumberIO = require( 'TANDEM/types/NumberIO' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var ObservableArrayIO = require( 'AXON/ObservableArrayIO' );
  var ParticleAtomIO = require( 'SHRED/model/ParticleAtomIO' );
  var ParticleIO = require( 'SHRED/model/ParticleIO' );
  var PhetioObject = require( 'TANDEM/PhetioObject' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var shred = require( 'SHRED/shred' );
  var ShredConstants = require( 'SHRED/ShredConstants' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Utils = require( 'SHRED/Utils' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector2IO = require( 'DOT/Vector2IO' );

  // constants
  var NUM_ELECTRON_POSITIONS = 10; // first two electron shells, i.e. 2 + 8

  /**
   * @param {Object} options
   * @constructor
   */
  function ParticleAtom( options ) {

    var self = this;

    options = _.extend( {
      innerElectronShellRadius: 85,
      outerElectronShellRadius: 130,
      nucleonRadius: ShredConstants.NUCLEON_RADIUS,
      tandem: Tandem.required,
      phetioType: ParticleAtomIO
    }, options );

    PhetioObject.call( this, options );

    this.nucleonRadius = options.nucleonRadius; // @private

    // @public (read-only) - radius of the nucleus in view coordinates, which is rougly pixels
    this.nucleusRadius = 0;

    // @public
    this.positionProperty = new Property( Vector2.ZERO, {
      useDeepEquality: true,
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioType: PropertyIO( Vector2IO )
    } );
    this.nucleusOffsetProperty = new Property( Vector2.ZERO, {
      useDeepEquality: true,
      tandem: options.tandem.createTandem( 'nucleusOffsetProperty' ),
      phetioType: PropertyIO( Vector2IO )
    } );

    // @private - particle collections
    this.protons = new ObservableArray( {
      tandem: options.tandem.createTandem( 'protons' ),
      phetioType: ObservableArrayIO( ParticleIO )
    } );
    this.neutrons = new ObservableArray( {
      tandem: options.tandem.createTandem( 'neutrons' ),
      phetioType: ObservableArrayIO( ParticleIO )
    } );
    this.electrons = new ObservableArray( {
      tandem: options.tandem.createTandem( 'electrons' ),
      phetioType: ObservableArrayIO( ParticleIO )
    } );

    // @public (read-only) - derived properties based on the number of particles present in the atom
    // These are DerivedProperties in support of phet-io. We need to have the lengthProperty of ObservableArray instrumented.
    // TODO: follow https://github.com/phetsims/axon/issues/149 and implement this correctly with the solution to that issue.
    // NOTE: Changing these will most certainly break some wrapper code, like in the sonification wrapper.
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
    this.electronCountProperty = new DerivedProperty(
      [ this.electrons.lengthProperty ],
      function( length ) {
        return length;
      },
      {
        tandem: options.tandem.createTandem( 'electronCountProperty' ),
        numberType: 'Integer',
        phetioType: DerivedPropertyIO( NumberIO )
      }
    );
    this.chargeProperty = new DerivedProperty(
      [ this.protonCountProperty, this.electronCountProperty ],
      function( protonCount, electronCount ) {
        return protonCount - electronCount;
      },
      {
        tandem: options.tandem.createTandem( 'chargeProperty' ),
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
      [ this.protonCountProperty, this.neutronCountProperty, this.electronCountProperty ],
      function( protonCount, neutronCount, electronCount ) {
        return protonCount + neutronCount + electronCount;
      },
      {
        tandem: options.tandem.createTandem( 'particleCountProperty' ),
        numberType: 'Integer',
        phetioType: DerivedPropertyIO( NumberIO )
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
      position: new Vector2( self.innerElectronShellRadius, 0 )
    };
    this.electronShellPositions[ 1 ] = {
      electron: null,
      position: new Vector2( -self.innerElectronShellRadius, 0 )
    };
    var numSlotsInOuterShell = 8;

    // Stagger inner and outer electron shell positions, tweaked a bit for better interaction with labels.
    var angle = Math.PI / numSlotsInOuterShell * 1.2;
    for ( var i = 0; i < numSlotsInOuterShell; i++ ) {
      this.electronShellPositions[ i + 2 ] = {
        electron: null,
        position: new Vector2(
          Math.cos( angle ) * self.outerElectronShellRadius,
          Math.sin( angle ) * self.outerElectronShellRadius
        )
      };
      angle += 2 * Math.PI / numSlotsInOuterShell;
    }

    // When an electron is removed, clear the corresponding shell position.
    this.electrons.addItemRemovedListener( function( electron ) {
      self.electronShellPositions.forEach( function( electronShellPosition ) {
        if ( electronShellPosition.electron === electron ) {
          electronShellPosition.electron = null;
          if ( Math.abs( electronShellPosition.position.magnitude() - self.innerElectronShellRadius ) < 1E-5 ) {

            // An inner-shell electron was removed.  If there are electrons in the outer shell, move one of them in.
            var occupiedOuterShellPositions = _.filter( self.electronShellPositions, function( electronShellPosition ) {
              return ( electronShellPosition.electron !== null &&
                       Utils.roughlyEqual( electronShellPosition.position.magnitude(),
                         self.outerElectronShellRadius,
                         1E-5
                       )
              );
            } );
            occupiedOuterShellPositions = _.sortBy( occupiedOuterShellPositions, function( occupiedShellPosition ) {
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
    var translateParticle = function( particle, translation ) {
      if ( particle.positionProperty.get().equals( particle.destinationProperty.get() ) ) {
        particle.setPositionAndDestination( particle.positionProperty.get().plus( translation ) );
      }
      else {
        // Particle is moving, only change the destination.
        particle.destinationProperty.set( particle.destinationProperty.get().plus( translation ) );
      }
    };

    // When the nucleus offset changes, update all nucleon positions.
    this.nucleusOffsetProperty.link( function( newOffset, oldOffset ) {
      var translation = oldOffset === null ? Vector2.ZERO : newOffset.minus( oldOffset );
      self.protons.forEach( function( particle ) {
        translateParticle( particle, translation );
      } );
      self.neutrons.forEach( function( particle ) {
        translateParticle( particle, translation );
      } );
    } );

    // When the particle position changes, update all nucleon positions.  This is to be used in Isotopes and Atomic
    // Mass when a particle gets moved to sit at the correct spot on the scale.
    this.positionProperty.link( function( newOffset, oldOffset ) {
      var translation = oldOffset === null ? Vector2.ZERO : newOffset.minus( oldOffset );
      self.protons.forEach( function( particle ) {
        translateParticle( particle, translation );
      } );
      self.neutrons.forEach( function( particle ) {
        translateParticle( particle, translation );
      } );
    } );
  }

  shred.register( 'ParticleAtom', ParticleAtom );

  return inherit( PhetioObject, ParticleAtom, {

    dispose: function() {

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

      PhetioObject.prototype.dispose.call( this );
    },

    /**
     * test this this particle atom contains a particular particle
     * @param {Particle} particle
     * @returns {boolean}
     * @private
     */
    containsParticle: function( particle ) {
      return this.protons.contains( particle ) ||
             this.neutrons.contains( particle ) ||
             this.electrons.contains( particle );
    },

    /**
     * Add a particle to the atom.
     * @param {Particle} particle
     * @public
     */
    addParticle: function( particle ) {

      // in phet-io mode, we can end up with attempts being made to add the same particle twice when state is being
      // set, so test for that case and bail if needed
      if ( phet.phetio && this.containsParticle( particle ) ) {
        // looks like someone beat us to it
        return;
      }

      var self = this;
      if ( particle.type === 'proton' || particle.type === 'neutron' ) {

        // create a listener that will be called when this particle is removed
        var nucleonRemovedListener = function( userControlled ) {
          if ( userControlled && particleArray.contains( particle ) ) {
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
        var particleArray = particle.type === 'proton' ? this.protons : this.neutrons;
        particleArray.push( particle );
        this.reconfigureNucleus();
      }
      else if ( particle.type === 'electron' ) {
        this.electrons.push( particle );

        // Find an open position in the electron shell.
        var openPositions = this.electronShellPositions.filter( function( electronPosition ) {
          return ( electronPosition.electron === null );
        } );
        var sortedOpenPositions;
        if ( this.electronAddMode === 'proximal' ) {
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
        sortedOpenPositions = sortedOpenPositions.sort( function( p1, p2 ) {
          return ( self.positionProperty.get().distance( p1.position ) -
                   self.positionProperty.get().distance( p2.position ) );
        } );

        assert && assert( sortedOpenPositions.length > 0, 'No open positions found for electrons' );
        sortedOpenPositions[ 0 ].electron = particle;
        particle.destinationProperty.set( sortedOpenPositions[ 0 ].position );

        // Listen for removal of the electron and handle it.
        var electronRemovedListener = function( userControlled ) {
          if ( userControlled && self.electrons.contains( particle ) ) {
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
    },

    /**
     * Remove the specified particle from this particle atom.
     * @param {Particle} particle
     * @public
     */
    removeParticle: function( particle ) {

      if ( this.protons.contains( particle ) ) {
        this.protons.remove( particle );
      }
      else if ( this.neutrons.contains( particle ) ) {
        this.neutrons.remove( particle );
      }
      else if ( this.electrons.contains( particle ) ) {
        this.electrons.remove( particle );
      }
      else {
        throw new Error( 'Attempt to remove particle that is not in this particle atom.' );
      }
      assert && assert( typeof( particle.particleAtomRemovalListener ) === 'function',
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
      var particle = null;
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
    },

    /**
     * Remove all the particles but don't reconfigure the nucleus as they go. This makes it a quicker operation.
     * @public
     */
    clear: function() {
      var self = this;
      this.protons.forEach( function( particle ) { self.removeParticle( particle ); } );
      this.neutrons.forEach( function( particle ) { self.removeParticle( particle ); } );
      this.electrons.forEach( function( particle ) { self.removeParticle( particle ); } );
    },

    /**
     * Move all the particles to their destinations. This is generally used when animation is not desired.
     * @public
     */
    moveAllParticlesToDestination: function() {
      this.protons.forEach( function( p ) { p.moveImmediatelyToDestination(); } );
      this.neutrons.forEach( function( p ) { p.moveImmediatelyToDestination(); } );
      this.electrons.forEach( function( p ) { p.moveImmediatelyToDestination(); } );
    },

    // @public
    getWeight: function() {
      return this.protonCountProperty.get() + this.neutronCountProperty.get();
    },

    // @public
    getCharge: function() {
      return this.protonCountProperty.get() - this.electronCountProperty.get();
    },

    // @public
    getIsotopeAtomicMass: function() {
      return AtomIdentifier.getIsotopeAtomicMass( this.protonCountProperty.get(), this.neutronCountProperty.get() );
    },

    // @public
    reconfigureNucleus: function() {

      // Convenience variables.
      var centerX = this.positionProperty.get().x + this.nucleusOffsetProperty.get().x;
      var centerY = this.positionProperty.get().y + this.nucleusOffsetProperty.get().y;
      var nucleonRadius = this.nucleonRadius;
      var angle;
      var distFromCenter;
      var nucleusRadius = nucleonRadius;

      // Create an array of interspersed protons and neutrons for configuring.
      var nucleons = [];
      var protonIndex = 0;
      var neutronIndex = 0;
      var neutronsPerProton = this.neutrons.length / this.protons.length;
      var neutronsToAdd = 0;
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
        var placementRadius = 0;
        var numAtThisRadius = 1;
        var level = 0;
        var placementAngle = 0;
        var placementAngleDelta = 0;

        // Scale correction for the next placement radius, linear map determined empirically. As the nucleon size
        // increases, we want the scale factor and change in placement radius to decrease since larger nucleons are
        // easier to see with larger area. Map values determined in cases which use a wide range in number of nucleons
        // and in cases where the nucleon radius scaled from 3 to 10 (in screen coordinates - roughly pixels).
        var radiusA = 3;
        var radiusB = 10;
        var scaleFactorA = 2.4;
        var scaleFactorB = 1.35;
        var scaleFunction = LinearFunction( radiusA, radiusB, scaleFactorA, scaleFactorB, this.nucleonRadius );
        var scaleFactor = scaleFunction( this.nucleonRadius );

        for ( var i = 0; i < nucleons.length; i++ ) {
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
  } );
} );
