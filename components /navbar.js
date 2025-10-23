class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        nav {
          background: rgba(17, 24, 39, 0.8);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(124, 58, 237, 0.2);
        }
        .logo {
          color: white;
          font-weight: bold;
          font-size: 1.5rem;
          background: linear-gradient(90deg, #7e22ce 0%, #9333ea 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        ul {
          display: flex;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        a {
          color: white;
          text-decoration: none;
          transition: color 0.3s;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        a:hover {
          color: #9333ea;
        }
        .mobile-menu {
          display: none;
        }
        @media (max-width: 768px) {
          ul {
            display: none;
          }
          .mobile-menu {
            display: block;
          }
        }
      </style>
      <nav>
        <a href="/" class="logo">TVStreamX</a>
        <ul>
          <li><a href="#features"><i data-feather="star"></i> Recursos</a></li>
          <li><a href="#download"><i data-feather="download"></i> Instalar</a></li>
          <li><a href="#faq"><i data-feather="help-circle"></i> FAQ</a></li>
          <li><a href="https://t.me/tvstreamxgroup" target="_blank"><i data-feather="send"></i> Telegram</a></li>
        </ul>
        <button class="mobile-menu text-white">
          <i data-feather="menu"></i>
        </button>
      </nav>
    `;
  }
}
customElements.define('custom-navbar', CustomNavbar);