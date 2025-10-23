class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          background: #111827;
          color: white;
          padding: 3rem 2rem;
          text-align: center;
          border-top: 1px solid rgba(124, 58, 237, 0.2);
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          text-align: left;
        }
        .footer-logo {
          font-size: 1.5rem;
          font-weight: bold;
          background: linear-gradient(90deg, #7e22ce 0%, #9333ea 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-links a {
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.3s;
        }
        .footer-links a:hover {
          color: #9333ea;
        }
        .social-links {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }
        .social-links a {
          color: white;
          background: rgba(255,255,255,0.1);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
        }
        .social-links a:hover {
          background: #7e22ce;
        }
        .copyright {
          margin-top: 3rem;
          color: #6b7280;
          font-size: 0.875rem;
        }
      </style>
      <footer>
        <div class="footer-content">
          <div>
            <div class="footer-logo">TVStreamX</div>
            <p>O melhor addon para Kodi com anti-bloqueio integrado e 100% gratuito.</p>
          </div>
          <div>
            <h3 class="font-bold mb-3">Links Rápidos</h3>
            <div class="footer-links">
              <a href="#features"><i data-feather="chevron-right" class="w-4 h-4 inline mr-1"></i> Recursos</a>
              <a href="#download"><i data-feather="chevron-right" class="w-4 h-4 inline mr-1"></i> Como Instalar</a>
              <a href="#faq"><i data-feather="chevron-right" class="w-4 h-4 inline mr-1"></i> FAQ</a>
            </div>
          </div>
          <div>
            <h3 class="font-bold mb-3">Comunidade</h3>
            <div class="footer-links">
              <a href="https://t.me/tvstreamxgroup" target="_blank"><i data-feather="chevron-right" class="w-4 h-4 inline mr-1"></i> Grupo no Telegram</a>
              <a href="https://github.com/tvstreamx" target="_blank"><i data-feather="chevron-right" class="w-4 h-4 inline mr-1"></i> GitHub</a>
            </div>
          </div>
        </div>
        <div class="social-links">
          <a href="https://t.me/tvstreamxgroup" target="_blank" title="Telegram"><i data-feather="send"></i></a>
          <a href="https://github.com/tvstreamx" target="_blank" title="GitHub"><i data-feather="github"></i></a>
        </div>
        <div class="copyright">
          &copy; 2025 TVStreamX. Todos os direitos reservados.
        </div>
      </footer>
    `;
  }
}
customElements.define('custom-footer', CustomFooter);