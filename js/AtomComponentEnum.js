// Copyright 2015, University of Colorado Boulder

/**
 * Created by Aadish on 02-Nov-15.
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