// Copyright 2021-2025, University of Colorado Boulder

/**
 * ShredColors defines the color profile for this sim.
 *
 * @author Agustín Vallejo
 */

import Color from '../../scenery/js/util/Color.js';
import ProfileColorProperty from '../../scenery/js/util/ProfileColorProperty.js';
import { PARTICLE_COLORS } from './model/Particle.js';
import shred from './shred.js';

const ShredColors = {

  // background color for screens in this sim
  screenBackgroundColorProperty: new ProfileColorProperty( shred, 'screenBackground', {
    default: Color.WHITE
  } ),

  // particle colors
  protonColorProperty: new ProfileColorProperty( shred, 'protonColor', {
    default: PARTICLE_COLORS.proton
  } ),
  neutronColorProperty: new ProfileColorProperty( shred, 'neutronColor', {
    default: PARTICLE_COLORS.neutron
  } ),
  electronColorProperty: new ProfileColorProperty( shred, 'electronColor', {
    default: PARTICLE_COLORS.electron
  } ),


  // background color for panels in this sim
  panelBackgroundColorProperty: new ProfileColorProperty( shred, 'panelBackground', {
    default: new Color( 241, 250, 254 )
  } ),
  panelStrokeColorProperty: new ProfileColorProperty( shred, 'panelStrokeColor', {
    default: Color.GRAY
  } ),

  shellModelTextHighlightColorProperty: new ProfileColorProperty( shred, 'shellModelTextHighlightColor', {
    default: new Color( 189, 255, 255 )
  } ),

  bucketTextBackgroundColorProperty: new ProfileColorProperty( shred, 'bucketTextBackgroundColor', {
    default: new Color( 0, 0, 0, 0.5 )
  } ),

  centerXColorProperty: new ProfileColorProperty( shred, 'centerXColorProperty', {
    default: '#DE6D02'
  } ),

  elementNameColorProperty: new ProfileColorProperty( shred, 'elementNameColorProperty', {
    default: '#D14600'
  } )
};

shred.register( 'ShredColors', ShredColors );

export default ShredColors;