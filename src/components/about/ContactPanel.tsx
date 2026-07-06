import { useCallback, useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const EMAIL_USER = 'mrerin.dev';
const EMAIL_DOMAIN = 'pm.me';

const ContactPanel = () => {
  const [mailto, setMailto] = useState('');

  const revealEmail = useCallback(() => {
    if (!mailto) {
      setMailto(`mailto:${EMAIL_USER}@${EMAIL_DOMAIN}`);
    }
  }, [mailto]);

  return (
    <section aria-label="Contact">
      <h2 className="font-heading text-teal-light text-2xl mb-6">Contact</h2>

      <nav aria-label="Contact links">
        <ul className="space-y-4">
          <li>
            {mailto ? (
              <a
                href={mailto}
                className="inline-flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors duration-300"
              >
                <span className="text-gold" aria-hidden="true">
                  <FaEnvelope />
                </span>
                <span>{`${EMAIL_USER}@${EMAIL_DOMAIN}`}</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={revealEmail}
                className="inline-flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors duration-300 bg-transparent border-none cursor-pointer p-0 font-body text-[inherit]"
              >
                <span className="text-gold" aria-hidden="true">
                  <FaEnvelope />
                </span>
                <span>Electromografied Mail</span>
              </button>
            )}
          </li>
          <li>
            <a
              href="https://github.com/mrerin"
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
              href="https://linkedin.com/in/erin-meaker"
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

export { ContactPanel };
