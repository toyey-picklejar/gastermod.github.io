import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, FormattedMessage} from 'react-intl';
import styles from './fonts-modal.css';

const messages = defineMessages({
    add: {
        defaultMessage: 'Add',
        description: 'Part of font management modal. This is the button that will actually add the font.',
        id: 'tw.fonts.add'
    },
    adding: {
        defaultMessage: 'Adding...',
        description: 'Part of font management modal. Shown while a font is being added.',
        id: 'tw.fonts.adding'
    }
});

const AddButton = props => (
    <button
        onClick={props.onClick}
        disabled={props.disabled}
        className={styles.button}
        aria-busy={props.loading}
    >
        <FormattedMessage {...messages[props.loading ? 'adding' : 'add']} />
    </button>
);

AddButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    loading: PropTypes.bool
};

export default AddButton;
