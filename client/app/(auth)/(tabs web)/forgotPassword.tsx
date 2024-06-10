import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';

const ForgotPasswordPage = () => {
    const email = 'karsten@okta.com';
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }else{
            try{
                const response = await fetch('/updatePw', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email: email, newPassword: password }),
                });
                if (response.ok) {
                    Alert.alert('Success', 'Password updated successfully');
                } else {
                    const errorMessage = await response.text();
                    Alert.alert('Error', errorMessage);
                }
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'An error occurred while updating the password');
            }
        }

        // Handle password reset...
    };

    return (
        <View>
            <Text>Email: {email}</Text>
            <TextInput
                secureTextEntry
                placeholder="New Password"
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                secureTextEntry
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <Button title="Reset Password" onPress={handleSubmit} />
        </View>
    );
}

export default ForgotPasswordPage;