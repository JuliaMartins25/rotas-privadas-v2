import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from "expo-router";

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confimPassword, setConfimPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [ singUp ] = useAuth();
    const router = useRouter();
    
    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Preencha todos os campos');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'A senha deve ter pelo menos 6 caracteres');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'As senhas não coincidem');
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;       
        if (!emailRegex.test(email)) {
            Alert.alert("Erro", "Email inválido");
                return;
        }

        setLoading(true);
        try{
            const result = await singUp(name, email, password);

            if (result.success) {
                Alert.alert('Sucesso', 'Conta criada com sucesso', [
                    {text: 'OK'}
                ]);
            } else {
                Alert.alert('Erro', 'Falha ao criar conta');
            }
        } catch (error) {
            Alert.alert('Erro', 'Falha ao criar conta');
        } finally {
            setLoading(false);
        }     
    };

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        <ScrollView
        contentContainerStyle={styles.scrollContant}
        keyboardShouldPersistTaps="handled">
        
        <View style={styles.content}>
            <Text style={styles.emoji}>✨</Text>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={subtitle}>Preecha os dados abaixo</Text>

            <TextInput
            style={styles.input}
            placeholder="Nome completo"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!loading}/>

            <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}/>

            <TextInput
            style={styles.input}
            placeholder="Senha (minimo 6 caracteres)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}/>

            <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            value={confimPassword}
            onChangeText={setConfimPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}/>

            <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}>
            
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
            )}
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={loading}>
                <Text style={styles.text}>Voltar para login</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
    )
}
