// src/presentation/screens/recipes/RecipesScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ActivityIndicator, TouchableOpacity, Alert, ScrollView, FlatList } from 'react-native';
import { RecipeDataSource } from '../../../data/datasources/RecipeDataSource';
import { RecipeDTO } from '../../../data/models/RecipeDTO';

type Category = 'TODAS' | 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack' | 'Postre';

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('TODAS');
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDTO | null>(null);
  
  const recipeDataSource = new RecipeDataSource();

  const categories: Category[] = ['TODAS', 'Desayuno', 'Almuerzo', 'Cena', 'Snack', 'Postre'];

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [searchQuery, selectedCategory, recipes]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipeDataSource.getAll();
      setRecipes(data);
      setFilteredRecipes(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
      Alert.alert('Error', 'No se pudieron cargar las recetas');
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

    if (searchQuery.trim()) {
      filtered = filtered.filter(recipe =>
        recipe.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'TODAS') {
      filtered = filtered.filter(recipe => recipe.categoria === selectedCategory);
    }

    setFilteredRecipes(filtered);
  };

  const getDificultadColor = (dificultad?: string) => {
    switch (dificultad) {
      case 'Fácil': return '#34C759';
      case 'Media': return '#FF6B00';
      case 'Difícil': return '#FF3B30';
      default: return '#666';
    }
  };

  const renderRecipeCard = ({ item }: { item: RecipeDTO }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => setSelectedRecipe(item)}
    >
      <View style={styles.cardImage}>
        {item.imagenUrl ? (
          <Image
            source={{ uri: item.imagenUrl }}
            style={styles.recipeImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <View style={styles.placeholderIcon}>
              <Text style={styles.placeholderText}>+</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.recipeName} numberOfLines={2}>{item.nombre}</Text>
        <Text style={styles.recipeDescription} numberOfLines={2}>{item.descripcion}</Text>
        
        {/* Tags de Categoría y Dificultad - MÁS VISIBLES */}
        <View style={styles.tagsRow}>
          {item.categoria && (
            <View style={styles.categoryTagCard}>
              <Text style={styles.categoryTagCardText}>{item.categoria}</Text>
            </View>
          )}
          {item.dificultad && (
            <View style={[styles.difficultyTagCard, { backgroundColor: getDificultadColor(item.dificultad) }]}>
              <Text style={styles.difficultyTagCardText}>{item.dificultad}</Text>
            </View>
          )}
        </View>

        {/* Tiempo de preparación - DESTACADO */}
        {item.tiempoPreparacion && (
          <View style={styles.timeRow}>
            <View style={styles.timeIconCircle}>
              <Text style={styles.timeIconText}>⏱</Text>
            </View>
            <Text style={styles.timeValue}>{item.tiempoPreparacion} min</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderRecipeDetail = () => {
    if (!selectedRecipe) return null;

    return (
      <View style={styles.detailContainer}>
        <View style={styles.detailHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedRecipe(null)}
          >
            <View style={styles.backIcon}>
              <Text style={styles.backIconText}>←</Text>
            </View>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View style={styles.detailImage}>
            {selectedRecipe.imagenUrl ? (
              <Image
                source={{ uri: selectedRecipe.imagenUrl }}
                style={styles.detailImageFull}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImageLarge}>
                <View style={styles.placeholderIconLarge}>
                  <Text style={styles.placeholderTextLarge}>+</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.detailContent}>
            <Text style={styles.detailTitle}>{selectedRecipe.nombre}</Text>
            <Text style={styles.detailSubtitle}>{selectedRecipe.descripcion}</Text>

            <View style={styles.detailTags}>
              {selectedRecipe.categoria && (
                <View style={styles.categoryTagCard}>
                  <Text style={styles.categoryTagCardText}>{selectedRecipe.categoria}</Text>
                </View>
              )}
              {selectedRecipe.dificultad && (
                <View style={[styles.difficultyTagCard, { backgroundColor: getDificultadColor(selectedRecipe.dificultad) }]}>
                  <Text style={styles.difficultyTagCardText}>{selectedRecipe.dificultad}</Text>
                </View>
              )}
              {selectedRecipe.tiempoPreparacion && (
                <View style={styles.timeTagDetail}>
                  <View style={styles.timeIconCircle}>
                    <Text style={styles.timeIconText}>⏱</Text>
                  </View>
                  <Text style={styles.timeTagDetailText}>{selectedRecipe.tiempoPreparacion} min</Text>
                </View>
              )}
            </View>

            {(selectedRecipe.calorias || selectedRecipe.proteinas) && (
              <View style={styles.nutritionSection}>
                <Text style={styles.sectionTitle}>Información Nutricional</Text>
                <View style={styles.nutritionGrid}>
                  {selectedRecipe.calorias && (
                    <View style={styles.nutritionItem}>
                      <View style={styles.nutritionIconContainer}>
                        <Text style={styles.nutritionIcon}>⚡</Text>
                      </View>
                      <Text style={styles.nutritionValue}>{selectedRecipe.calorias}</Text>
                      <Text style={styles.nutritionLabel}>kcal</Text>
                    </View>
                  )}
                  {selectedRecipe.proteinas && (
                    <View style={styles.nutritionItem}>
                      <View style={styles.nutritionIconContainer}>
                        <Text style={styles.nutritionIcon}>●</Text>
                      </View>
                      <Text style={styles.nutritionValue}>{selectedRecipe.proteinas}g</Text>
                      <Text style={styles.nutritionLabel}>proteína</Text>
                    </View>
                  )}
                  {selectedRecipe.carbohidratos && (
                    <View style={styles.nutritionItem}>
                      <View style={styles.nutritionIconContainer}>
                        <Text style={styles.nutritionIcon}>●</Text>
                      </View>
                      <Text style={styles.nutritionValue}>{selectedRecipe.carbohidratos}g</Text>
                      <Text style={styles.nutritionLabel}>carbos</Text>
                    </View>
                  )}
                  {selectedRecipe.grasas && (
                    <View style={styles.nutritionItem}>
                      <View style={styles.nutritionIconContainer}>
                        <Text style={styles.nutritionIcon}>●</Text>
                      </View>
                      <Text style={styles.nutritionValue}>{selectedRecipe.grasas}g</Text>
                      <Text style={styles.nutritionLabel}>grasas</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconCircle}>
                  <Text style={styles.sectionIcon}>≡</Text>
                </View>
                <Text style={styles.sectionTitle}>Ingredientes</Text>
              </View>
              {selectedRecipe.ingredientes ? (
                selectedRecipe.ingredientes.split(',').map((ing, idx) => (
                  <View key={idx} style={styles.ingredientItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.ingredientText}>{ing.trim()}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No se han especificado ingredientes</Text>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconCircle}>
                  <Text style={styles.sectionIcon}>→</Text>
                </View>
                <Text style={styles.sectionTitle}>Preparación</Text>
              </View>
              {selectedRecipe.instrucciones ? (
                selectedRecipe.instrucciones.split('\n').filter(paso => paso.trim()).map((paso, idx) => (
                  <View key={idx} style={styles.stepItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{paso.trim()}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No se han especificado instrucciones</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Cargando recetas...</Text>
      </View>
    );
  }

  if (selectedRecipe) {
    return renderRecipeDetail();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recetas Saludables</Text>
        <Text style={styles.subtitle}>Alimentación balanceada</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar recetas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.categoriesWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>+</Text>
              </View>
            </View>
            <Text style={styles.emptyTitle}>No se encontraron recetas</Text>
            <Text style={styles.emptyDescription}>Intenta con otra búsqueda o categoría</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
  },

  // Search
  searchContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    fontSize: 20,
    color: '#999',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 15,
    color: '#333',
  },

  // Categories
  categoriesWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  categoriesContainer: {},
  categoriesContent: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    paddingBottom: 18,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B00',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },

  // Recipe List
  listContainer: {
    padding: 10,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },

  // Recipe Cards - MEJORADAS
  recipeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  placeholderText: {
    fontSize: 28,
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 12,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  recipeDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },

  // Tags Row - MÁS VISIBLES
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  categoryTagCard: {
    backgroundColor: '#FFF5EE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  categoryTagCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B00',
  },
  difficultyTagCard: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  difficultyTagCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Time Row - DESTACADO
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  timeIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  timeIconText: {
    fontSize: 12,
    color: '#FF6B00',
  },
  timeValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },

  // Empty State
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  emptyIconText: {
    fontSize: 36,
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  // Loading
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: '#666',
  },

  // Detail Screen
  detailContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  detailHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backIconText: {
    fontSize: 20,
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF6B00',
    fontWeight: '600',
  },
  detailImage: {
    width: '100%',
    height: 250,
  },
  detailImageFull: {
    width: '100%',
    height: '100%',
  },
  placeholderImageLarge: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIconLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF6B00',
  },
  placeholderTextLarge: {
    fontSize: 48,
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  detailContent: {
    padding: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailSubtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
  },
  detailTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  timeTagDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeTagDetailText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  // Nutrition Section
  nutritionSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFF5EE',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFE5CC',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    minWidth: '22%',
  },
  nutritionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutritionIcon: {
    fontSize: 18,
    color: '#FF6B00',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  nutritionLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionIcon: {
    fontSize: 16,
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  // Ingredients
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B00',
    marginTop: 8,
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },

  // Steps
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});