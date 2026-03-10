import { View, Text, Pressable, ScrollView } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../lib/auth-context';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';

export default function ProfileScreen() {
  const { user, signOut } = React.use(AuthContext);
  const router = useRouter();

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}>
        <Text style={{ fontSize: 64, marginBottom: spacing.md }}>👤</Text>
        <Text style={{ fontSize: fontSize.xl, fontWeight: '700', color: colors.text }}>Your Profile</Text>
        <Text style={{ fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
          Sign in to manage your account and preferences.
        </Text>
        <Pressable
          onPress={() => router.push('/auth')}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            borderRadius: borderRadius.md,
            marginTop: spacing.lg,
          }}
        >
          <Text style={{ color: '#fff', fontSize: fontSize.md, fontWeight: '700' }}>Sign In</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
    >
      {/* Account */}
      <View style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
      }}>
        <Text style={{ fontSize: fontSize.lg, fontWeight: '700', color: colors.text }}>Account</Text>
        <Text selectable style={{ fontSize: fontSize.md, color: colors.textSecondary }}>{user.email}</Text>
      </View>

      {/* Subscription */}
      <View style={{
        backgroundColor: colors.premiumBg,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: '#ddd6fe',
      }}>
        <Text style={{ fontSize: fontSize.lg, fontWeight: '700', color: colors.premium }}>Subscription</Text>
        <Text style={{ fontSize: fontSize.md, color: colors.textSecondary }}>Free Plan</Text>
        <Pressable
          style={{
            backgroundColor: colors.premium,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.sm,
            alignItems: 'center',
            marginTop: spacing.xs,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Upgrade to Premium — $19 AUD</Text>
        </Pressable>
      </View>

      {/* Sign Out */}
      <Pressable
        onPress={signOut}
        style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
          padding: spacing.lg,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text style={{ fontSize: fontSize.md, color: colors.error, fontWeight: '600' }}>Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
}
