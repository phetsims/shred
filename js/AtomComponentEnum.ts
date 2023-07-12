// Copyright 2015-2021, University of Colorado Boulder

/**
 * Enumerable for the types of atomic particles.
 *
 * @author Aadish
 */


const AtomComponentEnum = {
  PROTON: 'PROTON',
  NEUTRON: 'NEUTRON',
  ELECTRON: 'ELECTRON',
  UNKNOWN: 'UNKNOWN'
};

// verify that enum is immutable, without the runtime penalty in production code
if ( assert ) { Object.freeze( AtomComponentEnum ); }

export default AtomComponentEnum;