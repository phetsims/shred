// Copyright 2002-2015, University of Colorado Boulder

/**
 * Model of an atom that represents the atom as a set of numbers which
 * represent the quantity of the various subatomic particles (i.e. protons,
 * neutrons, and electrons).
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var AtomIdentifier = require( 'SHRED/AtomIdentifier' );

  function NumberAtom( options ) {

    // Default configuration.
    options = _.extend( {
        protonCount: 0,
        neutronCount: 0,
        electronCount: 0
      },
      options );

    // Call the super constructor.
    PropertySet.call( this, {
      protonCount: options.protonCount,
      neutronCount: options.neutronCount,
      electronCount: options.electronCount
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
    }
  } );
} );
