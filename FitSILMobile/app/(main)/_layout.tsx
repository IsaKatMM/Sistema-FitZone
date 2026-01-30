// app/(main)/_layout.tsx
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MainLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 10,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        tabBarActiveTintColor: '#FF6B00',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        // ✅ Forzar renderizado de iconos
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => {
            console.log('🏠 Renderizando icono home:', { color, focused });
            return (
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={24} 
                color={color} 
              />
            );
          },
        }}
      />
      
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Ejercicios',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "barbell" : "barbell-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="routines"
        options={{
          title: 'Rutinas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "calendar" : "calendar-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recetas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "restaurant" : "restaurant-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "stats-chart" : "stats-chart-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* ✅ Pantallas ocultas del tab bar */}
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          title: 'Notificaciones',
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          href: null,
          title: 'Reportes',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}