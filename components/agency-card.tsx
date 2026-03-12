import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Agency } from '../lib/types';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

export function AgencyCard({ agency }: { agency: Agency }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/agency/${agency.id}`)}
      style={({ pressed }) => ({
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: pressed ? colors.primary : colors.border,
        opacity: pressed ? 0.95 : 1,
      })}
    >
      {/* Header row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, marginRight: spacing.sm }}>
          <Text
            style={{ fontSize: fontSize.md, fontWeight: '700', color: colors.text }}
            numberOfLines={1}
          >
            {agency.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
              {agency.city ? `${agency.city}, ` : ''}{agency.state}
            </Text>
          </View>
        </View>
        {agency.googleRating && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text style={{ fontSize: fontSize.sm, fontWeight: '600', color: colors.text }}>
              {agency.googleRating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Tags row */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.sm }}>
        <View style={{
          backgroundColor: colors.surfaceSecondary,
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: borderRadius.full,
        }}>
          <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: '500' }}>
            {agency.category.replace(/-|_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Text>
        </View>

        {agency.is88DaysEligible && (
          <View style={{
            backgroundColor: '#dcfce7',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: borderRadius.full,
          }}>
            <Text style={{ fontSize: 11, color: '#16a34a', fontWeight: '600' }}>
              88 Days
            </Text>
          </View>
        )}

        {agency.isCurrentlyHiring && (
          <View style={{
            backgroundColor: '#dbeafe',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: borderRadius.full,
          }}>
            <Text style={{ fontSize: 11, color: '#2563eb', fontWeight: '600' }}>
              Hiring
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm }}>
        <Text style={{ fontSize: 11, color: colors.textTertiary }}>
          {agency.confidenceScore > 1 ? Math.round(agency.confidenceScore) : Math.round(agency.confidenceScore * 100)}% verified
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
      </View>
    </Pressable>
  );
}
