import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';

const STORAGE_KEY = 'whv_88days_start';

export default function CounterScreen() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY).then(val => {
      if (val) setStartDate(new Date(val));
    });

    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const setStart = async () => {
    const date = new Date();
    await SecureStore.setItemAsync(STORAGE_KEY, date.toISOString());
    setStartDate(date);
  };

  const reset = async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
    setStartDate(null);
  };

  const daysPassed = startDate
    ? Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const daysRemaining = Math.max(0, 88 - daysPassed);
  const progress = Math.min(1, daysPassed / 88);
  const isComplete = daysPassed >= 88;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, alignItems: 'center', gap: spacing.lg }}
    >
      <Text style={{ fontSize: fontSize.xxxl, fontWeight: '800', color: colors.text, marginTop: spacing.xl }}>
        88 Days Counter
      </Text>

      {!startDate ? (
        <View style={{ alignItems: 'center', gap: spacing.lg, marginTop: spacing.xl }}>
          <Text style={{ fontSize: 80 }}>📅</Text>
          <Text style={{ fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center' }}>
            Track your 88 days of regional work{'\n'}required for a second year visa.
          </Text>
          <Pressable
            onPress={setStart}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: spacing.xl,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.md,
            }}
          >
            <Text style={{ color: '#fff', fontSize: fontSize.lg, fontWeight: '700' }}>
              Start Counting Today
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ alignItems: 'center', gap: spacing.lg, width: '100%' }}>
          {/* Big number */}
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 72,
              fontWeight: '800',
              color: isComplete ? colors.success : colors.primary,
              fontVariant: ['tabular-nums'],
            }}>
              {isComplete ? '✅' : daysRemaining}
            </Text>
            <Text style={{ fontSize: fontSize.lg, color: colors.textSecondary }}>
              {isComplete ? 'Complete!' : 'days remaining'}
            </Text>
          </View>

          {/* Progress bar */}
          <View style={{ width: '100%', height: 12, backgroundColor: colors.surfaceSecondary, borderRadius: borderRadius.full }}>
            <View
              style={{
                width: `${progress * 100}%`,
                height: '100%',
                backgroundColor: isComplete ? colors.success : colors.primary,
                borderRadius: borderRadius.full,
              }}
            />
          </View>

          {/* Stats */}
          <View style={{ flexDirection: 'row', gap: spacing.lg }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] }}>
                {daysPassed}
              </Text>
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>days done</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] }}>
                {daysRemaining}
              </Text>
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>days left</Text>
            </View>
          </View>

          {/* Start date info */}
          <Text style={{ fontSize: fontSize.sm, color: colors.textTertiary }}>
            Started: {startDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>

          <Pressable
            onPress={reset}
            style={{ marginTop: spacing.md }}
          >
            <Text style={{ color: colors.error, fontSize: fontSize.sm }}>Reset counter</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
