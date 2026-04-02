import './Navbar.css'

function Nav(){
    return <header class="navbar">
    <div class="nav-container">
        {/* <!-- Logo --> */}
        <a href="#" class="nav-logo">BRAND<span>NAME</span></a>

        {/* <!-- Hamburger Menu Icon (Mobile) --> */}
        <button class="mobile-menu-btn" aria-label="Toggle navigation" aria-expanded="false">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>

        {/* <!-- Navigation Links --> */}
        <nav class="nav-links">
            <ul>
                <li><a href="#home" class="active">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#contact" class="nav-cta">Contact Us</a></li>
            </ul>
        </nav>
    </div>
</header>
}


export default Nav