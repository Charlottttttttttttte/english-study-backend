import { memo } from 'react';

const Footer = memo(function Footer() {
  return (
    <footer className="py-8 text-center">
      <p className="text-white/90 text-xs font-body">
        English Study v1.0 · 在丛林中成长
      </p>
    </footer>
  );
});

export default Footer;
