// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model of an atom that represents the atom as a set of numbers which represent the quantity of the various subatomic
 * particles (i.e. protons, neutrons and electrons).
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  var AtomIdentifier = require( 'SHRED/AtomIdentifier' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var shred = require( 'SHRED/shred' );

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
      tandem: null
    }, options );

    // @public
    this.protonCountProperty =  new Property( options.protonCount, {
      tandem: options.tandem && options.tandem.createTandem( 'protonCountProperty' ),
      phetioValueType: TNumber( { type: 'Integer' } )
    } );
    this.neutronCountProperty = new Property( options.neutronCount, {
      tandem: options.tandem && options.tandem.createTandem( 'neutronCountProperty' ),
      phetioValueType: TNumber( { type: 'Integer' } )
    } );
    this.electronCountProperty = new Property( options.electronCount, {
      tandem: options.tandem && options.tandem.createTandem( 'electronCountProperty' ),
      phetioValueType: TNumber( { type: 'Integer' } )
    } );

    this.chargeProperty = new DerivedProperty( [ this.protonCountProperty, this.electronCountProperty ],
      function( protonCount, electronCount ) {
        return protonCount - electronCount;
      },
      {
        tandem: options.tandem && options.tandem.createTandem( 'chargeProperty' ),
        phetioValueType: TNumber( { type: 'Integer' } )
      }
    );

    this.massNumberProperty = new DerivedProperty( [ this.protonCountProperty, this.neutronCountProperty ],
      function( protonCount, neutronCount ) {
        return protonCount + neutronCount;
      },
      {
        tandem: options.tandem && options.tandem.createTandem( 'massNumberProperty' ),
        phetioValueType: TNumber( { type: 'Integer' } )
      }
    );

    this.particleCountProperty = new DerivedProperty( [ this.protonCountProperty, this.neutronCountProperty, this.electronCountProperty ],
      function( protonCount, neutronCount, electronCount ) {
        return protonCount + neutronCount + electronCount;
      },
      {
        tandem: options.tandem && options.tandem.createTandem( 'particleCountProperty' ),
        phetioValueType: TNumber( { type: 'Integer' } )
      }
    );

    // @public - events emitted by instances of this type
    this.atomUpdated = new Emitter();
  }

  shred.register( 'NumberAtom', NumberAtom );
  return inherit( Object, NumberAtom, {

    /**
     * Compare with other Number Atom
     * @param {NumberAtom} otherAtom
     * @public
     */
    equals: function( otherAtom ) {
      return ( this.protonCountProperty.get() === otherAtom.protonCountProperty.get() &&
               this.neutronCountProperty.get() === otherAtom.neutronCountProperty.get() &&
               this.electronCountProperty.get() === otherAtom.electronCountProperty.get() );
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
    }
  } );
} );
