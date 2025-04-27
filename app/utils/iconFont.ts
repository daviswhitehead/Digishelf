import Ionicons from 'react-native-vector-icons/Fonts/Ionicons.ttf';

// Only run on client side
if (typeof document !== 'undefined') {
  const iconFontStyles = `@font-face {
    src: url(${Ionicons});
    font-family: Ionicons;
  }`;

  // Create and inject stylesheet
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(iconFontStyles));
  document.head.appendChild(style);
}
