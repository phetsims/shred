// Copyright 2015-2019, University of Colorado Boulder

/**
 * Enumerable for the types of atomic particles.
 *
 * @author Aadish
 */
define( require => {
  'use strict';

  const AtomComponentEnum = {
    PROTON: 'PROTON',
    NEUTRON: 'NEUTRON',
    ELECTRON: 'ELECTRON',
    UNKNOWN: 'UNKNOWN'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( AtomComponentEnum ); }

  return AtomComponentEnum;
} );