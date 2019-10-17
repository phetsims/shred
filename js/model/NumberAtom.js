// Copyright 2014-2019, University of Colorado Boulder

/**
 * Model of an atom that represents the atom as a set of numbers which represent the quantity of the various subatomic
 * particles (i.e. protons, neutrons and electrons).
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const AtomIdentifier = require( 'SHRED/AtomIdentifier' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  const Emitter = require( 'AXON/Emitter' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const shred = require( 'SHRED/shred' );
  const Tandem = require( 'TANDEM/Tandem' );

  // constants
  const NumberDerivedProperty = DerivedPropertyIO( NumberIO );

  /**
   * @param {Object} options
   * @constructor
   */
  function NumberAtom( options ) {

    // Default configuration.
    options = merge( {
      protonCount: 0,
      neutronCount: 0,
      electronCount: 0,
      tandem: Tandem.optional // Tandem must be supplied when running in PhET-iO
    }, options );

    // @public
    this.protonCountProperty = new NumberProperty( options.protonCount, {
      tandem: options.tandem.createTandem( 'protonCountProperty' ),
      documentation: 'this property is updated by the model and should not be set by users',
      numberType: 'Integer'
    } );
    this.neutronCountProperty = new NumberProperty( options.neutronCount, {
      tandem: options.tandem.createTandem( 'neutronCountProperty' ),
      numberType: 'Integer',
      documentation: 'this property is updated by the model and should not be set by users'
    } );
    this.electronCountProperty = new NumberProperty( options.electronCount, {
      tandem: options.tandem.createTandem( 'electronCountProperty' ),
      numberType: 'Integer',
      documentation: 'this property is updated by the model and should not be set by users'
    } );

    this.chargeProperty = new DerivedProperty( [ this.protonCountProperty, this.electronCountProperty ],
      function( protonCount, electronCount ) {
        return protonCount - electronCount;
      }, {
        tandem: options.tandem.createTandem( 'chargeProperty' ),
        numberType: 'Integer',
        phetioType: NumberDerivedProperty
      }
    );

    this.massNumberProperty = new DerivedProperty( [ this.protonCountProperty, this.neutronCountProperty ],
      function( protonCount, neutronCount ) {
        return protonCount + neutronCount;
      }, {
        tandem: options.tandem.createTandem( 'massNumberProperty' ),
        numberType: 'Integer',
        phetioType: NumberDerivedProperty
      }
    );

    this.particleCountProperty = new DerivedProperty( [ this.protonCountProperty, this.neutronCountProperty, this.electronCountProperty ],
      function( protonCount, neutronCount, electronCount ) {
        return protonCount + neutronCount + electronCount;
      }, {
        tandem: options.tandem.createTandem( 'particleCountProperty' ),
        numberType: 'Integer',
        phetioType: NumberDerivedProperty
      }
    );

    // @public - events emitted by instances of this type
    this.atomUpdated = new Emitter( {
      tandem: options.tandem.createTandem( 'atomUpdatedEmitter' )
    } );
  }

  shred.register( 'NumberAtom', NumberAtom );

  return inherit( Object, NumberAtom, {

    /**
     * Compare with other Number Atom
     * @param {NumberAtom|ImmutableAtomConfig} otherAtom
     * @public
     */
    equals: function( otherAtom ) {
      return this.protonCount === otherAtom.protonCount &&
             this.neutronCount === otherAtom.neutronCount &&
             this.electronCount === otherAtom.electronCount;
    },

    // @public
    getStandardAtomicMass: function() {
      return AtomIdentifier.getStandardAtomicMass( this.protonCountProperty.get() + this.neutronCountProperty.get() );
    },

    // @public
    getIsotopeAtomicMass: function() {
      return AtomIdentifier.getIsotopeAtomicMass( this.protonCountProperty.get(), this.neutronCountProperty.get() );
    },

    // @public - ES5 getters for particle counts
    get protonCount() {
      return this.protonCountProperty.value;
    },
    get neutronCount() {
      return this.neutronCountProperty.value;
    },
    get electronCount() {
      return this.electronCountProperty.value;
    },

    /**
     * @param {number} protonCount
     * @param {number} neutronCount
     * @param {number} electronCount
     * @public
     */
    setSubAtomicParticleCount: function( protonCount, neutronCount, electronCount ) {
      this.protonCountProperty.set( protonCount );
      this.electronCountProperty.set( electronCount );
      this.neutronCountProperty.set( neutronCount );
      this.atomUpdated.emit();
    },

    dispose: function() {
      this.chargeProperty.dispose();
      this.massNumberProperty.dispose();
      this.particleCountProperty.dispose();

      // Dispose these afterwards since they are dependencies to the above DerivedProperties
      this.protonCountProperty.dispose();
      this.neutronCountProperty.dispose();
      this.electronCountProperty.dispose();

      this.atomUpdated.dispose();
    }
  } );
} );