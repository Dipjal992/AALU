// ============================================
// SWAD RESTRO - THREE.JS 3D SCENE
// Coffee Pour Animation + Floating Particles + Carousel
// ============================================

class ThreeScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.coffeeCup = null;
        this.steamParticles = [];
        this.beans = [];
        this.leaves = [];
        this.clock = new THREE.Clock();
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        this.setupScene();
        this.setupLighting();
        this.createCoffeeCup();
        this.createParticles();
        this.createCarousel();
        this.setupEventListeners();
        this.animate();
    }

    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.camera.position.y = 0.5;

        // Renderer
        const container = document.getElementById('hero3DBG');
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        if (container) {
            container.appendChild(this.renderer.domElement);
        }
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x8B7355, 0.8);
        this.scene.add(ambientLight);

        // Warm point light
        const pointLight = new THREE.PointLight(0xC17F59, 1.5, 15);
        pointLight.position.set(2, 3, 4);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 1024;
        pointLight.shadow.mapSize.height = 1024;
        this.scene.add(pointLight);

        // Secondary warm light
        const pointLight2 = new THREE.PointLight(0xDEB887, 1, 10);
        pointLight2.position.set(-2, -1, 3);
        this.scene.add(pointLight2);

        // Soft fill light
        const fillLight = new THREE.DirectionalLight(0xFFF8F0, 0.5);
        fillLight.position.set(0, 5, 0);
        this.scene.add(fillLight);
    }

    createCoffeeCup() {
        const cupGroup = new THREE.Group();

        // Cup body - using LatheGeometry for realistic shape
        const cupPoints = [];
        const cupRadius = 0.5;
        const cupHeight = 0.8;
        
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            const r = cupRadius * (0.7 + 0.3 * Math.sin(t * Math.PI));
            cupPoints.push(new THREE.Vector2(r, t * cupHeight));
        }

        const cupGeometry = new THREE.LatheGeometry(cupPoints, 32);
        const cupMaterial = new THREE.MeshStandardMaterial({
            color: 0xF5EDE3,
            roughness: 0.3,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
        const cup = new THREE.Mesh(cupGeometry, cupMaterial);
        cup.position.y = -0.2;
        cup.castShadow = true;
        cup.receiveShadow = true;
        cupGroup.add(cup);

        // Coffee surface inside cup
        const coffeeGeometry = new THREE.CylinderGeometry(0.32, 0.28, 0.02, 32);
        const coffeeMaterial = new THREE.MeshStandardMaterial({
            color: 0x3C2415,
            roughness: 0.2,
            metalness: 0.05
        });
        const coffee = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
        coffee.position.y = 0.25;
        cupGroup.add(coffee);

        // Cup handle
        const handleCurve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0.5, -0.05, 0),
            new THREE.Vector3(0.9, -0.05, 0),
            new THREE.Vector3(0.9, 0.45, 0),
            new THREE.Vector3(0.5, 0.45, 0)
        );
        const handleGeometry = new THREE.TubeGeometry(handleCurve, 20, 0.06, 8, false);
        const handle = new THREE.Mesh(handleGeometry, cupMaterial);
        handle.castShadow = true;
        cupGroup.add(handle);

        // Saucer
        const saucerGeometry = new THREE.CylinderGeometry(0.65, 0.7, 0.05, 32);
        const saucerMaterial = new THREE.MeshStandardMaterial({
            color: 0xF5EDE3,
            roughness: 0.3,
            metalness: 0.1
        });
        const saucer = new THREE.Mesh(saucerGeometry, saucerMaterial);
        saucer.position.y = -0.25;
        saucer.castShadow = true;
        saucer.receiveShadow = true;
        cupGroup.add(saucer);

        cupGroup.position.set(1.5, -0.5, -1);
        cupGroup.rotation.x = -0.2;
        
        this.scene.add(cupGroup);
        this.coffeeCup = cupGroup;

        // Coffee pour stream
        this.createPourStream(cupGroup);
    }

    createPourStream(cupGroup) {
        const pourGroup = new THREE.Group();
        const streamParticles = [];
        const streamCount = 100;

        const streamGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(streamCount * 3);
        const colors = new Float32Array(streamCount * 3);

        for (let i = 0; i < streamCount; i++) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = i * 0.03;
            positions[i * 3 + 2] = 0;
            
            const color = new THREE.Color();
            color.setHSL(0.08, 0.6, 0.2 + Math.random() * 0.3);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        streamGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        streamGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const streamMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            opacity: 0.8
        });

        const stream = new THREE.Points(streamGeometry, streamMaterial);
        stream.position.set(0, 0.8, 0);
        pourGroup.add(stream);
        
        this.pourStream = { group: pourGroup, points: stream, particles: streamParticles };
        
        if (cupGroup) {
            cupGroup.add(pourGroup);
        }
    }

    createParticles() {
        // Coffee beans floating particles
        this.createBeanParticles();
        
        // Steam particles
        this.createSteamParticles();
        
        // Floating leaves
        this.createLeafParticles();
    }

    createBeanParticles() {
        const beanCount = 50;
        const beanGeometry = new THREE.SphereGeometry(0.03, 6, 4);
        beanGeometry.scale(1, 1.3, 0.6);
        
        for (let i = 0; i < beanCount; i++) {
            const beanMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(0.08, 0.5, 0.1 + Math.random() * 0.3),
                roughness: 0.6,
                metalness: 0.1
            });
            
            const bean = new THREE.Mesh(beanGeometry, beanMaterial);
            
            bean.position.set(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 3 - 2
            );
            
            bean.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );
            
            bean.userData = {
                speed: 0.002 + Math.random() * 0.005,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                floatAmplitude: 0.5 + Math.random() * 1.5,
                floatOffset: Math.random() * Math.PI * 2,
                originalY: bean.position.y
            };
            
            this.scene.add(bean);
            this.beans.push(bean);
        }
    }

    createSteamParticles() {
        const steamCount = 80;
        
        for (let i = 0; i < steamCount; i++) {
            const steamGeometry = new THREE.SphereGeometry(0.02 + Math.random() * 0.04, 8, 8);
            const steamMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.08, 0.1, 0.7 + Math.random() * 0.3),
                transparent: true,
                opacity: 0.3 + Math.random() * 0.3,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            
            const steam = new THREE.Mesh(steamGeometry, steamMaterial);
            
            steam.position.set(
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 2 - 1
            );
            
            steam.userData = {
                speed: 0.003 + Math.random() * 0.008,
                floatAmplitude: 0.3 + Math.random() * 0.7,
                floatOffset: Math.random() * Math.PI * 2,
                originalY: steam.position.y,
                life: 0,
                maxLife: 2 + Math.random() * 3,
                opacity: steam.material.opacity
            };
            
            this.scene.add(steam);
            this.steamParticles.push(steam);
        }
    }

    createLeafParticles() {
        const leafCount = 30;
        
        for (let i = 0; i < leafCount; i++) {
            const leafShape = new THREE.Shape();
            leafShape.moveTo(0, 0.08);
            leafShape.bezierCurveTo(0.03, 0.04, 0.03, -0.04, 0, -0.08);
            leafShape.bezierCurveTo(-0.03, -0.04, -0.03, 0.04, 0, 0.08);
            
            const leafGeometry = new THREE.ShapeGeometry(leafShape);
            const leafMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(0.15 + Math.random() * 0.2, 0.4, 0.3 + Math.random() * 0.3),
                roughness: 0.7,
                side: THREE.DoubleSide
            });
            
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            
            leaf.position.set(
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 3 - 2
            );
            
            leaf.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            leaf.userData = {
                speed: 0.001 + Math.random() * 0.003,
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                floatAmplitude: 0.5 + Math.random() * 1,
                floatOffset: Math.random() * Math.PI * 2,
                originalY: leaf.position.y
            };
            
            this.scene.add(leaf);
            this.leaves.push(leaf);
        }
    }

    createCarousel() {
        const carouselTrack = document.getElementById('carouselTrack');
        if (!carouselTrack) return;

        const dishImages = [
            'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200',
            'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200',
            'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200',
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200',
            'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200'
        ];

        const radius = 180;
        const itemCount = dishImages.length;

        dishImages.forEach((imgSrc, index) => {
            const angle = (index / itemCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.style.transform = `rotateY(${angle * (180 / Math.PI)}deg) translateZ(${radius}px)`;
            
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `Dish ${index + 1}`;
            img.loading = 'lazy';
            
            item.appendChild(img);
            carouselTrack.appendChild(item);
        });
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }

    animateSteam() {
        const time = this.clock.getElapsedTime();

        this.steamParticles.forEach(steam => {
            steam.userData.life += 0.016;
            
            if (steam.userData.life >= steam.userData.maxLife) {
                steam.userData.life = 0;
                steam.position.y = steam.userData.originalY;
                steam.material.opacity = steam.userData.opacity;
            }
            
            const lifeProgress = steam.userData.life / steam.userData.maxLife;
            steam.position.y += steam.userData.speed;
            steam.position.x += Math.sin(time * 2 + steam.userData.floatOffset) * 0.002;
            steam.material.opacity = steam.userData.opacity * (1 - lifeProgress);
            steam.scale.setScalar(1 + lifeProgress * 2);
        });
    }

    animateParticles() {
        const time = this.clock.getElapsedTime();

        // Animate coffee beans
        this.beans.forEach(bean => {
            bean.position.y = bean.userData.originalY + 
                Math.sin(time * bean.userData.speed * 60 + bean.userData.floatOffset) * 
                bean.userData.floatAmplitude;
            bean.rotation.y += bean.userData.rotationSpeed;
            bean.rotation.x += bean.userData.rotationSpeed * 0.5;
        });

        // Animate leaves
        this.leaves.forEach(leaf => {
            leaf.position.y = leaf.userData.originalY + 
                Math.sin(time * leaf.userData.speed * 60 + leaf.userData.floatOffset) * 
                leaf.userData.floatAmplitude;
            leaf.position.x += Math.cos(time * 0.5 + leaf.userData.floatOffset) * 0.003;
            leaf.rotation.z += leaf.userData.rotationSpeed;
        });

        // Animate coffee cup gentle rotation
        if (this.coffeeCup) {
            this.coffeeCup.rotation.y += 0.002;
            this.coffeeCup.position.y = -0.5 + Math.sin(time * 0.5) * 0.05;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth camera follow mouse
        this.camera.position.x += (this.mouseX * 0.5 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouseY * 0.3 - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 0, 0);

        this.animateSteam();
        this.animateParticles();

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize Three.js scene
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure DOM is fully loaded
    setTimeout(() => {
        new ThreeScene();
    }, 500);
});