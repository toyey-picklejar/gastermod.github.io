import React from 'react';
import darkModeCSS from '!raw-loader!./tw-theme-dark.css';

export const getInitialDarkMode = () => true;

const darkModeStylesheet = document.createElement('style');
darkModeStylesheet.textContent = darkModeCSS;

const ThemeHOC = function (WrappedComponent) {
    class ThemeComponent extends React.Component {
        componentDidMount () {
            document.body.setAttribute('theme', 'dark');
            if (!darkModeStylesheet.parentNode) {
                // Append at the start of <body> we override scratch-gui styles in <head>
                // but are overridden by addon styles at the end of <body>
                document.body.insertBefore(darkModeStylesheet, document.body.firstChild);
            }
        }
        render () {
            return (
                <WrappedComponent
                    {...this.props}
                    isDark
                />
            );
        }
    }
    return ThemeComponent;
};

export {
    ThemeHOC as default
};
