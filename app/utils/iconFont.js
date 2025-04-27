import Ionicons from 'react-native-vector-icons/Fonts/Ionicons.ttf';

// Only run on client side
if (typeof document !== 'undefined') {
  const iconFontStyles = `@font-face {
    src: url(${Ionicons});
    font-family: Ionicons;
  }`;

  // Create stylesheet
  const style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = iconFontStyles;
  } else {
    style.appendChild(document.createTextNode(iconFontStyles));
  }

  // Inject stylesheet
  document.head.appendChild(style);
}
