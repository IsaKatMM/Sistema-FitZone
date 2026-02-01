// src/presentation/screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    correo: '',
    contrasenia: ''
  });
  const [errors, setErrors] = useState({
    correo: '',
    contrasenia: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors = {
      correo: '',
      contrasenia: ''
    };

    let isValid = true;

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo electrónico es obligatorio';
      isValid = false;
    } else if (!validateEmail(formData.correo)) {
      newErrors.correo = 'Por favor ingresa un correo válido';
      isValid = false;
    }

    if (!formData.contrasenia) {
      newErrors.contrasenia = 'La contraseña es obligatoria';
      isValid = false;
    } else if (formData.contrasenia.length < 6) {
      newErrors.contrasenia = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    // Limpiar errores anteriores
    setErrors({ correo: '', contrasenia: '' });

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await login(formData.correo, formData.contrasenia);
      router.replace('/(main)/home');
    } catch (error: any) {
     
      
      // Mensajes de error específicos
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.response) {
        const status = error.response.status;
        
        if (status === 401) {
          errorMessage = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
        } else if (status === 404) {
          errorMessage = 'Usuario no encontrado. ¿Ya te has registrado?';
        } else if (status === 403) {
          errorMessage = 'Acceso denegado. Tu cuenta puede estar inactiva.';
        } else if (status === 500) {
          errorMessage = 'Error en el servidor. Inténtalo más tarde.';
        } else {
          errorMessage = error.response.data?.message || 'Error al iniciar sesión';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert(
        'Error al iniciar sesión',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="fitness" size={50} color="#FF6B00" />
          </View>
          <Text style={styles.logoText}>FitSIL</Text>
        </View>

        <Text style={styles.title}>Iniciar Sesión</Text>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Correo Electrónico <Text style={styles.required}>*</Text>
            </Text>
            <View style={[
              styles.inputContainer,
              errors.correo ? styles.inputContainerError : null
            ]}>
              <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="email@ejemplo.com"
                value={formData.correo}
                onChangeText={(text) => {
                  setFormData({ ...formData, correo: text });
                  if (errors.correo) setErrors({ ...errors, correo: '' });
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
                placeholderTextColor="#94a3b8"
              />
            </View>
            {errors.correo ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{errors.correo}</Text>
              </View>
            ) : null}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Contraseña <Text style={styles.required}>*</Text>
            </Text>
            <View style={[
              styles.inputContainer,
              errors.contrasenia ? styles.inputContainerError : null
            ]}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                value={formData.contrasenia}
                onChangeText={(text) => {
                  setFormData({ ...formData, contrasenia: text });
                  if (errors.contrasenia) setErrors({ ...errors, contrasenia: '' });
                }}
                secureTextEntry={!showPassword}
                editable={!loading}
                placeholderTextColor="#94a3b8"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#64748b" 
                />
              </TouchableOpacity>
            </View>
            {errors.contrasenia ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{errors.contrasenia}</Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/register')}
            disabled={loading}
          >
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF5EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FF6B00',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputContainerError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  eyeButton: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
  },
  button: {
    backgroundColor: '#FF6B00',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#FFB380',
    shadowOpacity: 0,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    color: '#64748b',
  },
  registerLink: {
    fontSize: 14,
    color: '#FF6B00',
    fontWeight: '600',
  },
});