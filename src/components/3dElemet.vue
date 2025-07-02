<template>
      <div id="container">
        <div id="controls">
            <div class="logo">NANO</div>
            <div class="specs">
                <div class="spec-line"><strong>Medidas:</strong> ancho 0.60 M</div>
                <div class="spec-line">alto: 0.85 M X</div>
                <div class="spec-line">fondo 0.45 M</div>
            </div>
            <div class="colors">
                <strong>Colores:</strong>
                <div class="color-palette">
                    <div class="color-option active" style="background: #ffffff" onclick="changeColor('#ffffff')" title="Blanco"></div>
                    <div class="color-option" style="background: #f8f8f8" onclick="changeColor('#f8f8f8')" title="Blanco Puro"></div>
                    <div class="color-option" style="background: #e8e8e8" onclick="changeColor('#e8e8e8')" title="Perla"></div>
                    <div class="color-option" style="background: #d3d3d3" onclick="changeColor('#d3d3d3')" title="Gris Claro"></div>
                    <div class="color-option" style="background: #a8a8a8" onclick="changeColor('#a8a8a8')" title="Gris"></div>
                    <div class="color-option" style="background: #8b8b8b" onclick="changeColor('#8b8b8b')" title="Antracita"></div>
                </div>
            </div>
            <button onclick="toggleDrawer()">Abrir/Cerrar Cajón</button>
            <button onclick="resetCamera()">Reset Vista</button>
            <button onclick="toggleAnimation()">Auto-Rotación</button>
        </div>
        <div id="info">
            <strong>Mueble NANO</strong><br>
            Diseño moderno minimalista<br>
            <small>Arrastra para rotar • Scroll para zoom</small>
        </div>
    </div>
