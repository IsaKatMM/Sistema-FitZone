// app/index.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '../src/presentation/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { isAuthenticated, loading, user } = useAuth();

  // Mostrar loading mientras carga
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  // ✅ Validación estricta: solo redirigir a home si hay usuario válido
  if (isAuthenticated && user && user.nombre && user.nombre !== 'Usuario sin datos') {
    return <Redirect href="/(main)/home" />;
  }
  
  // ✅ Por defecto, siempre al login
  return <Redirect href="/(auth)/login" />;
}