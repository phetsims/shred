// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model of an atom that represents the atom as a set of numbers which
 * represent the quantity of the various subatomic particles (i.e. protons,
 * neutrons, and electrons).
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  var shred = require( 'SHRED/shred' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var AtomIdentifier = require( 'SHRED/AtomIdentifier' );

  function NumberAtom( options ) {

    // Default configuration.
    options = _.extend( {
      protonCount: 0,
      neutronCount: 0,
      electronCount: 0,
      tandem: null
    }, options );

    // Call the super constructor.
    // @public
    PropertySet.call( this, {
      protonCount: options.protonCount,
      neutronCount: options.neutronCount,
      electronCount: options.electronCount
    }, {
      tandemSet: {
        protonCount: options.tandem && options.tandem.createTandem( 'protonCountProperty' ),
        neutronCount: options.tandem && options.tandem.createTandem( 'neutronCountProperty' ),
        electronCount: options.tandem && options.tandem.createTandem( 'electronCountProperty' )
      }
    } );

    this.addDerivedProperty( 'charge', [ 'protonCount', 'electronCount' ], function( protonCount, electronCount ) {
      return protonCount - electronCount;
    } );
    this.addDerivedProperty( 'massNumber', [ 'protonCount', 'neutronCount' ], function( protonCount, neutronCount ) {
      return protonCount + neutronCount;
    } );
    this.addDerivedProperty( 'particleCount', [ 'protonCount', 'neutronCount', 'electronCount' ], function( protonCount, neutronCount, electronCount ) {
      return protonCount + neutronCount + electronCount;
    } );
  }

  shred.register( 'NumberAtom', NumberAtom );
  return inherit( PropertySet, NumberAtom, {
    equals: function( otherAtom ) {
      return ( this.protonCount === otherAtom.protonCount &&
               this.neutronCount === otherAtom.neutronCount &&
               this.electronCount === otherAtom.electronCount );
    },

    getStandardAtomicMass: function() {
      return AtomIdentifier.getStandardAtomicMass( this.protonCount + this.neutronCount );
    },

    getIsotopeAtomicMass: function() {
      return AtomIdentifier.getIsotopeAtomicMass( this.protonCount, this.neutronCount );
    },

    setSubAtomicParticleCount: function( protonCount, neutronCount, electronCount ) {
      this.protonCount = protonCount;
      this.electronCount = electronCount;
      this.neutronCount = neutronCount;
      this.trigger( 'atomUpdated' );
    }
  } );
} );
