import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Agency } from '../lib/types';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

type Props = { agency: Agency; isPremium?: boolean };

export function AgencyCard({ agency, isPremium = false }: Props) {
  return (
    <Link href={`/agency/${agency.id}`} asChild>
      <Pressable
        style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          gap: spacing.sm,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text
            style={{ fontSize: fontSize.lg, fontWeight: '600', color: colors.text, flex: 1 }}
            numberOfLines={1}
          >
            {agency.name}
          </Text>
          {agency.is88DaysEligible && (
            <View style={{
              backgroundColor: '#dcfce7',
              paddingHorizontal: spacing.sm,
              paddingVertical: 2,
              borderRadius: borderRadius.full,
            }}>
              <Text style={{ fontSize: fontSize.xs, color: '#16a34a', fontWeight: '600' }}>
                88 Days
              </Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
            📍 {agency.state}{agency.city ? `, ${agency.city}` : ''}
          </Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
            🏢 {agency.category}
          </Text>
        </View>

        {agency.googleRating && (
          <Text style={{ fontSize: fontSize.sm, color: colors.secondary }}>
            ⭐ {agency.googleRating.toFixed(1)} ({agency.googleReviewCount} reviews)
          </Text>
        )}

        {!isPremium && (agency.phonePrimary || agency.emailGeneral) && (
          <View style={{
            backgroundColor: colors.premiumBg,
            padding: spacing.sm,
            borderRadius: borderRadius.sm,
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: fontSize.sm, color: colors.premium, fontWeight: '500' }}>
              🔒 Unlock contact info — Premium
            </Text>
          </View>
        )}
      </Pressable>
    </Link>
  );
}
