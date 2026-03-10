import { useState } from 'react';
import { View, Text, FlatList, TextInput, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useAgencies } from '../../hooks/use-agencies';
import { AgencyCard } from '../../components/agency-card';
import { AUSTRALIAN_STATES } from '../../lib/types';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';

export default function DirectoryScreen() {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState<string | undefined>();
  const [only88Days, setOnly88Days] = useState(false);

  const { data: agencies, isLoading, error, refetch } = useAgencies({
    search: search || undefined,
    state: selectedState,
    is88Days: only88Days || undefined,
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Search */}
      <View style={{ padding: spacing.md, gap: spacing.sm, backgroundColor: colors.surface }}>
        <TextInput
          style={{
            backgroundColor: colors.surfaceSecondary,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            fontSize: fontSize.md,
            color: colors.text,
          }}
          placeholder="Search employers..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />

        {/* State filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.xs }}>
          <Pressable
            onPress={() => setSelectedState(undefined)}
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.full,
              backgroundColor: !selectedState ? colors.primary : colors.surfaceSecondary,
            }}
          >
            <Text style={{ color: !selectedState ? '#fff' : colors.textSecondary, fontSize: fontSize.sm, fontWeight: '500' }}>
              All States
            </Text>
          </Pressable>
          {AUSTRALIAN_STATES.map(state => (
            <Pressable
              key={state}
              onPress={() => setSelectedState(selectedState === state ? undefined : state)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: borderRadius.full,
                backgroundColor: selectedState === state ? colors.primary : colors.surfaceSecondary,
              }}
            >
              <Text style={{
                color: selectedState === state ? '#fff' : colors.textSecondary,
                fontSize: fontSize.sm,
                fontWeight: '500',
              }}>
                {state}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* 88 days toggle */}
        <Pressable
          onPress={() => setOnly88Days(!only88Days)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
          }}
        >
          <Text style={{ fontSize: fontSize.md }}>
            {only88Days ? '✅' : '⬜'}
          </Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
            88 Days eligible only
          </Text>
        </Pressable>
      </View>

      {/* Results */}
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.primary} size="large" />
      ) : error ? (
        <View style={{ padding: spacing.lg, alignItems: 'center' }}>
          <Text style={{ color: colors.error, fontSize: fontSize.md }}>Failed to load employers</Text>
          <Pressable onPress={() => refetch()} style={{ marginTop: spacing.sm }}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={agencies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AgencyCard agency={item} />}
          contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: spacing.xl }}>
              No employers found
            </Text>
          }
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
    </View>
  );
}
