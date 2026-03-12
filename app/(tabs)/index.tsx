import { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAgencies } from '../../hooks/use-agencies';
import { AgencyCard } from '../../components/agency-card';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';

const STATES = ['All', 'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

const EMPLOYER_TYPES = [
  { key: 'all', label: 'All Types', color: colors.textSecondary, bg: colors.surfaceSecondary },
  { key: 'direct_employer', label: 'Direct Employer', color: '#0369a1', bg: '#e0f2fe' },
  { key: 'traffic_control', label: 'TC Company', color: '#7c3aed', bg: '#ede9fe', match: ['traffic_control_company', 'tc_company'] },
  { key: 'recruitment_agency', label: 'Recruiter', color: '#be185d', bg: '#fce7f3' },
  { key: 'contractor', label: 'Contractor', color: '#92400e', bg: '#fef3c7', match: ['client_contractor', 'contractor'] },
  { key: 'labour_hire', label: 'Labour Hire', color: '#9333ea', bg: '#f3e8ff' },
];

export default function DirectoryScreen() {
  const { data: agencies, isLoading, error } = useAgencies();
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [visa417, setVisa417] = useState(false);
  const [visa462, setVisa462] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const filtered = useMemo(() => {
    if (!agencies) return [];
    return agencies.filter(a => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) &&
          !(a.city?.toLowerCase().includes(search.toLowerCase())) &&
          !a.state.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedState !== 'All' && a.state !== selectedState) return false;
      if (visa417 && !a.eligible88Days) return false;
      if (visa462 && !a.eligible88Days462) return false;
      if (selectedType !== 'all') {
        const typeFilter = EMPLOYER_TYPES.find(t => t.key === selectedType);
        const matchValues = (typeFilter as any)?.match || [selectedType];
        if (!matchValues.includes(a.contactType)) return false;
      }
      return true;
    });
  }, [agencies, search, selectedState, visa417, visa462, selectedType]);

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
      <View style={{ flexDirection: 'row', paddingHorizontal: spacing.md, gap: 8, paddingBottom: spacing.xs, flexWrap: 'wrap' }}>
        <Pressable
          onPress={() => setVisa417(!visa417)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: borderRadius.full,
            backgroundColor: visa417 ? '#16a34a' : colors.surfaceSecondary,
          }}
        >
          <Ionicons name="checkmark-circle" size={14} color={visa417 ? '#fff' : colors.textTertiary} />
          <Text style={{ fontSize: 12, fontWeight: '600', color: visa417 ? '#fff' : colors.textSecondary }}>
            Visa 417
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setVisa462(!visa462)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: borderRadius.full,
            backgroundColor: visa462 ? '#d97706' : colors.surfaceSecondary,
          }}
        >
          <Ionicons name="checkmark-circle" size={14} color={visa462 ? '#fff' : colors.textTertiary} />
          <Text style={{ fontSize: 12, fontWeight: '600', color: visa462 ? '#fff' : colors.textSecondary }}>
            Visa 462
          </Text>
        </Pressable>


      </View>

      {/* Employer type filter */}
      <View style={{ paddingLeft: spacing.md, paddingBottom: spacing.xs }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={EMPLOYER_TYPES}
          keyExtractor={item => item.key}
          contentContainerStyle={{ gap: 6, paddingRight: spacing.md }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedType(item.key)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: borderRadius.full,
                backgroundColor: selectedType === item.key ? item.bg : colors.surfaceSecondary,
                borderWidth: selectedType === item.key ? 1.5 : 0,
                borderColor: selectedType === item.key ? item.color : 'transparent',
              }}
            >
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: selectedType === item.key ? item.color : colors.textTertiary,
              }}>
                {item.label}
              </Text>
            </Pressable>
          )}
        />
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
