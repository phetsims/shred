// Copyright 2015-2016, University of Colorado Boulder

/**
 * Enumerable for the types of atomic particles.
 *
 * @author Aadish
 */
define( function( require ) {
  'use strict';

  var AtomComponentEnum = {
    PROTON: 'PROTON',
    NEUTRON: 'NEUTRON',
    ELECTRON: 'ELECTRON',
    UNKNOWN: 'UNKNOWN'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( AtomComponentEnum ); }

  return AtomComponentEnum;
} );