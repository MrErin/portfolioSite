import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

const ContactPanel = () => {
  return (
    <section aria-label="Contact">
      <h2 className="font-heading text-teal-light text-2xl mb-6">Contact</h2>

      <nav aria-label="Contact links">
        <ul className="space-y-4">
          <li>
            <a
              href="mailto:hello@example.com"
              className="inline-flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors duration-300"
            >
              <span className="text-gold" aria-hidden="true">
                <FaEnvelope />
              </span>
              <span>hello@example.com</span>
            </a>
          </li>
          <li>
            <a
              href="https://github.com/user"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors duration-300"
            >
              <span className="text-gold" aria-hidden="true">
                <FaGithub />
              </span>
              <span>GitHub</span>
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com/in/user"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors duration-300"
            >
              <span className="text-gold" aria-hidden="true">
                <FaLinkedin />
              </span>
              <span>LinkedIn</span>
            </a>
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default ContactPanel;
