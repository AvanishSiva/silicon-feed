import React, { useEffect, useRef } from 'react';
import './ParticleNetwork.css'

const ParticleNetwork = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const ParticleNetworkAnimation = function () { };
    const PNA = ParticleNetworkAnimation;

    PNA.prototype.init = function () {
      this.container = containerRef.current;
      this.canvas = canvasRef.current;
      this.ctx = this.canvas.getContext('2d');
      this.sizeCanvas();
      this.particleNetwork = new ParticleNetwork(this);
      this.bindUiActions();
      return this;
    };

    PNA.prototype.bindUiActions = function () {
      window.addEventListener('resize', () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.sizeCanvas();
        this.particleNetwork.createParticles();
      });

    };

    PNA.prototype.sizeCanvas = function () {
      this.canvas.width = this.container.offsetWidth;
      this.canvas.height = this.container.offsetHeight;
    };

    const Particle = function (parent, x, y) {
      this.network = parent;
      this.canvas = parent.canvas;
      this.ctx = parent.ctx;
      this.particleColor = returnRandomArrayitem(this.network.options.particleColors);
      this.radius = getLimitedRandom(1.5, 2.5);
      this.opacity = 0;
      this.x = x || Math.random() * this.canvas.width;
      this.y = y || Math.random() * this.canvas.height;
      this.velocity = {
        x: (Math.random() - 0.5) * parent.options.velocity,
        y: (Math.random() - 0.5) * parent.options.velocity,
      };
    };

    Particle.prototype.update = function () {
      if (this.opacity < 1) {
        this.opacity += 0.01;
      } else {
        this.opacity = 1;
      }
      if (this.x > this.canvas.width + 100 || this.x < -100) {
        this.velocity.x = -this.velocity.x;
      }
      if (this.y > this.canvas.height + 100 || this.y < -100) {
        this.velocity.y = -this.velocity.y;
      }
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    };

    Particle.prototype.draw = function () {
      this.ctx.beginPath();
      this.ctx.fillStyle = this.particleColor;
      this.ctx.globalAlpha = this.opacity;
      this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      this.ctx.fill();
    };

    const ParticleNetwork = function (parent) {
      this.options = {
        velocity: 1,
        density: 15000,
        netLineDistance: 200,
        netLineColor: 'rgba(255, 107, 53, 0.15)',
        particleColors: ['rgba(255, 107, 53, 0.8)', 'rgba(255, 87, 34, 0.6)', 'rgba(176, 176, 176, 0.4)'],
      };
      this.canvas = parent.canvas;
      this.ctx = parent.ctx;
      this.init();
    };

    ParticleNetwork.prototype.init = function () {
      this.createParticles(true);
      this.animationFrame = requestAnimationFrame(this.update.bind(this));
    };

    ParticleNetwork.prototype.createParticles = function (isInitial) {
      const quantity = this.canvas.width * this.canvas.height / this.options.density;
      this.particles = [];
      for (let i = 0; i < quantity; i++) {
        this.particles.push(new Particle(this));
      }
    };

    ParticleNetwork.prototype.update = function () {
      if (this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = 1;

        for (let i = 0; i < this.particles.length; i++) {
          for (let j = this.particles.length - 1; j > i; j--) {
            const p1 = this.particles[i];
            const p2 = this.particles[j];
            const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

            if (distance > this.options.netLineDistance) continue;

            this.ctx.beginPath();
            this.ctx.strokeStyle = this.options.netLineColor;
            this.ctx.globalAlpha = (this.options.netLineDistance - distance) / this.options.netLineDistance * p1.opacity * p2.opacity;
            this.ctx.lineWidth = 0.7;
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
          }
        }

        for (let i = 0; i < this.particles.length; i++) {
          this.particles[i].update();
          this.particles[i].draw();
        }

        if (this.options.velocity !== 0) {
          this.animationFrame = requestAnimationFrame(this.update.bind(this));
        }
      } else {
        cancelAnimationFrame(this.animationFrame);
      }
    };

    const getLimitedRandom = (min, max, roundToInteger) => {
      let number = Math.random() * (max - min) + min;
      if (roundToInteger) {
        number = Math.round(number);
      }
      return number;
    };

    const returnRandomArrayitem = (array) => {
      return array[Math.floor(Math.random() * array.length)];
    };

    const pna = new ParticleNetworkAnimation();
    pna.init();

    return () => {
      window.removeEventListener('resize', pna.bindUiActions);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="particle-network-animation"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ParticleNetwork;
