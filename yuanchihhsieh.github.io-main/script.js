// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');

    navToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });
    
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();

    // Lorenz attractor parameters
    const sigma = 10;
    const rho = 28;
    const beta = 8/3;
    const dt = 0.01;


    // Initial conditions for the points
    const initialPoints = [
        { x: -11, y: -8, z: 33, color: 'rgba(0, 0, 0, 0.7)' },
        { x: 8, y: 9, z: 23, color: 'rgba(50, 50, 50, 0.6)' },
        { x: -14, y: -5, z: 29, color: 'rgba(100, 100, 100, 0.5)' },
        { x: 13, y: 7, z: 31, color: 'rgba(150, 150, 150, 0.4)' },
        { x: 0, y: -1, z: 27, color: 'rgba(200, 200, 200, 0.3)' }
    ];

    // Create a deep copy of the initial points
    let points = JSON.parse(JSON.stringify(initialPoints));

    const scale = 15;
    let offsetX = canvas.width / 2;
    let offsetY = canvas.height / 2;

    // Set the duration for the simulation before restart (in milliseconds)
    const restartDuration = 30000; // 30 seconds
    let startTime;

    function lorenzStep(point) {
        const dx = sigma * (point.y - point.x) * dt;
        const dy = (point.x * (rho - point.z) - point.y) * dt;
        const dz = (point.x * point.y - beta * point.z) * dt;

        point.x += dx;
        point.y += dy;
        point.z += dz;
    }

    function draw(point, lastPoint) {
        ctx.beginPath();
        ctx.moveTo(lastPoint.x * scale + offsetX, lastPoint.y * scale + offsetY);
        ctx.lineTo(point.x * scale + offsetX, point.y * scale + offsetY);
        
        ctx.strokeStyle = point.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    function resetSimulation() {
        // Reset points to their initial conditions
        points = JSON.parse(JSON.stringify(initialPoints));
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Reset the start time
        startTime = Date.now();
    }

    function animate() {
        // Check if it's time to restart the simulation
        if (Date.now() - startTime >= restartDuration) {
            resetSimulation();
        }

        // Apply a subtle fade effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        points.forEach(point => {
            const lastPoint = { x: point.x, y: point.y, z: point.z };
            lorenzStep(point);
            draw(point, lastPoint);
        });

        requestAnimationFrame(animate);
    }

    // Start the animation after a 1.5-second delay
    setTimeout(() => {
        startTime = Date.now();
        animate();
    }, 1000); 

    // GSAP animations (unchanged)
    gsap.from("header", {duration: 1, y: "-100%", ease: "bounce"});
    gsap.from("#showcase h1", {duration: 1, opacity: 0, delay: 0.5});
    gsap.from("#showcase p", {duration: 1, opacity: 0, delay: 0.7});
    gsap.from("#boxes .box", {
        duration: 1, 
        opacity: 0, 
        y: 50, 
        stagger: 0.2, 
        scrollTrigger: {
            trigger: "#boxes",
            start: "top bottom-=100px",
            toggleActions: "play none none reverse"
        }
    });

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        offsetX = canvas.width / 2;
        offsetY = canvas.height / 2;
    });
});