</template>
 <script>
        let scene, camera, renderer, nanoVanity;
        let cabinetMaterial, drawerMesh;
        let autoRotate = false;
        let drawerOpen = false;

        // Variables para controles del mouse
        let mouseX = 0, mouseY = 0;
        let targetRotationX = 0, targetRotationY = 0;
        let mouseDown = false;

        function init() {
            // Escena
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf5f7fa);

            // Cámara
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(1.5, 1, 2);

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.gammaOutput = true;
            renderer.gammaFactor = 2.2;
            document.getElementById('container').appendChild(renderer.domElement);

            // Iluminación avanzada
            const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
            scene.add(ambientLight);

            const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
            mainLight.position.set(5, 10, 5);
            mainLight.castShadow = true;
            mainLight.shadow.mapSize.width = 2048;
            mainLight.shadow.mapSize.height = 2048;
            mainLight.shadow.camera.near = 0.5;
            mainLight.shadow.camera.far = 50;
            scene.add(mainLight);

            const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
            fillLight.position.set(-5, 5, -5);
            scene.add(fillLight);

            // Luz puntual para detalles
            const pointLight = new THREE.PointLight(0xffffff, 0.5);
            pointLight.position.set(0, 2, 1);
            scene.add(pointLight);

            // Suelo reflectante
            const floorGeometry = new THREE.PlaneGeometry(10, 10);
            const floorMaterial = new THREE.MeshLambertMaterial({ 
                color: 0xf0f0f0,
                transparent: true,
                opacity: 0.8
            });
            const floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.rotation.x = -Math.PI / 2;
            floor.position.y = -0.5;
            floor.receiveShadow = true;
            scene.add(floor);

            // Crear el mueble NANO
            createNanoVanity();

            // Event listeners
            setupControls();

            // Iniciar animación
            animate();
        }

        function createNanoVanity() {
            nanoVanity = new THREE.Group();

            // Material principal del mueble (blanco)
            cabinetMaterial = new THREE.MeshLambertMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.95
            });

            // Cuerpo principal del mueble (60cm ancho, 85cm alto, 45cm fondo)
            const cabinetGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.45);
            const cabinet = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
            cabinet.position.set(0, 0, 0);
            cabinet.castShadow = true;
            cabinet.receiveShadow = true;
            nanoVanity.add(cabinet);

            // Encimera superior
            const topGeometry = new THREE.BoxGeometry(0.62, 0.03, 0.47);
            const topMaterial = new THREE.MeshLambertMaterial({ color: 0xf8f8f8 });
            const top = new THREE.Mesh(topGeometry, topMaterial);
            top.position.set(0, 0.315, 0);
            top.castShadow = true;
            nanoVanity.add(top);

            // Cajón (parte frontal)
            const drawerFrontGeometry = new THREE.BoxGeometry(0.55, 0.15, 0.02);
            const drawerFrontMaterial = new THREE.MeshLambertMaterial({ color: 0xf5f5f5 });
            drawerMesh = new THREE.Mesh(drawerFrontGeometry, drawerFrontMaterial);
            drawerMesh.position.set(0, 0.1, 0.235);
            drawerMesh.castShadow = true;
            nanoVanity.add(drawerMesh);

            // Cuerpo del cajón
            const drawerBodyGeometry = new THREE.BoxGeometry(0.54, 0.14, 0.4);
            const drawerBodyMaterial = new THREE.MeshLambertMaterial({ color: 0xf0f0f0 });
            const drawerBody = new THREE.Mesh(drawerBodyGeometry, drawerBodyMaterial);
            drawerBody.position.set(0, 0.1, 0.02);
            nanoVanity.add(drawerBody);

            // Tirador del cajón
            const handleGeometry = new THREE.BoxGeometry(0.15, 0.01, 0.01);
            const handleMaterial = new THREE.MeshLambertMaterial({ color: 0xc0c0c0 });
            const handle = new THREE.Mesh(handleGeometry, handleMaterial);
            handle.position.set(0, 0.1, 0.25);
            nanoVanity.add(handle);

            // Puerta inferior
            const doorGeometry = new THREE.BoxGeometry(0.55, 0.4, 0.02);
            const doorMaterial = new THREE.MeshLambertMaterial({ color: 0xf5f5f5 });
            const door = new THREE.Mesh(doorGeometry, doorMaterial);
            door.position.set(0, -0.1, 0.235);
            door.castShadow = true;
            nanoVanity.add(door);

            // Tirador de la puerta
            const doorHandleGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.08, 8);
            const doorHandle = new THREE.Mesh(doorHandleGeometry, handleMaterial);
            doorHandle.rotation.z = Math.PI / 2;
            doorHandle.position.set(0.2, -0.1, 0.25);
            nanoVanity.add(doorHandle);

            // Lavabo sobre encimera (tipo vessel)
            const sinkGeometry = new THREE.CylinderGeometry(0.15, 0.13, 0.12, 32);
            const sinkMaterial = new THREE.MeshLambertMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.95
            });
            const sink = new THREE.Mesh(sinkGeometry, sinkMaterial);
            sink.position.set(-0.1, 0.4, 0);
            sink.castShadow = true;
            nanoVanity.add(sink);

            // Interior del lavabo
            const sinkInteriorGeometry = new THREE.CylinderGeometry(0.13, 0.11, 0.1, 32);
            const sinkInteriorMaterial = new THREE.MeshLambertMaterial({ color: 0xf8f8f8 });
            const sinkInterior = new THREE.Mesh(sinkInteriorGeometry, sinkInteriorMaterial);
            sinkInterior.position.set(-0.1, 0.35, 0);
            nanoVanity.add(sinkInterior);

            // Desagüe
            const drainGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.05, 8);
            const drainMaterial = new THREE.MeshLambertMaterial({ color: 0xc0c0c0 });
            const drain = new THREE.Mesh(drainGeometry, drainMaterial);
            drain.position.set(-0.1, 0.32, 0);
            nanoVanity.add(drain);

            // Grifo moderno de pared
            const faucetBaseGeometry = new THREE.BoxGeometry(0.08, 0.03, 0.02);
            const faucetMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
            const faucetBase = new THREE.Mesh(faucetBaseGeometry, faucetMaterial);
            faucetBase.position.set(-0.1, 0.55, -0.2);
            nanoVanity.add(faucetBase);

            // Caño del grifo
            const spoutGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.15, 8);
            const spout = new THREE.Mesh(spoutGeometry, faucetMaterial);
            spout.rotation.x = Math.PI / 6;
            spout.position.set(-0.1, 0.6, -0.05);
            nanoVanity.add(spout);

            // Patas/soporte (opcional, para dar estabilidad visual)
            const legGeometry = new THREE.BoxGeometry(0.02, 0.1, 0.02);
            const legMaterial = new THREE.MeshLambertMaterial({ color: 0xe0e0e0 });
            
            const leg1 = new THREE.Mesh(legGeometry, legMaterial);
            leg1.position.set(-0.25, -0.35, 0.2);
            nanoVanity.add(leg1);
            
            const leg2 = new THREE.Mesh(legGeometry, legMaterial);
            leg2.position.set(0.25, -0.35, 0.2);
            nanoVanity.add(leg2);

            // Agregar a la escena
            scene.add(nanoVanity);
            nanoVanity.position.y = 0.1;
        }

        function changeColor(color) {
            if (cabinetMaterial) {
                cabinetMaterial.color.setHex(parseInt(color.replace('#', '0x')));
            }
            
            // Actualizar botones activos
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
            event.target.classList.add('active');
        }

        function toggleDrawer() {
            if (!drawerMesh) return;
            
            drawerOpen = !drawerOpen;
            const targetZ = drawerOpen ? 0.4 : 0.235;
            
            // Animación suave del cajón
            const animate = () => {
                const currentZ = drawerMesh.position.z;
                const diff = targetZ - currentZ;
                
                if (Math.abs(diff) > 0.01) {
                    drawerMesh.position.z += diff * 0.1;
                    requestAnimationFrame(animate);
                }
            };
            animate();
        }

        function toggleAnimation() {
            autoRotate = !autoRotate;
        }

        function setupControls() {
            const canvas = renderer.domElement;

            canvas.addEventListener('mousedown', onMouseDown);
            canvas.addEventListener('mousemove', onMouseMove);
            canvas.addEventListener('mouseup', onMouseUp);
            canvas.addEventListener('wheel', onWheel);
            canvas.addEventListener('touchstart', onTouchStart);
            canvas.addEventListener('touchmove', onTouchMove);
            canvas.addEventListener('touchend', onTouchEnd);

            window.addEventListener('resize', onWindowResize);
        }

        function onMouseDown(event) {
            mouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
        }

        function onMouseMove(event) {
            if (!mouseDown) return;

            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;

            targetRotationY += deltaX * 0.01;
            targetRotationX += deltaY * 0.01;
            targetRotationX = Math.max(-Math.PI/3, Math.min(Math.PI/3, targetRotationX));

            mouseX = event.clientX;
            mouseY = event.clientY;
        }

        function onMouseUp() {
            mouseDown = false;
        }

        function onWheel(event) {
            camera.position.z += event.deltaY * 0.01;
            camera.position.z = Math.max(1, Math.min(5, camera.position.z));
        }

        function onTouchStart(event) {
            if (event.touches.length === 1) {
                mouseDown = true;
                mouseX = event.touches[0].clientX;
                mouseY = event.touches[0].clientY;
            }
        }

        function onTouchMove(event) {
            if (event.touches.length === 1 && mouseDown) {
                const deltaX = event.touches[0].clientX - mouseX;
                const deltaY = event.touches[0].clientY - mouseY;

                targetRotationY += deltaX * 0.01;
                targetRotationX += deltaY * 0.01;
                targetRotationX = Math.max(-Math.PI/3, Math.min(Math.PI/3, targetRotationX));

                mouseX = event.touches[0].clientX;
                mouseY = event.touches[0].clientY;
            }
        }

        function onTouchEnd() {
            mouseDown = false;
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function resetCamera() {
            camera.position.set(1.5, 1, 2);
            targetRotationX = 0;
            targetRotationY = 0;
            if (nanoVanity) {
                nanoVanity.rotation.x = 0;
                nanoVanity.rotation.y = 0;
            }
        }

        function animate() {
            requestAnimationFrame(animate);

            if (nanoVanity) {
                if (autoRotate) {
                    nanoVanity.rotation.y += 0.01;
                } else {
                    nanoVanity.rotation.x += (targetRotationX - nanoVanity.rotation.x) * 0.1;
                    nanoVanity.rotation.y += (targetRotationY - nanoVanity.rotation.y) * 0.1;
                }
            }

            renderer.render(scene, camera);
        }

        // Inicializar cuando se carga la página
        init();
    </script>
      <style scoped>
     #container {
            width: 100vw;
            height: 100vh;
            position: relative;
        }
        #controls {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 100;
            background: rgba(255,255,255,0.95);
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
            color: #333;
            min-width: 200px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 3px;
            margin-bottom: 15px;
            color: #2c3e50;
        }
        .specs {
            margin-bottom: 15px;
            font-size: 12px;
            line-height: 1.4;
        }
        .spec-line {
            margin-bottom: 5px;
        }
        .colors {
            margin-bottom: 15px;
        }
        .color-palette {
            display: flex;
            gap: 8px;
            margin-top: 8px;
        }
        .color-option {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }
        .color-option:hover {
            transform: scale(1.1);
            border-color: #333;
        }
        .color-option.active {
            border-color: #2c3e50;
            transform: scale(1.2);
        }
        button {
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 15px;
            margin: 5px 0;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            width: 100%;
            transition: all 0.3s ease;
        }
        button:hover {
            background: #2980b9;
            transform: translateY(-2px);
        }
        #info {
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(255,255,255,0.95);
            padding: 15px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            color: #333;
            font-size: 12px;
        }
    </style>