import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../lib/auth-context';
import { supabase } from '../../lib/supabase';
import { AgencyCard } from '../../components/agency-card';
import { Agency } from '../../lib/types';
import { colors, spacing, fontSize } from '../../constants/theme';

export default function SavedScreen() {
  const { user } = React.use(AuthContext);

  const { data: savedAgencies, isLoading } = useQuery({
    queryKey: ['saved-agencies', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('SavedJob')
        .select('agencyId, Agency(*)')
        .eq('userId', user.id);
      if (error) throw error;
      return (data?.map((s: any) => s.Agency).filter(Boolean) as Agency[]) ?? [];
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}>
        <Text style={{ fontSize: 64, marginBottom: spacing.md }}>⭐</Text>
        <Text style={{ fontSize: fontSize.xl, fontWeight: '700', color: colors.text }}>Saved Employers</Text>
        <Text style={{ fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
          Sign in to save employers and access them across devices.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={savedAgencies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AgencyCard agency={item} />}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
            <Text style={{ fontSize: 48 }}>📌</Text>
            <Text style={{ fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
              No saved employers yet.{'\n'}Tap the star on any employer to save it.
            </Text>
          </View>
        }
      />
    </View>
  );
}
