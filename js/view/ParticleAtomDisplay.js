// Copyright 2014-2020, University of Colorado Boulder

/**
 * A node that presents a representation of the atom. Uses ParticleNode's instead of the regular atom
 * that used ParticleView's that allowed correct layering of particles.
 *
 * @author John Blanco
 * @author Aadish Gupta
 * @author Luisa Vargas
 */

import LinearFunction from '../../../dot/js/LinearFunction.js';
import Vector2 from '../../../dot/js/Vector2.js';
import merge from '../../../phet-core/js/merge.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';
import ParticleNode from './ParticleNode.js';

// constants
const LINE_DASH = [ 4, 5 ];

class ParticleAtomDisplay extends Node {
  /**
   * @param {NumberAtom} numberAtom Model representation of the atom
   * @param {Object} [options]
   */
  constructor( numberAtom, options ) {

    options = merge( {
      pickable: false,
      tandem: Tandem.REQUIRED
    }, options );

    // Call super constructor.
    super( {
      pickable: false,
      tandem: options.tandem,

      // pdom
      tagName: 'div',
      ariaRole: 'listbox',
      focusable: true
    } );


    //Add electron rings
    const innerRing = new Circle( 35, {
      stroke: 'blue',
      lineWidth: 1.5,
      lineDash: LINE_DASH,
      tandem: options.tandem.createTandem( 'innerRing' )
    } );
    this.addChild( innerRing );
    const outerRing = new Circle( 60, {
      stroke: 'blue',
      lineWidth: 1.5,
      lineDash: LINE_DASH,
      tandem: options.tandem.createTandem( 'outerRing' )
    } );
    this.addChild( outerRing );

    // Figure out the sizes of the particles and the inter-particle spacing based on the max width.
    //const totalParticleSpace = maxWidth - 10;
    this.nucleonRadius = 6;//totalParticleSpace / ( ( maxParticles * 2 ) + ( maxParticles - 1 ) + 2 )
    const interParticleSpacing = this.nucleonRadius * 3;

    // @public (read-only) - radius of the nucleus in view coordinates, which is rougly pixels
    this.nucleusRadius = 0;

    // Add the layer where the particles will live.
    const particleLayer = new Node( { children: [] } );
    this.addChild( particleLayer );

    // stored ParticleNode instances that are positioned correctly, so we just have to add/remove the
    // changed ones (faster than full rebuild)
    const protons = [];
    const neutrons = [];

    // counts of the displayed number of particles
    let protonDisplayCount = 0;
    let neutronDisplayCount = 0;

    // increase the particle count by 1, and return the currently displayed quantity array
    function incrementParticleCount( array, currentQuantity, particleType, radius, startX, startY ) {
      const newIndex = currentQuantity;
      if ( newIndex === array.length ) {

        // we need to create a new particle
        array.push( new ParticleNode( particleType, radius, {
          x: startX + newIndex * interParticleSpacing,
          y: startY
        } ) );
      }
      particleLayer.addChild( array[ newIndex ] );
      currentQuantity += 1;
      return currentQuantity;
    }

    // decrease the particle count by 1, and return the currently displayed quantity array
    function decrementParticleCount( array, currentQuantity ) {
      currentQuantity -= 1;
      particleLayer.removeChild( array[ currentQuantity ] );
      array.splice( currentQuantity, 1 );
      return currentQuantity;
    }

    // Function that updates that displayed particles.
    const updateParticles = atom => {
      // feel free to refactor this, although we'd need to get a passable reference to the counts
      // (that's why there is duplication now)
      while ( atom.protonCountProperty.get() > protonDisplayCount ) {
        protonDisplayCount = incrementParticleCount(
          protons,
          protonDisplayCount,
          'proton',
          this.nucleonRadius,
          interParticleSpacing, 7
        );
      }
      while ( atom.protonCountProperty.get() < protonDisplayCount ) {
        protonDisplayCount = decrementParticleCount( protons, protonDisplayCount );
      }

      while ( atom.neutronCountProperty.get() > neutronDisplayCount ) {
        neutronDisplayCount = incrementParticleCount(
          neutrons,
          neutronDisplayCount,
          'neutron',
          this.nucleonRadius,
          interParticleSpacing, 23
        );
      }
      while ( atom.neutronCountProperty.get() < neutronDisplayCount ) {
        neutronDisplayCount = decrementParticleCount( neutrons, neutronDisplayCount );
      }

      //recongifgure nucleus

      // Convenience variables.
      const centerX = atom.nucleusOffsetProperty.get().x;
      const centerY = atom.nucleusOffsetProperty.get().y;
      const nucleonRadius = this.nucleonRadius;
      let angle;
      let distFromCenter;
      let nucleusRadius = nucleonRadius;

      // Create an array of interspersed protons and neutrons for configuring.
      const nucleons = [];
      let protonIndex = 0;
      let neutronIndex = 0;
      const neutronsPerProton = neutrons.length / protons.length;
      let neutronsToAdd = 0;
      while ( nucleons.length < neutrons.length + protons.length ) {
        neutronsToAdd += neutronsPerProton;
        while ( neutronsToAdd >= 1 && neutronIndex < neutrons.length ) {
          nucleons.push( neutrons[ neutronIndex++ ] );
          neutronsToAdd -= 1;
        }
        if ( protonIndex < protons.length ) {
          nucleons.push( protons[ protonIndex++ ] );
        }
      }

      if ( nucleons.length === 1 ) {
        nucleusRadius = this.nucleonRadius;

        // There is only one nucleon present, so place it in the center of the atom.
        nucleons[ 0 ].x = centerX;
        nucleons[ 0 ].y = centerY;
        nucleons[ 0 ].zLayerProperty.set( 0 );
      }
      else if ( nucleons.length === 2 ) {
        nucleusRadius = this.nucleonRadius * 2;

        // Two nucleons - place them side by side with their meeting point in the center.
        angle = 0.2 * 2 * Math.PI; // Angle arbitrarily chosen.
        nucleons[ 0 ].x = centerX + nucleonRadius * Math.cos( angle );
        nucleons[ 0 ].y = centerY + nucleonRadius * Math.sin( angle );
        nucleons[ 0 ].zLayerProperty.set( 0 );
        nucleons[ 1 ].x = centerX - nucleonRadius * Math.cos( angle );
        nucleons[ 1 ].y = centerY - nucleonRadius * Math.sin( angle );
        nucleons[ 1 ].zLayerProperty.set( 0 );
      }
      else if ( nucleons.length === 3 ) {

        // Three nucleons - form a triangle where they all touch.
        angle = 0.7 * 2 * Math.PI; // Angle arbitrarily chosen.
        distFromCenter = nucleonRadius * 1.155;
        nucleons[ 0 ].x = centerX + distFromCenter * Math.cos( angle );
        nucleons[ 0 ].y = centerY + distFromCenter * Math.sin( angle );
        nucleons[ 0 ].zLayerProperty.set( 0 );
        nucleons[ 1 ].x = centerX + distFromCenter * Math.cos( angle + 2 * Math.PI / 3 );
        nucleons[ 1 ].y = centerY + distFromCenter * Math.sin( angle + 2 * Math.PI / 3 );
        nucleons[ 1 ].zLayerProperty.set( 0 );
        nucleons[ 2 ].x = centerX + distFromCenter * Math.cos( angle + 4 * Math.PI / 3 );
        nucleons[ 2 ].y = centerY + distFromCenter * Math.sin( angle + 4 * Math.PI / 3 );
        nucleons[ 2 ].zLayerProperty.set( 0 );

        nucleusRadius = distFromCenter + nucleonRadius;
      }
      else if ( nucleons.length === 4 ) {

        // Four nucleons - make a sort of diamond shape with some overlap.
        angle = 1.4 * 2 * Math.PI; // Angle arbitrarily chosen.

        distFromCenter = nucleonRadius * 2 * Math.cos( Math.PI / 3 );
        nucleons[ 1 ].x = centerX + distFromCenter * Math.cos( angle + Math.PI / 2 );
        nucleons[ 1 ].y = centerY + distFromCenter * Math.sin( angle + Math.PI / 2 );
        nucleons[ 1 ].zLayerProperty.set( 1 );
        nucleons[ 3 ].x = centerX - distFromCenter * Math.cos( angle + Math.PI / 2 );
        nucleons[ 3 ].y = centerY - distFromCenter * Math.sin( angle + Math.PI / 2 );
        nucleons[ 3 ].zLayerProperty.set( 1 );

        nucleons[ 0 ].x = centerX + nucleonRadius * Math.cos( angle );
        nucleons[ 0 ].y = centerY + nucleonRadius * Math.sin( angle );
        nucleons[ 0 ].zLayerProperty.set( 0 );
        nucleons[ 2 ].x = centerX - nucleonRadius * Math.cos( angle );
        nucleons[ 2 ].y = centerY - nucleonRadius * Math.sin( angle );
        nucleons[ 2 ].zLayerProperty.set( 0 );

        nucleusRadius = distFromCenter + nucleonRadius;
      }
      else if ( nucleons.length >= 5 ) {

        // This is a generalized algorithm that should work for five or more nucleons.
        let placementRadius = 0;
        let numAtThisRadius = 1;
        let level = 0;
        let placementAngle = 0;
        let placementAngleDelta = 0;

        // Scale correction for the next placement radius, linear map determined empirically. As the nucleon size
        // increases, we want the scale factor and change in placement radius to decrease since larger nucleons are
        // easier to see with larger area. Map values determined in cases which use a wide range in number of nucleons
        // and in cases where the nucleon radius scaled from 3 to 10 (in screen coordinates - roughly pixels).
        const radiusA = 3;
        const radiusB = 10;
        const scaleFactorA = 1.35;//2.4
        const scaleFactorB = 1.35;
        const scaleFunction = LinearFunction( radiusA, radiusB, scaleFactorA, scaleFactorB, this.nucleonRadius );
        const scaleFactor = scaleFunction( this.nucleonRadius );

        for ( let i = 0; i < nucleons.length; i++ ) {
          nucleons[ i ].x = centerX + placementRadius * Math.cos( placementAngle );
          nucleons[ i ].y = centerY + placementRadius * Math.sin( placementAngle );
          nucleons[ i ].zLayerProperty.set( level );
          numAtThisRadius--;
          if ( numAtThisRadius > 0 ) {

            // Stay at the same radius and update the placement angle.
            placementAngle += placementAngleDelta;
          }
          else {

            // Move out to the next radius.
            level++;
            placementRadius += nucleonRadius * scaleFactor / level;
            placementAngle += 2 * Math.PI * 0.2 + level * Math.PI; // Arbitrary value chosen based on looks.
            numAtThisRadius = Math.floor( placementRadius * Math.PI / nucleonRadius );
            placementAngleDelta = 2 * Math.PI / numAtThisRadius;
          }
        }

        // the total radius is the center is the final placement radius plus the nucleon radius
        nucleusRadius = placementRadius + this.nucleonRadius;
      }

      this.nucleusRadius = nucleusRadius;
    };

    // Hook up the update function.
    numberAtom.particleCountProperty.link( () => {
      updateParticles( numberAtom );
    } );

    // Initial update.
    updateParticles( numberAtom );

    // When the nucleus offset changes, update all nucleon positions.
    numberAtom.nucleusOffsetProperty.link( ( newOffset, oldOffset ) => {
      const translation = oldOffset === null ? Vector2.ZERO : newOffset.minus( oldOffset );
      protons.forEach( particle => {
        particle.x += translation.x;
        particle.y += translation.y;
      } );
      neutrons.forEach( particle => {
        particle.x += translation.x;
        particle.y += translation.y;
      } );
    } );
  }
}

shred.register( 'ParticleAtomDisplay', ParticleAtomDisplay );

export default ParticleAtomDisplay;