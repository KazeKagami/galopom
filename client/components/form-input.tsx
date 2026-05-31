// components/FormInput.tsx
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { useState } from 'react';

interface FormInputProps extends TextInputProps {
    label: string;
    error?: string;
}

export const FormInput = ({ label, error, secureTextEntry, ...props }: FormInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={[styles.label, error && styles.labelError]}>{label}</Text>
            <View style={[
                styles.inputWrapper,
                isFocused && styles.inputFocused,
                error && styles.inputError
            ]}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#999"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={secureTextEntry && !showPassword}
                    {...props}
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Text>{showPassword ? '🙈' : '👁️'}</Text>
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    labelError: {
        color: '#ff4444',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
    },
    inputFocused: {
        borderColor: '#007AFF',
        borderWidth: 2,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#ff4444',
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});