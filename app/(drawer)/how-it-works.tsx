import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors, styles as globalStyles } from '../../constants/calculatorstyles';
import { SafeAreaView } from 'react-native-safe-area-context';

type Guide = {
  title: string;
  description: string;
  tags: string[];
};

const GUIDES: Guide[] = [
  {
    title: 'Understanding PAYE in Nigeria',
    description:
      "Learn how Pay As You Earn (PAYE) works, who it applies to, and how it's calculated.",
    tags: [
      'Tax bands and rates',
      'Pension deductions',
      'Consolidated Relief Allowance (CRA)',
      'Monthly vs Annual calculations',
    ],
  },
  {
    title: 'Annual Personal Income Tax (PIT)',
    description:
      'A comprehensive guide to annual PIT for salaried employees and self-employed individuals.',
    tags: [
      'Annual vs Monthly tax',
      'Tax reliefs and deductions',
      'Filing requirements',
      'Payment schedules',
    ],
  },
  {
    title: 'Tax Guide for Freelancers',
    description:
      'Everything freelancers and self-employed professionals need to know about Nigerian tax.',
    tags: [
      'Business expenses',
      'Quarterly payments',
      'Record keeping',
      'Tax optimization',
    ],
  },
  {
    title: 'Value Added Tax (VAT)',
    description:
      'Understanding VAT registration, collection, and remittance in Nigeria.',
    tags: [
      'VAT registration threshold',
      'Standard vs Zero-rated items',
      'Filing and remittance',
      'VAT exemptions',
    ],
  },
  {
    title: 'Company Income Tax (CIT)',
    description:
      'A guide for business owners on calculating and paying company income tax.',
    tags: [
      'CIT rates',
      'Allowable deductions',
      'Capital allowances',
      'Tax returns and filing',
    ],
  },
];

export default function TaxGuidesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['left', 'right', 'bottom']}>
      <View style={globalStyles.safeArea}>
        <ScrollView contentContainerStyle={globalStyles.scroll}>
          {/* HEADER */}
          <View style={{ padding: 20, paddingTop: 30 }}>
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <Ionicons
                name="book-outline"
                size={36}
                color={Colors.primary}
              />
            </View>

            <Text
              style={{
                fontSize: 26,
                fontWeight: '900',
                color: Colors.primary,
                textAlign: 'center',
              }}
            >
              Tax Guides & Resources
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: Colors.secondaryText,
                textAlign: 'center',
                marginTop: 6,
                lineHeight: 20,
              }}
            >
              Learn about Nigerian tax regulations, calculations,
              and best practices
            </Text>
          </View>

          {/* GUIDES */}
          <View style={{ padding: 20 }}>
            {GUIDES.map((guide, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: '/guides/[slug]',
                    params: { slug: guide.title },
                  })
                }
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: 18,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: Colors.border,
                  shadowColor: '#0f172a',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.06,
                  shadowRadius: 10,
                  elevation: 3,
                }}
              >
                {/* TITLE */}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '800',
                    color: Colors.primary,
                    marginBottom: 6,
                  }}
                >
                  {guide.title}
                </Text>

                {/* DESCRIPTION */}
                <Text
                  style={{
                    fontSize: 13,
                    color: Colors.secondaryText,
                    lineHeight: 18,
                    marginBottom: 12,
                  }}
                >
                  {guide.description}
                </Text>

                {/* TAGS */}
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  {guide.tags.map((tag, i) => (
                    <View
                      key={i}
                      style={{
                        backgroundColor: '#e5e7eb',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 999,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '600',
                          color: Colors.primary,
                        }}
                      >
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
