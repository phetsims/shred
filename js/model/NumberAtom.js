// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model of an atom that represents the atom as a set of numbers which represent the quantity of the various subatomic
 * particles (i.e. protons, neutrons and electrons).
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AtomIdentifier = require( 'SHRED/AtomIdentifier' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var shred = require( 'SHRED/shred' );
  var Tandem = require( 'TANDEM/Tandem' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  /**
   * @param {Object} options
   * @constructor
   */
  function NumberAtom( options ) {

    // Default configuration.
    options = _.extend( {
      protonCount: 0,
      neutronCount: 0,
      electronCount: 0,
      tandem: Tandem.tandemOptional() // Tandem must be supplied when running in PhET-iO
    }, options );

    // @public
    this.protonCountProperty = new NumberProperty( options.protonCount, {
      tandem: options.tandem.createTandem( 'protonCountProperty' ),
      documentation: 'this property is updated by the model and should not be set by users',
      valueType: 'Integer'
    } );
    this.neutronCountProperty = new NumberProperty( options.neutronCount, {
      tandem: options.tandem.createTandem( 'neutronCountProperty' ),
      valueType: 'Integer',
      documentation: 'this property is updated by the model and should not be set by users'
    } );
    this.electronCountProperty = new NumberProperty( options.electronCount, {
      tandem: options.tandem.createTandem( 'electronCountProperty' ),
      valueType: 'Integer',
      documentation: 'this property is updated by the model and should not be set by users'
    } );

    this.chargeProperty = new DerivedProperty( [ this.protonCountProperty, this.electronCountProperty ],
      function( protonCount, electronCount ) {
        return protonCount - electronCount;
      }, {
        tandem: options.tandem.createTandem( 'chargeProperty' ),
        valueType: 'Integer',
        phetioValueType: TNumber
      }
    );

    this.massNumberProperty = new DerivedProperty( [ this.protonCountProperty, this.neutronCountProperty ],
      function( protonCount, neutronCount ) {
        return protonCount + neutronCount;
      }, {
        tandem: options.tandem.createTandem( 'massNumberProperty' ),
        valueType: 'Integer',
        phetioValueType: TNumber
      }
    );

    this.particleCountProperty = new DerivedProperty( [ this.protonCountProperty, this.neutronCountProperty, this.electronCountProperty ],
      function( protonCount, neutronCount, electronCount ) {
        return protonCount + neutronCount + electronCount;
      }, {
        tandem: options.tandem.createTandem( 'particleCountProperty' ),
        valueType: 'Integer',
        phetioValueType: TNumber
      }
    );

    // @public - events emitted by instances of this type
    this.atomUpdated = new Emitter( {
      phetioArgumentTypes: [],
      tandem: options.tandem.createTandem( 'atomUpdatedEmitter' )
    } );
  }

  shred.register( 'NumberAtom', NumberAtom );

  return inherit( Object, NumberAtom, {

    /**
     * Compare with other Number Atom
     * @param {NumberAtom} otherAtom
     * @public
     */
    equals: function( otherAtom ) {
      return this.protonCountProperty.get() === otherAtom.protonCountProperty.get() &&
             this.neutronCountProperty.get() === otherAtom.neutronCountProperty.get() &&
             this.electronCountProperty.get() === otherAtom.electronCountProperty.get();
    },

    // @public
    getStandardAtomicMass: function() {
      return AtomIdentifier.getStandardAtomicMass( this.protonCountProperty.get() + this.neutronCountProperty.get() );
    },

    // @public
    getIsotopeAtomicMass: function() {
      return AtomIdentifier.getIsotopeAtomicMass( this.protonCountProperty.get(), this.neutronCountProperty.get() );
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