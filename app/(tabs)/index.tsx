import { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAgencies } from '../../hooks/use-agencies';
import { AgencyCard } from '../../components/agency-card';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';

const STATES = ['All', 'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];
const CATEGORIES = ['All', 'Farm', 'Meat Processing', 'Fishery', 'Mining', 'Construction', 'Hospitality', 'Other'];

export default function DirectoryScreen() {
  const { data: agencies, isLoading, error } = useAgencies();
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [only88Days, setOnly88Days] = useState(false);
  const [onlyHiring, setOnlyHiring] = useState(false);

  const filtered = useMemo(() => {
    if (!agencies) return [];
    return agencies.filter(a => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) &&
          !(a.city?.toLowerCase().includes(search.toLowerCase())) &&
          !a.state.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedState !== 'All' && a.state !== selectedState) return false;
      if (selectedCategory !== 'All' && a.category !== selectedCategory) return false;
      if (only88Days && !a.is88DaysEligible) return false;
      if (onlyHiring && !a.isCurrentlyHiring) return false;
      return true;
    });
  }, [agencies, search, selectedState, selectedCategory, only88Days, onlyHiring]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Header */}
      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.xs }}>
        <Text style={{ fontSize: fontSize.xxl, fontWeight: '800', color: colors.text }}>
          WHV Jobs
        </Text>
        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}>
          Find regional employers in Australia
        </Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.xs }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
          paddingHorizontal: spacing.sm,
          borderWidth: 1,
          borderColor: colors.border,
        }}>
          <Ionicons name="search" size={18} color={colors.textTertiary} />
          <TextInput
            style={{
              flex: 1,
              paddingVertical: Platform.OS === 'web' ? 10 : spacing.sm,
              paddingHorizontal: spacing.xs,
              fontSize: fontSize.md,
              color: colors.text,
            }}
            placeholder="Search by name, city, state..."
            placeholderTextColor={colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* State filter */}
      <View style={{ paddingLeft: spacing.md, paddingVertical: spacing.xs }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={STATES}
          keyExtractor={item => item}
          contentContainerStyle={{ gap: 6, paddingRight: spacing.md }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedState(item)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: borderRadius.full,
                backgroundColor: selectedState === item ? colors.primary : colors.surfaceSecondary,
              }}
            >
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: selectedState === item ? '#fff' : colors.textSecondary,
              }}>
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Toggle filters */}
      <View style={{ flexDirection: 'row', paddingHorizontal: spacing.md, gap: 8, paddingBottom: spacing.xs }}>
        <Pressable
          onPress={() => setOnly88Days(!only88Days)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: borderRadius.full,
            backgroundColor: only88Days ? '#16a34a' : colors.surfaceSecondary,
          }}
        >
          <Ionicons name="checkmark-circle" size={14} color={only88Days ? '#fff' : colors.textTertiary} />
          <Text style={{ fontSize: 12, fontWeight: '600', color: only88Days ? '#fff' : colors.textSecondary }}>
            88 Days
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setOnlyHiring(!onlyHiring)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: borderRadius.full,
            backgroundColor: onlyHiring ? '#2563eb' : colors.surfaceSecondary,
          }}
        >
          <Ionicons name="briefcase" size={14} color={onlyHiring ? '#fff' : colors.textTertiary} />
          <Text style={{ fontSize: 12, fontWeight: '600', color: onlyHiring ? '#fff' : colors.textSecondary }}>
            Hiring
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setSelectedCategory(selectedCategory === 'All' ? 'Farm' : 'All')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: borderRadius.full,
            backgroundColor: selectedCategory !== 'All' ? colors.primary : colors.surfaceSecondary,
          }}
        >
          <Ionicons name="filter" size={14} color={selectedCategory !== 'All' ? '#fff' : colors.textTertiary} />
          <Text style={{ fontSize: 12, fontWeight: '600', color: selectedCategory !== 'All' ? '#fff' : colors.textSecondary }}>
            Category
          </Text>
        </Pressable>
      </View>

      {/* Results count */}
      <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xs }}>
        <Text style={{ fontSize: 12, color: colors.textTertiary }}>
          {filtered.length} employer{filtered.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* List */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={{ color: colors.error, marginTop: spacing.sm, textAlign: 'center' }}>
            Failed to load employers
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AgencyCard agency={item} />}
          contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
              <Ionicons name="search-outline" size={48} color={colors.textTertiary} />
              <Text style={{ fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
                No employers match your filters.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
