import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour 👋</Text>
            <Text style={styles.headerTitle}>Où voulez-vous aller ?</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
        </View>

        {/* ── Search bar ── */}
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Rechercher une destination...</Text>
        </TouchableOpacity>

        {/* ── Categories ── */}
        <Text style={styles.sectionTitle}>Explorer</Text>
        <View style={styles.categoriesRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.label} style={styles.categoryPill} activeOpacity={0.7}>
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Featured destinations ── */}
        <Text style={styles.sectionTitle}>Destinations populaires</Text>
        <View style={styles.cardsContainer}>
          {DESTINATIONS.map((dest) => (
            <TouchableOpacity key={dest.name} style={styles.card} activeOpacity={0.85}>
              <View style={[styles.cardImage, { backgroundColor: dest.color }]}>
                <Text style={styles.cardEmoji}>{dest.emoji}</Text>
              </View>
              <View style={styles.cardBody}>
                <View>
                  <Text style={styles.cardName}>{dest.name}</Text>
                  <Text style={styles.cardCountry}>{dest.country}</Text>
                </View>
                <Text style={styles.cardPrice}>{dest.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ── Bottom navigation ── */}
      <View style={styles.bottomNav}>
        {NAV_ITEMS.map((item) => (
          <TouchableOpacity key={item.label} style={styles.navItem} activeOpacity={0.7}>
            <Text style={[styles.navIcon, item.active && styles.navIconActive]}>
              {item.icon}
            </Text>
            <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const CATEGORIES = [
  { emoji: '🏖️', label: 'Plages' },
  { emoji: '🏔️', label: 'Montagnes' },
  { emoji: '🏛️', label: 'Culture' },
  { emoji: '🌿', label: 'Nature' },
];

const DESTINATIONS = [
  { name: 'Paris', country: 'France', price: 'À partir de 299€', emoji: '🗼', color: '#D6E4FF' },
  { name: 'Bali', country: 'Indonésie', price: 'À partir de 799€', emoji: '🌴', color: '#D6F5E3' },
  { name: 'Tokyo', country: 'Japon', price: 'À partir de 899€', emoji: '🗾', color: '#FFD6E7' },
];

const NAV_ITEMS = [
  { icon: '🏠', label: 'Accueil', active: true },
  { icon: '🔍', label: 'Explorer', active: false },
  { icon: '🗺️', label: 'Voyages', active: false },
  { icon: '👤', label: 'Profil', active: false },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FB',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#9A9AB0',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0A0A1A',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C6BF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 28,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E8E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchPlaceholder: {
    color: '#B0B0C8',
    fontSize: 15,
  },

  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A0A1A',
    marginBottom: 14,
  },

  // Categories
  categoriesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  categoryPill: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E8E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryLabel: {
    fontSize: 11,
    color: '#6A6A8A',
    fontWeight: '500',
  },

  // Cards
  cardsContainer: {
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {
    fontSize: 52,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A0A1A',
  },
  cardCountry: {
    fontSize: 13,
    color: '#9A9AB0',
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 13,
    color: '#1C6BF4',
    fontWeight: '600',
  },

  // Bottom nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8F0',
    paddingBottom: 24,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navIcon: {
    fontSize: 22,
    opacity: 0.3,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 10,
    color: '#B0B0C8',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#1C6BF4',
  },
});

export default HomeScreen;