import React from 'react'

function SelectCustomTheme(theme) {
    return {
        ...theme,
        colors: {
            ...theme.colors,
            primary25: '#B3B3B3',
            primary: '#1CB48F',
        }
    }
}

export default SelectCustomTheme
