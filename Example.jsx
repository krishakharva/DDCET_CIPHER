import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSettings } from './SettingsContext';

const Example = () => {
    const { language, changeLanguage, t } = useSettings();

    return (
        <View>
            <Text>{t('welcome')}</Text>
            
            <TouchableOpacity onPress={() => changeLanguage('en')}>
                <Text>{t('english')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => changeLanguage('gu')}>
                <Text>{t('gujarati')}</Text>
            </TouchableOpacity>

            <Text>{t('settings')}</Text>
            <Text>{t('darkMode')}</Text>
            <Text>{t('vibration')}</Text>
        </View>
    );
}; 