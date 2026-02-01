// src/presentation/screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    usuario: '',
    contrasenia: '',
    confirmPassword: '',
    peso: '',
    altura: '',
  });
  const [errors, setErrors] = useState({
    nombre: '',
    correo: '',
    usuario: '',
    contrasenia: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
  };

  const validateForm = (): boolean => {
    const newErrors = {
      nombre: '',
      correo: '',
      usuario: '',
      contrasenia: '',
      confirmPassword: '',
    };

    let isValid = true;

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
      isValid = false;
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
      isValid = false;
    }

    // Validar correo
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo electrónico es obligatorio';
      isValid = false;
    } else if (!validateEmail(formData.correo)) {
      newErrors.correo = 'Por favor ingresa un correo válido';
      isValid = false;
    }

    // Validar usuario
    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El nombre de usuario es obligatorio';
      isValid = false;
    } else if (formData.usuario.length < 3 || formData.usuario.length > 20) {
      newErrors.usuario = 'El usuario debe tener entre 3 y 20 caracteres';
      isValid = false;
    } else if (!validateUsername(formData.usuario)) {
      newErrors.usuario = 'Solo puede contener letras, números y guiones bajos';
      isValid = false;
    }

    // Validar contraseña
    if (!formData.contrasenia) {
      newErrors.contrasenia = 'La contraseña es obligatoria';
      isValid = false;
    } else if (formData.contrasenia.length < 6) {
      newErrors.contrasenia = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar tu contraseña';
      isValid = false;
    } else if (formData.contrasenia !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    // Validar peso y altura (opcionales pero deben ser válidos si se ingresan)
    if (formData.peso && parseFloat(formData.peso) <= 0) {
      Alert.alert('Error', 'El peso debe ser un valor positivo');
      isValid = false;
    }

    if (formData.altura && parseFloat(formData.altura) <= 0) {
      Alert.alert('Error', 'La altura debe ser un valor positivo');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    setErrors({
      nombre: '',
      correo: '',
      usuario: '',
      contrasenia: '',
      confirmPassword: '',
    });

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const dataToSend = {
        nombre: formData.nombre,
        apellido: formData.apellido || '',
        telefono: formData.telefono || '',
        correo: formData.correo,
        usuario: formData.usuario,
        contrasenia: formData.contrasenia,
        rol: 'USUARIO',
        peso: parseFloat(formData.peso) || 0,
        altura: parseFloat(formData.altura) || 0,
      };

      await register(dataToSend);
      
      Alert.alert(
        '✅ Registro exitoso',
        'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        [
          { 
            text: 'OK', 
            onPress: () => router.replace('/(auth)/login') 
          }
        ]
      );
    } catch (error: any) {
      
      
      let errorMessage = 'Error al registrar usuario';
      
      if (error.response) {
        const status = error.response.status;
        
        if (status === 409) {
          errorMessage = 'El correo o usuario ya está registrado';
        } else if (status === 400) {
          errorMessage = error.response.data?.message || 'Datos inválidos. Verifica la información';
        } else if (status === 500) {
          errorMessage = 'Error en el servidor. Inténtalo más tarde';
        } else {
          errorMessage = error.response.data?.message || 'Error al registrar usuario';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error al registrarse', errorMessage);
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

        <Text style={styles.title}>Crear Cuenta</Text>
        
        {/* Form */}
        <View style={styles.formContainer}>
          {/* Nombre y Apellido */}
          <View style={styles.formRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>
                Nombre <Text style={styles.required}>*</Text>
              </Text>
              <View style={[
                styles.inputContainer,
                errors.nombre ? styles.inputContainerError : null
              ]}>
                <Ionicons name="person-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChangeText={(text) => {
                    setFormData({ ...formData, nombre: text });
                    if (errors.nombre) setErrors({ ...errors, nombre: '' });
                  }}
                  editable={!loading}
                  placeholderTextColor="#94a3b8"
                />
              </View>
              {errors.nombre ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{errors.nombre}</Text>
                </View>
              ) : null}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Apellido</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="people-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Tu apellido"
                  value={formData.apellido}
                  onChangeText={(text) => setFormData({ ...formData, apellido: text })}
                  editable={!loading}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          </View>

          {/* Email y Teléfono */}
          <View style={styles.formRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>
                Email <Text style={styles.required}>*</Text>
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
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{errors.correo}</Text>
                </View>
              ) : null}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Teléfono</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="0987654321"
                  value={formData.telefono}
                  onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                  keyboardType="phone-pad"
                  editable={!loading}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          </View>

          {/* Usuario */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nombre de Usuario <Text style={styles.required}>*</Text>
            </Text>
            <View style={[
              styles.inputContainer,
              errors.usuario ? styles.inputContainerError : null
            ]}>
              <Ionicons name="at" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="usuario123"
                value={formData.usuario}
                onChangeText={(text) => {
                  setFormData({ ...formData, usuario: text });
                  if (errors.usuario) setErrors({ ...errors, usuario: '' });
                }}
                autoCapitalize="none"
                editable={!loading}
                placeholderTextColor="#94a3b8"
              />
            </View>
            {errors.usuario ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={14} color="#EF4444" />
                <Text style={styles.errorText}>{errors.usuario}</Text>
              </View>
            ) : null}
          </View>

          {/* Contraseña y Confirmar */}
          <View style={styles.formRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
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
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{errors.contrasenia}</Text>
                </View>
              ) : null}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>
                Confirmar <Text style={styles.required}>*</Text>
              </Text>
              <View style={[
                styles.inputContainer,
                errors.confirmPassword ? styles.inputContainerError : null
              ]}>
                <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChangeText={(text) => {
                    setFormData({ ...formData, confirmPassword: text });
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                  placeholderTextColor="#94a3b8"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#64748b" 
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Peso y Altura */}
          <View style={styles.formRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Peso (kg)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="scale-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="70.5"
                  value={formData.peso}
                  onChangeText={(text) => setFormData({ ...formData, peso: text })}
                  keyboardType="decimal-pad"
                  editable={!loading}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Altura (m)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="resize-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="1.75"
                  value={formData.altura}
                  onChangeText={(text) => setFormData({ ...formData, altura: text })}
                  keyboardType="decimal-pad"
                  editable={!loading}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Crear Cuenta</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/login')}
            disabled={loading}
          >
            <Text style={styles.loginLink}>Iniciar Sesión</Text>
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
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
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
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 0,
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
    paddingVertical: 14,
    fontSize: 15,
    color: '#1e293b',
  },
  eyeButton: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
  },
  button: {
    backgroundColor: '#FF6B00',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: '#64748b',
  },
  loginLink: {
    fontSize: 14,
    color: '#FF6B00',
    fontWeight: '600',
  },
});