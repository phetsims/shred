// Copyright 2015, University of Colorado Boulder

/**
 * Enumerable for the types of atomic particles.
 *
 * @author Aadish (02-Nov-15)
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