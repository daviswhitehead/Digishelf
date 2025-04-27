// Only run on client side
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const iconFontStyles = `@font-face {
    src: url(/_next/static/fonts/Ionicons.ttf);
    font-family: Ionicons;
  }`;

  // Create and inject stylesheet
  const style = document.createElement('style');
  style.type = 'text/css';
  if (!document.head.querySelector('style[data-icon-font]')) {
    style.setAttribute('data-icon-font', 'true');
    style.appendChild(document.createTextNode(iconFontStyles));
    document.head.appendChild(style);
  }
}
